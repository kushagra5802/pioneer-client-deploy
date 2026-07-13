import React, { useState, useMemo } from "react";
import { Button, Radio, Input, Select, message, Progress } from "antd";
import {
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

const STEP_IDS = ["lifeValues", "wlbPreferences", "lifestyleGoals", "moneyMindset", "socialContribution", "satisfactionPredictors", "futureProjection", "scenarios"];
const STEP_META = {
  lifeValues: { code: "A", name: "Core Life Values" },
  wlbPreferences: { code: "B", name: "Work-Life Balance" },
  lifestyleGoals: { code: "C", name: "Lifestyle Goals & Life Design" },
  moneyMindset: { code: "D", name: "Financial Risk & Money Mindset" },
  socialContribution: { code: "E", name: "Social Contribution vs Success" },
  satisfactionPredictors: { code: "F", name: "Satisfaction Predictors" },
  futureProjection: { code: "G", name: "Future Life Projection" },
  scenarios: { code: "H", name: "Life Design Dilemmas" },
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

export default function DISHA8Assessment({ data, onClose }) {
  const axios = useAxiosInstance();
  const navigate = useNavigate();
  const [stepIdx, setStepIdx] = useState(0);
  const [startTime] = useState(Date.now());

  const [lifeValues, setLifeValues] = useState({});
  const [lifeValuesRanking, setLifeValuesRanking] = useState({});
  const [wlbPreferences, setWlbPreferences] = useState({});
  const [wlbFc, setWlbFc] = useState({});
  const [lifestyleGoals, setLifestyleGoals] = useState({});
  const [lifeDesignOpen, setLifeDesignOpen] = useState({});
  const [moneyMindset, setMoneyMindset] = useState({});
  const [moneyFc, setMoneyFc] = useState({});
  const [socialContribution, setSocialContribution] = useState({});
  const [satisfactionPredictors, setSatisfactionPredictors] = useState({});
  const [futureProjectionSliders, setFutureProjectionSliders] = useState({});
  const [gp5, setGp5] = useState({});
  const [sjt, setSjt] = useState({});
  const [validity, setValidity] = useState({});

  const stepId = STEP_IDS[stepIdx];
  const meta = STEP_META[stepId];

  const stepProgress = useMemo(() => {
    const likertCount = (items, map) => ({ done: (items || []).filter((i) => map[i.id]).length, total: (items || []).length });
    const rankCount = Object.values(lifeValuesRanking).filter((r) => r >= 1 && r <= 5).length;
    return {
      lifeValues: {
        done: (data.lifeValues || []).filter((i) => lifeValues[i.id]).length + Math.min(rankCount, 5),
        total: (data.lifeValues || []).length + 5,
      },
      wlbPreferences: {
        done: (data.wlbPreferences || []).filter((i) => wlbPreferences[i.id]).length + (data.wlbFc || []).filter((p) => wlbFc[p.id]).length,
        total: (data.wlbPreferences || []).length + (data.wlbFc || []).length,
      },
      lifestyleGoals: {
        done: (data.lifestyleGoals || []).filter((i) => lifestyleGoals[i.id]).length + (data.lifeDesignOpen || []).filter((q) => (lifeDesignOpen[q.id] || "").trim()).length,
        total: (data.lifestyleGoals || []).length + (data.lifeDesignOpen || []).length,
      },
      moneyMindset: {
        done: (data.moneyMindset || []).filter((i) => moneyMindset[i.id]).length + (data.moneyFc || []).filter((p) => moneyFc[p.id]).length,
        total: (data.moneyMindset || []).length + (data.moneyFc || []).length,
      },
      socialContribution: likertCount(data.socialContribution, socialContribution),
      satisfactionPredictors: likertCount(data.satisfactionPredictors, satisfactionPredictors),
      futureProjection: {
        done: (data.futureProjection || []).reduce((sum, sc) => sum + sc.elements.filter((el) => futureProjectionSliders[el.id] !== undefined).length, 0) + (gp5.GP5_good ? 1 : 0) + (gp5.GP5_wasted ? 1 : 0),
        total: (data.futureProjection || []).reduce((sum, sc) => sum + sc.elements.length, 0) + 2,
      },
      scenarios: {
        done: (data.sjt || []).filter((s) => sjt[s.id]?.mostLikely).length + (data.validity || []).filter((i) => validity[i.id]).length,
        total: (data.sjt || []).length + (data.validity || []).length,
      },
    };
  }, [data, lifeValues, lifeValuesRanking, wlbPreferences, wlbFc, lifestyleGoals, lifeDesignOpen, moneyMindset, moneyFc, socialContribution, satisfactionPredictors, futureProjectionSliders, gp5, sjt, validity]);

  const submitMutation = useMutation(
    async (payload) => {
      const res = await axios.post("/api/psychometric/disha8Assessment", payload);
      return res.data;
    },
    {
      onSuccess: (response) => {
        message.success("DISHA Test 8 submitted successfully!");
        navigate("/psychometric-disha8-result", { state: response.data });
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
      lifeValues, lifeValuesRanking, wlbPreferences, wlbFc,
      lifestyleGoals, lifeDesignOpen, moneyMindset, moneyFc,
      socialContribution, satisfactionPredictors,
      futureProjectionSliders, gp5, sjt, validity, completionTimeSeconds,
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

  const renderFcList = (pairs, valueMap, setter) =>
    (pairs || []).map((q, i) => (
      <QuestionCard index={i + 1} key={q.id}>
        <p className="font-medium text-slate-800 mb-2">{q.prompt}</p>
        <Radio.Group
          value={valueMap[q.id]}
          onChange={(e) => setter((p) => ({ ...p, [q.id]: e.target.value }))}
          className="flex flex-col md:flex-row gap-3 w-full"
        >
          {["A", "B"].map((k) => (
            <Radio.Button key={k} value={k} className="!h-auto !flex-1 !whitespace-normal !py-3 !px-4 !rounded-lg !leading-snug">
              {k === "A" ? q.optionA.text : q.optionB.text}
            </Radio.Button>
          ))}
        </Radio.Group>
      </QuestionCard>
    ));

  const usedRanks = new Set(Object.values(lifeValuesRanking).filter((r) => r >= 1 && r <= 5));

  const renderLifeValues = () => (
    <div>
      {renderLikertList(data.lifeValues, lifeValues, setLifeValues, "Rate how important each of the following is to you in your life — not what you think you should value, but what genuinely matters most to you personally.")}
      <h4 className="font-bold text-slate-800 mb-1 mt-8">Life Values Priority Ranking</h4>
      <p className="text-sm text-slate-500 mb-4">From the 10 life values below, select and rank your top 5 in order of personal importance to you right now. 1 = most important.</p>
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        {(data.lifeValuesRanking || []).map((v, i) => (
          <div key={v.key} className={`flex items-center justify-between gap-3 p-4 ${i !== data.lifeValuesRanking.length - 1 ? "border-b border-slate-100" : ""}`}>
            <div>
              <div className="font-semibold text-slate-800">{v.label}</div>
              <div className="text-xs text-slate-400">{v.description}</div>
            </div>
            <Select
              className="w-28 shrink-0"
              placeholder="Rank"
              allowClear
              value={lifeValuesRanking[v.key]}
              onChange={(val) =>
                setLifeValuesRanking((p) => {
                  const next = { ...p };
                  if (val === undefined) delete next[v.key];
                  else next[v.key] = val;
                  return next;
                })
              }
              options={[1, 2, 3, 4, 5].map((r) => ({
                value: r,
                label: `#${r}`,
                disabled: usedRanks.has(r) && lifeValuesRanking[v.key] !== r,
              }))}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderWlb = () => (
    <div>
      {renderLikertList(data.wlbPreferences, wlbPreferences, setWlbPreferences, "How intense a career can you sustain, and what does family life require of it?")}
      <h4 className="font-bold text-slate-800 mb-1 mt-8">Work-Life Trade-Off Pairs</h4>
      <p className="text-sm text-slate-500 mb-4">When these values conflict directly, which would you genuinely choose?</p>
      {renderFcList(data.wlbFc, wlbFc, setWlbFc)}
    </div>
  );

  const renderLifestyle = () => (
    <div>
      {renderLikertList(data.lifestyleGoals, lifestyleGoals, setLifestyleGoals, "Concrete preferences about where and how you want to live.")}
      <h4 className="font-bold text-slate-800 mb-1 mt-8">A few reflective questions</h4>
      <p className="text-sm text-slate-500 mb-4">These answers are for your counsellor's use — write honestly, in your own words.</p>
      {(data.lifeDesignOpen || []).map((q, i) => (
        <QuestionCard index={i + 1} key={q.id}>
          <p className="font-medium text-slate-800 mb-2">{q.question}</p>
          <Input.TextArea
            rows={3}
            placeholder={q.format}
            value={lifeDesignOpen[q.id] || ""}
            onChange={(e) => setLifeDesignOpen((p) => ({ ...p, [q.id]: e.target.value }))}
          />
        </QuestionCard>
      ))}
    </div>
  );

  const renderMoney = () => (
    <div>
      {renderLikertList(data.moneyMindset, moneyMindset, setMoneyMindset, "Your real relationship with money, risk, and family financial responsibility.")}
      <h4 className="font-bold text-slate-800 mb-1 mt-8">Income Scenario Pairs</h4>
      <p className="text-sm text-slate-500 mb-4">When two paths to a financial future conflict, which would you genuinely choose?</p>
      {renderFcList(data.moneyFc, moneyFc, setMoneyFc)}
    </div>
  );

  const renderFutureProjection = () => (
    <div>
      <p className="text-sm text-slate-500 mb-5">
        For each scenario, take 30–60 seconds to genuinely imagine yourself in this situation before
        responding. There is no time limit and no right answer.
      </p>
      {(data.futureProjection || []).map((sc, sIdx) => (
        <div key={sc.id} className="border border-slate-200 rounded-xl p-5 md:p-6 mb-6 bg-white shadow-sm">
          <h4 className="font-bold text-slate-800 mb-1">{sIdx + 1}. {sc.title}</h4>
          <p className="text-slate-600 text-sm mb-4">{sc.instruction}</p>
          {sc.elements.map((el) => (
            <div key={el.id} className="mb-4 last:mb-0">
              <p className="text-sm font-medium text-slate-700 mb-2">{el.label}</p>
              <Radio.Group
                value={futureProjectionSliders[el.id]}
                onChange={(e) => setFutureProjectionSliders((p) => ({ ...p, [el.id]: e.target.value }))}
                className="flex flex-wrap gap-2"
              >
                {el.spectrum.map((label, idx) => (
                  <Radio.Button key={idx} value={idx} className="!h-auto !whitespace-normal !py-2 !px-3 !rounded-lg !text-xs !leading-snug">
                    {label}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div>
          ))}
        </div>
      ))}

      <div className="border-2 rounded-xl p-5 md:p-6 mb-6 bg-blue-50" style={{ borderColor: navy }}>
        <h4 className="font-bold text-slate-800 mb-1">{(data.futureProjection || []).length + 1}. {data.gp5?.title}</h4>
        <p className="text-slate-600 text-sm mb-4">{data.gp5?.instruction}</p>
        {(data.gp5?.prompts || []).map((p) => (
          <div key={p.id} className="mb-4 last:mb-0">
            <p className="text-sm font-medium text-slate-700 mb-2">{p.label}</p>
            <Input.TextArea
              rows={2}
              placeholder="Your honest answer…"
              value={gp5[p.id] || ""}
              onChange={(e) => setGp5((prev) => ({ ...prev, [p.id]: e.target.value }))}
            />
          </div>
        ))}
        <p className="text-xs text-slate-400 mt-2">This answer is shared only with you and your counsellor.</p>
      </div>
    </div>
  );

  const renderScenarios = () => (
    <div>
      <p className="text-sm text-slate-500 mb-5">
        For each situation, mark the option you would be <strong>most likely</strong> to choose. There
        are no right or wrong answers — these dilemmas reveal how you actually prioritise when values
        conflict in real life.
      </p>
      {(data.sjt || []).map((sc, i) => (
        <div key={sc.id} className="border border-slate-200 rounded-xl p-5 md:p-6 mb-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <h4 className="font-bold text-slate-800">{i + 1}. {sc.title}</h4>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{sc.context}</span>
          </div>
          <p className="text-slate-600 text-sm mb-4 leading-relaxed bg-slate-50 rounded-lg p-3">{sc.scenario}</p>
          <Radio.Group
            value={sjt[sc.id]?.mostLikely}
            onChange={(e) => setSjt((p) => ({ ...p, [sc.id]: { mostLikely: e.target.value } }))}
            className="flex flex-col gap-2 w-full"
          >
            {sc.options.map((opt) => (
              <Radio key={opt.key} value={opt.key} className="!items-start !py-1">
                <span className="font-semibold text-slate-700 mr-1">{opt.key}.</span>
                <span className="text-slate-700 text-sm">{opt.text}</span>
              </Radio>
            ))}
          </Radio.Group>
        </div>
      ))}

      <h4 className="font-bold text-slate-800 mb-3 mt-8">A few final statements</h4>
      {(data.validity || []).map((q, i) => (
        <QuestionCard index={i + 1} key={q.id}>
          <p className="font-medium text-slate-800">{q.text}</p>
          <ScaleRow value={validity[q.id]} onChange={(v) => setValidity((p) => ({ ...p, [q.id]: v }))} />
        </QuestionCard>
      ))}
    </div>
  );

  const renderStep = () => {
    switch (stepId) {
      case "lifeValues": return renderLifeValues();
      case "wlbPreferences": return renderWlb();
      case "lifestyleGoals": return renderLifestyle();
      case "moneyMindset": return renderMoney();
      case "socialContribution": return renderLikertList(data.socialContribution, socialContribution, setSocialContribution, "Neither orientation — personal success or social contribution — is 'better'. Answer honestly.");
      case "satisfactionPredictors": return renderLikertList(data.satisfactionPredictors, satisfactionPredictors, setSatisfactionPredictors, "What do you specifically need to feel sustainably satisfied in a career, long-term?");
      case "futureProjection": return renderFutureProjection();
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
          <div className="font-extrabold text-xl" style={{ color: navy }}>DISHA Test 8</div>
          <span className="hidden md:inline text-sm text-slate-400">Life Values, Work-Life Balance &amp; Career Satisfaction</span>
        </div>
        <Button danger size="small" onClick={onClose}>Save &amp; Exit</Button>
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
