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

const SUBJECT_LABELS = {
  mathematics: "Mathematics", physics: "Physics", chemistry: "Chemistry", biology: "Biology",
  english: "English", science: "Science", socialScience: "Social Science", hindi: "Hindi / 2nd Lang",
  thirdLanguage: "3rd Language", computerScience: "Computer Science", physicalEducation: "Phys. Ed",
  optional: "Optional", fifthSubject: "5th Subject", accountancy: "Accountancy",
  businessStudies: "Business Studies", economics: "Economics", history: "History",
  polsci: "Pol Science", geography: "Geography", psychology: "Psychology",
  vocationalSubject: "Vocational",
};
const subjLabel = (k) => SUBJECT_LABELS[k] || k;

const VARK_LABELS = { Visual: "Visual", Auditory: "Auditory", ReadWrite: "Read/Write", Kinesthetic: "Kinesthetic" };
const EXAM_LABELS = { jeeMains: "JEE Mains", neet: "NEET", clat: "CLAT", caFoundation: "CA Foundation", cuet: "CUET" };

const zoneColor = (zone) => {
  switch (zone) {
    case "Exceptional": return "#16a34a";
    case "Strong": return "#22c55e";
    case "Average": return "#eab308";
    case "Developing": return "#f97316";
    default: return "#ef4444";
  }
};
const bandColor = (band) => (band === "High" ? "green" : band === "Moderate" ? "gold" : "red");

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

export default function DISHA3Result() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const result = state?.result;
  const profile = state?.profile;

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <Empty description="No DISHA Test 3 report found" />
        <Button type="primary" style={{ background: navy }} onClick={() => navigate("/psychometric")}>
          Back to Tests
        </Button>
      </div>
    );
  }

  const { marks, proficiency, learningStyles, studyHabits, examPrep, sjt, streams, examProbabilities, validity, summary } = result;

  const subjectBars = (marks?.subjects || []).map((s) => ({ subject: subjLabel(s.subjectKey), SSI: s.ssi, zone: s.zone }));
  const varkRadar = (learningStyles?.varkProfile || []).map((v) => ({ style: VARK_LABELS[v.scale] || v.scale, score: v.pct }));
  const streamList = streams || [];
  const examList = Object.entries(examProbabilities || {}).filter(([, v]) => v).map(([k, v]) => ({ exam: EXAM_LABELS[k] || k, ...v }));

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* header */}
      <div className="text-white px-6 md:px-10 py-8" style={{ background: `linear-gradient(135deg, ${navy}, #013257)` }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <Tag color="cyan" className="!text-xs !font-semibold mb-2">DISHA TEST 3 REPORT</Tag>
            <h1 className="text-3xl font-extrabold">Your Academic Performance Report</h1>
            <p className="opacity-80 mt-1 text-sm">
              {profile?.currentClass ? `${profile.currentClass} · ` : ""}
              {profile?.board ? `${profile.board} · ` : ""}
              {profile?.stream ? `${profile.stream} · ` : ""}
              Academic Performance, Subject Strengths, Learning Styles &amp; Study Habits
            </p>
          </div>
          <Button ghost onClick={() => navigate("/psychometric")}>Back to Tests</Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-6">
        {/* validity / wellbeing banners */}
        {studyHabits?.amotivationFlag && (
          <Alert
            className="mb-4 rounded-xl"
            type="warning"
            showIcon
            message="A wellbeing check-in first"
            description="Some responses suggest study fatigue or feeling overwhelmed. This is common and worth talking through with a counsellor or someone you trust before academic planning. Indian helplines such as iCall (9152987821) and the Vandrevala Foundation are available."
          />
        )}
        {validity && !validity.clean && (
          <Alert
            className="mb-4 rounded-xl"
            type="info"
            showIcon
            message="A note on your responses"
            description="A few responses suggest an idealised self-presentation. This does not invalidate your report; your counsellor may explore some areas in more depth."
          />
        )}

        {/* summary */}
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
                    <div className="text-xs text-slate-400">Academic Readiness</div>
                  </span>
                )}
              />
              {summary?.preliminary && <Tag color="orange" className="mt-2">Preliminary (Test 3 only)</Tag>}
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800 mb-3">What this measures</h3>
              {summary &&
                [
                  { key: "academic", label: "Academic profile / marks (50%)" },
                  { key: "studyQuality", label: "Study quality (30%)" },
                  { key: "examReadiness", label: "Exam readiness (20%)" },
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
                Combine with Test 1 (aptitude) and Test 2 (interests) to unlock the full three-way
                Interest–Aptitude–Performance gap analysis.
              </p>
            </div>
          </div>
        </Card>

        {/* Academic dashboard */}
        {subjectBars.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="1" hint="Subject Strength Index (SSI) per subject — recency-weighted marks + trend + relative strength.">
              Academic Dashboard
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectBars} layout="vertical" margin={{ left: 40 }}>
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="subject" width={130} tick={{ fontSize: 11 }} />
                    <RTooltip />
                    <Bar dataKey="SSI" radius={[0, 6, 6, 0]}>
                      {subjectBars.map((e, i) => (
                        <Cell key={i} fill={zoneColor(e.zone)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-slate-500">Academic Profile (APS)</div>
                  <div className="text-xl font-bold" style={{ color: navy }}>{marks.aps}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-slate-500">Composite SSI</div>
                  <div className="text-xl font-bold" style={{ color: navy }}>{marks.composite}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-slate-500">Consistency</div>
                  <div className="text-xl font-bold" style={{ color: navy }}>{marks.consistencyScore}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-slate-500">Trajectory</div>
                  <div className="text-xl font-bold" style={{ color: navy }}>{marks.trajectory}</div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(marks.subjects || []).map((s) => (
                  <Tag key={s.subjectKey} color={bandColor(s.zone === "Exceptional" || s.zone === "Strong" ? "High" : s.zone === "Average" ? "Moderate" : "Low")}>
                    {subjLabel(s.subjectKey)}: SSI {s.ssi} · {s.trendLabel}
                  </Tag>
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* Self-efficacy gaps */}
        {proficiency?.items?.length > 0 && (proficiency.overconfidenceSubjects?.length || proficiency.impostorSubjects?.length || proficiency.hiddenInterestSubjects?.length) ? (
          <section className="mb-10">
            <SectionTitle n="2" hint="How your self-rating compares with your actual marks.">
              Confidence vs Performance
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm space-y-3">
              {proficiency.impostorSubjects?.length > 0 && (
                <Alert type="info" showIcon message="Possible underconfidence (impostor pattern)"
                  description={`You rate yourself lower than your marks suggest in: ${proficiency.impostorSubjects.map(subjLabel).join(", ")}. Your performance shows you are stronger here than you feel.`} />
              )}
              {proficiency.overconfidenceSubjects?.length > 0 && (
                <Alert type="warning" showIcon message="Worth a closer look"
                  description={`Your confidence is higher than current marks in: ${proficiency.overconfidenceSubjects.map(subjLabel).join(", ")}. A focused revision check could close this gap.`} />
              )}
              {proficiency.hiddenInterestSubjects?.length > 0 && (
                <Alert type="success" showIcon message="Hidden interest"
                  description={`You enjoy these subjects but marks are lagging: ${proficiency.hiddenInterestSubjects.map(subjLabel).join(", ")}. Genuine interest here is a strong base to build on.`} />
              )}
            </Card>
          </section>
        ) : null}

        {/* Stream recommendation */}
        {streamList.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="3" hint="Probability of fit per stream, based on your current marks (and study habits).">
              Stream Recommendation
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              {streamList.map((s, i) => (
                <div key={s.stream} className="mb-3">
                  <div className="flex justify-between text-sm mb-0.5">
                    <span className="font-medium text-slate-700">
                      {s.label}
                      {i === 0 && <span className="ml-2 text-emerald-600 font-semibold">★ Best current fit</span>}
                    </span>
                    <span className="font-semibold" style={{ color: navy }}>
                      {s.probability < 35 ? "<35%" : s.probability > 90 ? ">90%" : `${s.probability}%`}
                    </span>
                  </div>
                  <Progress percent={s.probability} showInfo={false} strokeColor={i === 0 ? accent : navy} size="small" />
                  {(s.drivers?.length > 0 || s.concerns?.length > 0) && (
                    <div className="text-xs text-slate-500 mt-0.5">
                      {s.drivers?.length > 0 && <span className="text-emerald-600">Drivers: {s.drivers.join(", ")}. </span>}
                      {s.concerns?.length > 0 && <span className="text-orange-600">Watch: {s.concerns.join(", ")}.</span>}
                    </div>
                  )}
                </div>
              ))}
              <p className="text-xs text-slate-400 mt-3">
                These probabilities are a guide based on current performance — not a verdict. Students
                can and do succeed in any stream with effort, good teaching, and support.
              </p>
            </Card>
          </section>
        )}

        {/* Exam probability */}
        {examList.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="4" hint="Estimated likelihood of clearing major entrance exams from current marks.">
              Exam Probability Estimates
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {examList.map((e) => (
                  <div key={e.exam} className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500">{e.exam}</div>
                    <div className="text-lg font-bold" style={{ color: navy }}>{e.probability}%</div>
                    <Tag color={bandColor(e.band)} className="mt-1">{e.band}</Tag>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-3">
                These are probability estimates based on current performance trends — not predictions.
                Students regularly exceed and underperform these estimates.
              </p>
            </Card>
          </section>
        )}

        {/* Learning style */}
        {varkRadar.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="5" hint={`Dominant style: ${VARK_LABELS[learningStyles.dominantStyle] || learningStyles.dominantStyle || "—"}`}>
              Learning Style Profile
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={varkRadar} outerRadius="75%">
                    <PolarGrid />
                    <PolarAngleAxis dataKey="style" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
                    <Radar dataKey="score" stroke={navy} fill={accent} fillOpacity={0.5} />
                    <RTooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              {(learningStyles.roteFlag || learningStyles.coachDepFlag) && (
                <Alert
                  type="info"
                  showIcon
                  className="mt-3 rounded-lg"
                  message="A study-skill opportunity"
                  description="Your study pattern suggests you may rely heavily on memorisation and structured coaching. Conceptual entrance exams (JEE, NEET, CUET) reward deep understanding over rote recall — your study plan includes specific strategies to shift toward conceptual mastery. This is a skill-building opportunity, not a criticism."
                />
              )}
            </Card>
          </section>
        )}

        {/* Study habits + exam prep sub-scales */}
        <section className="mb-10">
          <SectionTitle n="6" hint="Your study habits, motivation and exam approach.">
            Study Habits &amp; Exam Preparedness
          </SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="rounded-2xl shadow-sm">
              <h3 className="font-bold text-slate-800 mb-3">Study Habits</h3>
              {(studyHabits?.subScales || []).map((s) => (
                <div key={s.scale} className="mb-2">
                  <div className="flex justify-between text-sm text-slate-600 mb-0.5">
                    <span>{s.scale.replace("AcadMot_I", "Motivation (Intrinsic)").replace("AcadMot_E", "Motivation (Extrinsic)").replace("CoachDep", "Coaching Dependence")}</span>
                    <span className="font-semibold">{s.pct}</span>
                  </div>
                  <Progress percent={s.pct} showInfo={false} strokeColor={navy} size="small" />
                </div>
              ))}
            </Card>
            <Card className="rounded-2xl shadow-sm">
              <h3 className="font-bold text-slate-800 mb-3">Exam Preparedness</h3>
              {(examPrep?.subScales || []).map((s) => (
                <div key={s.scale} className="mb-2">
                  <div className="flex justify-between text-sm text-slate-600 mb-0.5">
                    <span>{s.scale.replace("ExamPrep", "Preparation Quality").replace("TestAnxiety", "Test Anxiety").replace("TestStrategy", "Test Strategy")}</span>
                    <span className="font-semibold">{s.pct}</span>
                  </div>
                  <Progress percent={s.pct} showInfo={false} strokeColor={s.scale === "TestAnxiety" ? "#f97316" : navy} size="small" />
                </div>
              ))}
              {examPrep?.anxietyRisk === "High" && (
                <Alert type="warning" showIcon className="mt-3 rounded-lg" message="Exam anxiety is elevated"
                  description="Your test-anxiety score is high. This is very common and very manageable. Resources like iCall and the Vandrevala Foundation can help, and your report includes specific anxiety-management strategies." />
              )}
            </Card>
          </div>
        </section>

        {/* SJT */}
        {sjt?.competencies?.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="7" hint={`Academic decision-making: ${sjt.percentage}%`}>
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

        <p className="text-center text-xs text-slate-400 mt-8 max-w-2xl mx-auto">
          This report is a scientifically-informed guide, not a destiny. Weak or declining marks are
          solvable patterns, not fixed limitations. Your marks data is private and used only to
          personalise your recommendations. For guidance use only — not for admissions or selection.
        </p>
      </div>
    </div>
  );
}
