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

const SUBSCALE_LABELS = {
  Resilience: "Resilience",
  Grit: "Grit",
  GrowthMindset: "Growth Mindset",
  Empathy: "Empathy",
  CollEmpathy: "Family / Collectivist Empathy",
  SocialSkill: "Social Skills",
  SevaOrient: "Service (Seva) Orientation",
  UrbanRural: "Urban–Rural Comfort",
  DiversityOpen: "Diversity Openness",
  InterGen: "Inter-generational",
  LangAdapt: "Language Adaptability",
  SocialFlex: "Social Flexibility",
  TeamAdapt: "Team Adaptability",
  GeoFlex: "Geographic Flexibility",
};

const bandColor = (band) => {
  switch (band) {
    case "Exceptional": return "#16a34a";
    case "Strong": return "#22c55e";
    case "Average": return "#eab308";
    case "Developing": return "#f97316";
    default: return "#ef4444";
  }
};
const bandTag = (band) => (band === "Exceptional" || band === "Strong" ? "green" : band === "Average" ? "gold" : "red");

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

export default function DISHA4Result() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const result = state?.result;
  const profile = state?.profile;

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <Empty description="No DISHA Test 4 report found" />
        <Button type="primary" style={{ background: navy }} onClick={() => navigate("/psychometric")}>
          Back to Tests
        </Button>
      </div>
    );
  }

  const { selfAwareness, selfRegulation, resilience, empathy, adaptability, sjt, validity, overall, flags, summary } = result;
  const f = flags || {};

  // EI radar: 5 components.
  const eiRadar = [
    { dim: "Self-Awareness", T: selfAwareness?.tScore ?? 50 },
    { dim: "Self-Regulation", T: selfRegulation?.tScore ?? 50 },
    { dim: "Resilience", T: resilience?.resilienceIndex ?? 50 },
    { dim: "Empathy", T: empathy?.empathyScore ?? 50 },
    { dim: "Adaptability", T: adaptability?.adaptabilityT ?? 50 },
  ];

  const resilienceBars = [
    { scale: "Resilience", T: resilience?.resilience?.tScore ?? 50 },
    { scale: "Grit", T: resilience?.grit?.tScore ?? 50 },
    { scale: "Growth Mindset", T: resilience?.growthMindset?.tScore ?? 50 },
  ];

  const empathyBars = ["empathy", "collEmpathy", "socialSkill", "sevaOrient"]
    .map((k) => empathy?.[k])
    .filter(Boolean)
    .map((s) => ({ scale: SUBSCALE_LABELS[s.scale] || s.scale, T: s.tScore }));

  const adaptBars = (adaptability?.subScales || []).map((s) => ({ scale: SUBSCALE_LABELS[s.scale] || s.scale, T: s.tScore }));

  const isCriticalBand = overall?.band === "Critical Concern";

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* header */}
      <div className="text-white px-6 md:px-10 py-8" style={{ background: `linear-gradient(135deg, ${navy}, #013257)` }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <Tag color="cyan" className="!text-xs !font-semibold mb-2">DISHA TEST 4 REPORT</Tag>
            <h1 className="text-3xl font-extrabold">Your Emotional Intelligence Profile</h1>
            <p className="opacity-80 mt-1 text-sm">
              {profile?.currentClass ? `${profile.currentClass} · ` : ""}
              Emotional Intelligence, Resilience, Stress Management &amp; Interpersonal Fit
            </p>
          </div>
          <Button ghost onClick={() => navigate("/psychometric")}>Back to Tests</Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-6">
        {/* wellbeing banners — shown first, framed supportively */}
        {(f.crisisSupport || f.crisisSelfCheck) && (
          <Alert
            className="mb-4 rounded-xl"
            type="error"
            showIcon
            message="A wellbeing check-in comes first"
            description="Some of your responses suggest this may be a difficult period. That is more common than you might think, and support genuinely helps. Please consider talking to your counsellor or a trusted adult, or reaching out to iCall (9152987821), Vandrevala Foundation (1860-2662-345) or AASRA (9820466627). Career planning can wait — you matter more."
          />
        )}
        {f.burnoutRisk && !f.crisisSupport && (
          <Alert
            className="mb-4 rounded-xl"
            type="warning"
            showIcon
            message="Pace yourself"
            description="Your responses suggest you may be running low on emotional energy. Building in rest and self-care is not a luxury during exam preparation — it is part of performing well. Your development plan includes specific stress-management strategies."
          />
        )}
        {validity && !validity.clean && (
          <Alert
            className="mb-4 rounded-xl"
            type="info"
            showIcon
            message="A note on your responses"
            description="A few responses suggest an idealised self-presentation. This does not invalidate your report; your counsellor may explore some areas in more depth using emotional-incident examples."
          />
        )}

        {/* EQ overview */}
        <Card className="rounded-2xl shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-center">
            <div className="text-center">
              <Progress
                type="dashboard"
                percent={summary?.overall ?? 0}
                strokeColor={bandColor(overall?.band)}
                format={() => (
                  <span>
                    <span className="text-3xl font-bold" style={{ color: navy }}>{overall?.tScore ?? "—"}</span>
                    <div className="text-xs text-slate-400">EQ T-score</div>
                  </span>
                )}
              />
              {overall?.band && !isCriticalBand && (
                <Tag color={bandTag(overall.band)} className="mt-2">{overall.band}</Tag>
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">Your emotional intelligence profile</h3>
              {isCriticalBand ? (
                <p className="text-sm text-slate-600">
                  Your report focuses on a few emotional skill areas where targeted support would make
                  a meaningful difference. Your counsellor will walk through these with you — wellbeing
                  comes before any career planning.
                </p>
              ) : (
                <p className="text-sm text-slate-600">
                  Emotional intelligence is one of the strongest predictors of success in people-centred
                  and high-pressure careers — and unlike aptitude, every part of it can be developed.
                  Your highest area is a genuine career asset; the areas you scored lower are exactly
                  where your development plan can move the needle.
                </p>
              )}
              <div className="h-64 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={eiRadar} outerRadius="72%">
                    <PolarGrid />
                    <PolarAngleAxis dataKey="dim" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis domain={[20, 80]} tick={{ fontSize: 9 }} />
                    <Radar dataKey="T" stroke={navy} fill={accent} fillOpacity={0.5} />
                    <RTooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Card>

        {/* Self-Awareness & Self-Regulation */}
        <section className="mb-10">
          <SectionTitle n="1" hint="How well you understand and manage your own emotions under pressure.">
            Self-Awareness &amp; Regulation
          </SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="rounded-2xl shadow-sm text-center">
              <div className="text-sm text-slate-500 mb-1">Emotional Self-Awareness</div>
              <div className="text-3xl font-bold" style={{ color: bandColor(selfAwareness?.band) }}>{selfAwareness?.tScore ?? "—"}</div>
              <Tag color={bandTag(selfAwareness?.band)} className="mt-1">{selfAwareness?.band}</Tag>
            </Card>
            <Card className="rounded-2xl shadow-sm text-center">
              <div className="text-sm text-slate-500 mb-1">Emotional Self-Regulation</div>
              <div className="text-3xl font-bold" style={{ color: bandColor(selfRegulation?.band) }}>{selfRegulation?.tScore ?? "—"}</div>
              <Tag color={bandTag(selfRegulation?.band)} className="mt-1">{selfRegulation?.band}</Tag>
              {f.impulsivityRisk && (
                <p className="text-xs text-orange-600 mt-2">
                  Your responses suggest emotions can run high under pressure — your plan includes
                  practical impulse-management strategies (a real strength to build for high-stakes roles).
                </p>
              )}
            </Card>
          </div>
        </section>

        {/* Resilience */}
        {resilience && (
          <section className="mb-10">
            <SectionTitle n="2" hint={`Resilience Index: ${resilience.resilienceIndex} — the single strongest moderator of competitive-exam success.`}>
              Resilience, Grit &amp; Growth Mindset
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={resilienceBars} layout="vertical" margin={{ left: 30 }}>
                    <XAxis type="number" domain={[20, 80]} tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="scale" width={120} tick={{ fontSize: 11 }} />
                    <RTooltip />
                    <Bar dataKey="T" radius={[0, 6, 6, 0]}>
                      {resilienceBars.map((e, i) => (
                        <Cell key={i} fill={bandColor(e.T >= 65 ? "Exceptional" : e.T >= 55 ? "Strong" : e.T >= 45 ? "Average" : e.T >= 35 ? "Developing" : "Critical")} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {resilience.fixedMindsetFlag && (
                <Alert type="info" showIcon className="mt-3 rounded-lg" message="Developing a growth mindset"
                  description="Some responses lean toward seeing ability as fixed. A growth mindset — believing skills can be built with the right approach — is one of the most developable and high-impact mindsets for exams and careers. Your plan includes specific resources for this." />
              )}
              {resilience.combinedCritical && (
                <Alert type="warning" showIcon className="mt-3 rounded-lg" message="Resilience is your highest-priority skill to build"
                  description="Your resilience is currently below average — this is one of the most developable emotional skills, not a fixed limitation. Your plan includes specific, evidence-based strategies to build it over the next 3 months, and your counsellor will support you." />
              )}
            </Card>
          </section>
        )}

        {/* Empathy */}
        {empathyBars.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="3" hint="Reading others, building relationships, and the service orientation valued across Indian careers.">
              Empathy &amp; Interpersonal Skills
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={empathyBars} layout="vertical" margin={{ left: 60 }}>
                    <XAxis type="number" domain={[20, 80]} tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="scale" width={150} tick={{ fontSize: 10 }} />
                    <RTooltip />
                    <Bar dataKey="T" radius={[0, 6, 6, 0]} fill={navy} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {f.empathicOverInvolvement && (
                <Alert type="info" showIcon className="mt-3 rounded-lg" message="Your deep empathy is a strength"
                  description="Your deep empathy is one of your greatest assets — a foundation for careers in medicine, counselling, teaching and social work. The one additional skill worth building is protecting your own energy while serving others (boundary skills). Your plan includes this." />
              )}
            </Card>
          </section>
        )}

        {/* Adaptability */}
        {adaptBars.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="4" hint="Comfort with diversity, mobility and new environments — a strong predictor of career-transition fit.">
              Social &amp; Cultural Adaptability
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={adaptBars} layout="vertical" margin={{ left: 50 }}>
                    <XAxis type="number" domain={[20, 80]} tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="scale" width={140} tick={{ fontSize: 10 }} />
                    <RTooltip />
                    <Bar dataKey="T" radius={[0, 6, 6, 0]} fill={accent} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {adaptability?.lowGeoFilter && (
                <Alert type="info" showIcon className="mt-3 rounded-lg" message="Geographic preferences and career fit"
                  description="You lean toward staying closer to home — a completely valid value. Your recommendations will prioritise careers that offer excellent options within that preference, rather than metro-heavy or frequent-relocation roles." />
              )}
            </Card>
          </section>
        )}

        {/* SJT */}
        {sjt?.competencies?.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="5" hint={`Emotional intelligence in action: ${sjt.percentage}% — how you respond to real Indian pressure scenarios.`}>
              Emotional Scenarios &amp; Competencies
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
                Your most likely responses suggest these competency patterns — they are never marked
                right or wrong, only interpreted against your own emotional profile.
              </p>
            </Card>
          </section>
        )}

        {/* wellbeing resources — always shown */}
        <Card className="rounded-2xl shadow-sm mb-8 bg-emerald-50 border-emerald-100">
          <h3 className="font-bold text-slate-800 mb-1">Wellbeing resources — for everyone</h3>
          <p className="text-sm text-slate-600">
            Reaching out for support is a sign of emotional intelligence, not weakness. Many of India's
            most successful people have sought professional support during high-pressure periods.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Tag color="green">iCall · 9152987821</Tag>
            <Tag color="green">Vandrevala Foundation · 1860-2662-345</Tag>
            <Tag color="green">AASRA · 9820466627</Tag>
          </div>
        </Card>

        <p className="text-center text-xs text-slate-400 mt-2 max-w-2xl mx-auto">
          This report measures functional emotional intelligence for career guidance — it does not
          diagnose any mental-health condition. Every emotional skill here can be developed. For
          guidance use only.
        </p>
      </div>
    </div>
  );
}
