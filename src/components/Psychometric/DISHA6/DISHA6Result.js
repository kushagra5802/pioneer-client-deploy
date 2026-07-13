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

const bandColor = (band) => {
  switch (band) {
    case "Exceptional": return "#16a34a";
    case "Strong": return "#22c55e";
    case "Moderate": return "#eab308";
    case "Developing": return "#f97316";
    default: return "#ef4444";
  }
};
const bandTag = (band) => (band === "Exceptional" || band === "Strong" ? "green" : band === "Moderate" ? "gold" : "red");

const ERI_DESC = {
  "Founder-Ready": "You have the full profile of an entrepreneurially-ready individual — strong opportunity recognition, risk tolerance, execution drive, and business resilience. The entrepreneurship and startup pathways are highlighted prominently in your recommendations.",
  "Intrapreneur Profile": "You have strong innovation and execution abilities, but prefer building within a structured organisation rather than founding independently. Intrapreneurial roles in innovation teams, R&D, product management, and corporate ventures are your ideal expression of entrepreneurial energy.",
  "Idea-Rich Profile": "You have excellent opportunity-sensing and creative ideation, but execution and drive scores suggest you may struggle to bring ideas to fruition independently. Recommended: build execution skills through small projects; consider a co-founder or team entrepreneurship.",
  "Entrepreneurial Curious": "You show genuine interest in entrepreneurship but are not yet fully ready. Your plan includes specific experience-building steps: internships at startups, participation in hackathons, starting a micro-project.",
  "Stability Preferrer": "Entrepreneurship is not your primary path at this stage — and that is completely valid. Your profile is strong for building outstanding careers within established organisations. 'Intrapreneurship' — innovating within your employer — is a great way to channel creative energy with security.",
};

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

export default function DISHA6Result() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const result = state?.result;
  const profile = state?.profile;

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <Empty description="No DISHA Test 6 report found" />
        <Button type="primary" style={{ background: navy }} onClick={() => navigate("/psychometric")}>Back to Tests</Button>
      </div>
    );
  }

  const { divergentTasks, creativeSelfReport, innovationMindset, entrepreneurial, problemSolvingStyle, designSensitivity, sjt, validity, cqProfile, summary } = result;

  const ttctBars = divergentTasks
    ? [
        { dim: "Fluency", T: divergentTasks.dimensions.fluencyT },
        { dim: "Flexibility", T: divergentTasks.dimensions.flexibilityT },
        { dim: "Originality", T: divergentTasks.dimensions.originalityT },
        { dim: "Elaboration", T: divergentTasks.dimensions.elaborationT },
      ]
    : [];

  const eriBars = entrepreneurial
    ? Object.entries(entrepreneurial.subScales).map(([k, v]) => ({ scale: k, T: v.tScore }))
    : [];

  const psStyleBars = (problemSolvingStyle?.styles || []).map((s) => ({ style: s.style, pct: s.pct }));

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="text-white px-6 md:px-10 py-8" style={{ background: `linear-gradient(135deg, ${navy}, #013257)` }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <Tag color="cyan" className="!text-xs !font-semibold mb-2">DISHA TEST 6 REPORT</Tag>
            <h1 className="text-3xl font-extrabold">Your Creative Quotient Profile</h1>
            <p className="opacity-80 mt-1 text-sm">
              {profile?.currentClass ? `${profile.currentClass} · ` : ""}Creative Thinking, Innovation Mindset, Entrepreneurial Potential &amp; Problem-Solving Style
            </p>
          </div>
          <Button ghost onClick={() => navigate("/psychometric")}>Back to Tests</Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-6">
        {divergentTasks?.engagementFlag && (
          <Alert
            className="mb-4 rounded-xl"
            type="info"
            showIcon
            message="A note on your open-ended responses"
            description="Your idea generation was quite limited across most tasks. This may reflect severe exam-culture inhibition or disengagement with the format — not necessarily low creativity. Your counsellor may ask you to describe something creative you've done outside school as an alternative measure."
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
        {creativeSelfReport?.highSuppressionFlag && (
          <Alert
            className="mb-6 rounded-xl"
            type="warning"
            showIcon
            message="Your creativity may be stronger than your current scores suggest"
            description="The exam culture you've grown up in has systematically discouraged creative expression for many students — this is very common in India. Your divergent task performance is a more direct measure of your actual creative potential than how confident you currently feel about it."
          />
        )}

        {/* CQ overview */}
        <Card className="rounded-2xl shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-center">
            <div className="text-center">
              <Progress
                type="dashboard"
                percent={summary?.overall ?? 0}
                strokeColor={bandColor(cqProfile?.band)}
                format={() => (
                  <span>
                    <span className="text-3xl font-bold" style={{ color: navy }}>{cqProfile?.compositeT ?? "—"}</span>
                    <div className="text-xs text-slate-400">Creative Quotient</div>
                  </span>
                )}
              />
              {cqProfile?.band && <Tag color={bandTag(cqProfile.band)} className="mt-2">{cqProfile.band}</Tag>}
              {cqProfile?.suppressionAdjustmentApplied && (
                <p className="text-[10px] text-amber-600 mt-1">Adjusted for creativity suppression</p>
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">Your creative profile</h3>
              <p className="text-sm text-slate-600">
                Your Creative Quotient reveals how you generate ideas, how broad or deep your thinking
                tends to be, and how original your ideas are compared to your peers. This isn't about
                'being an artist' — creativity powers medicine, engineering, entrepreneurship, teaching,
                and virtually every career in India's future economy.
              </p>
              {ttctBars.length > 0 && (
                <div className="h-56 mt-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ttctBars} layout="vertical" margin={{ left: 20 }}>
                      <XAxis type="number" domain={[20, 80]} tick={{ fontSize: 10 }} />
                      <YAxis type="category" dataKey="dim" width={90} tick={{ fontSize: 11 }} />
                      <RTooltip />
                      <Bar dataKey="T" radius={[0, 6, 6, 0]} fill={accent} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              <p className="text-[11px] text-slate-400 mt-2">
                Divergent-task scores are an algorithmic estimate — your counsellor reviews the qualitative
                depth of your responses alongside these numbers.
              </p>
            </div>
          </div>
        </Card>

        {/* Entrepreneurial Readiness Index */}
        {eriBars.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="1" hint={`ERI: ${entrepreneurial.eri} — ${entrepreneurial.profile}`}>
              Entrepreneurial Readiness Index
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={eriBars} layout="vertical" margin={{ left: 30 }}>
                    <XAxis type="number" domain={[20, 80]} tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="scale" width={110} tick={{ fontSize: 11 }} />
                    <RTooltip />
                    <Bar dataKey="T" radius={[0, 6, 6, 0]} fill={navy} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <Alert
                type="info"
                showIcon
                className="mt-3 rounded-lg"
                message={entrepreneurial.profile}
                description={ERI_DESC[entrepreneurial.profile]}
              />
            </Card>
          </section>
        )}

        {/* Problem-Solving Style */}
        {psStyleBars.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="2" hint={`Dominant style: ${problemSolvingStyle.dominant}${problemSolvingStyle.secondary ? ` · Secondary: ${problemSolvingStyle.secondary}` : ""}`}>
              Problem-Solving Style
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={psStyleBars} layout="vertical" margin={{ left: 30 }}>
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="style" width={90} tick={{ fontSize: 11 }} />
                    <RTooltip />
                    <Bar dataKey="pct" radius={[0, 6, 6, 0]}>
                      {psStyleBars.map((e, i) => (
                        <Cell key={i} fill={e.style === problemSolvingStyle.dominant ? accent : navy} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-slate-400 mt-2">Your problem-solving style tells us something important about HOW you will do your best work — not just what kind of work suits you.</p>
            </Card>
          </section>
        )}

        {/* Innovation Mindset */}
        {innovationMindset?.scales && (
          <section className="mb-10">
            <SectionTitle n="3" hint="Your orientation toward finding and solving real-world problems.">
              Innovation Mindset
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(innovationMindset.scales).map(([k, v]) => (
                  <div key={k} className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500">{k}</div>
                    <div className="font-bold" style={{ color: navy }}>{v}</div>
                  </div>
                ))}
              </div>
              {innovationMindset.styleTally && Object.keys(innovationMindset.styleTally).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {Object.entries(innovationMindset.styleTally).map(([k, v]) => (
                    <Tag key={k}>{k} × {v}</Tag>
                  ))}
                </div>
              )}
            </Card>
          </section>
        )}

        {/* Design Sensitivity */}
        {designSensitivity && (
          <section className="mb-10">
            <SectionTitle n="4" hint={`Design Sensitivity: ${designSensitivity.designSensitivityT}${designSensitivity.designClusterUnlocked ? " — Design Career Cluster unlocked" : ""}`}>
              Aesthetic &amp; Design Sensitivity
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {Object.entries(designSensitivity.subScales).map(([k, v]) => (
                  <div key={k} className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500">{k}</div>
                    <div className="font-bold" style={{ color: navy }}>{v}</div>
                  </div>
                ))}
              </div>
              {designSensitivity.designClusterUnlocked && (
                <Alert
                  type="success"
                  showIcon
                  className="mt-3 rounded-lg"
                  message="Design Career Cluster unlocked"
                  description="NID, NIFT and MIT-ID entrance pathways, UI/UX design, architecture, industrial design and fashion design are strongly featured in your recommendations."
                />
              )}
            </Card>
          </section>
        )}

        {/* Creative Self-Report */}
        {creativeSelfReport && (
          <section className="mb-10">
            <SectionTitle n="5" hint="Your creative identity, history and confidence.">
              Creative Self-Report
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {["CreativeIdentity", "CreativeHistory", "CreativeConfidence", "Aesthetic", "DivergentDisp"].map((k) => (
                  <div key={k} className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500">{k}</div>
                    <div className="font-bold" style={{ color: navy }}>{creativeSelfReport[k]?.pct ?? 0}</div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* SJT */}
        {sjt?.competencies?.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="6" hint={`Creative decision-making under pressure: ${sjt.percentage}%`}>
              Creative &amp; Innovation Scenarios
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

        <p className="text-center text-xs text-slate-400 mt-2 max-w-2xl mx-auto">
          This report is a scientifically-informed guide, not a destiny. Creativity, innovation and
          entrepreneurial skill can all be developed with practice. For guidance use only.
        </p>
      </div>
    </div>
  );
}
