import React, { useState, useMemo, useEffect, useRef } from "react";
import { Button, Radio, Progress, message, Alert } from "antd";
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

const STEP_IDS = ["selfAwareness", "selfRegulation", "resilience", "empathy", "adaptability", "scenarios"];
const STEP_META = {
  selfAwareness: { code: "A", name: "Emotional Self-Awareness", timeMin: 5 },
  selfRegulation: { code: "B", name: "Emotional Self-Regulation", timeMin: 4 },
  resilience: { code: "C", name: "Resilience, Grit & Mindset", timeMin: 6 },
  empathy: { code: "D", name: "Empathy & Interpersonal", timeMin: 5 },
  adaptability: { code: "E", name: "Social & Cultural Adaptability", timeMin: 4 },
  scenarios: { code: "F·G", name: "Emotional Scenarios", timeMin: 13 },
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

export default function DISHA4Assessment({ data, onClose }) {
  const axios = useAxiosInstance();
  const navigate = useNavigate();
  const [stepIdx, setStepIdx] = useState(0);
  const [startTime] = useState(Date.now());

  const [selfAwareness, setSelfAwareness] = useState({});
  const [selfRegulation, setSelfRegulation] = useState({});
  const [resilience, setResilience] = useState({});
  const [empathy, setEmpathy] = useState({});
  const [adaptability, setAdaptability] = useState({});
  const [sjt, setSjt] = useState({});
  const [validity, setValidity] = useState({});
  const [crisisSelfCheck, setCrisisSelfCheck] = useState(null);

  const allSjt = useMemo(() => [...(data.sjt?.blockF || []), ...(data.sjt?.blockG || [])], [data]);

  const stepId = STEP_IDS[stepIdx];
  const meta = STEP_META[stepId];

  const stepProgress = useMemo(() => {
    const likertCount = (items, map) => ({
      done: (items || []).filter((i) => map[i.id]).length,
      total: (items || []).length,
    });
    return {
      selfAwareness: likertCount(data.selfAwareness, selfAwareness),
      selfRegulation: likertCount(data.selfRegulation, selfRegulation),
      resilience: likertCount(data.resilience, resilience),
      empathy: likertCount(data.empathy, empathy),
      adaptability: likertCount(data.adaptability, adaptability),
      scenarios: {
        done:
          allSjt.filter((s) => sjt[s.id]?.mostLikely && sjt[s.id]?.leastLikely).length +
          (data.validity || []).filter((i) => validity[i.id]).length,
        total: allSjt.length + (data.validity || []).length,
      },
    };
  }, [data, selfAwareness, selfRegulation, resilience, empathy, adaptability, sjt, validity, allSjt]);

  const submitMutation = useMutation(
    async (payload) => {
      const res = await axios.post("/api/psychometric/disha4Assessment", payload);
      return res.data;
    },
    {
      onSuccess: (response) => {
        message.success("DISHA Test 4 submitted successfully!");
        navigate("/psychometric-disha4-result", { state: response.data });
      },
      onError: (error) => {
        message.error(error?.response?.data?.error?.message || "Submission failed. Please try again.");
      },
    }
  );

  const incomplete = useMemo(
    () => STEP_IDS.filter((g) => stepProgress[g] && stepProgress[g].done < stepProgress[g].total),
    [stepProgress]
  );

  const handleSubmit = () => {
    if (incomplete.length) {
      message.warning(`Please complete all sections. Pending: ${incomplete.map((g) => STEP_META[g].name).join(", ")}`);
      return;
    }
    const completionTimeSeconds = Math.floor((Date.now() - startTime) / 1000);
    submitMutation.mutate({
      selfAwareness,
      selfRegulation,
      resilience,
      empathy,
      adaptability,
      sjt,
      validity,
      crisisSelfCheck,
      completionTimeSeconds,
    });
  };

  /* ---------------- renderers ---------------- */

  const renderLikertList = (items, valueMap, setter, hint) => (
    <div>
      {hint && <p className="text-sm text-slate-500 mb-5">{hint}</p>}
      {(items || []).map((q, i) => (
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

  const renderSjtCard = (sc, i) => (
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
  );

  const renderScenarios = () => (
    <div>
      <p className="text-sm text-slate-500 mb-5">
        For each situation, mark the option you would be <strong>most likely</strong> and{" "}
        <strong>least likely</strong> to do. There are no right or wrong answers — these show how you
        tend to respond under pressure.
      </p>

      <h4 className="font-bold text-slate-800 mb-3">Block 1 — Emotional Scenarios</h4>
      {(data.sjt?.blockF || []).map((sc, i) => renderSjtCard(sc, i))}

      <h4 className="font-bold text-slate-800 mb-3 mt-8">Block 2 — Resilience &amp; Social Scenarios</h4>
      {(data.sjt?.blockG || []).map((sc, i) => renderSjtCard(sc, (data.sjt?.blockF || []).length + i))}

      <h4 className="font-bold text-slate-800 mb-3 mt-8">A few final statements</h4>
      {(data.validity || []).map((q, i) => (
        <QuestionCard index={i + 1} key={q.id}>
          <p className="font-medium text-slate-800">{q.text}</p>
          <AgreeRow value={validity[q.id]} onChange={(v) => setValidity((p) => ({ ...p, [q.id]: v }))} />
        </QuestionCard>
      ))}

      {/* crisis self-check (optional, surfaces support if agreed) */}
      {data.crisisSelfCheck && (
        <div className="border border-slate-200 rounded-xl p-5 md:p-6 mb-2 bg-white shadow-sm">
          <p className="font-medium text-slate-800">
            {data.crisisSelfCheck.text}
            <span className="text-slate-400 text-xs ml-2">(optional)</span>
          </p>
          <AgreeRow value={crisisSelfCheck} onChange={(v) => setCrisisSelfCheck(v)} />
          {crisisSelfCheck >= 4 && (
            <Alert
              type="warning"
              showIcon
              className="mt-3 rounded-lg"
              message="We want to make sure you're okay"
              description="What you're describing is something many students go through, and support genuinely helps. Please consider speaking to your counsellor or a trusted adult, or calling iCall (9152987821) or the Vandrevala Foundation (1860-2662-345). Reaching out is a strength, not a weakness."
            />
          )}
        </div>
      )}
    </div>
  );

  const renderStep = () => {
    switch (stepId) {
      case "selfAwareness":
        return renderLikertList(data.selfAwareness, selfAwareness, setSelfAwareness, "Rate how accurately each statement describes you — focus on what is typically true for you, not what you think you should feel.");
      case "selfRegulation":
        return renderLikertList(data.selfRegulation, selfRegulation, setSelfRegulation, "How do you manage difficult emotions and pressure?");
      case "resilience":
        return renderLikertList(data.resilience, resilience, setResilience, "How do you respond to setbacks, and how do you pursue long-term goals?");
      case "empathy":
        return renderLikertList(data.empathy, empathy, setEmpathy, "How do you relate to and support the people around you?");
      case "adaptability":
        return renderLikertList(data.adaptability, adaptability, setAdaptability, "How comfortable are you with new people, places and cultures?");
      case "scenarios":
        return renderScenarios();
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
          <div className="font-extrabold text-xl" style={{ color: navy }}>DISHA Test 4</div>
          <span className="hidden md:inline text-sm text-slate-400">
            Emotional Intelligence, Resilience &amp; Interpersonal Fit
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
              <span className="text-sm text-slate-500">{cur.done}/{cur.total} answered</span>
            </div>
            <Progress
              percent={cur.total ? Math.round((cur.done / cur.total) * 100) : 0}
              showInfo={false}
              strokeColor={navy}
              className="mt-1"
            />
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> There are no right or wrong answers. Your responses are
              confidential and auto-save as you go.
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
