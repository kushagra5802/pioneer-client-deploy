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
} from "recharts";

const navy = "#004877";
const accent = "#3BBEE8";

const SUBJECT_LABELS = {
  mathematics: "Mathematics", science: "Science", english: "English",
  socialScience: "Social Science", hindi: "Hindi / 2nd Lang", computerScience: "Computer Science / IT",
};
const subjLabel = (k) => SUBJECT_LABELS[k] || k;

const RIASEC_LABELS = { R: "Realistic", I: "Investigative", A: "Artistic", S: "Social", E: "Enterprising", C: "Conventional" };
const VALUE_LABELS = {
  Security: "Security", Growth: "Growth / Intellectual", Altruism: "Altruism", Prestige: "Prestige",
  Autonomy: "Autonomy", Seva: "Seva / Nation-building", WLB: "Work-Life Balance", Innovation: "Innovation",
};

const bandColor = (p) => (p >= 65 ? "#16a34a" : p >= 50 ? "#22c55e" : p >= 40 ? "#eab308" : "#f97316");
const bandTag = (band) => (band === "High" ? "green" : band === "Moderate" ? "gold" : "red");

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

export default function DISHAC10Result() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const result = state?.result;
  const profile = state?.profile;

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <Empty description="No Stream Selection report found" />
        <Button type="primary" style={{ background: navy }} onClick={() => navigate("/psychometric")}>
          Back to Tests
        </Button>
      </div>
    );
  }

  const { academic, aptitude, interests, values, context, scenarios, streams, examReadiness, summary, explorationNeeded } = result;

  const subjectBars = (academic?.subjects || []).filter((s) => s.ssi != null).map((s) => ({
    subject: subjLabel(s.subjectKey), SSI: s.ssi,
  }));

  const streamList = streams || [];

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* header */}
      <div className="text-white px-6 md:px-10 py-8" style={{ background: `linear-gradient(135deg, ${navy}, #013257)` }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <Tag color="cyan" className="!text-xs !font-semibold mb-2">STREAM SELECTION REPORT</Tag>
            <h1 className="text-3xl font-extrabold">Your Recommended Stream</h1>
            <p className="opacity-80 mt-1 text-sm">
              {profile?.classGrade ? `${profile.classGrade} · ` : ""}Finding your stream for Class 11
            </p>
          </div>
          <Button ghost onClick={() => navigate("/psychometric")}>Back to Tests</Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-6">
        {explorationNeeded && (
          <Alert
            className="mb-4 rounded-xl"
            type="info"
            showIcon
            message="Your top streams are closely matched — and that's completely normal"
            description="Many students genuinely fit well in more than one stream at this stage. This is valuable information, not a problem to solve immediately — talk it through with your counsellor and focus on which activities (not just which subjects) engage you most."
          />
        )}

        {/* Top recommendation */}
        <Card className="rounded-2xl shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-center">
            <div className="text-center">
              <Progress
                type="dashboard"
                percent={summary?.topProbability ?? 0}
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
              <h3 className="font-bold text-lg text-slate-800 mb-3">Stream Probability</h3>
              {streamList.map((s, i) => (
                <div key={s.stream} className="mb-2">
                  <div className="flex justify-between text-sm mb-0.5">
                    <span className="font-medium text-slate-700">
                      {s.label}
                      {i === 0 && <span className="ml-2 text-emerald-600 font-semibold">★ Recommended</span>}
                    </span>
                    <span className="font-semibold" style={{ color: navy }}>{s.probability}%</span>
                  </div>
                  <Progress percent={s.probability} showInfo={false} strokeColor={i === 0 ? accent : navy} size="small" />
                </div>
              ))}
              <p className="text-xs text-slate-400 mt-3">
                These probabilities are a guide based on your marks, aptitude, interests and values —
                not a final verdict. Students succeed in any stream with effort, good teaching, and support.
              </p>
            </div>
          </div>
        </Card>

        {/* Academic dashboard */}
        {subjectBars.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="1" hint="Your Subject Strength Index (SSI) per subject, from your verified marks.">
              Academic Profile
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectBars} layout="vertical" margin={{ left: 40 }}>
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="subject" width={130} tick={{ fontSize: 11 }} />
                    <RTooltip />
                    <Bar dataKey="SSI" radius={[0, 6, 6, 0]}>
                      {subjectBars.map((e, i) => (
                        <Cell key={i} fill={bandColor(e.SSI)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {academic?.inTheZoneSubject && (
                <p className="text-sm text-slate-500 mt-2">
                  You told us <strong>{subjLabel(academic.inTheZoneSubject)}</strong> is where you feel most
                  'in the zone' — a strong signal worth weighing alongside your marks.
                </p>
              )}
            </Card>
          </section>
        )}

        {/* Aptitude */}
        {aptitude?.dimensions?.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="2" hint="Your reasoning strengths across four dimensions.">
              Aptitude Snapshot
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {aptitude.dimensions.map((d) => (
                  <div key={d.dim} className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500">{d.dim}</div>
                    <div className="text-xl font-bold" style={{ color: navy }}>{d.tScore}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-3">
                {aptitude.totalCorrect} correct · {aptitude.totalWrong} incorrect · {aptitude.totalBlank} left blank
                {aptitude.totalHints > 0 && ` · ${aptitude.totalHints} hint(s) used`}
              </p>
            </Card>
          </section>
        )}

        {/* Interests */}
        {interests?.scores?.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="3" hint={`Your strongest interest areas: ${(interests.topTypes || []).map((t) => RIASEC_LABELS[t]).join(" & ")}.`}>
              Interest Profile
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                {interests.scores.map((s) => (
                  <div key={s.type} className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500">{RIASEC_LABELS[s.type]}</div>
                    <div className="font-bold" style={{ color: navy }}>{s.pct}</div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* Values */}
        {values?.scores?.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="4" hint="What matters most to you in a future career.">
              Values &amp; Preferences
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="flex flex-wrap gap-2">
                {[...values.scores].sort((a, b) => b.pct - a.pct).slice(0, 4).map((v, i) => (
                  <Tag key={v.scale} color={i === 0 ? "blue" : "default"} className="!text-sm !py-1 !px-3">
                    {VALUE_LABELS[v.scale] || v.scale} ({v.pct})
                  </Tag>
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* Exam readiness */}
        {examReadiness?.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="5" hint="Based on the entrance exams you're considering.">
              Exam Readiness Signal
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {examReadiness.map((e) => (
                  <div key={e.exam} className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500">{e.exam}</div>
                    <div className="text-lg font-bold" style={{ color: navy }}>{e.probability}%</div>
                    <Tag color={bandTag(e.band)} className="mt-1">{e.band}</Tag>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-3">
                This is an early, marks-and-aptitude-based signal — not a prediction. It will become
                more accurate as you move through Class 11–12.
              </p>
            </Card>
          </section>
        )}

        {/* Context — personalisation, never blocking */}
        {context && (context.highParentalPressure || context.highFinancialUrgency || context.geographicallyConstrained) && (
          <section className="mb-10">
            <SectionTitle n="6" hint="Your context personalises this report — it never removes a stream from consideration.">
              Your Context
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm space-y-2">
              {context.highParentalPressure && (
                <Alert type="info" showIcon message="Family-Aligned Path"
                  description="Your family has a strong preference for your stream. Your recommended stream above already reflects your genuine marks, aptitude and interests — use it as evidence for a calm, data-backed conversation at home." />
              )}
              {context.highFinancialUrgency && (
                <Alert type="info" showIcon message="Career timeline"
                  description="Earning sooner matters to your family right now. Commerce and vocational-adjacent pathways typically offer earlier income; this doesn't rule out other streams, but it's worth discussing timelines with your counsellor." />
              )}
              {context.geographicallyConstrained && (
                <Alert type="info" showIcon message="Geographic preference"
                  description="You've told us you need to stay in or near your home city or state. Your counsellor can filter college recommendations accordingly — every stream above has good options within that constraint." />
              )}
            </Card>
          </section>
        )}

        {/* Scenarios — descriptive, not scored into streams */}
        {scenarios?.results?.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="7" hint="These reflect how you tend to navigate pressure — they do not change your stream probabilities above.">
              Real-Life Scenarios
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
              <p className="text-xs text-slate-400 mt-3">
                There are no wrong answers here — these responses give your counsellor insight into how
                you make decisions under pressure.
              </p>
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
