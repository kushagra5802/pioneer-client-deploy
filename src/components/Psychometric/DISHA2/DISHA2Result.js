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

const RIASEC_LABELS = {
  R: "Realistic",
  I: "Investigative",
  A: "Artistic",
  S: "Social",
  E: "Enterprising",
  C: "Conventional",
};

const VALUE_LABELS = {
  Security: "Security",
  Prestige: "Prestige",
  FinGrowth: "Financial Growth",
  WLB: "Work-Life Balance",
  Altruism: "Altruism",
  Autonomy: "Autonomy",
  Innovation: "Innovation",
  Intellectual: "Intellectual",
  FamilyDuty: "Family Duty",
  SocietalContribution: "Societal Contribution",
  Stability: "Stability",
};

const MOTIVATION_LABELS = {
  Achievement: "Achievement",
  Power: "Power / Influence",
  Affiliation: "Affiliation",
  Mastery: "Mastery / Learning",
  SocietalImpact: "Societal Impact",
  Intrinsic: "Intrinsic",
  Extrinsic: "Extrinsic",
};

const ENV_LABELS = {
  GovtSector: "Government sector",
  PrivateSector: "Private sector",
  Startup: "Startup / entrepreneurial",
  FamilyBusiness: "Family business",
  SocialSector: "Social sector / NGO",
  Independent: "Independent professional",
  OfficeWork: "Office-based work",
  FieldWork: "Field work",
  Metro: "Metro city",
  Tier2Rural: "Tier-2 / rural",
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

export default function DISHA2Result() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const result = state?.result;
  const profile = state?.profile;

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <Empty description="No DISHA Test 2 report found" />
        <Button type="primary" style={{ background: navy }} onClick={() => navigate("/psychometric")}>
          Back to Tests
        </Button>
      </div>
    );
  }

  const { riasec, workValues, motivations, environment, sjt, summary } = result;

  const riasecRadar = (riasec?.scores || []).map((s) => ({
    type: RIASEC_LABELS[s.type],
    score: s.combined,
  }));

  const valueBars = (workValues?.ranked || []).map((v) => ({
    value: VALUE_LABELS[v.scale] || v.scale,
    score: v.score,
  }));

  const motivationBars = (motivations?.motivationScores || []).map((m) => ({
    scale: MOTIVATION_LABELS[m.scale] || m.scale,
    score: m.score,
  }));

  const filter = environment?.filter || {};

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* header */}
      <div className="text-white px-6 md:px-10 py-8" style={{ background: `linear-gradient(135deg, ${navy}, #013257)` }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <Tag color="cyan" className="!text-xs !font-semibold mb-2">DISHA TEST 2 REPORT</Tag>
            <h1 className="text-3xl font-extrabold">Your Interests, Values &amp; Motivations</h1>
            <p className="opacity-80 mt-1 text-sm">
              {profile?.currentClass ? `${profile.currentClass} · ` : ""}
              {profile?.board ? `${profile.board} · ` : ""}
              Interests, Work Values, Career Motivations &amp; Occupational Preferences
            </p>
          </div>
          <Button ghost onClick={() => navigate("/psychometric")}>
            Back to Tests
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-6">
        {/* Fit overview */}
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
                    <div className="text-xs text-slate-400">Self-Fit Index</div>
                  </span>
                )}
              />
              {summary?.preliminary && (
                <Tag color="orange" className="mt-2">Preliminary (Test 2 only)</Tag>
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800 mb-3">What this measures</h3>
              {summary &&
                [
                  { key: "interests", label: "Interest clarity (45%)" },
                  { key: "values", label: "Values clarity (30%)" },
                  { key: "motivation", label: "Intrinsic motivation (25%)" },
                ].map((p) => (
                  <div key={p.key} className="mb-2">
                    <div className="flex justify-between text-sm text-slate-600 mb-0.5">
                      <span>{p.label}</span>
                      <span className="font-semibold">{summary.pillars?.[p.key] ?? 0}</span>
                    </div>
                    <Progress percent={summary.pillars?.[p.key] ?? 0} showInfo={false} strokeColor={navy} size="small" />
                  </div>
                ))}
              <p className="text-xs text-slate-400 mt-3">
                Combine with Test 1 (aptitude &amp; marks) to unlock your full Career Fit Score and
                Interest–Performance Gap analysis.
              </p>
            </div>
          </div>
        </Card>

        {/* RIASEC */}
        {riasec && (
          <section className="mb-10">
            <SectionTitle n="1" hint={`Holland Code: ${riasec.hollandCode} · ${riasec.consistency === "consistent" ? "Consistent profile" : "Differentiated profile — worth a closer look with your counsellor"}`}>
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
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mt-4">
                {(riasec.scores || []).map((s) => (
                  <div key={s.type} className="text-center bg-slate-50 rounded-lg py-2">
                    <div className="text-xs text-slate-500">{RIASEC_LABELS[s.type]}</div>
                    <div className="font-bold" style={{ color: navy }}>{s.combined}</div>
                    <div className="text-[10px] text-slate-400">{s.zone}</div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* Work Values */}
        {workValues?.ranked?.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="2" hint="What matters most to you in a career (0–100 per value).">
              Work Values Profile
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="flex flex-wrap gap-2 mb-4">
                {workValues.topValues.map((v, i) => (
                  <Tag key={v} color={i === 0 ? "blue" : "default"} className="!text-sm !py-1 !px-3">
                    {i + 1}. {VALUE_LABELS[v] || v}
                  </Tag>
                ))}
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={valueBars} layout="vertical" margin={{ left: 40 }}>
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="value" width={130} tick={{ fontSize: 11 }} />
                    <RTooltip />
                    <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                      {valueBars.map((e, i) => (
                        <Cell key={i} fill={i === 0 ? accent : navy} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {workValues.familyCongruent && (
                <p className="text-sm text-slate-500 mt-3">
                  When a family-approved path conflicts with a path you're passionate about, you
                  currently lean toward{" "}
                  <strong>
                    {workValues.familyCongruent === "family"
                      ? "the family-approved path"
                      : "the path you're passionate about"}
                  </strong>
                  . This is a genuine value, not a limitation — your counsellor can use the Family
                  Conversation Guide to honour both.
                </p>
              )}
            </Card>
          </section>
        )}

        {/* Career Motivations */}
        {motivations?.motivationScores?.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="3" hint="WHY you want what you want — the psychological drivers behind your choices.">
              Career Motivations
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={motivationBars} layout="vertical" margin={{ left: 40 }}>
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="scale" width={130} tick={{ fontSize: 11 }} />
                    <RTooltip />
                    <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                      {motivationBars.map((e, i) => (
                        <Cell key={i} fill={navy} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-500">Intrinsic motivation</div>
                  <div className="text-xl font-bold" style={{ color: navy }}>{motivations.intrinsic}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-500">Extrinsic motivation</div>
                  <div className="text-xl font-bold" style={{ color: navy }}>{motivations.extrinsic}</div>
                </div>
              </div>
              {motivations.extrinsicFlag && (
                <Alert
                  type="info"
                  showIcon
                  className="mt-3 rounded-lg"
                  message="A reflection prompt — not a problem"
                  description="Your career thinking appears strongly influenced by family expectations and social norms. This is very common in Indian families and reflects love and responsibility, not weakness. It can be worth reflecting with your counsellor on which parts of your plan are truly yours."
                />
              )}
            </Card>
          </section>
        )}

        {/* Work Environment */}
        {environment?.filter && (
          <section className="mb-10">
            <SectionTitle n="4" hint="Your ideal working conditions — used to filter career recommendations to fit your life.">
              Work Environment Preferences
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="flex flex-wrap gap-2">
                {[
                  filter.sector,
                  filter.ownership,
                  filter.impactMode,
                  filter.setting,
                  filter.location,
                ]
                  .filter(Boolean)
                  .map((k) => (
                    <Tag key={k} color="geekblue" className="!text-sm !py-1 !px-3">
                      {ENV_LABELS[k] || k}
                    </Tag>
                  ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-sm">
                {filter.teamworkPref != null && (
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-xs text-slate-500">Independent ↔ Team</div>
                    <Progress percent={filter.teamworkPref * 10} showInfo={false} strokeColor={accent} size="small" />
                  </div>
                )}
                {filter.travelPref != null && (
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-xs text-slate-500">Stable ↔ Travel</div>
                    <Progress percent={filter.travelPref * 10} showInfo={false} strokeColor={accent} size="small" />
                  </div>
                )}
                {filter.wfhPref != null && (
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-xs text-slate-500">Office ↔ Remote</div>
                    <Progress percent={filter.wfhPref * 10} showInfo={false} strokeColor={accent} size="small" />
                  </div>
                )}
              </div>
            </Card>
          </section>
        )}

        {/* SJT */}
        {sjt?.competencies?.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="5" hint={`Values-in-action competency: ${sjt.percentage}%`}>
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
              <p className="text-xs text-slate-400 mt-3">
                There are no universally correct answers — your choices are interpreted against your own
                values and motivations, never marked right or wrong.
              </p>
            </Card>
          </section>
        )}

        {/* disclaimer */}
        <p className="text-center text-xs text-slate-400 mt-8 max-w-2xl mx-auto">
          This report is a scientifically-informed guide for reflection and counselling, not a
          destiny. Your effort, passion, context and choices always outweigh any test score. For
          guidance use only — not for admissions, scholarship, or employment decisions.
        </p>
      </div>
    </div>
  );
}
