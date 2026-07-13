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

const APTITUDE_LABELS = {
  verbal: "Verbal",
  numerical: "Numerical",
  logical: "Logical",
  spatial: "Spatial",
  abstract: "Abstract",
  closure: "Closure",
  clerical: "Clerical",
  mechanical: "Mechanical",
  memory: "Memory",
  creativity: "Creativity",
};

const OCEAN_LABELS = {
  O: "Openness",
  C: "Conscientiousness",
  E: "Extraversion",
  A: "Agreeableness",
  N: "Neuroticism",
};

const RIASEC_LABELS = {
  R: "Realistic",
  I: "Investigative",
  A: "Artistic",
  S: "Social",
  E: "Enterprising",
  C: "Conventional",
};

const zoneColor = (zone) => {
  switch (zone) {
    case "Exceptional":
    case "Excellent":
      return "#16a34a";
    case "Strong":
    case "Good":
      return "#22c55e";
    case "Average":
      return "#eab308";
    case "Developing":
    case "Below-average":
      return "#f97316";
    default:
      return "#ef4444";
  }
};

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

export default function DISHAResult() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const result = state?.result;
  const profile = state?.profile;

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <Empty description="No DISHA report found" />
        <Button type="primary" style={{ background: navy }} onClick={() => navigate("/psychometric")}>
          Back to Tests
        </Button>
      </div>
    );
  }

  const { aptitude, personality, riasec, workValues, sjt, academic, validity, ccre } = result;

  const aptitudeRadar = (aptitude?.dimensions || []).map((d) => ({
    dim: APTITUDE_LABELS[d.dim] || d.dim,
    T: d.tScore,
  }));

  const oceanBars = personality
    ? Object.keys(OCEAN_LABELS).map((f) => ({
        factor: OCEAN_LABELS[f],
        T: personality[f]?.tScore ?? 50,
      }))
    : [];

  const riasecRadar = (riasec?.scores || []).map((s) => ({
    type: RIASEC_LABELS[s.type],
    score: s.combined,
  }));

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* header */}
      <div className="text-white px-6 md:px-10 py-8" style={{ background: `linear-gradient(135deg, ${navy}, #013257)` }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <Tag color="cyan" className="!text-xs !font-semibold mb-2">DISHA REPORT</Tag>
            <h1 className="text-3xl font-extrabold">Your Career Direction Report</h1>
            <p className="opacity-80 mt-1 text-sm">
              {profile?.currentClass ? `${profile.currentClass} · ` : ""}
              {profile?.board ? `${profile.board} · ` : ""}
              Differential Intelligence &amp; Scholastic Horizon Assessment
            </p>
          </div>
          <Button ghost onClick={() => navigate("/psychometric")}>
            Back to Tests
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-6">
        {/* validity banner */}
        {validity && !validity.clean && (
          <Alert
            className="mb-6 rounded-xl"
            type="warning"
            showIcon
            message="A note on your responses"
            description="Some responses suggest an idealised self-presentation. This does not invalidate your report, but your counsellor may explore a few areas in more depth during your debrief."
          />
        )}

        {/* CCRE Fit overview */}
        <Card className="rounded-2xl shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-center">
            <div className="text-center">
              <Progress
                type="dashboard"
                percent={ccre?.overall ?? 0}
                strokeColor={accent}
                format={(p) => (
                  <span>
                    <span className="text-3xl font-bold" style={{ color: navy }}>{p}</span>
                    <div className="text-xs text-slate-400">Fit Index</div>
                  </span>
                )}
              />
              {ccre?.preliminary && (
                <Tag color="orange" className="mt-2">Preliminary (T1 only)</Tag>
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800 mb-3">Career Fit — pillar breakdown</h3>
              {ccre &&
                [
                  { key: "aptitude", label: "Aptitude & Cognitive (35%)" },
                  { key: "marks", label: "Academic Marks (30%)" },
                  { key: "personality", label: "Personality (15%)" },
                  { key: "interests", label: "Interests (15%)" },
                  { key: "values", label: "Values (5%)" },
                ].map((p) => (
                  <div key={p.key} className="mb-2">
                    <div className="flex justify-between text-sm text-slate-600 mb-0.5">
                      <span>{p.label}</span>
                      <span className="font-semibold">{ccre.pillars?.[p.key] ?? 0}</span>
                    </div>
                    <Progress percent={ccre.pillars?.[p.key] ?? 0} showInfo={false} strokeColor={navy} size="small" />
                  </div>
                ))}
              <p className="text-xs text-slate-400 mt-3">
                Complete the remaining DISHA tests to unlock a full career match and replace this
                preliminary snapshot.
              </p>
            </div>
          </div>
        </Card>

        {/* Academic */}
        {academic?.subjects?.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="1" hint="Recency-weighted Subject Strength Index (SSI) per subject.">
              Academic Performance
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              {academic.subjects.map((s) => (
                <div key={s.subjectKey} className="mb-3">
                  <div className="flex justify-between text-sm mb-0.5">
                    <span className="font-medium text-slate-700 capitalize">{s.subjectKey.replace(/([A-Z])/g, " $1")}</span>
                    <span className="flex items-center gap-2">
                      <Tag color={zoneColor(s.zone) === "#16a34a" || zoneColor(s.zone) === "#22c55e" ? "green" : zoneColor(s.zone) === "#eab308" ? "gold" : "red"}>{s.zone}</Tag>
                      <span className="font-semibold" style={{ color: navy }}>SSI {s.ssi}</span>
                    </span>
                  </div>
                  <Progress percent={s.ssi} showInfo={false} strokeColor={zoneColor(s.zone)} size="small" />
                  {s.enjoymentFlag && (
                    <p className="text-xs text-amber-600 mt-1">⚠ {s.enjoymentFlag}</p>
                  )}
                </div>
              ))}
              <div className="mt-4 pt-3 border-t border-slate-100 text-sm text-slate-500">
                Composite SSI: <strong style={{ color: navy }}>{academic.composite}</strong> · Overall average {academic.overallAverage}%
              </div>
            </Card>
          </section>
        )}

        {/* Aptitude radar */}
        <section className="mb-10">
          <SectionTitle n="2" hint="10-dimension aptitude profile (T-score: 50 = average, 65+ = exceptional).">
            Aptitude Intelligence Profile
          </SectionTitle>
          <Card className="rounded-2xl shadow-sm">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={aptitudeRadar} outerRadius="75%">
                  <PolarGrid />
                  <PolarAngleAxis dataKey="dim" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis domain={[20, 80]} tick={{ fontSize: 9 }} />
                  <Radar dataKey="T" stroke={navy} fill={accent} fillOpacity={0.5} />
                  <RTooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4">
              {(aptitude?.dimensions || []).map((d) => (
                <div key={d.dim} className="text-center bg-slate-50 rounded-lg py-2">
                  <div className="text-xs text-slate-500">{APTITUDE_LABELS[d.dim]}</div>
                  <div className="font-bold" style={{ color: zoneColor(d.zone) }}>{d.tScore}</div>
                  <div className="text-[10px] text-slate-400">{d.zone}</div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Personality */}
        {personality && (
          <section className="mb-10">
            <SectionTitle n="3" hint="Ipsative-adjusted Big Five (controls for agreement bias).">
              Personality Profile (OCEAN)
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={oceanBars} layout="vertical" margin={{ left: 30 }}>
                    <XAxis type="number" domain={[20, 80]} tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="factor" width={110} tick={{ fontSize: 11 }} />
                    <RTooltip />
                    <Bar dataKey="T" radius={[0, 6, 6, 0]}>
                      {oceanBars.map((e, i) => (
                        <Cell key={i} fill={navy} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {personality.N?.tScore >= 60 && (
                <Alert
                  type="info"
                  showIcon
                  className="mt-3 rounded-lg"
                  message="Wellbeing note"
                  description="Your emotional-reactivity score is elevated. Indian helplines such as iCall (9152987821) and Vandrevala Foundation are available if exam stress feels overwhelming."
                />
              )}
            </Card>
          </section>
        )}

        {/* RIASEC */}
        {riasec && (
          <section className="mb-10">
            <SectionTitle n="4" hint={`Your Holland Code: ${riasec.hollandCode}`}>
              Interests Profile (RIASEC)
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="text-center mb-4">
                <span className="inline-block text-3xl font-extrabold tracking-widest px-6 py-2 rounded-xl text-white" style={{ background: navy }}>
                  {riasec.hollandCode}
                </span>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={riasecRadar} outerRadius="75%">
                    <PolarGrid />
                    <PolarAngleAxis dataKey="type" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
                    <Radar dataKey="score" stroke={navy} fill={accent} fillOpacity={0.5} />
                    <RTooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </section>
        )}

        {/* Work values */}
        {workValues?.ranked?.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="5" hint="What matters most to you in a career.">
              Work Values &amp; Motivations
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="flex flex-wrap gap-2 mb-4">
                {workValues.topValues.map((v, i) => (
                  <Tag key={v} color={i === 0 ? "blue" : "default"} className="!text-sm !py-1 !px-3">
                    {i + 1}. {v}
                  </Tag>
                ))}
              </div>
              {workValues.familyCongruent && (
                <p className="text-sm text-slate-500">
                  Right now you lean toward{" "}
                  <strong>
                    {workValues.familyCongruent === "family"
                      ? "a family-approved path"
                      : "a path you're passionate about"}
                  </strong>
                  . Your counsellor can use the Family Conversation Guide to bridge both.
                </p>
              )}
            </Card>
          </section>
        )}

        {/* SJT */}
        {sjt?.competencies?.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="6" hint={`Decision-making competency: ${sjt.percentage}%`}>
              Situational Judgment &amp; Competencies
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
            </Card>
          </section>
        )}

        {/* disclaimer */}
        <p className="text-center text-xs text-slate-400 mt-8 max-w-2xl mx-auto">
          This report is a scientifically-informed guide, not a destiny. Your effort, passion, context
          and choices always outweigh any test score. For guidance use only — not for admissions,
          scholarship, or employment decisions.
        </p>
      </div>
    </div>
  );
}
