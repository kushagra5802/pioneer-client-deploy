import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Button,
  Radio,
  Checkbox,
  Input,
  InputNumber,
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

const AGREE_SCALE = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
];
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
  { value: 3, label: "Neutral" },
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

const STEP_IDS = ["academic", "aptitude", "personality", "interests", "careerTitles", "valuesMotivations", "lifeDesign", "context", "scenarios"];
const STEP_META = {
  academic: { code: "1", name: "Academic Profile", timeMin: 7 },
  aptitude: { code: "2", name: "Aptitude (Extended)", timeMin: 12 },
  personality: { code: "3", name: "Personality", timeMin: 8 },
  interests: { code: "4", name: "Interests (RIASEC)", timeMin: 8 },
  careerTitles: { code: "5", name: "Career Titles", timeMin: 5 },
  valuesMotivations: { code: "6", name: "Values & Motivations", timeMin: 7 },
  lifeDesign: { code: "7", name: "Life Design", timeMin: 3 },
  context: { code: "8", name: "Your Context", timeMin: 4 },
  scenarios: { code: "9", name: "Career Scenarios", timeMin: 8 },
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

function ScaleRow({ scale, value, onChange }) {
  return (
    <Radio.Group value={value} onChange={(e) => onChange(e.target.value)} className="flex flex-wrap gap-2 mt-3">
      {scale.map((opt) => (
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

export default function DISHAC12Assessment({ data, onClose }) {
  const axios = useAxiosInstance();
  const navigate = useNavigate();
  const [stepIdx, setStepIdx] = useState(0);
  const [startTime] = useState(Date.now());

  const [class10Marks, setClass10Marks] = useState({});
  const [class11Marks, setClass11Marks] = useState({});
  const [class12Marks, setClass12Marks] = useState({});
  const [attemptedScores, setAttemptedScores] = useState({});
  const [aptitude, setAptitude] = useState({});
  const [hintOpen, setHintOpen] = useState({});
  const [personality, setPersonality] = useState({});
  const [interests, setInterests] = useState({});
  const [careerAppeal, setCareerAppeal] = useState({});
  const [values, setValues] = useState({});
  const [motivations, setMotivations] = useState({});
  const [lifeDesign, setLifeDesign] = useState({});
  const [parentPreference, setParentPreference] = useState(null);
  const [financialUrgency, setFinancialUrgency] = useState(null);
  const [geographicConstraint, setGeographicConstraint] = useState(null);
  const [secretInterest, setSecretInterest] = useState("");
  const [careerClarity, setCareerClarity] = useState(null);
  const [targetExam, setTargetExam] = useState([]);
  const [financialSituation, setFinancialSituation] = useState(null);
  const [roleModelName, setRoleModelName] = useState("");
  const [roleModelAdmire, setRoleModelAdmire] = useState("");
  const [scenarios, setScenarios] = useState({});

  const stepId = STEP_IDS[stepIdx];
  const meta = STEP_META[stepId];

  const setSlotVal = (setter, slotKey, field, val) =>
    setter((p) => ({ ...p, [slotKey]: { ...p[slotKey], [field]: val } }));
  const setClass10Val = (subjKey, field, val) =>
    setClass10Marks((p) => ({ ...p, [subjKey]: { ...p[subjKey], [field]: val } }));

  const setAptSelected = (qid, val) => setAptitude((p) => ({ ...p, [qid]: { ...p[qid], selected: val } }));
  const revealHint = (qid) => {
    setHintOpen((p) => ({ ...p, [qid]: true }));
    setAptitude((p) => ({ ...p, [qid]: { ...p[qid], hintUsed: true } }));
  };

  /* ---------------- completeness tracking ---------------- */
  const class10Done = useMemo(
    () => (data.academic?.class10Subjects || []).filter((s) => class10Marks[s.key]?.maximum && (class10Marks[s.key]?.obtained || class10Marks[s.key]?.obtained === 0)).length,
    [class10Marks, data]
  );

  const stepProgress = useMemo(() => {
    const counts = {};
    counts.academic = { done: class10Done, total: (data.academic?.class10Subjects || []).length || 1 };
    counts.aptitude = {
      done: (data.aptitude || []).filter((q) => aptitude[q.id]?.selected != null).length,
      total: (data.aptitude || []).length,
    };
    counts.personality = {
      done: (data.personality || []).filter((q) => personality[q.id]).length,
      total: (data.personality || []).length,
    };
    counts.interests = {
      done: (data.interests || []).filter((q) => interests[q.id]).length,
      total: (data.interests || []).length,
    };
    counts.careerTitles = {
      done: (data.careerTitles || []).filter((q) => careerAppeal[q.id]).length,
      total: (data.careerTitles || []).length,
    };
    const valuesDone = (data.workValues || []).filter((q) => values[q.id]).length + (data.motivations || []).filter((q) => motivations[q.id]).length;
    counts.valuesMotivations = { done: valuesDone, total: (data.workValues || []).length + (data.motivations || []).length };
    const ldItems = Object.values(data.lifeDesign || {});
    const ldDone = ldItems.filter((item) => lifeDesign[item.id] != null && lifeDesign[item.id] !== "").length;
    counts.lifeDesign = { done: ldDone, total: ldItems.length || 1 };
    const ctxRequired = [parentPreference, financialUrgency, geographicConstraint, careerClarity].filter((v) => v != null && v !== "").length;
    counts.context = { done: ctxRequired, total: 4, optional: true };
    counts.scenarios = {
      done: (data.scenarios || []).filter((s) => scenarios[s.id]).length,
      total: (data.scenarios || []).length,
    };
    return counts;
  }, [class10Done, data, aptitude, personality, interests, careerAppeal, values, motivations, lifeDesign, parentPreference, financialUrgency, geographicConstraint, careerClarity, scenarios]);

  /* ---------------- submission ---------------- */
  const submitMutation = useMutation(
    async (payload) => {
      const res = await axios.post("/api/psychometric/dishaC12Assessment", payload);
      return res.data;
    },
    {
      onSuccess: (response) => {
        message.success("Career Selection Test submitted successfully!");
        navigate("/psychometric-dishac12-result", { state: response.data });
      },
      onError: (error) => {
        message.error(error?.response?.data?.error?.message || "Submission failed. Please try again.");
      },
    }
  );

  const incomplete = useMemo(() => {
    const required = ["aptitude", "personality", "interests", "careerTitles", "valuesMotivations", "scenarios"];
    const missing = required.filter((g) => stepProgress[g] && stepProgress[g].done < stepProgress[g].total);
    if (class10Done === 0) missing.unshift("academic");
    return missing;
  }, [stepProgress, class10Done]);

  const handleSubmit = () => {
    if (incomplete.length) {
      message.warning(`Please complete: ${incomplete.map((g) => STEP_META[g].name).join(", ")}`);
      return;
    }
    const completionTimeSeconds = Math.floor((Date.now() - startTime) / 1000);
    submitMutation.mutate({
      class10Marks,
      class11Marks,
      class12Marks,
      attemptedScores,
      aptitude,
      personality,
      interests,
      careerAppeal,
      values,
      motivations,
      lifeDesign,
      context: {
        parentPreference,
        financialUrgency,
        geographicConstraint,
        secretInterest,
        careerClarity,
        targetExam,
        financialSituation,
        roleModelName,
        roleModelAdmire,
      },
      scenarios,
      completionTimeSeconds,
    });
  };

  /* ==================== RENDERERS ==================== */

  const renderMarksGrid = (title, hint, slots, marksState, setMarksState, showPredicted) => (
    <div className="border border-slate-200 rounded-xl p-4 mb-4 bg-white">
      <h4 className="font-semibold text-slate-800 mb-1">{title}</h4>
      {hint && <p className="text-xs text-slate-500 mb-3">{hint}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {slots.map((slotKey, i) => (
          <div key={slotKey} className="flex items-center gap-2">
            <Input
              size="small"
              placeholder={`Subject ${i + 1} name`}
              className="w-40"
              value={marksState[slotKey]?.label || ""}
              onChange={(e) => setSlotVal(setMarksState, slotKey, "label", e.target.value)}
            />
            <InputNumber size="small" min={0} placeholder="Got" className="w-20" value={marksState[slotKey]?.obtained} onChange={(v) => setSlotVal(setMarksState, slotKey, "obtained", v)} />
            <span className="text-slate-400">/</span>
            <InputNumber size="small" min={1} placeholder="Max" className="w-20" value={marksState[slotKey]?.maximum} onChange={(v) => setSlotVal(setMarksState, slotKey, "maximum", v)} />
            {showPredicted && (
              <Checkbox
                checked={!!marksState[slotKey]?.predicted}
                onChange={(e) => setSlotVal(setMarksState, slotKey, "predicted", e.target.checked)}
              >
                Predicted
              </Checkbox>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderAcademic = () => (
    <div>
      <p className="text-sm text-slate-500 mb-4">
        Enter marks for Class 10 (Board), Class 11 (Annual), and Class 12 (Actual or Predicted). If a
        Class 12 subject hasn't been examined yet, enter your realistic estimate and tick 'Predicted'.
      </p>

      <div className="border border-slate-200 rounded-xl p-4 mb-4 bg-white">
        <h4 className="font-semibold text-slate-800 mb-3">Class 10 Board Results</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(data.academic?.class10Subjects || []).map((subj) => (
            <div key={subj.key} className="flex items-center gap-2">
              <span className="w-40 text-sm text-slate-700">{subj.label}</span>
              <InputNumber size="small" min={0} placeholder="Got" className="w-20" value={class10Marks[subj.key]?.obtained} onChange={(v) => setClass10Val(subj.key, "obtained", v)} />
              <span className="text-slate-400">/</span>
              <InputNumber size="small" min={1} placeholder="Max" className="w-20" value={class10Marks[subj.key]?.maximum} onChange={(v) => setClass10Val(subj.key, "maximum", v)} />
            </div>
          ))}
        </div>
      </div>

      {renderMarksGrid(
        "Class 11 — Annual Examination",
        "Enter marks for your stream subjects only. Name each slot (e.g. Physics, History, Accountancy).",
        data.academic?.class11Slots || [],
        class11Marks,
        setClass11Marks,
        false
      )}
      {renderMarksGrid(
        "Class 12 — Current Year (Actual or Predicted)",
        "For subjects not yet examined, enter your realistic estimate and tick Predicted.",
        data.academic?.class12Slots || [],
        class12Marks,
        setClass12Marks,
        true
      )}

      <div className="border border-slate-200 rounded-xl p-4 bg-white">
        <h4 className="font-semibold text-slate-800 mb-1">Entrance Exam Scores (if available)</h4>
        <p className="text-xs text-slate-500 mb-3">Leave blank if not yet attempted.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(data.academic?.entranceExamsAttempted || []).map((exam) => (
            <div key={exam.key} className="flex items-center gap-2">
              <span className="w-32 text-sm text-slate-700">{exam.label}</span>
              <InputNumber
                size="small"
                min={0}
                placeholder={exam.unit}
                className="w-32"
                value={attemptedScores[exam.key]?.value}
                onChange={(v) => setSlotVal(setAttemptedScores, exam.key, "value", v)}
              />
              {exam.note && <span className="text-xs text-slate-400">{exam.note}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAptitude = () => (
    <div>
      <p className="text-sm text-slate-500 mb-5">
        20 harder questions across Numerical, Verbal, Logical and Abstract reasoning. Scoring: Correct
        = +1 · Wrong = −0.33 · Hint used = additional −0.25 · Blank = 0.
      </p>
      {(data.aptitude || []).map((q, i) => (
        <QuestionCard index={i + 1} key={q.id}>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Tag color={q.difficulty === "Easy" ? "green" : q.difficulty === "Hard" ? "red" : "gold"}>{q.difficulty}</Tag>
            <Tag>{q.dim}</Tag>
          </div>
          <p className="font-medium text-slate-800 mb-2 whitespace-pre-line">{q.text}</p>
          <Radio.Group value={aptitude[q.id]?.selected} onChange={(e) => setAptSelected(q.id, e.target.value)} className="flex flex-col gap-2 mt-2">
            {q.options.map((opt, idx) => (
              <Radio key={idx} value={idx}>{opt}</Radio>
            ))}
          </Radio.Group>
          <div className="mt-3">
            {!hintOpen[q.id] ? (
              <Button size="small" icon={<Lightbulb size={14} />} onClick={() => revealHint(q.id)}>Show hint (−0.25)</Button>
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

  const renderPersonality = () => (
    <div>
      <p className="text-sm text-slate-500 mb-5">Rate how accurately each statement describes you. There are no right or wrong answers.</p>
      {(data.personality || []).map((q, i) => (
        <QuestionCard index={i + 1} key={q.id}>
          <p className="font-medium text-slate-800">
            {q.text}
            {q.indiaSpecific && <span className="text-amber-500 ml-1" title="India-specific item">★</span>}
          </p>
          <ScaleRow scale={AGREE_SCALE} value={personality[q.id]} onChange={(v) => setPersonality((p) => ({ ...p, [q.id]: v }))} />
        </QuestionCard>
      ))}
    </div>
  );

  const renderInterests = () => (
    <div>
      <p className="text-sm text-slate-500 mb-5">Rate how much you would ENJOY each activity — regardless of your aptitude, marks, or family's opinion.</p>
      {(data.interests || []).map((q, i) => (
        <QuestionCard index={i + 1} key={q.id}>
          <p className="font-medium text-slate-800">
            {q.text}
            {q.indiaSpecific && <span className="text-amber-500 ml-1">★</span>}
          </p>
          <ScaleRow scale={LIKE_SCALE} value={interests[q.id]} onChange={(v) => setInterests((p) => ({ ...p, [q.id]: v }))} />
        </QuestionCard>
      ))}
    </div>
  );

  const renderCareerTitles = () => (
    <div>
      <p className="text-sm text-slate-500 mb-5">Rate how appealing each career sounds — regardless of whether you think you could get into it.</p>
      {(data.careerTitles || []).map((q, i) => (
        <QuestionCard index={i + 1} key={q.id}>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <p className="font-medium text-slate-800">{q.title}</p>
            <Tag className="!text-xs">{q.sector}</Tag>
          </div>
          <ScaleRow scale={APPEAL_SCALE} value={careerAppeal[q.id]} onChange={(v) => setCareerAppeal((p) => ({ ...p, [q.id]: v }))} />
        </QuestionCard>
      ))}
    </div>
  );

  const renderValuesMotivations = () => (
    <div>
      <h4 className="font-bold text-slate-800 mb-3">Part A — Work Values</h4>
      <p className="text-sm text-slate-500 mb-4">How important is each statement to your future career?</p>
      {(data.workValues || []).map((q, i) => (
        <QuestionCard index={i + 1} key={q.id}>
          <p className="font-medium text-slate-800">
            {q.text}
            {q.indiaSpecific && <span className="text-amber-500 ml-1">★</span>}
          </p>
          <ScaleRow scale={IMPORTANCE_SCALE} value={values[q.id]} onChange={(v) => setValues((p) => ({ ...p, [q.id]: v }))} />
        </QuestionCard>
      ))}

      <h4 className="font-bold text-slate-800 mb-3 mt-8">Part B — Career Motivations</h4>
      <p className="text-sm text-slate-500 mb-4">How accurately does each statement describe what drives you?</p>
      {(data.motivations || []).map((q, i) => (
        <QuestionCard index={(data.workValues || []).length + i + 1} key={q.id}>
          <p className="font-medium text-slate-800">
            {q.text}
            {q.indiaSpecific && <span className="text-amber-500 ml-1">★</span>}
          </p>
          <ScaleRow scale={AGREE_SCALE} value={motivations[q.id]} onChange={(v) => setMotivations((p) => ({ ...p, [q.id]: v }))} />
        </QuestionCard>
      ))}
    </div>
  );

  const renderLifeDesign = () => {
    const ld = data.lifeDesign || {};
    let idx = 0;
    const next = () => { idx += 1; return idx; };
    return (
      <div>
        <p className="text-sm text-slate-500 mb-5">
          How do you want your career to fit into your life? These shape lifestyle compatibility, not just what you can do.
        </p>
        {["metroPreference", "autonomyIn5Years", "incomeAspiration", "familyPresence"].map((k) =>
          ld[k] ? (
            <QuestionCard index={next()} key={k}>
              <p className="font-medium text-slate-800 mb-1">{ld[k].text}</p>
              <p className="text-xs text-slate-400 mb-2">{ld[k].note}</p>
              <ScaleRow scale={AGREE_SCALE} value={lifeDesign[k]} onChange={(v) => setLifeDesign((p) => ({ ...p, [k]: v }))} />
            </QuestionCard>
          ) : null
        )}
        {["orgType", "geoExpectation", "workingStyle"].map((k) =>
          ld[k] ? (
            <QuestionCard index={next()} key={k}>
              <p className="font-medium text-slate-800 mb-1">{ld[k].text}</p>
              <p className="text-xs text-slate-400 mb-2">{ld[k].note}</p>
              <Radio.Group value={lifeDesign[k]} onChange={(e) => setLifeDesign((p) => ({ ...p, [k]: e.target.value }))} className="flex flex-col gap-2">
                {ld[k].options.map((opt) => (
                  <Radio key={opt} value={opt}>{opt}</Radio>
                ))}
              </Radio.Group>
            </QuestionCard>
          ) : null
        )}
        {ld.riskTolerance && (
          <QuestionCard index={next()}>
            <p className="font-medium text-slate-800 mb-1">{ld.riskTolerance.text}</p>
            <p className="text-xs text-slate-400 mb-2">{ld.riskTolerance.note}</p>
            <ScaleRow scale={AGREE_SCALE} value={lifeDesign.riskTolerance} onChange={(v) => setLifeDesign((p) => ({ ...p, riskTolerance: v }))} />
          </QuestionCard>
        )}
      </div>
    );
  };

  const renderContext = () => {
    const ctx = data.context || {};
    return (
      <div>
        <p className="text-sm text-slate-500 mb-5">
          Eight questions about your real-life situation. These personalise your results — no career
          option is ever blocked by any answer here.
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
        {ctx.secretInterest && (
          <QuestionCard index={4}>
            <p className="font-medium text-slate-800 mb-1">{ctx.secretInterest.text}</p>
            <p className="text-xs text-slate-400 mb-2">{ctx.secretInterest.note}</p>
            <Input.TextArea rows={3} placeholder="Optional — private to counsellor only" value={secretInterest} onChange={(e) => setSecretInterest(e.target.value)} />
          </QuestionCard>
        )}
        {ctx.careerClarity && (
          <QuestionCard index={5}>
            <p className="font-medium text-slate-800 mb-1">{ctx.careerClarity.text}</p>
            <p className="text-xs text-slate-400 mb-2">{ctx.careerClarity.note}</p>
            <Radio.Group value={careerClarity} onChange={(e) => setCareerClarity(e.target.value)} className="flex flex-col gap-2">
              {ctx.careerClarity.options.map((opt) => (
                <Radio key={opt} value={opt}>{opt}</Radio>
              ))}
            </Radio.Group>
          </QuestionCard>
        )}
        {ctx.targetExam && (
          <QuestionCard index={6}>
            <p className="font-medium text-slate-800 mb-1">{ctx.targetExam.text}</p>
            <p className="text-xs text-slate-400 mb-2">{ctx.targetExam.note}</p>
            <Checkbox.Group value={targetExam} onChange={setTargetExam} className="flex flex-col gap-2" options={ctx.targetExam.options} />
          </QuestionCard>
        )}
        {ctx.financialSituation && (
          <QuestionCard index={7}>
            <p className="font-medium text-slate-800 mb-1">{ctx.financialSituation.text}</p>
            <p className="text-xs text-slate-400 mb-2">{ctx.financialSituation.note}</p>
            <Radio.Group value={financialSituation} onChange={(e) => setFinancialSituation(e.target.value)} className="flex flex-col gap-2">
              {ctx.financialSituation.options.map((opt) => (
                <Radio key={opt} value={opt}>{opt}</Radio>
              ))}
            </Radio.Group>
          </QuestionCard>
        )}
        {ctx.roleModel && (
          <QuestionCard index={8}>
            <p className="font-medium text-slate-800 mb-1">{ctx.roleModel.text}</p>
            <p className="text-xs text-slate-400 mb-2">{ctx.roleModel.note}</p>
            <Input placeholder="Role model's name" className="mb-2" value={roleModelName} onChange={(e) => setRoleModelName(e.target.value)} />
            <Input.TextArea rows={2} placeholder="What I admire about their career (about 50 words)" value={roleModelAdmire} onChange={(e) => setRoleModelAdmire(e.target.value)} />
          </QuestionCard>
        )}
      </div>
    );
  };

  const renderScenarios = () => (
    <div>
      <p className="text-sm text-slate-500 mb-5">
        Five situations Class 12 students commonly face. Select the response you would MOST LIKELY choose.
      </p>
      {(data.scenarios || []).map((sc, i) => (
        <div key={sc.id} className="border border-slate-200 rounded-xl p-5 md:p-6 mb-6 bg-white shadow-sm">
          <h4 className="font-bold text-slate-800 mb-2">{i + 1}. {sc.title}</h4>
          <p className="text-slate-600 text-sm mb-4 leading-relaxed bg-slate-50 rounded-lg p-3">{sc.situation}</p>
          <p className="text-sm font-semibold text-slate-500 mb-2">What would you MOST LIKELY do?</p>
          <Radio.Group value={scenarios[sc.id]} onChange={(e) => setScenarios((p) => ({ ...p, [sc.id]: e.target.value }))} className="flex flex-col gap-2 w-full">
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
      case "personality": return renderPersonality();
      case "interests": return renderInterests();
      case "careerTitles": return renderCareerTitles();
      case "valuesMotivations": return renderValuesMotivations();
      case "lifeDesign": return renderLifeDesign();
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
          <div className="font-extrabold text-xl" style={{ color: navy }}>Career Selection Test</div>
          <span className="hidden md:inline text-sm text-slate-400">Class 12 · Finding your career path</span>
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
            <Progress percent={cur.total ? Math.round((cur.done / cur.total) * 100) : 0} showInfo={false} strokeColor={navy} className="mt-1" />
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> Suggested time {meta.timeMin} min. Your answers auto-save as you go.
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
