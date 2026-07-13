import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Button,
  Radio,
  Input,
  InputNumber,
  Select,
  message,
  Progress,
  Tooltip,
} from "antd";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Lock,
} from "lucide-react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import useAxiosInstance from "../../../lib/useAxiosInstance";

/* 5-point Likert labels reused across OCEAN, RIASEC, Work Values, ICS. */
const LIKERT = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
];

/* Ordered list of step ids that make up the test flow. */
const STEP_IDS = [
  "marks",
  "verbal",
  "numerical",
  "spatial",
  "abstract",
  "closure",
  "memory",
  "personality",
  "interests",
  "values",
  "sjt",
];

const STEP_META = {
  marks: { code: "1", name: "Academic Marks", timeMin: 8, timed: false },
  verbal: { code: "2A", name: "Verbal Ability", timeMin: 8, timed: true },
  numerical: { code: "2B", name: "Numerical & Logical", timeMin: 8, timed: true },
  spatial: { code: "2C", name: "Spatial Reasoning", timeMin: 6, timed: true },
  abstract: { code: "2D", name: "Abstract Reasoning", timeMin: 6, timed: true },
  closure: { code: "2E", name: "Closure / Clerical / Mechanical", timeMin: 7, timed: false },
  memory: { code: "2F", name: "Memory & Creativity", timeMin: 6, timed: false },
  personality: { code: "3", name: "Personality (OCEAN)", timeMin: 10, timed: false },
  interests: { code: "4A", name: "Interests (RIASEC)", timeMin: 7, timed: false },
  values: { code: "4B", name: "Work Values & Context", timeMin: 6, timed: false },
  sjt: { code: "5", name: "Situational Judgment", timeMin: 10, timed: false },
};

const navy = "#004877";

/* ---------------- small presentational helpers ---------------- */

function QuestionCard({ index, children }) {
  return (
    <div className="border border-slate-200 rounded-xl p-5 md:p-6 mb-5 bg-white shadow-sm hover:border-slate-300 transition">
      <div className="flex gap-3">
        <span
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
          style={{ background: navy }}
        >
          {index}
        </span>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

function LikertRow({ value, onChange }) {
  return (
    <Radio.Group
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex flex-wrap gap-2 mt-3"
    >
      {LIKERT.map((opt) => (
        <Radio.Button key={opt.value} value={opt.value} className="!rounded-lg">
          {opt.label}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
}

/* ---------------- section countdown (informational) ---------------- */

function SectionTimer({ stepId, minutes }) {
  const [left, setLeft] = useState(minutes * 60);
  const ref = useRef();
  useEffect(() => {
    setLeft(minutes * 60);
    clearInterval(ref.current);
    ref.current = setInterval(() => {
      setLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(ref.current);
  }, [stepId, minutes]);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const low = left <= 30;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full ${
        low ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-700"
      }`}
    >
      <Clock size={15} /> {mm}:{ss}
    </span>
  );
}

export default function DISHAAssessment({ data, onClose }) {
  const axios = useAxiosInstance();
  const navigate = useNavigate();
  const [stepIdx, setStepIdx] = useState(0);
  const [startTime] = useState(Date.now());

  // ---- response state, keyed per module ----
  const [profile, setProfile] = useState({ currentClass: "", board: "", competitiveExam: "" });
  const [aptitude, setAptitude] = useState({}); // { qid: optionIndex | count | text }
  const [personality, setPersonality] = useState({}); // { id: 1..5 }
  const [riasecFc, setRiasecFc] = useState({}); // { id: "A"|"B" }
  const [riasecLikert, setRiasecLikert] = useState({});
  const [wvLikert, setWvLikert] = useState({});
  const [wvFc, setWvFc] = useState({});
  const [ics, setIcs] = useState({});
  const [sjt, setSjt] = useState({}); // { id: { mostLikely, leastLikely } }
  const [marks, setMarks] = useState({}); // { subjectKey: { terms:{tk:{obtained,maximum}}, enjoyment } }
  const [supplementary, setSupplementary] = useState({});

  const stepId = STEP_IDS[stepIdx];
  const meta = STEP_META[stepId];

  const setAptAns = (qid, val) => setAptitude((p) => ({ ...p, [qid]: val }));

  /* ---------------- completeness tracking ---------------- */
  const aptitudeGroups = ["verbal", "numerical", "spatial", "abstract", "closure"];

  const stepProgress = useMemo(() => {
    const counts = {};
    aptitudeGroups.forEach((g) => {
      const items = data.aptitude[g] || [];
      const done = items.filter((i) => aptitude[i.id] !== undefined && aptitude[i.id] !== "").length;
      counts[g] = { done, total: items.length };
    });
    // memory
    const mem = data.aptitude.memory || [];
    counts.memory = {
      done: mem.filter((i) => aptitude[i.id] !== undefined && aptitude[i.id] !== "").length,
      total: mem.length,
    };
    counts.personality = {
      done: data.personality.filter((i) => personality[i.id]).length,
      total: data.personality.length,
    };
    const fcTot = data.riasec.forcedChoice.length;
    const rlTot = data.riasec.likert.length;
    counts.interests = {
      done:
        data.riasec.forcedChoice.filter((i) => riasecFc[i.id]).length +
        data.riasec.likert.filter((i) => riasecLikert[i.id]).length,
      total: fcTot + rlTot,
    };
    const wvDone =
      data.workValues.filter((i) =>
        i.type === "forced_choice" ? wvFc[i.id] : wvLikert[i.id]
      ).length;
    counts.values = { done: wvDone, total: data.workValues.length };
    counts.sjt = {
      done: data.sjt.filter((s) => sjt[s.id]?.mostLikely && sjt[s.id]?.leastLikely).length,
      total: data.sjt.length,
    };
    // marks: count subjects with at least one term entered
    const subjDone = Object.values(marks).filter(
      (m) => m && m.terms && Object.values(m.terms).some((t) => t && t.maximum)
    ).length;
    counts.marks = { done: subjDone, total: data.academic.subjects.length, optional: true };
    return counts;
  }, [aptitude, personality, riasecFc, riasecLikert, wvLikert, wvFc, sjt, marks, data]);

  /* ---------------- submission ---------------- */
  const submitMutation = useMutation(
    async (payload) => {
      const res = await axios.post("/api/psychometric/dishaAssessment", payload);
      return res.data;
    },
    {
      onSuccess: (response) => {
        message.success("DISHA assessment submitted successfully!");
        navigate("/psychometric-disha-result", { state: response.data });
      },
      onError: (error) => {
        message.error(
          error?.response?.data?.error?.message || "Submission failed. Please try again."
        );
      },
    }
  );

  const buildAcademicMarks = () =>
    Object.entries(marks)
      .map(([subjectKey, m]) => ({
        subjectKey,
        terms: m.terms || {},
        enjoyment: m.enjoyment ?? null,
      }))
      .filter((m) => Object.values(m.terms).some((t) => t && t.maximum));

  const incompleteScored = useMemo(() => {
    // Scored modules that must be complete before submit (marks & creativity self-reports optional).
    const required = ["verbal", "numerical", "spatial", "abstract", "closure", "personality", "interests", "values", "sjt"];
    return required.filter((g) => stepProgress[g] && stepProgress[g].done < stepProgress[g].total);
  }, [stepProgress]);

  const handleSubmit = () => {
    if (incompleteScored.length) {
      message.warning(
        `Please complete all scored sections before submitting. Pending: ${incompleteScored
          .map((g) => STEP_META[g].name)
          .join(", ")}`
      );
      return;
    }
    const completionTimeSeconds = Math.floor((Date.now() - startTime) / 1000);
    submitMutation.mutate({
      profile,
      aptitude,
      personality,
      riasecForcedChoice: riasecFc,
      riasecLikert,
      workValuesLikert: wvLikert,
      workValuesForcedChoice: wvFc,
      ics,
      sjt,
      academicMarks: buildAcademicMarks(),
      supplementary,
      completionTimeSeconds,
    });
  };

  /* ====================================================================
     RENDERERS PER MODULE
     ==================================================================== */

  const renderAptitudeMcq = (group) => {
    const items = data.aptitude[group] || [];
    console.log("items",items)
    return items.map((q, i) => (
      <QuestionCard index={i + 1} key={q.id}>
        {q.subType && (
          <span className="inline-block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
            {q.subType}
          </span>
        )}
        {q.imageUrl && (
          <div className="my-3 flex justify-center">
            <img
              src={q.imageUrl}
              alt={q.imageDescription || q.subType || "Question figure"}
              className="max-w-full rounded-lg border border-slate-200 bg-slate-50"
              style={{ maxHeight: 320 }}
            />
          </div>
        )}
        <p className="font-medium text-slate-800 mb-1 whitespace-pre-line">{q.text}</p>
        <Radio.Group
          value={aptitude[q.id]}
          onChange={(e) => setAptAns(q.id, e.target.value)}
          className="flex flex-col gap-2 mt-3"
        >
          {q.options.map((opt, idx) => (
            <Radio key={idx} value={idx} className="!items-start">
              <span className="text-slate-700">{opt}</span>
            </Radio>
          ))}
        </Radio.Group>
      </QuestionCard>
    ));
  };

  const renderMemory = () => {
    console.log("RENDER MEMORY")
    const items = data.aptitude.memory || [];
    console.log("items",items)
    return items.map((q, i) => (
      <QuestionCard index={i + 1} key={q.id}>
        <span className="inline-block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
          {q.subType}
        </span>
        {q.imageUrl && (
          <div className="my-3 flex justify-center">
            <img
              src={q.imageUrl}
              alt={q.imageDescription || q.subType || "Question figure"}
              className="max-w-full rounded-lg border border-slate-200 bg-slate-50"
              style={{ maxHeight: 320 }}
            />
          </div>
        )}
        <p className="font-medium text-slate-800 mb-2 whitespace-pre-line">{q.text}</p>
        {q.format === "count" && (
          <InputNumber
            min={0}
            max={q.maxCount}
            value={aptitude[q.id]}
            onChange={(v) => setAptAns(q.id, v)}
            placeholder={`0 – ${q.maxCount}`}
            className="w-40"
          />
        )}
        {q.format === "text_recall" && (
          <Input
            value={aptitude[q.id]}
            onChange={(e) => setAptAns(q.id, e.target.value)}
            placeholder="Type the sequence"
            className="max-w-xs"
          />
        )}
        {q.format === "open_list" && (
          <Input.TextArea
            rows={4}
            value={aptitude[q.id]}
            onChange={(e) => setAptAns(q.id, e.target.value)}
            placeholder="One idea per line"
          />
        )}
        {q.options && (
          <Radio.Group
            value={aptitude[q.id]}
            onChange={(e) => setAptAns(q.id, e.target.value)}
            className="flex flex-col gap-2 mt-2"
          >
            {q.options.map((opt, idx) => (
              <Radio key={idx} value={idx}>
                {opt}
              </Radio>
            ))}
          </Radio.Group>
        )}
      </QuestionCard>
    ));
  };

  const renderMarks = () => (
    <div>
      {/* class / board / exam context */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Current / last completed class</label>
          <Select
            className="w-full"
            placeholder="Select class"
            value={profile.currentClass || undefined}
            onChange={(v) => setProfile((p) => ({ ...p, currentClass: v }))}
            options={(data.academic.supplementary.find((s) => s.id === "M1")?.options || []).map((o) => ({ value: o, label: o }))}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Board</label>
          <Select
            className="w-full"
            placeholder="Select board"
            value={profile.board || undefined}
            onChange={(v) => setProfile((p) => ({ ...p, board: v }))}
            options={(data.academic.supplementary.find((s) => s.id === "M2")?.options || []).map((o) => ({ value: o, label: o }))}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Competitive exam (if any)</label>
          <Select
            className="w-full"
            placeholder="Select"
            value={profile.competitiveExam || undefined}
            onChange={(v) => setProfile((p) => ({ ...p, competitiveExam: v }))}
            options={(data.academic.supplementary.find((s) => s.id === "M3")?.options || []).map((o) => ({ value: o, label: o }))}
          />
        </div>
      </div>

      <p className="text-sm text-slate-500 mb-4">
        Enter your marks for each subject and term you have (obtained / maximum). Leave blank what
        doesn't apply — recent terms are weighted more heavily. Rate how much you enjoy each subject.
      </p>

      {data.academic.subjects.map((subj) => (
        <div key={subj.key} className="border border-slate-200 rounded-xl p-4 mb-4 bg-white">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h4 className="font-semibold text-slate-800">{subj.label}</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Enjoyment</span>
              <Radio.Group
                size="small"
                value={marks[subj.key]?.enjoyment}
                onChange={(e) =>
                  setMarks((p) => ({
                    ...p,
                    [subj.key]: { ...p[subj.key], enjoyment: e.target.value },
                  }))
                }
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <Radio.Button key={n} value={n}>
                    {n}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {data.academic.terms.map((term) => (
              <div key={term.key}>
                <label className="block text-xs text-slate-500 mb-1">{term.label}</label>
                <div className="flex items-center gap-1">
                  <InputNumber
                    size="small"
                    min={0}
                    placeholder="Got"
                    className="w-full"
                    value={marks[subj.key]?.terms?.[term.key]?.obtained}
                    onChange={(v) =>
                      setMarks((p) => ({
                        ...p,
                        [subj.key]: {
                          ...p[subj.key],
                          terms: {
                            ...p[subj.key]?.terms,
                            [term.key]: { ...p[subj.key]?.terms?.[term.key], obtained: v },
                          },
                        },
                      }))
                    }
                  />
                  <span className="text-slate-400">/</span>
                  <InputNumber
                    size="small"
                    min={1}
                    placeholder="Max"
                    className="w-full"
                    value={marks[subj.key]?.terms?.[term.key]?.maximum}
                    onChange={(v) =>
                      setMarks((p) => ({
                        ...p,
                        [subj.key]: {
                          ...p[subj.key],
                          terms: {
                            ...p[subj.key]?.terms,
                            [term.key]: { ...p[subj.key]?.terms?.[term.key], maximum: v },
                          },
                        },
                      }))
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* open supplementary reflections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Has any subject changed significantly in the last year? Why?
          </label>
          <Input.TextArea
            rows={3}
            value={supplementary.M6 || ""}
            onChange={(e) => setSupplementary((p) => ({ ...p, M6: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Is there a subject you wish you'd studied harder? Why?
          </label>
          <Input.TextArea
            rows={3}
            value={supplementary.M7 || ""}
            onChange={(e) => setSupplementary((p) => ({ ...p, M7: e.target.value }))}
          />
        </div>
      </div>
    </div>
  );

  const renderPersonality = () =>
    data.personality.map((q, i) => (
      <QuestionCard index={i + 1} key={q.id}>
        <p className="font-medium text-slate-800">
          {q.text}
          {q.indiaSpecific && <span className="text-amber-500 ml-1" title="India-specific item">★</span>}
        </p>
        <LikertRow value={personality[q.id]} onChange={(v) => setPersonality((p) => ({ ...p, [q.id]: v }))} />
      </QuestionCard>
    ));

  const renderInterests = () => (
    <div>
      <h4 className="font-bold text-slate-800 mb-3">Part A — Which appeals more to you?</h4>
      {data.riasec.forcedChoice.map((q, i) => (
        <QuestionCard index={i + 1} key={q.id}>
          <Radio.Group
            value={riasecFc[q.id]}
            onChange={(e) => setRiasecFc((p) => ({ ...p, [q.id]: e.target.value }))}
            className="flex flex-col md:flex-row gap-3 w-full"
          >
            {["A", "B"].map((k) => (
              <Radio.Button
                key={k}
                value={k}
                className="!h-auto !flex-1 !whitespace-normal !py-3 !px-4 !rounded-lg !leading-snug"
              >
                {k === "A" ? q.optionA.text : q.optionB.text}
              </Radio.Button>
            ))}
          </Radio.Group>
        </QuestionCard>
      ))}

      <h4 className="font-bold text-slate-800 mb-3 mt-8">Part B — How much do you agree?</h4>
      {data.riasec.likert.map((q, i) => (
        <QuestionCard index={i + 1} key={q.id}>
          <p className="font-medium text-slate-800">
            {q.text}
            {q.indiaSpecific && <span className="text-amber-500 ml-1">★</span>}
          </p>
          <LikertRow value={riasecLikert[q.id]} onChange={(v) => setRiasecLikert((p) => ({ ...p, [q.id]: v }))} />
        </QuestionCard>
      ))}
    </div>
  );

  const renderValues = () => (
    <div>
      <h4 className="font-bold text-slate-800 mb-3">Work Values</h4>
      {data.workValues.map((q, i) =>
        q.type === "forced_choice" ? (
          <QuestionCard index={i + 1} key={q.id}>
            <p className="font-medium text-slate-800 mb-2">
              {q.text}
              {q.indiaSpecific && <span className="text-amber-500 ml-1">★</span>}
            </p>
            <Radio.Group
              value={wvFc[q.id]}
              onChange={(e) => setWvFc((p) => ({ ...p, [q.id]: e.target.value }))}
              className="flex flex-col md:flex-row gap-3 w-full"
            >
              {["A", "B"].map((k) => (
                <Radio.Button
                  key={k}
                  value={k}
                  className="!h-auto !flex-1 !whitespace-normal !py-3 !px-4 !rounded-lg !leading-snug"
                >
                  {k === "A" ? q.optionA.text : q.optionB.text}
                </Radio.Button>
              ))}
            </Radio.Group>
          </QuestionCard>
        ) : (
          <QuestionCard index={i + 1} key={q.id}>
            <p className="font-medium text-slate-800">
              {q.text}
              {q.indiaSpecific && <span className="text-amber-500 ml-1">★</span>}
            </p>
            <LikertRow value={wvLikert[q.id]} onChange={(v) => setWvLikert((p) => ({ ...p, [q.id]: v }))} />
          </QuestionCard>
        )
      )}

      <h4 className="font-bold text-slate-800 mb-2 mt-8">Your Context</h4>
      <p className="text-sm text-slate-500 mb-4">
        These help us personalise — not limit — your recommendations. Answer honestly. Some answers
        are shared only with your counsellor.
      </p>
      {data.ics.map((q, i) => (
        <QuestionCard index={i + 1} key={q.id}>
          <p className="font-medium text-slate-800 mb-2">
            {q.text}
            {q.counsellorOnly && (
              <Tooltip title="Visible to your counsellor only — never shared with parents.">
                <Lock size={14} className="inline ml-1.5 text-slate-400" />
              </Tooltip>
            )}
          </p>
          {q.control === "dropdown" ? (
            <Select
              className="w-full md:w-2/3"
              placeholder="Select"
              value={ics[q.id] || undefined}
              onChange={(v) => setIcs((p) => ({ ...p, [q.id]: v }))}
              options={(q.options || []).map((o) => ({ value: o, label: o }))}
            />
          ) : q.control === "numeric" ? (
            <InputNumber
              min={q.min}
              max={q.max}
              value={ics[q.id]}
              onChange={(v) => setIcs((p) => ({ ...p, [q.id]: v }))}
              className="w-40"
            />
          ) : q.control === "text" ? (
            <Input.TextArea
              rows={2}
              value={ics[q.id] || ""}
              onChange={(e) => setIcs((p) => ({ ...p, [q.id]: e.target.value }))}
            />
          ) : q.control === "yesno_text" ? (
            <Radio.Group
              value={ics[q.id]}
              onChange={(e) => setIcs((p) => ({ ...p, [q.id]: e.target.value }))}
            >
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
            </Radio.Group>
          ) : (
            <LikertRow value={ics[q.id]} onChange={(v) => setIcs((p) => ({ ...p, [q.id]: v }))} />
          )}
        </QuestionCard>
      ))}
    </div>
  );

  const renderSjt = () =>
    data.sjt.map((sc, i) => (
      <div key={sc.id} className="border border-slate-200 rounded-xl p-5 md:p-6 mb-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <h4 className="font-bold text-slate-800">
            {i + 1}. {sc.title}
          </h4>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{sc.classFocus}</span>
        </div>
        <p className="text-slate-600 text-sm mb-4 leading-relaxed bg-slate-50 rounded-lg p-3">{sc.scenario}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-semibold text-slate-500 mb-1">
          <span>Most likely to do</span>
          <span>Least likely to do</span>
        </div>
        {sc.options.map((opt) => (
          <div key={opt.key} className="grid grid-cols-[auto_1fr] md:grid-cols-[40px_40px_1fr] gap-3 items-start py-2 border-b border-slate-100 last:border-0">
            <Radio
              checked={sjt[sc.id]?.mostLikely === opt.key}
              onChange={() =>
                setSjt((p) => {
                  const cur = p[sc.id] || {};
                  return { ...p, [sc.id]: { ...cur, mostLikely: opt.key, leastLikely: cur.leastLikely === opt.key ? undefined : cur.leastLikely } };
                })
              }
            />
            <Radio
              className="hidden md:inline-flex"
              checked={sjt[sc.id]?.leastLikely === opt.key}
              onChange={() =>
                setSjt((p) => {
                  const cur = p[sc.id] || {};
                  return { ...p, [sc.id]: { ...cur, leastLikely: opt.key, mostLikely: cur.mostLikely === opt.key ? undefined : cur.mostLikely } };
                })
              }
            />
            <div>
              <span className="font-semibold text-slate-700 mr-1">{opt.key}.</span>
              <span className="text-slate-700">{opt.text}</span>
              {/* mobile least-likely toggle */}
              <button
                type="button"
                className={`md:hidden block mt-1 text-xs underline ${
                  sjt[sc.id]?.leastLikely === opt.key ? "text-red-600 font-semibold" : "text-slate-400"
                }`}
                onClick={() =>
                  setSjt((p) => {
                    const cur = p[sc.id] || {};
                    return { ...p, [sc.id]: { ...cur, leastLikely: opt.key, mostLikely: cur.mostLikely === opt.key ? undefined : cur.mostLikely } };
                  })
                }
              >
                Mark as least likely
              </button>
            </div>
          </div>
        ))}
      </div>
    ));

  const renderStep = () => {
    console.log("stepId",stepId)
    switch (stepId) {
      case "marks":
        return renderMarks();
      case "memory":
        return renderMemory();
      case "personality":
        return renderPersonality();
      case "interests":
        return renderInterests();
      case "values":
        return renderValues();
      case "sjt":
        return renderSjt();
      default:
        return renderAptitudeMcq(stepId); // verbal/numerical/spatial/abstract/closure
    }
  };

  const isLast = stepIdx === STEP_IDS.length - 1;
  const cur = stepProgress[stepId] || { done: 0, total: 0 };

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 overflow-hidden flex flex-col">
      {/* top bar */}
      <header className="bg-white border-b border-slate-200 px-5 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="font-extrabold text-xl" style={{ color: navy }}>
            DISHA
          </div>
          <span className="hidden md:inline text-sm text-slate-400">
            Differential Intelligence &amp; Scholastic Horizon Assessment
          </span>
        </div>
        <div className="flex items-center gap-3">
          {meta.timed && <SectionTimer stepId={stepId} minutes={meta.timeMin} />}
          <Button danger size="small" onClick={onClose}>
            Save &amp; Exit
          </Button>
        </div>
      </header>

      {/* step rail */}
      <div className="bg-white border-b border-slate-200 px-5 md:px-8 py-3 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {STEP_IDS.map((sid, idx) => {
            const sp = stepProgress[sid] || { done: 0, total: 0 };
            const complete = sp.total > 0 && sp.done >= sp.total;
            const active = idx === stepIdx;
            return (
              <button
                key={sid}
                onClick={() => setStepIdx(idx)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap transition ${
                  active
                    ? "text-white"
                    : complete
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
                style={active ? { background: navy } : {}}
              >
                {complete && !active && <CheckCircle2 size={13} />}
                {STEP_META[sid].code} · {STEP_META[sid].name.split(" ")[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* body */}
      <main className="flex-1 overflow-y-auto px-5 md:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-2xl font-bold text-slate-900">
                Module {meta.code}: {meta.name}
              </h2>
              <span className="text-sm text-slate-500">
                {cur.done}/{cur.total} answered {cur.optional ? "(optional)" : ""}
              </span>
            </div>
            <Progress
              percent={cur.total ? Math.round((cur.done / cur.total) * 100) : 0}
              showInfo={false}
              strokeColor={navy}
              className="mt-1"
            />
            {meta.timed && (
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> Timed section ({meta.timeMin} min suggested). The timer is a
                guide; your answers are saved either way.
              </p>
            )}
          </div>

          {renderStep()}
        </div>
      </main>

      {/* footer nav */}
      <footer className="bg-white border-t border-slate-200 px-5 md:px-8 py-3 flex items-center justify-between">
        <Button
          icon={<ChevronLeft size={16} />}
          disabled={stepIdx === 0}
          onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
        >
          Previous
        </Button>

        <span className="text-sm text-slate-400">
          Step {stepIdx + 1} of {STEP_IDS.length}
        </span>

        {isLast ? (
          <Button
            type="primary"
            style={{ background: navy }}
            loading={submitMutation.isLoading}
            onClick={handleSubmit}
          >
            Submit Assessment
          </Button>
        ) : (
          <Button
            type="primary"
            style={{ background: navy }}
            onClick={() => setStepIdx((i) => Math.min(STEP_IDS.length - 1, i + 1))}
          >
            Next <ChevronRight size={16} />
          </Button>
        )}
      </footer>
    </div>
  );
}
