import React, { useState, useMemo, useEffect, useRef } from "react";
import { Button, Radio, Input, Tag, message, Progress } from "antd";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Timer,
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

const STEP_IDS = ["divergentTasks", "creativeSelfReport", "innovationMindset", "entrepreneurial", "problemSolvingStyle", "designSensitivity", "scenarios"];
const STEP_META = {
  divergentTasks: { code: "A", name: "Creative Thinking Tasks", timeMin: 10 },
  creativeSelfReport: { code: "B", name: "Creative Self-Report", timeMin: 5 },
  innovationMindset: { code: "C", name: "Innovation Mindset", timeMin: 4 },
  entrepreneurial: { code: "D", name: "Entrepreneurial Potential", timeMin: 6 },
  problemSolvingStyle: { code: "E", name: "Problem-Solving Style", timeMin: 4 },
  designSensitivity: { code: "F", name: "Design Sensitivity", timeMin: 4 },
  scenarios: { code: "G·H", name: "Creative & Innovation Scenarios", timeMin: 12 },
};

function QuestionCard({ index, children }) {
  return (
    <div className="border border-slate-200 rounded-xl p-5 md:p-6 mb-5 bg-white shadow-sm hover:border-slate-300 transition">
      <div className="flex gap-3">
        <span className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: navy }}>
          {index}
        </span>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

function ScaleRow({ value, onChange }) {
  return (
    <Radio.Group value={value} onChange={(e) => onChange(e.target.value)} className="flex flex-wrap gap-2 mt-3">
      {AGREE_SCALE.map((opt) => (
        <Radio.Button key={opt.value} value={opt.value} className="!rounded-lg">{opt.label}</Radio.Button>
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

export default function DISHA6Assessment({ data, onClose }) {
  const axios = useAxiosInstance();
  const navigate = useNavigate();
  const [stepIdx, setStepIdx] = useState(0);
  const [startTime] = useState(Date.now());

  const [divergentTasks, setDivergentTasks] = useState({});
  const [creativeSelfReport, setCreativeSelfReport] = useState({});
  const [innovationMindset, setInnovationMindset] = useState({});
  const [innovationFc, setInnovationFc] = useState({});
  const [entrepreneurial, setEntrepreneurial] = useState({});
  const [problemSolvingStyle, setProblemSolvingStyle] = useState({});
  const [designSensitivity, setDesignSensitivity] = useState({});
  const [sjt, setSjt] = useState({});
  const [validity, setValidity] = useState({});

  const allSjt = useMemo(() => [...(data.sjt?.blockG || []), ...(data.sjt?.blockH || [])], [data]);

  const stepId = STEP_IDS[stepIdx];
  const meta = STEP_META[stepId];

  const stepProgress = useMemo(() => {
    const likertCount = (items, map) => ({
      done: (items || []).filter((i) => map[i.id]).length,
      total: (items || []).length,
    });
    return {
      divergentTasks: {
        done: (data.divergentTasks || []).filter((t) => (divergentTasks[t.id] || "").trim().length > 0).length,
        total: (data.divergentTasks || []).length,
      },
      creativeSelfReport: likertCount(data.creativeSelfReport, creativeSelfReport),
      innovationMindset: {
        done: (data.innovationMindset || []).filter((i) => innovationMindset[i.id]).length + (data.innovationFc || []).filter((p) => innovationFc[p.id]).length,
        total: (data.innovationMindset || []).length + (data.innovationFc || []).length,
      },
      entrepreneurial: likertCount(data.entrepreneurial, entrepreneurial),
      problemSolvingStyle: likertCount(data.problemSolvingStyle, problemSolvingStyle),
      designSensitivity: likertCount(data.designSensitivity, designSensitivity),
      scenarios: {
        done: allSjt.filter((s) => sjt[s.id]?.mostLikely && sjt[s.id]?.leastLikely).length + (data.validity || []).filter((i) => validity[i.id]).length,
        total: allSjt.length + (data.validity || []).length,
      },
    };
  }, [data, divergentTasks, creativeSelfReport, innovationMindset, innovationFc, entrepreneurial, problemSolvingStyle, designSensitivity, sjt, validity, allSjt]);

  const submitMutation = useMutation(
    async (payload) => {
      const res = await axios.post("/api/psychometric/disha6Assessment", payload);
      return res.data;
    },
    {
      onSuccess: (response) => {
        message.success("DISHA Test 6 submitted successfully!");
        navigate("/psychometric-disha6-result", { state: response.data });
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
      divergentTasks,
      creativeSelfReport,
      innovationMindset,
      innovationFc,
      entrepreneurial,
      problemSolvingStyle,
      designSensitivity,
      sjt,
      validity,
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
          <ScaleRow value={valueMap[q.id]} onChange={(v) => setter((p) => ({ ...p, [q.id]: v }))} />
        </QuestionCard>
      ))}
    </div>
  );

  const renderDivergentTasks = () => (
    <div>
      <p className="text-sm text-slate-500 mb-5">
        For each task, write as many ideas as you can within the suggested time — one idea per line.
        There are no right or wrong answers. Unusual, creative or unexpected ideas are especially
        valued. Write quickly, don't filter your ideas.
      </p>
      {(data.divergentTasks || []).map((task, i) => (
        <div key={task.id} className="border border-slate-200 rounded-xl p-5 md:p-6 mb-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <h4 className="font-bold text-slate-800">
              {i + 1}. {task.title}
              {task.indiaContextStars > 0 && <span className="text-amber-500 ml-1">{"★".repeat(task.indiaContextStars)}</span>}
            </h4>
            <Tag icon={<Timer size={12} />} color="blue">{task.timeSeconds}s suggested</Tag>
          </div>
          <p className="text-slate-700 text-sm mb-3 leading-relaxed">{task.prompt}</p>
          {task.substitutionNote && (
            <p className="text-xs text-slate-400 mb-3 italic">{task.substitutionNote}</p>
          )}
          <Input.TextArea
            rows={6}
            placeholder="One idea per line…"
            value={divergentTasks[task.id] || ""}
            onChange={(e) => setDivergentTasks((p) => ({ ...p, [task.id]: e.target.value }))}
          />
        </div>
      ))}
    </div>
  );

  const renderInnovationMindset = () => (
    <div>
      {renderLikertList(data.innovationMindset, innovationMindset, setInnovationMindset, "How do you approach problems and new ideas?")}
      <h4 className="font-bold text-slate-800 mb-3 mt-8">When two approaches conflict, which resonates more?</h4>
      {(data.innovationFc || []).map((q, i) => (
        <QuestionCard index={i + 1} key={q.id}>
          <p className="font-medium text-slate-800 mb-2">{q.prompt}</p>
          <Radio.Group
            value={innovationFc[q.id]}
            onChange={(e) => setInnovationFc((p) => ({ ...p, [q.id]: e.target.value }))}
            className="flex flex-col md:flex-row gap-3 w-full"
          >
            {["A", "B"].map((k) => (
              <Radio.Button key={k} value={k} className="!h-auto !flex-1 !whitespace-normal !py-3 !px-4 !rounded-lg !leading-snug">
                {k === "A" ? q.optionA.text : q.optionB.text}
              </Radio.Button>
            ))}
          </Radio.Group>
        </QuestionCard>
      ))}
    </div>
  );

  const renderScenarios = () => (
    <div>
      <p className="text-sm text-slate-500 mb-5">
        For each situation, mark the option you would be <strong>most likely</strong> and{" "}
        <strong>least likely</strong> to do. There are no right or wrong answers.
      </p>
      <h4 className="font-bold text-slate-800 mb-3">Block 1 — Creative &amp; Entrepreneurial Dilemmas</h4>
      {(data.sjt?.blockG || []).map((sc, i) => renderSjtCard(sc, i))}
      <h4 className="font-bold text-slate-800 mb-3 mt-8">Block 2 — Innovation &amp; Startup Scenarios</h4>
      {(data.sjt?.blockH || []).map((sc, i) => renderSjtCard(sc, (data.sjt?.blockG || []).length + i))}

      <h4 className="font-bold text-slate-800 mb-3 mt-8">A few final statements</h4>
      {(data.validity || []).map((q, i) => (
        <QuestionCard index={i + 1} key={q.id}>
          <p className="font-medium text-slate-800">{q.text}</p>
          <ScaleRow value={validity[q.id]} onChange={(v) => setValidity((p) => ({ ...p, [q.id]: v }))} />
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

  const renderStep = () => {
    switch (stepId) {
      case "divergentTasks": return renderDivergentTasks();
      case "creativeSelfReport": return renderLikertList(data.creativeSelfReport, creativeSelfReport, setCreativeSelfReport, "Rate how accurately each statement describes you.");
      case "innovationMindset": return renderInnovationMindset();
      case "entrepreneurial": return renderLikertList(data.entrepreneurial, entrepreneurial, setEntrepreneurial, "There are no right or wrong answers — these questions are about your preferences and values, not about whether you are 'suited' to be an entrepreneur.");
      case "problemSolvingStyle": return renderLikertList(data.problemSolvingStyle, problemSolvingStyle, setProblemSolvingStyle, "No style is better than another — the goal is insight into how you naturally work.");
      case "designSensitivity": return renderLikertList(data.designSensitivity, designSensitivity, setDesignSensitivity, null);
      case "scenarios": return renderScenarios();
      default: return null;
    }
  };

  const isLast = stepIdx === STEP_IDS.length - 1;
  const cur = stepProgress[stepId] || { done: 0, total: 0 };

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 overflow-hidden flex flex-col">
      <header className="bg-white border-b border-slate-200 px-5 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="font-extrabold text-xl" style={{ color: navy }}>DISHA Test 6</div>
          <span className="hidden md:inline text-sm text-slate-400">Creative Thinking, Innovation &amp; Entrepreneurial Potential</span>
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
            <Progress percent={cur.total ? Math.round((cur.done / cur.total) * 100) : 0} showInfo={false} strokeColor={navy} className="mt-1" />
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> No right or wrong answers. Your responses auto-save as you go.
            </p>
          </div>
          {renderStep()}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 px-5 md:px-8 py-3 flex items-center justify-between">
        <Button icon={<ChevronLeft size={16} />} disabled={stepIdx === 0} onClick={() => setStepIdx((i) => Math.max(0, i - 1))}>Previous</Button>
        <span className="text-sm text-slate-400">Step {stepIdx + 1} of {STEP_IDS.length}</span>
        {isLast ? (
          <Button type="primary" style={{ background: navy }} loading={submitMutation.isLoading} onClick={handleSubmit}>Submit Assessment</Button>
        ) : (
          <Button type="primary" style={{ background: navy }} onClick={() => setStepIdx((i) => Math.min(STEP_IDS.length - 1, i + 1))}>
            Next <ChevronRight size={16} />
          </Button>
        )}
      </footer>
    </div>
  );
}
