import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Progress, Tag, Empty, Alert } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  ResponsiveContainer,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

const navy = "#004877";
const accent = "#3BBEE8";

const RIASEC_LABELS = { R: "Realistic", I: "Investigative", A: "Artistic", S: "Social", E: "Enterprising", C: "Conventional" };
const OCEAN_LABELS = { O: "Openness", C: "Conscientiousness", E: "Extraversion", A: "Agreeableness", N: "Neuroticism" };
const VALUE_LABELS = {
  Security: "Security", Mastery: "Mastery", Autonomy: "Autonomy", Altruism: "Altruism", WLB: "Work-Life Balance",
  Intellectual: "Intellectual Challenge", Prestige: "Prestige", FamilyDuty: "Family Duty", Societal: "Nation-building",
  Innovation: "Innovation", Voice: "Voice / Influence", Stability: "Stability",
};
const MOTIVATION_LABELS = {
  Power: "Power / Impact", Achievement: "Achievement", Affiliation: "Affiliation", Mastery: "Mastery / Learning",
  SocietalImpact: "Societal Impact", Intrinsic: "Intrinsic", Extrinsic: "Extrinsic (family/social expectation)",
};

const bandColor = (band) => (band === "High" ? "green" : band === "Moderate" ? "gold" : "red");

function SectionTitle({ n, children, hint }) {
  return (
    <div className="mb-4">
      <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
        <span className="text-white text-sm w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: navy }}>{n}</span>
        {children}
      </h2>
      {hint && <p className="text-slate-500 text-sm mt-1">{hint}</p>}
    </div>
  );
}

export default function DISHAC12Result() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const result = state?.result;
  const profile = state?.profile;

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <Empty description="No Career Selection report found" />
        <Button type="primary" style={{ background: navy }} onClick={() => navigate("/psychometric")}>Back to Tests</Button>
      </div>
    );
  }

  const {
    academic, aptitude, personality, interests, valuesMotivations, context,
    scenarios, recommendations, examProbabilities, collegePathways, fiveYearVision, summary,
  } = result;

  const oceanBars = personality
    ? Object.keys(OCEAN_LABELS).map((f) => ({ factor: OCEAN_LABELS[f], T: personality[f]?.tScore ?? 50 }))
    : [];
  const riasecRadar = (interests?.scores || []).map((s) => ({ type: RIASEC_LABELS[s.type], score: s.combined }));
  const recBars = (recommendations || []).slice(0, 12).map((r) => ({ title: r.title, score: r.score }));
  const valueBars = (valuesMotivations?.valueScores || []).filter((v) => v.pct != null).sort((a, b) => b.pct - a.pct).map((v) => ({ scale: VALUE_LABELS[v.scale] || v.scale, pct: v.pct }));
  const motivBars = (valuesMotivations?.motivationScores || []).filter((m) => m.pct != null).map((m) => ({ scale: MOTIVATION_LABELS[m.scale] || m.scale, pct: m.pct }));

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="text-white px-6 md:px-10 py-8" style={{ background: `linear-gradient(135deg, ${navy}, #013257)` }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <Tag color="cyan" className="!text-xs !font-semibold mb-2">CAREER SELECTION REPORT</Tag>
            <h1 className="text-3xl font-extrabold">Your Career Direction</h1>
            <p className="opacity-80 mt-1 text-sm">{profile?.classGrade ? `${profile.classGrade} · ` : ""}Finding your career path</p>
          </div>
          <Button ghost onClick={() => navigate("/psychometric")}>Back to Tests</Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-6">
        {summary?.explorationNeeded && (
          <Alert
            className="mb-4 rounded-xl"
            type="info"
            showIcon
            message="Your top career choices are closely matched — and that's genuinely useful information"
            description="Several careers fit you well at this stage. Use this list to explore rather than rush a single choice — talk it through with your counsellor."
          />
        )}

        {/* Top recommendation */}
        <Card className="rounded-2xl shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-center">
            <div className="text-center">
              <Progress
                type="dashboard"
                percent={summary?.topScore ?? 0}
                strokeColor={accent}
                format={(p) => (
                  <span>
                    <span className="text-2xl font-bold" style={{ color: navy }}>{p}%</span>
                    <div className="text-xs text-slate-400">Best Fit</div>
                  </span>
                )}
              />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800 mb-1">
                {summary?.topCareerTitle && <>Your top recommendation: <span style={{ color: navy }}>{summary.topCareerTitle}</span></>}
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                These probabilities are a guide based on your appeal ratings, interests, values, life-design
                preferences and context — not a final verdict.
              </p>
            </div>
          </div>
        </Card>

        {/* Top 12 careers */}
        {recBars.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="1" hint="Your Top 12 career recommendations, blending direct appeal, interest fit, and values alignment.">
              Top Career Recommendations
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="h-[420px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={recBars} layout="vertical" margin={{ left: 10, right: 20 }}>
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="title" width={220} tick={{ fontSize: 10 }} />
                    <RTooltip />
                    <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                      {recBars.map((e, i) => (
                        <Cell key={i} fill={i === 0 ? accent : navy} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {(recommendations || []).slice(0, 3).map((r) => (
                  <div key={r.careerId} className="bg-slate-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-800">{r.title}</span>
                      <Tag>{r.sector}</Tag>
                    </div>
                    {r.modifiers?.length > 0 && (
                      <p className="text-xs text-emerald-600 mt-1">{r.modifiers.join(" · ")}</p>
                    )}
                    {r.readinessFlag && (
                      <p className="text-xs text-orange-600 mt-1">{r.readinessFlag}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* Academic trajectory */}
        {academic?.years?.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="2" hint="Your 3-year academic trajectory (Class 10 → 11 → 12).">
              Academic Profile
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {academic.years.map((y) => (
                  <div key={y.label} className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500">{y.label}</div>
                    <div className="text-xl font-bold" style={{ color: navy }}>{y.pct}%</div>
                  </div>
                ))}
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-slate-500">Trend</div>
                  <div className="text-sm font-bold" style={{ color: navy }}>{academic.trendLabel}</div>
                </div>
              </div>
              {academic.class12Predicted && (
                <p className="text-xs text-slate-400 mt-2">Some Class 12 marks are predicted estimates and will update as actual results come in.</p>
              )}
            </Card>
          </section>
        )}

        {/* Aptitude */}
        {aptitude?.dimensions?.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="3" hint="Your reasoning strengths across four dimensions.">Aptitude Snapshot</SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {aptitude.dimensions.map((d) => (
                  <div key={d.dim} className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500">{d.dim}</div>
                    <div className="text-xl font-bold" style={{ color: navy }}>{d.tScore}</div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* Personality */}
        {oceanBars.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="4" hint="Your Big Five personality profile.">Personality Profile (OCEAN)</SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={oceanBars} layout="vertical" margin={{ left: 30 }}>
                    <XAxis type="number" domain={[20, 80]} tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="factor" width={110} tick={{ fontSize: 11 }} />
                    <RTooltip />
                    <Bar dataKey="T" radius={[0, 6, 6, 0]} fill={navy} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </section>
        )}

        {/* RIASEC */}
        {riasecRadar.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="5" hint={`Your Holland Code: ${interests.hollandCode}`}>Interest Profile (RIASEC)</SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="text-center mb-4">
                <span className="inline-block text-3xl font-extrabold tracking-widest px-6 py-2 rounded-xl text-white" style={{ background: navy }}>
                  {interests.hollandCode}
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

        {/* Values & Motivations */}
        {(valueBars.length > 0 || motivBars.length > 0) && (
          <section className="mb-10">
            <SectionTitle n="6" hint="What you value in a career and what genuinely drives you.">Values &amp; Motivations</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {valueBars.length > 0 && (
                <Card className="rounded-2xl shadow-sm">
                  <h4 className="font-bold text-slate-800 mb-2">Top Values</h4>
                  <div className="flex flex-wrap gap-2">
                    {valueBars.slice(0, 5).map((v, i) => (
                      <Tag key={v.scale} color={i === 0 ? "blue" : "default"}>{v.scale} ({v.pct})</Tag>
                    ))}
                  </div>
                </Card>
              )}
              {motivBars.length > 0 && (
                <Card className="rounded-2xl shadow-sm">
                  <h4 className="font-bold text-slate-800 mb-2">Motivations</h4>
                  <div className="flex flex-wrap gap-2">
                    {motivBars.map((m) => (
                      <Tag key={m.scale}>{m.scale} ({m.pct})</Tag>
                    ))}
                  </div>
                  {valuesMotivations.intrinsicExtrinsicGap != null && (
                    <Alert
                      type="info"
                      showIcon
                      className="mt-3 rounded-lg"
                      message="A gap worth noticing, not judging"
                      description={
                        valuesMotivations.intrinsicExtrinsicGap >= 15
                          ? "Your career thinking is strongly driven by your own genuine interest — a great sign of sustainable motivation."
                          : valuesMotivations.intrinsicExtrinsicGap <= -15
                          ? "Family and community expectations appear to be a major driver of your career thinking right now — this is common and valid in Indian families. It's worth reflecting on which parts of your plan are genuinely yours."
                          : "Your career thinking blends genuine personal interest with family/community expectations in a fairly balanced way."
                      }
                    />
                  )}
                </Card>
              )}
            </div>
          </section>
        )}

        {/* Entrance exam probability */}
        {examProbabilities?.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="7" hint="Uses your actual scores where available, or a marks-and-aptitude estimate otherwise.">
              Entrance Exam Probability
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {examProbabilities.map((e) => (
                  <div key={e.exam} className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500">{e.exam}</div>
                    <div className="text-lg font-bold" style={{ color: navy }}>
                      {e.probability != null ? `${e.probability}%` : e.rank != null ? `Rank ${e.rank}` : `${e.score}`}
                    </div>
                    <Tag color={bandColor(e.band)} className="mt-1">{e.band}</Tag>
                    <div className="text-[10px] text-slate-400 mt-1">{e.source === "actual" ? "Your actual score" : "Estimate"}</div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* College pathways */}
        {collegePathways?.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="8" hint="Category-level guidance for where to focus your applications.">College Pathway Categories</SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="flex flex-wrap gap-2">
                {collegePathways.map((c) => (
                  <Tag key={c} color="geekblue" className="!text-sm !py-1 !px-3">{c}</Tag>
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* Context notes */}
        {context && (context.highParentalPressure || context.highFinancialUrgency || context.geographicallyConstrained) && (
          <section className="mb-10">
            <SectionTitle n="9" hint="Your context personalises this report — it never removes a career from consideration.">Your Context</SectionTitle>
            <Card className="rounded-2xl shadow-sm space-y-2">
              {context.highParentalPressure && (
                <Alert type="info" showIcon message="Family-Aligned Path"
                  description="Your family has a strong preference for your career. Your recommendations above already reflect your genuine interests, aptitude and values — use this report as evidence for a calm, data-backed conversation at home." />
              )}
              {context.highFinancialUrgency && (
                <Alert type="info" showIcon message="Career timeline"
                  description="Earning sooner matters to your family right now. Careers flagged with a quicker-income note above may be worth prioritising, alongside longer-gestation paths you can still pursue with a staged plan." />
              )}
              {context.geographicallyConstrained && (
                <Alert type="info" showIcon message="Geographic preference"
                  description="You've told us you need to stay in or near your home city or state. Your college pathway categories above already account for within-state and online options." />
              )}
            </Card>
          </section>
        )}

        {/* 5-year vision */}
        {fiveYearVision?.topCareerTitle && (
          <section className="mb-10">
            <SectionTitle n="10" hint="A snapshot combining your top career with how you want to live.">Your 5-Year Vision</SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <p className="text-slate-700 leading-relaxed">
                In 5 years, you could be working as a <strong>{fiveYearVision.topCareerTitle}</strong>
                {fiveYearVision.orgType ? <>, in a setting like <strong>{fiveYearVision.orgType.split(" — ")[0].toLowerCase()}</strong></> : ""}
                {fiveYearVision.geoExpectation ? <>, based in <strong>{fiveYearVision.geoExpectation.toLowerCase()}</strong></> : ""}.
                What matters most to you along the way is <strong>{VALUE_LABELS[fiveYearVision.topValue] || fiveYearVision.topValue}</strong>,
                driven by <strong>{MOTIVATION_LABELS[fiveYearVision.topMotivation] || fiveYearVision.topMotivation}</strong>.
                {fiveYearVision.riskOriented ? " You're genuinely open to a higher-risk, higher-learning path if the opportunity is right." : ""}
              </p>
            </Card>
          </section>
        )}

        {/* Scenarios */}
        {scenarios?.results?.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="11" hint="These reflect how you tend to navigate high-stakes decisions — they do not change your recommendations above.">
              Career Scenarios
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <p className="text-sm text-slate-600 mb-3">
                You aligned with the most balanced response in <strong>{scenarios.alignedCount} of {scenarios.totalAnswered}</strong> scenarios.
              </p>
              <div className="flex flex-wrap gap-2">
                {scenarios.results.filter((r) => r.picked).map((r) => (
                  <Tag key={r.id} color={r.aligned ? "green" : "default"}>{r.title}</Tag>
                ))}
              </div>
            </Card>
          </section>
        )}

        <p className="text-center text-xs text-slate-400 mt-2 max-w-2xl mx-auto">
          This report is a scientifically-informed guide, not a final verdict. Your effort, curiosity
          and choices always outweigh any single test score. For guidance use only.
        </p>
      </div>
    </div>
  );
}
