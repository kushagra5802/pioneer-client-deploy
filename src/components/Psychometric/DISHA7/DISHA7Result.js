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
    case "Exceptional Leader": return "#16a34a";
    case "Strong Leader": return "#22c55e";
    case "Emerging Leader": return "#eab308";
    case "Collaborative Contributor": return "#f97316";
    default: return "#6366f1";
  }
};
const bandTag = (band) =>
  band === "Exceptional Leader" || band === "Strong Leader" ? "green" : band === "Emerging Leader" ? "gold" : "blue";

const LPI_NARRATIVE = {
  "Exceptional Leader": "Your leadership potential is in the top tier of Indian students your age. You combine vision, influence, decision-making under pressure, and a strong ethical foundation — the full profile of someone who will lead organisations and communities meaningfully.",
  "Strong Leader": "Your leadership profile is well above average. You have genuine capacity to lead — your strongest dimensions and specific career matches are detailed below.",
  "Emerging Leader": "You have solid leadership foundations — your profile suggests you are developing the skills and confidence to lead effectively. Your plan includes specific activities to accelerate this development.",
  "Collaborative Contributor": "Your profile strongly suggests you add greatest value as a high-quality team member or specialist contributor. This is not a limitation — India's most important careers do not all require leading others. Your specific strengths are detailed below.",
  "Individual Achiever": "Your profile is oriented toward individual achievement and depth of expertise. Careers that allow you to be excellent at one thing rather than managing many people will suit you best.",
};

const POWER_DESC = {
  "High Authority Leader": "You are comfortable holding and exercising authority within institutions. IAS/IPS/IFS, Army/Navy/Air Force officer, hospital director, corporate C-suite and political leadership are highlighted — best combined with strong ethical leadership.",
  "Institutional Leader": "You lead well within established structures. PSU management, government departments, bank management, and school/college administration fit your profile.",
  "Entrepreneurial Leader": "You want authority but dislike rigid hierarchy — you lead best where power comes from contribution, not title. Startup founder, family-business leadership and creative agency head are strongly featured.",
  "Collaborative Leader": "You lead through people and relationships rather than formal authority. NGO/social sector, teaching leadership, HR, community leadership and consulting fit your profile.",
  "Expert Contributor": "You lead through expertise, not formal authority — and that is a genuine strength. Research, technical specialisation, clinical medicine, architecture and writing are where you will do your best work.",
};

const STABILITY_NOTE = {
  Stable: "You do your best work in stable, predictable environments where you can build deep expertise over time.",
  Dynamic: "You thrive in fast-changing environments with new challenges and shifting priorities.",
  Balanced: "You are comfortable across both stable and rapidly-changing environments.",
};

const ORG_LABEL = {
  Corporate: "Corporate / MNC", Govt: "Government / PSU", Startup: "Startup",
  NGO: "NGO / Social Sector", FamilyBiz: "Family Business",
};

const ROLE_LABEL = {
  Coordinator: "Coordinator", Implementer: "Implementer", Shaper: "Shaper",
  MonitorEvaluator: "Monitor-Evaluator", Teamworker: "Teamworker",
  ResourceInvestigator: "Resource Investigator", Plant: "Plant (Innovator)", Specialist: "Specialist",
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

export default function DISHA7Result() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const result = state?.result;
  const profile = state?.profile;

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <Empty description="No DISHA Test 7 report found" />
        <Button type="primary" style={{ background: navy }} onClick={() => navigate("/psychometric")}>Back to Tests</Button>
      </div>
    );
  }

  const { leadership, management, teamwork, power, ethical, workCulture, leadershipFc, sjt, lpi, style, validity, criticalFlags, summary } = result;

  const lpiBars = leadership
    ? [
        { dim: "Vision", T: leadership.subScales.Vision.tScore },
        { dim: "Influence", T: leadership.subScales.Influence.tScore },
        { dim: "Decision-Making", T: leadership.decisionMakingT },
        { dim: "Motivation of Others", T: leadership.motivOthersT },
        { dim: "Management", T: management?.managementT },
      ]
    : [];

  const orgBars = (workCulture?.fit || []).map((f) => ({ org: ORG_LABEL[f.archetype] || f.archetype, pct: f.pct }));
  const roleBars = (teamwork?.roleScores || []).filter((r) => r.score > 0).slice(0, 6).map((r) => ({ role: ROLE_LABEL[r.role] || r.role, score: r.score }));

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="text-white px-6 md:px-10 py-8" style={{ background: `linear-gradient(135deg, ${navy}, #013257)` }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <Tag color="cyan" className="!text-xs !font-semibold mb-2">DISHA TEST 7 REPORT</Tag>
            <h1 className="text-3xl font-extrabold">Your Leadership Profile</h1>
            <p className="opacity-80 mt-1 text-sm">
              {profile?.currentClass ? `${profile.currentClass} · ` : ""}Leadership Potential, Management Aptitude, Teamwork &amp; Organisational Fit
            </p>
          </div>
          <Button ghost onClick={() => navigate("/psychometric")}>Back to Tests</Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-6">
        {/* Validity / critical notes */}
        {validity && !validity.clean && (
          <Alert
            className="mb-4 rounded-xl"
            type="info"
            showIcon
            message="A note on your responses"
            description={
              validity.leadershipInflationFlag
                ? "Your leadership self-ratings were uniformly very high. This can reflect genuine strength, but your counsellor may ask you to describe 2–3 specific leadership experiences in detail to ground the profile."
                : "A few of your answers were slightly inconsistent with one another. This does not invalidate your report; your counsellor may explore some areas in more depth."
            }
          />
        )}
        {criticalFlags?.highPowerLowEthics && (
          <Alert
            className="mb-4 rounded-xl"
            type="warning"
            showIcon
            message="A development focus worth discussing"
            description="Your profile shows a strong drive for authority and influence. Developing a strong ethical-leadership foundation alongside it is a specific, valuable part of your growth plan — and something worth exploring with a counsellor. Great authority is only powerful when it rests on trust."
          />
        )}
        {ethical && ethical.civilServiceBand !== "High" && (
          <Alert
            className="mb-6 rounded-xl"
            type="info"
            showIcon
            message="Ethical leadership — a development area"
            description="For civil services (IAS/IPS/IFS), ethical conduct is both a selection criterion and a daily requirement. Strengthening your ethical-leadership foundation would meaningfully improve your fit for these careers — your plan includes specific activities for this."
          />
        )}

        {/* LPI overview */}
        <Card className="rounded-2xl shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-center">
            <div className="text-center">
              <Progress
                type="dashboard"
                percent={summary?.overall ?? 0}
                strokeColor={bandColor(lpi?.band)}
                format={() => (
                  <span>
                    <span className="text-3xl font-bold" style={{ color: navy }}>{lpi?.compositeT ?? "—"}</span>
                    <div className="text-xs text-slate-400">Leadership Index</div>
                  </span>
                )}
              />
              {lpi?.band && <Tag color={bandTag(lpi.band)} className="mt-2">{lpi.band}</Tag>}
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">{lpi?.band}</h3>
              <p className="text-sm text-slate-600">{LPI_NARRATIVE[lpi?.band]}</p>
              {lpiBars.length > 0 && (
                <div className="h-60 mt-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={lpiBars} layout="vertical" margin={{ left: 20 }}>
                      <XAxis type="number" domain={[20, 80]} tick={{ fontSize: 10 }} />
                      <YAxis type="category" dataKey="dim" width={120} tick={{ fontSize: 11 }} />
                      <RTooltip />
                      <Bar dataKey="T" radius={[0, 6, 6, 0]} fill={accent} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Leadership Style */}
        {style?.style && (
          <section className="mb-10">
            <SectionTitle n="1" hint={style.roleModel ? `Indian role model for this style: ${style.roleModel}` : null}>
              Your Leadership Style
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <Tag color="cyan" className="!text-sm !font-semibold !py-1 !px-3">{style.style}</Tag>
                {leadershipFc?.leadVsFollow && <Tag>{leadershipFc.leadVsFollow === "Lead" ? "Prefers to lead" : leadershipFc.leadVsFollow === "Follow" ? "Prefers to contribute" : "Balanced lead/contribute"}</Tag>}
                {leadershipFc?.resultsVsPeople && <Tag>{leadershipFc.resultsVsPeople}-oriented</Tag>}
              </div>
              <p className="text-sm text-slate-600">{style.indiaExpression}</p>
            </Card>
          </section>
        )}

        {/* Power Orientation */}
        {power?.profile && (
          <section className="mb-10">
            <SectionTitle n="2" hint={`Power Drive ${power.powerDriveT} · Hierarchy Comfort ${power.hierarchyComfortT} · Flat-org Preference ${power.flatPrefT}`}>
              Authority &amp; Power Orientation
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <Alert type="info" showIcon className="rounded-lg" message={power.profile} description={POWER_DESC[power.profile]} />
            </Card>
          </section>
        )}

        {/* Team Role Profile */}
        {roleBars.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="3" hint={`Primary role: ${ROLE_LABEL[teamwork.primaryRole] || teamwork.primaryRole}${teamwork.secondaryRole ? ` · Secondary: ${ROLE_LABEL[teamwork.secondaryRole] || teamwork.secondaryRole}` : ""}`}>
              Team Role Profile (Belbin-adapted)
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roleBars} layout="vertical" margin={{ left: 40 }}>
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="role" width={130} tick={{ fontSize: 11 }} />
                    <RTooltip />
                    <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                      {roleBars.map((e, i) => (
                        <Cell key={i} fill={i === 0 ? accent : navy} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </section>
        )}

        {/* Organisational Fit */}
        {orgBars.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="4" hint={`Best-fit environment: ${ORG_LABEL[workCulture.topFit] || workCulture.topFit}. ${STABILITY_NOTE[workCulture.stabilityOrientation] || ""}`}>
              Organisational Fit
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={orgBars} layout="vertical" margin={{ left: 40 }}>
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="org" width={130} tick={{ fontSize: 11 }} />
                    <RTooltip />
                    <Bar dataKey="pct" radius={[0, 6, 6, 0]}>
                      {orgBars.map((e, i) => (
                        <Cell key={i} fill={i === 0 ? accent : navy} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-slate-400 mt-2">Your career recommendations across the DISHA battery are filtered and ranked to highlight careers in your preferred environment.</p>
            </Card>
          </section>
        )}

        {/* Ethical Leadership */}
        {ethical && (
          <section className="mb-10">
            <SectionTitle n="5" hint={`Ethical Leadership Index: ${ethical.ethicalT} (${ethical.civilServiceBand}) · Social Responsibility ${ethical.socialResponsibilityT}`}>
              Ethical Leadership &amp; Social Responsibility
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {Object.entries(ethical.subScales).map(([k, v]) => (
                  <div key={k} className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500">{k}</div>
                    <div className="font-bold" style={{ color: navy }}>{v.pct}</div>
                  </div>
                ))}
              </div>
              {ethical.civilServiceBand === "High" && (
                <Alert
                  type="success"
                  showIcon
                  className="mt-3 rounded-lg"
                  message="A genuine differentiator"
                  description="Your strong ethical foundation is a core requirement for civil services, public-sector management, and community leadership — careers where ethical conduct is both a requirement and a professional advantage."
                />
              )}
            </Card>
          </section>
        )}

        {/* Management sub-scales */}
        {management?.subScales && (
          <section className="mb-10">
            <SectionTitle n="6" hint={`Management Aptitude: ${management.managementT}`}>
              Management &amp; Organisational Skills
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(management.subScales).map(([k, v]) => (
                  <div key={k} className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500">{k}</div>
                    <div className="font-bold" style={{ color: navy }}>{v.pct}</div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* SJT */}
        {sjt?.competencies?.length > 0 && (
          <section className="mb-10">
            <SectionTitle n="7" hint={`Leadership judgment in real Indian scenarios: ${sjt.percentage}%`}>
              Leadership &amp; Management Scenarios
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
          This report is a scientifically-informed guide, not a destiny. Leadership, management and
          ethical judgment can all be developed with practice and real responsibility. For guidance use only.
        </p>
      </div>
    </div>
  );
}
