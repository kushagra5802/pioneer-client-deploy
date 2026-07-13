import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Button,
  Radio,
  Checkbox,
  Input,
  InputNumber,
  Select,
  Tag,
  message,
  Progress,
} from "antd";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import useAxiosInstance from "../../../lib/useAxiosInstance";

const navy = "#004877";

const LIKE_SCALE = [
  { value: 1, label: "Strongly Dislike" },
  { value: 2, label: "Dislike" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Like" },
  { value: 5, label: "Strongly Like" },
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

const STEP_IDS = ["academic", "aptitude", "interests", "values", "streamPreference", "context", "scenarios"];
const STEP_META = {
  academic: { code: "1", name: "Academic Profile", timeMin: 5 },
  aptitude: { code: "2", name: "Aptitude Snapshot", timeMin: 10 },
  interests: { code: "3", name: "Interest Profile", timeMin: 5 },
  values: { code: "4", name: "Values & Preferences", timeMin: 3 },
  streamPreference: { code: "5", name: "Stream Preferences", timeMin: 2 },
  context: { code: "6", name: "Your Context", timeMin: 3 },
  scenarios: { code: "7", name: "Real-Life Scenarios", timeMin: 7 },
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

function ScaleRow({ scale, value, onChange }) {
  return (
    <Radio.Group value={value} onChange={(e) => onChange(e.target.value)} className="flex flex-wrap gap-2 mt-3">
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

export default function DISHAC10Assessment({ data, onClose }) {
  const axios = useAxiosInstance();
  const navigate = useNavigate();
  const [stepIdx, setStepIdx] = useState(0);
  const [startTime] = useState(Date.now());

  const [marks, setMarks] = useState({});
  const [enjoyment, setEnjoyment] = useState({});
  const [inTheZoneSubject, setInTheZoneSubject] = useState(null);
  const [aptitude, setAptitude] = useState({}); // { id: { selected, hintUsed } }
  const [hintOpen, setHintOpen] = useState({});
  const [interests, setInterests] = useState({});
  const [values, setValues] = useState({});
  const [streamPreference, setStreamPreference] = useState({});
  const [parentPreference, setParentPreference] = useState(null);
  const [financialUrgency, setFinancialUrgency] = useState(null);
  const [geographicConstraint, setGeographicConstraint] = useState(null);
  const [decisionStatus, setDecisionStatus] = useState(null);
  const [examTargets, setExamTargets] = useState([]);
  const [secretInterest, setSecretInterest] = useState("");
  const [scenarios, setScenarios] = useState({});

  const stepId = STEP_IDS[stepIdx];
  const meta = STEP_META[stepId];

  const subjectOptions = useMemo(
    () => (data.academic?.subjects || []).map((s) => ({ value: s.key, label: s.label })),
    [data]
  );

  const setMarkVal = (subjKey, termKey, field, val) =>
    setMarks((p) => ({
      ...p,
      [subjKey]: {
        ...p[subjKey],
        terms: { ...p[subjKey]?.terms, [termKey]: { ...p[subjKey]?.terms?.[termKey], [field]: val } },
      },
    }));

  const setAptSelected = (qid, val) => setAptitude((p) => ({ ...p, [qid]: { ...p[qid], selected: val } }));
  const revealHint = (qid) => {
    setHintOpen((p) => ({ ...p, [qid]: true }));
    setAptitude((p) => ({ ...p, [qid]: { ...p[qid], hintUsed: true } }));
  };

  /* ---------------- completeness tracking ---------------- */
  const subjectsWithMarks = useMemo(
    () =>
      Object.entries(marks).filter(([, m]) =>
        m && m.terms && Object.values(m.terms).some((t) => t && t.maximum && (t.obtained || t.obtained === 0))
      ),
    [marks]
  );

  const stepProgress = useMemo(() => {
    const counts = {};
    counts.academic = { done: subjectsWithMarks.length, total: (data.academic?.subjects || []).length || 1 };
    counts.aptitude = {
      done: (data.aptitude || []).filter((q) => aptitude[q.id]?.selected != null).length,
      total: (data.aptitude || []).length,
    };
    counts.interests = {
      done: (data.interests || []).filter((q) => interests[q.id]).length,
      total: (data.interests || []).length,
    };
    counts.values = {
      done: (data.values || []).filter((q) => values[q.id]).length,
      total: (data.values || []).length,
    };
    counts.streamPreference = {
      done: (data.streamPreference || []).filter((p) => streamPreference[p.id]).length,
      total: (data.streamPreference || []).length,
    };
    const ctxRequired = [parentPreference, financialUrgency, geographicConstraint, decisionStatus].filter(
      (v) => v != null && v !== ""
    ).length;
    counts.context = { done: ctxRequired, total: 4, optional: true };
    counts.scenarios = {
      done: (data.scenarios || []).filter((s) => scenarios[s.id]).length,
      total: (data.scenarios || []).length,
    };
    return counts;
  }, [
    subjectsWithMarks,
    data,
    aptitude,
    interests,
    values,
    streamPreference,
    parentPreference,
    financialUrgency,
    geographicConstraint,
    decisionStatus,
    scenarios,
  ]);

  /* ---------------- submission ---------------- */
  const submitMutation = useMutation(
    async (payload) => {
      const res = await axios.post("/api/psychometric/dishaC10Assessment", payload);
      return res.data;
    },
    {
      onSuccess: (response) => {
        message.success("Stream Selection Test submitted successfully!");
        navigate("/psychometric-dishac10-result", { state: response.data });
      },
      onError: (error) => {
        message.error(error?.response?.data?.error?.message || "Submission failed. Please try again.");
      },
    }
  );

  const incomplete = useMemo(() => {
    const required = ["aptitude", "interests", "values", "streamPreference", "scenarios"];
    const missing = required.filter((g) => stepProgress[g] && stepProgress[g].done < stepProgress[g].total);
    if (!subjectsWithMarks.length) missing.unshift("academic");
    return missing;
  }, [stepProgress, subjectsWithMarks]);

  const handleSubmit = () => {
    if (incomplete.length) {
      message.warning(`Please complete: ${incomplete.map((g) => STEP_META[g].name).join(", ")}`);
      return;
    }
    const completionTimeSeconds = Math.floor((Date.now() - startTime) / 1000);
    submitMutation.mutate({
      marks,
      enjoyment,
      inTheZoneSubject,
      aptitude,
      interests,
      values,
      streamPreference,
      context: {
        parentPreference,
        financialUrgency,
        geographicConstraint,
        decisionStatus,
        examTargets,
        secretInterest,
      },
      scenarios,
      completionTimeSeconds,
    });
  };

  /* ==================== RENDERERS ==================== */

  const renderAcademic = () => (
    <div>
      <p className="text-sm text-slate-500 mb-4">
        Your marks are usually pre-filled from your DISHA profile. Check them and correct anything
        wrong, then rate how much you genuinely enjoy each subject.
      </p>
      {(data.academic?.subjects || []).map((subj) => (
        <div key={subj.key} className="border border-slate-200 rounded-xl p-4 mb-4 bg-white">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h4 className="font-semibold text-slate-800">{subj.label}</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">★ Enjoy?</span>
              <Radio.Group
                size="small"
                value={enjoyment[subj.key]}
                onChange={(e) => setEnjoyment((p) => ({ ...p, [subj.key]: e.target.value }))}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <Radio.Button key={n} value={n}>{n}</Radio.Button>
                ))}
              </Radio.Group>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(data.academic?.terms || []).map((term) => (
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

      <div className="bg-white border border-slate-200 rounded-lg p-4 mt-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Which subject do you feel most 'in the zone' with — where time passes quickly and you feel
          genuinely engaged?
        </label>
        <Select
          className="w-full md:w-2/3"
          placeholder="Select a subject"
          value={inTheZoneSubject || undefined}
          onChange={setInTheZoneSubject}
          options={subjectOptions}
          allowClear
        />
      </div>
    </div>
  );

  const renderAptitude = () => (
    <div>
      <p className="text-sm text-slate-500 mb-5">
        14 timed questions. Try your best. A hint is available for each question but costs 0.25 marks.
        Scoring: Correct = +1 · Wrong = −0.33 · Hint used = additional −0.25 · Blank = 0.
      </p>
      {(data.aptitude || []).map((q, i) => (
        <QuestionCard index={i + 1} key={q.id}>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Tag color={q.difficulty === "Easy" ? "green" : q.difficulty === "Hard" ? "red" : "gold"}>{q.difficulty}</Tag>
            <Tag>{q.dim}</Tag>
          </div>
          <p className="font-medium text-slate-800 mb-2">{q.text}</p>
          <Radio.Group
            value={aptitude[q.id]?.selected}
            onChange={(e) => setAptSelected(q.id, e.target.value)}
            className="flex flex-col gap-2 mt-2"
          >
            {q.options.map((opt, idx) => (
              <Radio key={idx} value={idx}>{opt}</Radio>
            ))}
          </Radio.Group>
          <div className="mt-3">
            {!hintOpen[q.id] ? (
              <Button size="small" icon={<Lightbulb size={14} />} onClick={() => revealHint(q.id)}>
                Show hint (−0.25)
              </Button>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-sm text-amber-700 flex items-center gap-2">
                <Lightbulb size={14} /> {q.hint}
              </div>
            )}
          </div>
        </QuestionCard>
      ))}
    </div>
  );

  const renderInterests = () => (
    <div>
      <p className="text-sm text-slate-500 mb-5">
        Rate how much you would <strong>enjoy</strong> doing each activity — regardless of whether you
        are good at it, or whether your family would approve. Answer for yourself.
      </p>
      {(data.interests || []).map((q, i) => (
        <QuestionCard index={i + 1} key={q.id}>
          <p className="font-medium text-slate-800">
            {q.text}
            {q.indiaSpecific && <span className="text-amber-500 ml-1" title="India-specific item">★</span>}
          </p>
          <ScaleRow scale={LIKE_SCALE} value={interests[q.id]} onChange={(v) => setInterests((p) => ({ ...p, [q.id]: v }))} />
        </QuestionCard>
      ))}
    </div>
  );

  const renderValues = () => (
    <div>
      <p className="text-sm text-slate-500 mb-5">
        Rate how important each statement is to <strong>your</strong> future career — not your parents'
        ideal career.
      </p>
      {(data.values || []).map((q, i) => (
        <QuestionCard index={i + 1} key={q.id}>
          <p className="font-medium text-slate-800">
            {q.text}
            {q.indiaSpecific && <span className="text-amber-500 ml-1">★</span>}
          </p>
          <ScaleRow scale={IMPORTANCE_SCALE} value={values[q.id]} onChange={(v) => setValues((p) => ({ ...p, [q.id]: v }))} />
        </QuestionCard>
      ))}
    </div>
  );

  const renderStreamPreference = () => (
    <div>
      <p className="text-sm text-slate-500 mb-5">
        For each pair, choose the activity that appeals to you MORE — not the one that seems 'safer'.
      </p>
      {(data.streamPreference || []).map((q, i) => (
        <QuestionCard index={i + 1} key={q.id}>
          <Radio.Group
            value={streamPreference[q.id]}
            onChange={(e) => setStreamPreference((p) => ({ ...p, [q.id]: e.target.value }))}
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

  const renderContext = () => {
    const ctx = data.context || {};
    return (
      <div>
        <p className="text-sm text-slate-500 mb-5">
          Six questions about your situation. These personalise your results — no stream option is
          ever blocked by any answer here.
        </p>
        {ctx.parentPreference && (
          <QuestionCard index={1}>
            <p className="font-medium text-slate-800 mb-1">{ctx.parentPreference.text}</p>
            <p className="text-xs text-slate-400 mb-2">{ctx.parentPreference.note}</p>
            <ScaleRow scale={AGREE_SCALE} value={parentPreference} onChange={setParentPreference} />
          </QuestionCard>
        )}
        {ctx.financialUrgency && (
          <QuestionCard index={2}>
            <p className="font-medium text-slate-800 mb-1">{ctx.financialUrgency.text}</p>
            <p className="text-xs text-slate-400 mb-2">{ctx.financialUrgency.note}</p>
            <ScaleRow scale={AGREE_SCALE} value={financialUrgency} onChange={setFinancialUrgency} />
          </QuestionCard>
        )}
        {ctx.geographicConstraint && (
          <QuestionCard index={3}>
            <p className="font-medium text-slate-800 mb-1">{ctx.geographicConstraint.text}</p>
            <p className="text-xs text-slate-400 mb-2">{ctx.geographicConstraint.note}</p>
            <ScaleRow scale={AGREE_SCALE} value={geographicConstraint} onChange={setGeographicConstraint} />
          </QuestionCard>
        )}
        {ctx.decisionStatus && (
          <QuestionCard index={4}>
            <p className="font-medium text-slate-800 mb-1">{ctx.decisionStatus.text}</p>
            <p className="text-xs text-slate-400 mb-2">{ctx.decisionStatus.note}</p>
            <Radio.Group
              value={decisionStatus}
              onChange={(e) => setDecisionStatus(e.target.value)}
              className="flex flex-col gap-2"
            >
              {ctx.decisionStatus.options.map((opt) => (
                <Radio key={opt} value={opt}>{opt}</Radio>
              ))}
            </Radio.Group>
          </QuestionCard>
        )}
        {ctx.examTargets && (
          <QuestionCard index={5}>
            <p className="font-medium text-slate-800 mb-1">{ctx.examTargets.text}</p>
            <p className="text-xs text-slate-400 mb-2">{ctx.examTargets.note}</p>
            <Checkbox.Group
              value={examTargets}
              onChange={setExamTargets}
              className="flex flex-col gap-2"
              options={ctx.examTargets.options}
            />
          </QuestionCard>
        )}
        {ctx.secretInterest && (
          <QuestionCard index={6}>
            <p className="font-medium text-slate-800 mb-1">{ctx.secretInterest.text}</p>
            <p className="text-xs text-slate-400 mb-2">{ctx.secretInterest.note}</p>
            <Input.TextArea
              rows={3}
              placeholder="Optional — private to counsellor only"
              value={secretInterest}
              onChange={(e) => setSecretInterest(e.target.value)}
            />
          </QuestionCard>
        )}
      </div>
    );
  };

  const renderScenarios = () => (
    <div>
      <p className="text-sm text-slate-500 mb-5">
        Five situations Class 10 students commonly face. Select the response you would MOST LIKELY
        choose. There are no wrong answers.
      </p>
      {(data.scenarios || []).map((sc, i) => (
        <div key={sc.id} className="border border-slate-200 rounded-xl p-5 md:p-6 mb-6 bg-white shadow-sm">
          <h4 className="font-bold text-slate-800 mb-2">{i + 1}. {sc.title}</h4>
          <p className="text-slate-600 text-sm mb-4 leading-relaxed bg-slate-50 rounded-lg p-3">{sc.situation}</p>
          <p className="text-sm font-semibold text-slate-500 mb-2">What would you MOST LIKELY do?</p>
          <Radio.Group
            value={scenarios[sc.id]}
            onChange={(e) => setScenarios((p) => ({ ...p, [sc.id]: e.target.value }))}
            className="flex flex-col gap-2 w-full"
          >
            {sc.options.map((opt) => (
              <Radio key={opt.key} value={opt.key} className="!items-start">
                <span className="font-semibold text-slate-700 mr-1">{opt.key}.</span>
                <span className="text-slate-700">{opt.text}</span>
              </Radio>
            ))}
          </Radio.Group>
        </div>
      ))}
    </div>
  );

  const renderStep = () => {
    switch (stepId) {
      case "academic": return renderAcademic();
      case "aptitude": return renderAptitude();
      case "interests": return renderInterests();
      case "values": return renderValues();
      case "streamPreference": return renderStreamPreference();
      case "context": return renderContext();
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
          <div className="font-extrabold text-xl" style={{ color: navy }}>Stream Selection Test</div>
          <span className="hidden md:inline text-sm text-slate-400">Class 10 · Finding your stream</span>
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
