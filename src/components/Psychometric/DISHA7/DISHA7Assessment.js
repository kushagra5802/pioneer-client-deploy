import React, { useState, useMemo } from "react";
import { Button, Radio, message, Progress } from "antd";
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

const STEP_IDS = ["leadershipPotential", "managementSkills", "teamwork", "powerOrientation", "ethicalLeadership", "workCulture", "leadershipFc", "scenarios"];
const STEP_META = {
  leadershipPotential: { code: "A", name: "Leadership Potential" },
  managementSkills: { code: "B", name: "Management & Organisation" },
  teamwork: { code: "C", name: "Teamwork & Team Roles" },
  powerOrientation: { code: "D", name: "Authority & Power" },
  ethicalLeadership: { code: "E", name: "Ethical Leadership" },
  workCulture: { code: "F", name: "Work Culture & Org Fit" },
  leadershipFc: { code: "G", name: "Leadership Preferences" },
  scenarios: { code: "H·I", name: "Leadership Scenarios" },
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

export default function DISHA7Assessment({ data, onClose }) {
  const axios = useAxiosInstance();
  const navigate = useNavigate();
  const [stepIdx, setStepIdx] = useState(0);
  const [startTime] = useState(Date.now());

  const [leadershipPotential, setLeadershipPotential] = useState({});
  const [managementSkills, setManagementSkills] = useState({});
  const [teamwork, setTeamwork] = useState({});
  const [teamworkFc, setTeamworkFc] = useState({});
  const [powerOrientation, setPowerOrientation] = useState({});
  const [ethicalLeadership, setEthicalLeadership] = useState({});
  const [workCulture, setWorkCulture] = useState({});
  const [workCultureFc, setWorkCultureFc] = useState({});
  const [leadershipFc, setLeadershipFc] = useState({});
  const [sjt, setSjt] = useState({});
  const [validity, setValidity] = useState({});

  const allSjt = useMemo(() => [...(data.sjt?.blockH || []), ...(data.sjt?.blockI || [])], [data]);

  const stepId = STEP_IDS[stepIdx];
  const meta = STEP_META[stepId];

  const stepProgress = useMemo(() => {
    const likertCount = (items, map) => ({ done: (items || []).filter((i) => map[i.id]).length, total: (items || []).length });
    return {
      leadershipPotential: likertCount(data.leadershipPotential, leadershipPotential),
      managementSkills: likertCount(data.managementSkills, managementSkills),
      teamwork: {
        done: (data.teamwork || []).filter((i) => teamwork[i.id]).length + (data.teamworkFc || []).filter((p) => teamworkFc[p.id]).length,
        total: (data.teamwork || []).length + (data.teamworkFc || []).length,
      },
      powerOrientation: likertCount(data.powerOrientation, powerOrientation),
      ethicalLeadership: likertCount(data.ethicalLeadership, ethicalLeadership),
      workCulture: {
        done: (data.workCulture || []).filter((i) => workCulture[i.id]).length + (data.workCultureFc || []).filter((p) => workCultureFc[p.id]).length,
        total: (data.workCulture || []).length + (data.workCultureFc || []).length,
      },
      leadershipFc: { done: (data.leadershipFc || []).filter((p) => leadershipFc[p.id]).length, total: (data.leadershipFc || []).length },
      scenarios: {
        done: allSjt.filter((s) => sjt[s.id]?.mostLikely && sjt[s.id]?.leastLikely).length + (data.validity || []).filter((i) => validity[i.id]).length,
        total: allSjt.length + (data.validity || []).length,
      },
    };
  }, [data, leadershipPotential, managementSkills, teamwork, teamworkFc, powerOrientation, ethicalLeadership, workCulture, workCultureFc, leadershipFc, sjt, validity, allSjt]);

  const submitMutation = useMutation(
    async (payload) => {
      const res = await axios.post("/api/psychometric/disha7Assessment", payload);
      return res.data;
    },
    {
      onSuccess: (response) => {
        message.success("DISHA Test 7 submitted successfully!");
        navigate("/psychometric-disha7-result", { state: response.data });
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
      leadershipPotential, managementSkills, teamwork, teamworkFc,
      powerOrientation, ethicalLeadership, workCulture, workCultureFc,
      leadershipFc, sjt, validity, completionTimeSeconds,
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

  const renderFcList = (pairs, valueMap, setter, hint) =>
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

  const renderTeamwork = () => (
    <div>
      {renderLikertList(data.teamwork, teamwork, setTeamwork, "How do you naturally function within a team?")}
      <h4 className="font-bold text-slate-800 mb-1 mt-8">Team-role preferences</h4>
      <p className="text-sm text-slate-500 mb-4">In a school cultural festival team with 8 members and 2 weeks to plan, which role do you most naturally gravitate toward?</p>
      {renderFcList(data.teamworkFc, teamworkFc, setTeamworkFc)}
    </div>
  );

  const renderWorkCulture = () => (
    <div>
      {renderLikertList(data.workCulture, workCulture, setWorkCulture, "Which kind of organisation do you believe you'd perform best in?")}
      <h4 className="font-bold text-slate-800 mb-1 mt-8">Organisation preferences</h4>
      <p className="text-sm text-slate-500 mb-4">When two organisational types conflict, which environment would you genuinely prefer?</p>
      {renderFcList(data.workCultureFc, workCultureFc, setWorkCultureFc)}
    </div>
  );

  const renderScenarios = () => (
    <div>
      <p className="text-sm text-slate-500 mb-5">
        For each situation, mark the option you would be <strong>most likely</strong> and{" "}
        <strong>least likely</strong> to do. There are no right or wrong answers.
      </p>
      <h4 className="font-bold text-slate-800 mb-3">Block 1 — Indian Leadership Dilemmas</h4>
      {(data.sjt?.blockH || []).map((sc, i) => renderSjtCard(sc, i))}
      <h4 className="font-bold text-slate-800 mb-3 mt-8">Block 2 — Management &amp; Ethical Scenarios</h4>
      {(data.sjt?.blockI || []).map((sc, i) => renderSjtCard(sc, (data.sjt?.blockH || []).length + i))}

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
      case "leadershipPotential": return renderLikertList(data.leadershipPotential, leadershipPotential, setLeadershipPotential, "Rate how accurately each statement describes you. There are no right or wrong answers.");
      case "managementSkills": return renderLikertList(data.managementSkills, managementSkills, setManagementSkills, "These questions are about how you get things done through others.");
      case "teamwork": return renderTeamwork();
      case "powerOrientation": return renderLikertList(data.powerOrientation, powerOrientation, setPowerOrientation, "How do you relate to authority and power? No orientation is better than another — this maps you to the right kind of career.");
      case "ethicalLeadership": return renderLikertList(data.ethicalLeadership, ethicalLeadership, setEthicalLeadership, "How you think about integrity, accountability and the responsibilities of authority.");
      case "workCulture": return renderWorkCulture();
      case "leadershipFc": return (
        <div>
          <p className="text-sm text-slate-500 mb-5">For each pair, choose the option that genuinely appeals to you more — even if both are attractive.</p>
          {renderFcList(data.leadershipFc, leadershipFc, setLeadershipFc)}
        </div>
      );
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
          <div className="font-extrabold text-xl" style={{ color: navy }}>DISHA Test 7</div>
          <span className="hidden md:inline text-sm text-slate-400">Leadership, Management, Teamwork &amp; Organisational Fit</span>
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
