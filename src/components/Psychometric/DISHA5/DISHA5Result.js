import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Progress, Tag, Empty, Alert } from "antd";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  Cell,
} from "recharts";

const navy = "#004877";
const accent = "#3BBEE8";

const tBand = (t) => (t >= 60 ? "High" : t >= 50 ? "Moderate" : t >= 45 ? "Developing" : "Low");
const bandColor = (t) => (t >= 60 ? "#16a34a" : t >= 50 ? "#22c55e" : t >= 45 ? "#eab308" : "#f97316");

function SectionTitle({ n, children, hint }) {
  return (
    <div className="mb-4">
      <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
        <span className="text-white text-sm w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: navy }}>
          {n}
        </span>
        {children}
      </h2>
      {hint && <p className="text-slate-500 text-sm mt-1">{hint}</p>}
    </div>
  );
}

const QUADRANT_DESC = {
  HighAdapt_HighRisk: "You thrive in dynamic, uncertain, high-growth environments — comfortable navigating change and taking calculated risks.",
  HighAdapt_LowRisk: "You adapt readily but prefer structured security — excellent at flexing within established, stable settings.",
  LowAdapt_HighRisk: "You take risks within familiar, known domains — bold within territory you understand well.",
  LowAdapt_LowRisk: "You value certainty, routine and established paths — and there are excellent careers built exactly for that strength.",
};

export default function DISHA5Result() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const result = state?.result;
  const profile = state?.profile;

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <Empty description="No DISHA Test 5 report found" />
        <Button type="primary" style={{ background: navy }} onClick={() => navigate("/psychometric")}>
          Back to Tests
        </Button>
      </div>
    );
  }

  const { adaptability, mindset, decisionStyle, learningAgility, ambiguityRisk, futureOrientation, sjt, validity, quadrant, summary } = result;

  const cRadar = (adaptability?.dimensions || []).map((d) => ({ dim: d.scale, T: d.tScore }));
  const decisionBars = (decisionStyle?.styles || []).map((s) => ({ style: s.style, score: s.score }));
  const riskBars = [
    { scale: "Ambiguity Tolerance", T: ambiguityRisk?.ambigTol?.tScore ?? 50 },
    { scale: "Risk-Taking", T: ambiguityRisk?.riskTake?.tScore ?? 50 },
    { scale: "Stability Preference", T: ambiguityRisk?.stability?.tScore ?? 50 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* header */}
      <div className="text-white px-6 md:px-10 py-8" style={{ background: `linear-gradient(135deg, ${navy}, #013257)` }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <Tag color="cyan" className="!text-xs !font-semibold mb-2">DISHA TEST 5 REPORT</Tag>
            <h1 className="text-3xl font-extrabold">Your Career Adaptability &amp; Future-Readiness</h1>
            <p className="opacity-80 mt-1 text-sm">
              {profile?.currentClass ? `${profile.currentClass} · ` : ""}
              Career Adaptability, Decision Style, Growth Mindset, Learning Agility &amp; Future-Readiness
            </p>
          </div>
          <Button ghost onClick={() => navigate("/psychometric")}>Back to Tests</Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-6">
        {validity && !validity.clean && (
          <Alert
            className="mb-4 rounded-xl"
            type="info"
            showIcon
            message="A note on your responses"
            description="A few responses suggest an idealised self-presentation. This does not invalidate your report; your counsellor may explore some areas in more depth."
          />
        )}

        {/* Future-readiness overview + quadrant */}
        <Card className="rounded-2xl shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-center">
            <div className="text-center">
              <Progress
                type="dashboard"
                percent={summary?.overall ?? 0}
                strokeColor={accent}
                format={(p) => (
                  <span>
                    <span className="text-3xl font-bold" style={{ color: navy }}>{p}</span>
                    <div className="text-xs text-slate-400">Future-Readiness</div>
                  </span>
                )}
              />
              {summary?.preliminary && <Tag color="orange" className="mt-2">Preliminary (Test 5 only)</Tag>}
            </div>
            <div>
              {quadrant && (
                <div className="mb-3">
                  <span className="inline-block text-lg font-extrabold px-4 py-1.5 rounded-xl text-white" style={{ background: navy }}>
                    {quadrant.label}
                  </span>
                  <p className="text-sm text-slate-600 mt-2">{QUADRANT_DESC[quadrant.quadrant]}</p>
                </div>
              )}
              {summary &&
                [
                  { key: "adaptability", label: "Career Adaptability (4Cs)" },
                  { key: "learningAgility", label: "Learning Agility" },
                  { key: "futureOrientation", label: "Future Orientation" },
                  { key: "growthMindset", label: "Growth Mindset" },
                ].map((p) => (
                  <div key={p.key} className="mb-1.5">
                    <div className="flex justify-between text-sm text-slate-600 mb-0.5">
                      <span>{p.label}</span>
                      <span className="font-semibold">{summary.pillars?.[p.key] ?? 0}</span>
                    </div>
                    <Progress percent={summary.pillars?.[p.key] ?? 0} showInfo={false} strokeColor={navy} size="small" />
                  </div>
                ))}
            </div>
          </div>
          {quadrant?.clusters?.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="text-sm font-semibold text-slate-700 mb-2">Career clusters that fit your adaptability profile</div>
              <div className="flex flex-wrap gap-2">
                {quadrant.clusters.map((c) => (
                  <Tag key={c} color="geekblue" className="!text-sm !py-1 !px-3">{c}</Tag>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* 4Cs adaptability */}
        {cRadar.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="1" hint={`Overall Career Adaptability: ${adaptability.overallT} (${adaptability.band}). Savickas's 4C model.`}>
              Career Adaptability Profile
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={cRadar} outerRadius="75%">
                    <PolarGrid />
                    <PolarAngleAxis dataKey="dim" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis domain={[20, 80]} tick={{ fontSize: 9 }} />
                    <Radar dataKey="T" stroke={navy} fill={accent} fillOpacity={0.5} />
                    <RTooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                {(adaptability.dimensions || []).map((d) => (
                  <div key={d.scale} className="text-center bg-slate-50 rounded-lg py-2">
                    <div className="text-xs text-slate-500">{d.scale}</div>
                    <div className="font-bold" style={{ color: bandColor(d.tScore) }}>{d.tScore}</div>
                    <div className="text-[10px] text-slate-400">{tBand(d.tScore)}</div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* Growth mindset */}
        {mindset && (
          <section className="mb-10">
            <SectionTitle n="2" hint={`Growth Mindset Index: ${mindset.tScore} — ${mindset.band}.`}>
              Growth vs Fixed Mindset
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <Progress percent={Math.round(((mindset.tScore - 20) / 60) * 100)} strokeColor={bandColor(mindset.tScore)} />
              {mindset.abilityBeliefChallenge && (
                <Alert
                  type="info"
                  showIcon
                  className="mt-3 rounded-lg"
                  message="An ability-belief worth revisiting"
                  description="Some of your current beliefs about ability and talent may be limiting how you see your options — for example, that certain careers are only for people 'born with' a specific intelligence. Your development plan includes evidence-based examples of Indians who built these very skills from low starting points. This is about expanding possibilities, not a criticism."
                />
              )}
            </Card>
          </section>
        )}

        {/* Decision style */}
        {decisionBars.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="3" hint={`Dominant style: ${decisionStyle.dominant}${decisionStyle.secondary ? ` · Secondary: ${decisionStyle.secondary}` : ""}. No style is better — the goal is insight.`}>
              Decision-Making Style
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={decisionBars} layout="vertical" margin={{ left: 30 }}>
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="style" width={90} tick={{ fontSize: 12 }} />
                    <RTooltip />
                    <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                      {decisionBars.map((e, i) => (
                        <Cell key={i} fill={e.style === decisionStyle.dominant ? accent : navy} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {decisionStyle.dependentFlag && (
                <Alert type="info" showIcon className="mt-3 rounded-lg" message="Your decision-making shows strong family orientation"
                  description="This is a genuine strength in many ways — and this section of your plan helps you navigate it so that both family harmony and personal fit are honoured. Your guide includes 5 conversations that build mutual trust and your independence simultaneously." />
              )}
              {decisionStyle.avoidantFlag && (
                <Alert type="warning" showIcon className="mt-3 rounded-lg" message="Decision avoidance is common — and very workable"
                  description="Avoiding a big decision often signals that you care deeply about getting it right; it is not a character flaw. Your plan includes a step-by-step protocol for moving from avoiding to deciding on high-stakes career choices." />
              )}
            </Card>
          </section>
        )}

        {/* Learning agility */}
        {learningAgility && (
          <section className="mb-10">
            <SectionTitle n="4" hint={`Learning Agility: ${learningAgility.tScore} — ${learningAgility.band}. In a world where skills have a 2–3 year half-life, this matters more than the skills you have today.`}>
              Learning Agility &amp; New Skills
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(learningAgility.subScales || []).map((s) => (
                  <div key={s.scale} className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500">{s.scale.replace("LearnAgility", "Core Agility").replace("FutureSkills", "Future Skills")}</div>
                    <div className="text-lg font-bold" style={{ color: navy }}>{s.score}</div>
                  </div>
                ))}
              </div>
              {learningAgility.highAgility && (
                <Alert type="success" showIcon className="mt-3 rounded-lg" message="India 2030 emerging careers unlocked"
                  description="Your high learning agility means you are well-suited to fast-evolving fields — AI & data, climate & green energy, health tech, space & defence tech, agri-tech and the creator economy. These appear in your emerging-career recommendations." />
              )}
            </Card>
          </section>
        )}

        {/* Ambiguity & risk */}
        {ambiguityRisk && (
          <section className="mb-10">
            <SectionTitle n="5" hint={`Risk-Stability profile: ${ambiguityRisk.profile}.`}>
              Ambiguity &amp; Risk Tolerance
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskBars} layout="vertical" margin={{ left: 40 }}>
                    <XAxis type="number" domain={[20, 80]} tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="scale" width={130} tick={{ fontSize: 11 }} />
                    <RTooltip />
                    <Bar dataKey="T" radius={[0, 6, 6, 0]} fill={navy} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Your career environment preferences have been applied to filter your recommendations —
                careers that match your risk-stability profile are highlighted. A preference for
                stability is a valid value, not a limitation.
              </p>
            </Card>
          </section>
        )}

        {/* Future orientation */}
        {futureOrientation && (
          <section className="mb-10">
            <SectionTitle n="6" hint={`Future Orientation: ${futureOrientation.tScore} — ${futureOrientation.band}.`}>
              Future Orientation &amp; AI-Readiness
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {(futureOrientation.subScales || []).map((s) => (
                  <div key={s.scale} className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500">
                      {s.scale.replace("FutOrient", "Future Thinking").replace("AIAware", "AI-Readiness").replace("India2030", "India 2030")}
                    </div>
                    <div className="text-lg font-bold" style={{ color: navy }}>{s.score}</div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* SJT */}
        {sjt?.competencies?.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="7" hint={`Adaptability-in-action: ${sjt.percentage}% — how you navigate real career-change scenarios.`}>
              Career Scenarios &amp; Competencies
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                {sjt.competencies.map((c) => (
                  <div key={c.name} className="flex justify-between items-center text-sm py-1">
                    <span className="text-slate-700">{c.name}</span>
                    <Progress
                      percent={Math.min(100, Math.round((c.score / (sjt.competencies[0].score || 1)) * 100))}
                      showInfo={false}
                      strokeColor={accent}
                      className="!w-1/2"
                      size="small"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-3">
                Your most likely responses suggest these adaptability patterns — they are never marked
                right or wrong, only interpreted against your own profile.
              </p>
            </Card>
          </section>
        )}

        <p className="text-center text-xs text-slate-400 mt-2 max-w-2xl mx-auto">
          This report is a scientifically-informed guide, not a destiny. Your adaptability can grow with
          practice, and a preference for stability or family input in decisions is a genuine strength in
          the Indian context. For guidance use only.
        </p>
      </div>
    </div>
  );
}
