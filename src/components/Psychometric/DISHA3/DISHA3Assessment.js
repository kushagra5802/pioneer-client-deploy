import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Button,
  Radio,
  Input,
  InputNumber,
  Select,
  Checkbox,
  message,
  Progress,
} from "antd";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import useAxiosInstance from "../../../lib/useAxiosInstance";

const navy = "#004877";

const AGREE_SCALE = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
];
const RATING_5 = [1, 2, 3, 4, 5];

const STEP_IDS = ["marks", "proficiency", "learningStyles", "studyHabits", "examPrep", "sjt"];
const STEP_META = {
  marks: { code: "1", name: "Academic Marks", timeMin: 12 },
  proficiency: { code: "2", name: "Subject Proficiency", timeMin: 7 },
  learningStyles: { code: "3", name: "Learning Styles", timeMin: 6 },
  studyHabits: { code: "4", name: "Study Habits", timeMin: 7 },
  examPrep: { code: "5", name: "Exam Preparedness", timeMin: 5 },
  sjt: { code: "6", name: "Situational Judgment", timeMin: 8 },
};

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

function AgreeRow({ value, onChange }) {
  return (
    <Radio.Group
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex flex-wrap gap-2 mt-3"
    >
      {AGREE_SCALE.map((opt) => (
        <Radio.Button key={opt.value} value={opt.value} className="!rounded-lg">
          {opt.label}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
}

function SectionTimer({ stepId, minutes }) {
  const [left, setLeft] = useState(minutes * 60);
  const ref = useRef();
  useEffect(() => {
    setLeft(minutes * 60);
    clearInterval(ref.current);
    ref.current = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(ref.current);
  }, [stepId, minutes]);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700">
      <Clock size={15} /> {mm}:{ss}
    </span>
  );
}

export default function DISHA3Assessment({ data, onClose }) {
  const axios = useAxiosInstance();
  const navigate = useNavigate();
  const [stepIdx, setStepIdx] = useState(0);
  const [startTime] = useState(Date.now());

  const [profile, setProfile] = useState({
    currentClass: "",
    board: "",
    stream: "",
    appearedBoard: "",
    coaching: "",
    marksVerified: false,
  });
  const [marks, setMarks] = useState({}); // { subjectKey: { terms: { termKey: {obtained,maximum} } } }
  const [marksSupp, setMarksSupp] = useState({});
  const [proficiency, setProficiency] = useState({}); // { subjectKey: {comfort,enjoyment} }
  const [identity, setIdentity] = useState({}); // { SP-xx: value }
  const [lsLikert, setLsLikert] = useState({});
  const [lsFc, setLsFc] = useState({});
  const [studyHabits, setStudyHabits] = useState({});
  const [examPrep, setExamPrep] = useState({});
  const [validity, setValidity] = useState({});
  const [sjt, setSjt] = useState({});

  const stepId = STEP_IDS[stepIdx];
  const meta = STEP_META[stepId];

  /* ---- derive active subject set + term set from class/stream ---- */
  const { activeSubjects, activeTerms } = useMemo(() => {
    const cls = profile.currentClass;
    const rules = data.marks.subjectSetRules || {};
    let subjectSetKey = "core_9_10";
    let termSetKey = "10";
    if (cls === "Class 9") {
      subjectSetKey = "core_9_10";
      termSetKey = "9";
    } else if (cls === "Class 10") {
      subjectSetKey = "core_9_10";
      termSetKey = "10";
    } else if (cls === "Class 11" || cls === "Class 12" || cls === "Passed Class 12") {
      subjectSetKey = (rules.streamToSet || {})[profile.stream] || "pcm";
      termSetKey = "11-12";
    }
    return {
      activeSubjects: data.marks.subjectSets[subjectSetKey] || [],
      activeTerms: data.marks.termSets[termSetKey] || [],
    };
  }, [profile.currentClass, profile.stream, data]);

  const subjectOptions = useMemo(
    () => activeSubjects.map((s) => ({ value: s.key, label: s.label })),
    [activeSubjects]
  );

  /* ---- completeness tracking ---- */
  const subjectsWithMarks = useMemo(
    () =>
      Object.entries(marks).filter(([, m]) =>
        m && m.terms && Object.values(m.terms).some((t) => t && t.maximum && (t.obtained || t.obtained === 0))
      ),
    [marks]
  );

  const stepProgress = useMemo(() => {
    const counts = {};
    counts.marks = {
      done: subjectsWithMarks.length,
      total: activeSubjects.length || 1,
      optional: false,
    };
    // proficiency = comfort+enjoyment per active subject (optional) + identity (optional)
    const profDone = activeSubjects.filter((s) => proficiency[s.key]?.comfort && proficiency[s.key]?.enjoyment).length;
    counts.proficiency = { done: profDone, total: activeSubjects.length || 1, optional: true };
    counts.learningStyles = {
      done:
        data.learningStyles.likert.filter((i) => lsLikert[i.id]).length +
        data.learningStyles.forcedChoice.filter((p) => lsFc[p.id]).length,
      total: data.learningStyles.likert.length + data.learningStyles.forcedChoice.length,
    };
    counts.studyHabits = {
      done: data.studyHabits.filter((i) => studyHabits[i.id]).length,
      total: data.studyHabits.length,
    };
    counts.examPrep = {
      done:
        data.examPrep.filter((i) => examPrep[i.id]).length +
        data.validity.filter((i) => validity[i.id]).length,
      total: data.examPrep.length + data.validity.length,
    };
    counts.sjt = {
      done: data.sjt.filter((s) => sjt[s.id]?.mostLikely && sjt[s.id]?.leastLikely).length,
      total: data.sjt.length,
    };
    return counts;
  }, [subjectsWithMarks, activeSubjects, proficiency, lsLikert, lsFc, studyHabits, examPrep, validity, sjt, data]);

  /* ---- submission ---- */
  const submitMutation = useMutation(
    async (payload) => {
      const res = await axios.post("/api/psychometric/disha3Assessment", payload);
      return res.data;
    },
    {
      onSuccess: (response) => {
        message.success("DISHA Test 3 submitted successfully!");
        navigate("/psychometric-disha3-result", { state: response.data });
      },
      onError: (error) => {
        message.error(error?.response?.data?.error?.message || "Submission failed. Please try again.");
      },
    }
  );

  const incompleteRequired = useMemo(() => {
    const required = ["learningStyles", "studyHabits", "examPrep", "sjt"];
    return required.filter((g) => stepProgress[g] && stepProgress[g].done < stepProgress[g].total);
  }, [stepProgress]);

  const handleSubmit = () => {
    if (!profile.currentClass || !profile.marksVerified) {
      message.warning("Please select your class and confirm the self-declaration in Section 1.");
      setStepIdx(0);
      return;
    }
    if (!subjectsWithMarks.length) {
      message.warning("Please enter marks for at least one subject in Section 1.");
      setStepIdx(0);
      return;
    }
    if (incompleteRequired.length) {
      message.warning(
        `Please complete: ${incompleteRequired.map((g) => STEP_META[g].name).join(", ")}`
      );
      return;
    }
    const completionTimeSeconds = Math.floor((Date.now() - startTime) / 1000);
    submitMutation.mutate({
      profile,
      marks,
      marksSupplementary: marksSupp,
      proficiency,
      subjectIdentity: identity,
      learningStyles: lsLikert,
      learningStyleFc: lsFc,
      studyHabits,
      examPrep,
      validity,
      sjt,
      streamSubjects: null,
      completionTimeSeconds,
    });
  };

  /* ---- marks setters ---- */
  const setMarkVal = (subjKey, termKey, field, val) =>
    setMarks((p) => ({
      ...p,
      [subjKey]: {
        ...p[subjKey],
        terms: {
          ...p[subjKey]?.terms,
          [termKey]: { ...p[subjKey]?.terms?.[termKey], [field]: val },
        },
      },
    }));

  /* ==================== RENDERERS ==================== */

  const renderMarks = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Current Class</label>
          <Select
            className="w-full"
            placeholder="Select class"
            value={profile.currentClass || undefined}
            onChange={(v) => setProfile((p) => ({ ...p, currentClass: v }))}
            options={(data.marks.intake.find((i) => i.id === "M-INT-01")?.options || []).map((o) => ({ value: o, label: o }))}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">School Board</label>
          <Select
            className="w-full"
            placeholder="Select board"
            value={profile.board || undefined}
            onChange={(v) => setProfile((p) => ({ ...p, board: v }))}
            options={(data.marks.intake.find((i) => i.id === "M-INT-02")?.options || []).map((o) => ({ value: o, label: o }))}
          />
        </div>
        {["Class 11", "Class 12", "Passed Class 12"].includes(profile.currentClass) && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Stream</label>
            <Select
              className="w-full"
              placeholder="Select stream"
              value={profile.stream || undefined}
              onChange={(v) => setProfile((p) => ({ ...p, stream: v }))}
              options={(data.marks.intake.find((i) => i.id === "M-INT-03")?.options || []).map((o) => ({ value: o, label: o }))}
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Appeared for Class 10 Board?</label>
          <Select
            className="w-full"
            placeholder="Select"
            value={profile.appearedBoard || undefined}
            onChange={(v) => setProfile((p) => ({ ...p, appearedBoard: v }))}
            options={(data.marks.intake.find((i) => i.id === "M-INT-04")?.options || []).map((o) => ({ value: o, label: o }))}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Coaching classes</label>
          <Select
            className="w-full"
            placeholder="Select"
            value={profile.coaching || undefined}
            onChange={(v) => setProfile((p) => ({ ...p, coaching: v }))}
            options={(data.marks.intake.find((i) => i.id === "M-INT-05")?.options || []).map((o) => ({ value: o, label: o }))}
          />
        </div>
      </div>

      {!profile.currentClass ? (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-700">
          Select your class (and stream for Class 11–12) above to load your subject marks grid.
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500 mb-4">
            Enter your actual marks (Obtained / Maximum) for each subject and term you have. Leave
            blank what doesn't apply — recent terms are weighted more heavily. Maximum auto-suggests
            100 but is editable (some boards use 80 + 20 splits).
          </p>
          {activeSubjects.map((subj) => (
            <div key={subj.key} className="border border-slate-200 rounded-xl p-4 mb-4 bg-white">
              <h4 className="font-semibold text-slate-800 mb-3">{subj.label}</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {activeTerms.map((term) => (
                  <div key={term.key}>
                    <label className="block text-xs text-slate-500 mb-1">{term.label}</label>
                    <div className="flex items-center gap-1">
                      <InputNumber
                        size="small"
                        min={0}
                        placeholder="Got"
                        className="w-full"
                        value={marks[subj.key]?.terms?.[term.key]?.obtained}
                        onChange={(v) => setMarkVal(subj.key, term.key, "obtained", v)}
                      />
                      <span className="text-slate-400">/</span>
                      <InputNumber
                        size="small"
                        min={1}
                        placeholder="Max"
                        className="w-full"
                        value={marks[subj.key]?.terms?.[term.key]?.maximum}
                        onChange={(v) => setMarkVal(subj.key, term.key, "maximum", v)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* supplementary academic context */}
          <h4 className="font-bold text-slate-800 mt-8 mb-3">A few quick questions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.marks.supplementary.map((q) => (
              <div key={q.id} className="bg-white border border-slate-200 rounded-lg p-3">
                <label className="block text-sm font-medium text-slate-700 mb-2">{q.text}</label>
                {q.control === "numeric" ? (
                  <InputNumber
                    min={q.min}
                    max={q.max}
                    step={q.step || 1}
                    className="w-40"
                    value={marksSupp[q.id]}
                    onChange={(v) => setMarksSupp((p) => ({ ...p, [q.id]: v }))}
                  />
                ) : q.control === "dropdown" ? (
                  <Select
                    className="w-full md:w-2/3"
                    placeholder="Select"
                    value={marksSupp[q.id] || undefined}
                    onChange={(v) => setMarksSupp((p) => ({ ...p, [q.id]: v }))}
                    options={(q.options || []).map((o) => ({ value: o, label: o }))}
                  />
                ) : q.control === "subject_dropdown" ? (
                  <Select
                    className="w-full md:w-2/3"
                    placeholder="Select subject"
                    value={marksSupp[q.id] || undefined}
                    onChange={(v) => setMarksSupp((p) => ({ ...p, [q.id]: v }))}
                    options={subjectOptions}
                  />
                ) : (
                  <Input.TextArea
                    rows={2}
                    value={marksSupp[q.id] || ""}
                    onChange={(e) => setMarksSupp((p) => ({ ...p, [q.id]: e.target.value }))}
                  />
                )}
              </div>
            ))}
          </div>

          {/* self declaration */}
          <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-4">
            <Checkbox
              checked={profile.marksVerified}
              onChange={(e) => setProfile((p) => ({ ...p, marksVerified: e.target.checked }))}
            >
              I confirm these marks are accurate to the best of my knowledge.
            </Checkbox>
          </div>
        </>
      )}
    </div>
  );

  const renderProficiency = () => (
    <div>
      <p className="text-sm text-slate-500 mb-5">
        For each subject, rate your <strong>comfort / proficiency</strong> and your{" "}
        <strong>enjoyment / interest</strong> (1 = Very Low, 5 = Very High). We cross-check these with
        your marks to surface hidden interests and confidence gaps. (Optional but recommended.)
      </p>
      {activeSubjects.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-700 mb-4">
          Select your class in Section 1 first to load your subjects.
        </div>
      )}
      {activeSubjects.map((subj, i) => (
        <QuestionCard index={i + 1} key={subj.key}>
          <p className="font-medium text-slate-800 mb-2">{subj.label}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-slate-500">Comfort / Proficiency</span>
              <Radio.Group
                className="flex gap-1 mt-1"
                value={proficiency[subj.key]?.comfort}
                onChange={(e) =>
                  setProficiency((p) => ({ ...p, [subj.key]: { ...p[subj.key], comfort: e.target.value } }))
                }
              >
                {RATING_5.map((n) => (
                  <Radio.Button key={n} value={n}>{n}</Radio.Button>
                ))}
              </Radio.Group>
            </div>
            <div>
              <span className="text-xs text-slate-500">Enjoyment / Interest</span>
              <Radio.Group
                className="flex gap-1 mt-1"
                value={proficiency[subj.key]?.enjoyment}
                onChange={(e) =>
                  setProficiency((p) => ({ ...p, [subj.key]: { ...p[subj.key], enjoyment: e.target.value } }))
                }
              >
                {RATING_5.map((n) => (
                  <Radio.Button key={n} value={n}>{n}</Radio.Button>
                ))}
              </Radio.Group>
            </div>
          </div>
        </QuestionCard>
      ))}

      <h4 className="font-bold text-slate-800 mt-8 mb-3">Subject Identity</h4>
      <p className="text-sm text-slate-500 mb-4">A few short questions about your relationship with your subjects. (Optional.)</p>
      {data.proficiency.identity.map((q, i) => (
        <QuestionCard index={i + 1} key={q.id}>
          <p className="font-medium text-slate-800 mb-2">{q.text}</p>
          {q.control === "text" ? (
            <Input.TextArea
              rows={2}
              value={identity[q.id] || ""}
              onChange={(e) => setIdentity((p) => ({ ...p, [q.id]: e.target.value }))}
            />
          ) : q.control === "subject_dropdown_direction" ? (
            <div className="flex flex-col gap-2">
              <Select
                className="w-full md:w-2/3"
                placeholder="Select subject"
                value={identity[q.id]?.subject || undefined}
                onChange={(v) => setIdentity((p) => ({ ...p, [q.id]: { ...p[q.id], subject: v } }))}
                options={subjectOptions}
              />
              <Radio.Group
                value={identity[q.id]?.direction}
                onChange={(e) => setIdentity((p) => ({ ...p, [q.id]: { ...p[q.id], direction: e.target.value } }))}
              >
                {(q.directions || []).map((d) => (
                  <Radio key={d} value={d}>{d}</Radio>
                ))}
              </Radio.Group>
            </div>
          ) : (
            <Select
              className="w-full md:w-2/3"
              placeholder="Select subject"
              value={(typeof identity[q.id] === "object" ? identity[q.id]?.subject : identity[q.id]) || undefined}
              onChange={(v) => setIdentity((p) => ({ ...p, [q.id]: v }))}
              options={subjectOptions}
              allowClear
            />
          )}
        </QuestionCard>
      ))}
    </div>
  );

  const renderLikertList = (items, valueMap, setter, hint) => (
    <div>
      {hint && <p className="text-sm text-slate-500 mb-5">{hint}</p>}
      {items.map((q, i) => (
        <QuestionCard index={i + 1} key={q.id}>
          <p className="font-medium text-slate-800">
            {q.text}
            {q.indiaSpecific && <span className="text-amber-500 ml-1" title="India-specific item">★</span>}
          </p>
          <AgreeRow value={valueMap[q.id]} onChange={(v) => setter((p) => ({ ...p, [q.id]: v }))} />
        </QuestionCard>
      ))}
    </div>
  );

  const renderLearningStyles = () => (
    <div>
      <p className="text-sm text-slate-500 mb-2">
        How do you learn best? This personalises your study plan — it is not used to judge ability.
      </p>
      <h4 className="font-bold text-slate-800 mb-3 mt-4">Part 1 — How much do you agree?</h4>
      {data.learningStyles.likert.map((q, i) => (
        <QuestionCard index={i + 1} key={q.id}>
          <p className="font-medium text-slate-800">
            {q.text}
            {q.indiaSpecific && <span className="text-amber-500 ml-1">★</span>}
          </p>
          <AgreeRow value={lsLikert[q.id]} onChange={(v) => setLsLikert((p) => ({ ...p, [q.id]: v }))} />
        </QuestionCard>
      ))}

      <h4 className="font-bold text-slate-800 mb-3 mt-8">Part 2 — Which approach fits you better?</h4>
      {data.learningStyles.forcedChoice.map((q, i) => (
        <QuestionCard index={i + 1} key={q.id}>
          <p className="font-medium text-slate-800 mb-2">{q.prompt}</p>
          <Radio.Group
            value={lsFc[q.id]}
            onChange={(e) => setLsFc((p) => ({ ...p, [q.id]: e.target.value }))}
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
    </div>
  );

  const renderExamPrep = () => (
    <div>
      {renderLikertList(
        data.examPrep,
        examPrep,
        setExamPrep,
        "How you prepare for and handle exams. Answer honestly — there are no right answers."
      )}
      <h4 className="font-bold text-slate-800 mb-3 mt-8">A few final statements</h4>
      {data.validity.map((q, i) => (
        <QuestionCard index={i + 1} key={q.id}>
          <p className="font-medium text-slate-800">{q.text}</p>
          <AgreeRow value={validity[q.id]} onChange={(v) => setValidity((p) => ({ ...p, [q.id]: v }))} />
        </QuestionCard>
      ))}
    </div>
  );

  const renderSjt = () =>
    data.sjt.map((sc, i) => (
      <div key={sc.id} className="border border-slate-200 rounded-xl p-5 md:p-6 mb-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <h4 className="font-bold text-slate-800">{i + 1}. {sc.title}</h4>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{sc.context}</span>
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
    switch (stepId) {
      case "marks":
        return renderMarks();
      case "proficiency":
        return renderProficiency();
      case "learningStyles":
        return renderLearningStyles();
      case "studyHabits":
        return renderLikertList(
          data.studyHabits,
          studyHabits,
          setStudyHabits,
          "How do you actually study? Answer for what is true now, not what you wish were true."
        );
      case "examPrep":
        return renderExamPrep();
      case "sjt":
        return renderSjt();
      default:
        return null;
    }
  };

  const isLast = stepIdx === STEP_IDS.length - 1;
  const cur = stepProgress[stepId] || { done: 0, total: 0 };

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 overflow-hidden flex flex-col">
      <header className="bg-white border-b border-slate-200 px-5 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="font-extrabold text-xl" style={{ color: navy }}>DISHA Test 3</div>
          <span className="hidden md:inline text-sm text-slate-400">
            Academic Performance, Subject Strengths, Learning Styles &amp; Study Habits
          </span>
        </div>
        <div className="flex items-center gap-3">
          <SectionTimer stepId={stepId} minutes={meta.timeMin} />
          <Button danger size="small" onClick={onClose}>Save &amp; Exit</Button>
        </div>
      </header>

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
                  active ? "text-white" : complete ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
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

      <main className="flex-1 overflow-y-auto px-5 md:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-2xl font-bold text-slate-900">Section {meta.code}: {meta.name}</h2>
              <span className="text-sm text-slate-500">
                {cur.done}/{cur.total} {cur.optional ? "(optional)" : "answered"}
              </span>
            </div>
            <Progress
              percent={cur.total ? Math.round((cur.done / cur.total) * 100) : 0}
              showInfo={false}
              strokeColor={navy}
              className="mt-1"
            />
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> Suggested time {meta.timeMin} min. Your answers auto-save as you go.
            </p>
          </div>
          {renderStep()}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 px-5 md:px-8 py-3 flex items-center justify-between">
        <Button icon={<ChevronLeft size={16} />} disabled={stepIdx === 0} onClick={() => setStepIdx((i) => Math.max(0, i - 1))}>
          Previous
        </Button>
        <span className="text-sm text-slate-400">Step {stepIdx + 1} of {STEP_IDS.length}</span>
        {isLast ? (
          <Button type="primary" style={{ background: navy }} loading={submitMutation.isLoading} onClick={handleSubmit}>
            Submit Assessment
          </Button>
        ) : (
          <Button type="primary" style={{ background: navy }} onClick={() => setStepIdx((i) => Math.min(STEP_IDS.length - 1, i + 1))}>
            Next <ChevronRight size={16} />
          </Button>
        )}
      </footer>
    </div>
  );
}
