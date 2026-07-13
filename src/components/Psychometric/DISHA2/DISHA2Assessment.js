import React, { useState, useMemo, useEffect, useRef } from "react";
import { Button, Radio, message, Progress, Tag, Tooltip } from "antd";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Info as InfoIcon,
} from "lucide-react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import useAxiosInstance from "../../../lib/useAxiosInstance";

const navy = "#004877";

/* Likert scale labels per module (different anchors). */
const LIKE_SCALE = [
  { value: 1, label: "Strongly Dislike" },
  { value: 2, label: "Dislike" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Like" },
  { value: 5, label: "Strongly Like" },
];
const APPEAL_SCALE = [
  { value: 1, label: "Not at all" },
  { value: 2, label: "Slightly" },
  { value: 3, label: "Somewhat" },
  { value: 4, label: "Appealing" },
  { value: 5, label: "Very appealing" },
];
const IMPORTANCE_SCALE = [
  { value: 1, label: "Not important" },
  { value: 2, label: "Slightly" },
  { value: 3, label: "Moderately" },
  { value: 4, label: "Very" },
  { value: 5, label: "Extremely" },
];
const AGREE_SCALE = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
];

const STEP_IDS = ["activities", "occupations", "workValues", "motivations", "environment", "sjt"];

const STEP_META = {
  activities: { code: "A", name: "Activity Preferences", timeMin: 12 },
  occupations: { code: "B", name: "Occupational Ratings", timeMin: 8 },
  workValues: { code: "C", name: "Work Values", timeMin: 7 },
  motivations: { code: "D", name: "Career Motivations", timeMin: 5 },
  environment: { code: "E", name: "Work Environment", timeMin: 4 },
  sjt: { code: "F", name: "Situational Judgment", timeMin: 9 },
};

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

function ScaleRow({ scale, value, onChange }) {
  return (
    <Radio.Group
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex flex-wrap gap-2 mt-3"
    >
      {scale.map((opt) => (
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

export default function DISHA2Assessment({ data, onClose }) {
  const axios = useAxiosInstance();
  const navigate = useNavigate();
  const [stepIdx, setStepIdx] = useState(0);
  const [startTime] = useState(Date.now());

  // ---- response state, keyed per module ----
  const [activities, setActivities] = useState({}); // { id: 1..5 }
  const [occupations, setOccupations] = useState({}); // { id: 1..5 }
  const [wvLikert, setWvLikert] = useState({}); // { id: 1..5 }
  const [wvFc, setWvFc] = useState({}); // { id: "A"|"B" }
  const [valueRanking, setValueRanking] = useState([]); // ordered value keys (top 5)
  const [motivations, setMotivations] = useState({}); // { id: 1..5 }
  const [envSector, setEnvSector] = useState({}); // { id: "A"|"B" }
  const [workStyle, setWorkStyle] = useState({}); // { id: 1..5 }
  const [sjt, setSjt] = useState({}); // { id: { mostLikely, leastLikely } }

  const stepId = STEP_IDS[stepIdx];
  const meta = STEP_META[stepId];

  /* ---------------- completeness tracking ---------------- */
  const stepProgress = useMemo(() => {
    const counts = {};
    counts.activities = {
      done: (data.activities || []).filter((i) => activities[i.id]).length,
      total: (data.activities || []).length,
    };
    counts.occupations = {
      done: (data.occupations || []).filter((o) => occupations[o.id]).length,
      total: (data.occupations || []).length,
    };
    const wvLik = data.workValues?.likert || [];
    const wvFcArr = data.workValues?.forcedChoice || [];
    counts.workValues = {
      done:
        wvLik.filter((i) => wvLikert[i.id]).length +
        wvFcArr.filter((p) => wvFc[p.id]).length +
        (valueRanking.length >= 1 ? 1 : 0),
      total: wvLik.length + wvFcArr.length + 1, // +1 for the ranking task
    };
    counts.motivations = {
      done: (data.motivations || []).filter((i) => motivations[i.id]).length,
      total: (data.motivations || []).length,
    };
    const envSec = data.environment?.sector || [];
    const envStyle = data.environment?.workStyle || [];
    counts.environment = {
      done:
        envSec.filter((p) => envSector[p.id]).length +
        envStyle.filter((i) => workStyle[i.id]).length,
      total: envSec.length + envStyle.length,
    };
    counts.sjt = {
      done: (data.sjt || []).filter((s) => sjt[s.id]?.mostLikely && sjt[s.id]?.leastLikely).length,
      total: (data.sjt || []).length,
    };
    return counts;
  }, [activities, occupations, wvLikert, wvFc, valueRanking, motivations, envSector, workStyle, sjt, data]);

  /* ---------------- submission ---------------- */
  const submitMutation = useMutation(
    async (payload) => {
      const res = await axios.post("/api/psychometric/disha2Assessment", payload);
      return res.data;
    },
    {
      onSuccess: (response) => {
        message.success("DISHA Test 2 submitted successfully!");
        navigate("/psychometric-disha2-result", { state: response.data });
      },
      onError: (error) => {
        message.error(
          error?.response?.data?.error?.message || "Submission failed. Please try again."
        );
      },
    }
  );

  const incomplete = useMemo(() => {
    return STEP_IDS.filter((g) => stepProgress[g] && stepProgress[g].done < stepProgress[g].total);
  }, [stepProgress]);

  const handleSubmit = () => {
    if (incomplete.length) {
      message.warning(
        `Please complete all sections before submitting. Pending: ${incomplete
          .map((g) => STEP_META[g].name)
          .join(", ")}`
      );
      return;
    }
    const completionTimeSeconds = Math.floor((Date.now() - startTime) / 1000);
    submitMutation.mutate({
      activities,
      occupations,
      workValuesLikert: wvLikert,
      workValuesForcedChoice: wvFc,
      valueRanking,
      motivations,
      envSector,
      workStyle,
      sjt,
      completionTimeSeconds,
    });
  };

  /* ---------------- ranking helpers (Module C part 3) ---------------- */
  const toggleRank = (val) => {
    setValueRanking((prev) => {
      if (prev.includes(val)) return prev.filter((v) => v !== val);
      if (prev.length >= 5) return prev; // cap at 5
      return [...prev, val];
    });
  };

  /* ====================================================================
     RENDERERS PER MODULE
     ==================================================================== */

  const renderActivities = () => (
    <div>
      <p className="text-sm text-slate-500 mb-5">
        Rate how much you would <strong>enjoy</strong> doing each activity — regardless of whether you
        think you are good at it or whether your family would approve.
      </p>
      {(data.activities || []).map((q, i) => (
        <QuestionCard index={i + 1} key={q.id}>
          <p className="font-medium text-slate-800">
            {q.text}
            {q.indiaSpecific && <span className="text-amber-500 ml-1" title="India-specific item">★</span>}
          </p>
          <ScaleRow scale={LIKE_SCALE} value={activities[q.id]} onChange={(v) => setActivities((p) => ({ ...p, [q.id]: v }))} />
        </QuestionCard>
      ))}
    </div>
  );

  const renderOccupations = () => (
    <div>
      <p className="text-sm text-slate-500 mb-5">
        Rate how <strong>appealing</strong> each career sounds to you — regardless of whether you think
        you could get into it. Focus purely on whether you would enjoy doing it. Hover the info icon for
        a one-line description.
      </p>
      {(data.occupations || []).map((q, i) => (
        <QuestionCard index={i + 1} key={q.id}>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium text-slate-800">{q.title}</p>
            <Tag className="!text-xs">{q.sector}</Tag>
            {q.description && (
              <Tooltip title={q.description}>
                <InfoIcon size={15} className="text-slate-400 cursor-help" />
              </Tooltip>
            )}
          </div>
          <ScaleRow scale={APPEAL_SCALE} value={occupations[q.id]} onChange={(v) => setOccupations((p) => ({ ...p, [q.id]: v }))} />
        </QuestionCard>
      ))}
    </div>
  );

  const renderWorkValues = () => (
    <div>
      <p className="text-sm text-slate-500 mb-4">
        Rate how important each thing is to you in <strong>your</strong> future career — not your
        parents' ideal career, but yours. There are no right or wrong answers.
      </p>

      <h4 className="font-bold text-slate-800 mb-3">Part 1 — How important is this to you?</h4>
      {(data.workValues?.likert || []).map((q, i) => (
        <QuestionCard index={i + 1} key={q.id}>
          <p className="font-medium text-slate-800">
            {q.text}
            {q.indiaSpecific && <span className="text-amber-500 ml-1">★</span>}
          </p>
          <ScaleRow scale={IMPORTANCE_SCALE} value={wvLikert[q.id]} onChange={(v) => setWvLikert((p) => ({ ...p, [q.id]: v }))} />
        </QuestionCard>
      ))}

      <h4 className="font-bold text-slate-800 mb-3 mt-8">Part 2 — When two values conflict, which matters more?</h4>
      {(data.workValues?.forcedChoice || []).map((q, i) => (
        <QuestionCard index={i + 1} key={q.id}>
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
      ))}

      <h4 className="font-bold text-slate-800 mb-2 mt-8">Part 3 — Rank your top 5 values</h4>
      <p className="text-sm text-slate-500 mb-4">
        Tap to add a value to your ranking (1 = most important). Tap again to remove. Choose up to 5.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(data.workValues?.rankOptions || []).map((v) => {
          const rank = valueRanking.indexOf(v.value);
          const selected = rank >= 0;
          return (
            <button
              type="button"
              key={v.value}
              onClick={() => toggleRank(v.value)}
              className={`text-left rounded-xl border p-3 transition flex items-start gap-3 ${
                selected ? "border-[#004877] bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <span
                className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                  selected ? "text-white" : "text-slate-400 bg-slate-100"
                }`}
                style={selected ? { background: navy } : {}}
              >
                {selected ? rank + 1 : "+"}
              </span>
              <span>
                <span className="font-semibold text-slate-800">
                  {v.label}
                  {v.indiaSpecific && <span className="text-amber-500 ml-1">★</span>}
                </span>
                <span className="block text-xs text-slate-500">{v.description}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderMotivations = () => (
    <div>
      <p className="text-sm text-slate-500 mb-5">
        Rate how much each statement describes your <strong>true</strong> motivations — not what you
        think you should feel, but what actually drives you.
      </p>
      {(data.motivations || []).map((q, i) => (
        <QuestionCard index={i + 1} key={q.id}>
          <p className="font-medium text-slate-800">
            {q.text}
            {q.indiaSpecific && <span className="text-amber-500 ml-1">★</span>}
          </p>
          <ScaleRow scale={AGREE_SCALE} value={motivations[q.id]} onChange={(v) => setMotivations((p) => ({ ...p, [q.id]: v }))} />
        </QuestionCard>
      ))}
    </div>
  );

  const renderEnvironment = () => (
    <div>
      <p className="text-sm text-slate-500 mb-4">
        These preferences personalise — not limit — your recommendations. There are no right answers.
      </p>

      <h4 className="font-bold text-slate-800 mb-3">Part 1 — Which environment appeals more?</h4>
      {(data.environment?.sector || []).map((q, i) => (
        <QuestionCard index={i + 1} key={q.id}>
          <Radio.Group
            value={envSector[q.id]}
            onChange={(e) => setEnvSector((p) => ({ ...p, [q.id]: e.target.value }))}
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

      <h4 className="font-bold text-slate-800 mb-3 mt-8">Part 2 — Where do you lean?</h4>
      {(data.environment?.workStyle || []).map((q, i) => (
        <div key={q.id} className="border border-slate-200 rounded-xl p-4 mb-4 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-2 text-sm">
            <span className="text-slate-700 flex-1">{q.left}</span>
            <span className="text-slate-700 flex-1 text-right">{q.right}</span>
          </div>
          <Radio.Group
            value={workStyle[q.id]}
            onChange={(e) => setWorkStyle((p) => ({ ...p, [q.id]: e.target.value }))}
            className="flex justify-between w-full"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <Radio key={n} value={n} className="!mr-0" />
            ))}
          </Radio.Group>
        </div>
      ))}
    </div>
  );

  const renderSjt = () =>
    (data.sjt || []).map((sc, i) => (
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
      case "activities":
        return renderActivities();
      case "occupations":
        return renderOccupations();
      case "workValues":
        return renderWorkValues();
      case "motivations":
        return renderMotivations();
      case "environment":
        return renderEnvironment();
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
      {/* top bar */}
      <header className="bg-white border-b border-slate-200 px-5 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="font-extrabold text-xl" style={{ color: navy }}>
            DISHA Test 2
          </div>
          <span className="hidden md:inline text-sm text-slate-400">
            Interests, Work Values, Motivations &amp; Occupational Preferences
          </span>
        </div>
        <div className="flex items-center gap-3">
          <SectionTimer stepId={stepId} minutes={meta.timeMin} />
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
                {cur.done}/{cur.total} answered
              </span>
            </div>
            <Progress
              percent={cur.total ? Math.round((cur.done / cur.total) * 100) : 0}
              showInfo={false}
              strokeColor={navy}
              className="mt-1"
            />
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> Suggested time {meta.timeMin} min. The timer is a guide; your
              answers are saved either way.
            </p>
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
