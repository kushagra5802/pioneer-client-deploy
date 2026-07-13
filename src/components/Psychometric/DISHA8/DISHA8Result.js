import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Progress, Tag, Empty, Alert, Timeline } from "antd";
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

const VALUE_LABEL = {
  Family: "Family & Relationships", Achievement: "Achievement & Mastery", Security: "Security & Stability",
  Autonomy: "Autonomy & Freedom", Seva: "Seva (Service)", Status: "Status & Recognition",
  Adventure: "Adventure & Novelty", Spirituality: "Spirituality", Intellectual: "Intellectual Growth",
  Dharma: "Dharma (Family Duty)",
};

const PURPOSE_DESC = {
  Integration: "You are drawn to careers that deliver both personal achievement AND genuine social value — the rarest and most integrated profile. Careers like social entrepreneurship, impact-focused leadership, and institution-building (in the spirit of Verghese Kurien or Narayana Murthy's philanthropic work) fit you well.",
  "Seva-Oriented": "Your career motivation leans strongly toward contribution and service. Careers in public service, NGOs, education, healthcare and community development will be your most sustaining paths — not because they're 'more virtuous', but because they're what will genuinely satisfy you.",
  "Personal-Success-Oriented": "Your career motivation leans strongly toward personal achievement, mastery and recognition — and that is completely valid, not something to apologise for. Careers in corporate leadership, entrepreneurship, finance and competitive professional fields will be your most sustaining paths.",
  Balanced: "You hold both service and personal-achievement motivations without a strong lean either way — you have real flexibility in the kind of career culture that will suit you.",
};

const WLB_DESC = {
  HighIntensity: "You are genuinely energised by demanding, high-stakes work — a career requiring intense hours and high commitment will likely suit you better than a slower-paced one.",
  Balance: "You genuinely prioritise a well-integrated life over career intensity — this is a real preference, not a lack of ambition, and it should shape which roles and organisations you target.",
  Mixed: "You show real pull toward both career intensity and life balance — this is common and worth exploring further rather than assuming one will simply win out.",
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

export default function DISHA8Result() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const result = state?.result;
  const profile = state?.profile;

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <Empty description="No DISHA Test 8 report found" />
        <Button type="primary" style={{ background: navy }} onClick={() => navigate("/psychometric")}>Back to Tests</Button>
      </div>
    );
  }

  const { lifeValues, wlb, lifestyle, money, purpose, spi, futureProjection, sjt, validity, regretRisk, summary } = result;

  const valuesBars = lifeValues
    ? Object.entries(lifeValues.dims).map(([k, v]) => ({ value: VALUE_LABEL[k] || k, T: v.tScore, key: k }))
        .sort((a, b) => b.T - a.T)
    : [];

  const regretColor = regretRisk?.level === "Low" ? "green" : regretRisk?.level === "Moderate" ? "gold" : "red";

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="text-white px-6 md:px-10 py-8" style={{ background: `linear-gradient(135deg, ${navy}, #013257)` }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <Tag color="cyan" className="!text-xs !font-semibold mb-2">DISHA TEST 8 REPORT — CAPSTONE</Tag>
            <h1 className="text-3xl font-extrabold">Your Life Values &amp; Lifestyle Profile</h1>
            <p className="opacity-80 mt-1 text-sm">
              {profile?.currentClass ? `${profile.currentClass} · ` : ""}What kind of life do you actually want to live?
            </p>
          </div>
          <Button ghost onClick={() => navigate("/psychometric")}>Back to Tests</Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-6">
        {validity?.idealisationNote && (
          <Alert
            className="mb-4 rounded-xl"
            type="info"
            showIcon
            message="A note on your responses"
            description={validity.idealisationNote}
          />
        )}
        {validity?.tensions?.length > 0 && (
          <Alert
            className="mb-6 rounded-xl"
            type="info"
            showIcon
            message="Real tensions worth exploring"
            description={
              <ul className="list-disc pl-4 space-y-1 mt-1">
                {validity.tensions.map((t) => <li key={t.pattern} className="text-sm">{t.note}</li>)}
              </ul>
            }
          />
        )}

        {/* Top values */}
        <Card className="rounded-2xl shadow-sm mb-8">
          <h3 className="font-bold text-lg text-slate-800 mb-1">Your Top 5 Life Values</h3>
          <p className="text-sm text-slate-500 mb-4">These values are the primary moderator on every career recommendation across your DISHA reports.</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {(summary?.top5Values || []).map((v, i) => (
              <Tag key={v} color={i < 3 ? "blue" : "default"} className="!text-sm !py-1 !px-3">
                #{i + 1} {VALUE_LABEL[v] || v}
              </Tag>
            ))}
          </div>
          {valuesBars.length > 0 && (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={valuesBars} layout="vertical" margin={{ left: 30 }}>
                  <XAxis type="number" domain={[20, 80]} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="value" width={140} tick={{ fontSize: 11 }} />
                  <RTooltip />
                  <Bar dataKey="T" radius={[0, 6, 6, 0]}>
                    {valuesBars.map((e, i) => (
                      <Cell key={i} fill={(summary?.top3Values || []).includes(e.key) ? accent : navy} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Purpose Orientation */}
        {purpose?.profile && (
          <section className="mb-10">
            <SectionTitle n="1" hint={`Seva ${purpose.sevaT} · Personal Success ${purpose.personalSuccessT} · Integration ${purpose.integrationT}`}>
              Purpose Orientation
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <Alert type="info" showIcon className="rounded-lg" message={purpose.profile} description={PURPOSE_DESC[purpose.profile]} />
            </Card>
          </section>
        )}

        {/* WLB */}
        {wlb?.orientation && (
          <section className="mb-10">
            <SectionTitle n="2" hint={`High-Intensity Comfort ${wlb.highIntensityT} · Balance Preference ${wlb.balanceT} · Family-Career Integration ${wlb.familyCareerIntegrationT}`}>
              Work-Life Balance Profile
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <Alert type="info" showIcon className="rounded-lg" message={`${wlb.orientation} Orientation`} description={WLB_DESC[wlb.orientation]} />
            </Card>
          </section>
        )}

        {/* Lifestyle */}
        {lifestyle && (
          <section className="mb-10">
            <SectionTitle n="3" hint="Where and how you see yourself living.">
              Lifestyle &amp; Life Design
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-slate-500">Geographic Preference</div>
                  <div className="font-bold text-sm" style={{ color: navy }}>{lifestyle.topGeoPreference || "—"}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-slate-500">Family Structure</div>
                  <div className="font-bold text-sm" style={{ color: navy }}>{lifestyle.familyStructurePreference || "—"}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-slate-500">International Mobility</div>
                  <div className="font-bold text-sm" style={{ color: navy }}>{lifestyle.intlMobilityT}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-slate-500">Career Flexibility Need</div>
                  <div className="font-bold text-sm" style={{ color: navy }}>{lifestyle.careerFlexT}</div>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Money */}
        {money?.orientation && (
          <section className="mb-10">
            <SectionTitle n="4" hint={`Money Security ${money.moneySecurityT} · Money Growth ${money.moneyGrowthT} · Family Financial Responsibility ${money.familyFinRespT}`}>
              Money Mindset
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <Tag color="cyan" className="!text-sm !py-1 !px-3">{money.orientation}-Oriented</Tag>
              <p className="text-sm text-slate-600 mt-3">
                {money.orientation === "Security"
                  ? "A guaranteed, predictable income matters more to you than a higher but variable ceiling — this points toward stable government, PSU, or established-organisation roles over high-risk entrepreneurial paths."
                  : money.orientation === "Growth"
                  ? "You are comfortable with variable, back-loaded income in exchange for a higher long-term ceiling — this points toward entrepreneurial, sales, equity-linked, or startup-style compensation structures."
                  : "You hold both security and growth orientations without a strong lean — a range of compensation structures could work for you."}
              </p>
            </Card>
          </section>
        )}

        {/* SPI */}
        {spi?.top3Needs && (
          <section className="mb-10">
            <SectionTitle n="5" hint="Your top 3 psychological needs — used to check whether your top career choices will actually satisfy you long-term.">
              Satisfaction Prediction Index (SPI)
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="flex flex-wrap gap-2 mb-4">
                {spi.top3Needs.map((n) => <Tag key={n} color="blue">{n.replace("Need", " Need")}</Tag>)}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {["IntrinsicNeed", "GrowthNeed", "AutonomyNeed", "RelatednessNeed", "PurposeNeed"].map((k) => (
                  <div key={k} className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500">{k.replace("Need", "")}</div>
                    <div className="font-bold" style={{ color: navy }}>{spi[k]}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-3">A career that scores well on aptitude but doesn't meet your top SPI needs is likely to feel unsatisfying, regardless of fit on paper.</p>
            </Card>
          </section>
        )}

        {/* Career Regret Risk */}
        {regretRisk && (
          <section className="mb-10">
            <SectionTitle n="6">Career Regret Prevention Check</SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <Tag color={regretColor} className="!text-sm !py-1 !px-3">{regretRisk.level} Regret Risk</Tag>
              </div>
              {regretRisk.factors.length > 0 ? (
                <div className="space-y-2">
                  {regretRisk.factors.map((f) => (
                    <Alert key={f.factor} type="warning" showIcon className="rounded-lg" message={f.note} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600">No significant regret-risk factors were detected from your responses — your career direction and life values appear well-aligned so far.</p>
              )}
            </Card>
          </section>
        )}

        {/* Future Life Vision */}
        {futureProjection?.nonNegotiable && (
          <section className="mb-10">
            <SectionTitle n="7" hint="The single most important item in the entire DISHA battery — shared with you and your counsellor only.">
              Your Non-Negotiable Life Design
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <Timeline
                items={[
                  {
                    color: "green",
                    children: (
                      <div>
                        <div className="text-xs font-semibold text-slate-500 mb-1">A genuinely good life at 40 would mean…</div>
                        <div className="text-slate-800">{futureProjection.nonNegotiable.goodLife || "—"}</div>
                      </div>
                    ),
                  },
                  {
                    color: "red",
                    children: (
                      <div>
                        <div className="text-xs font-semibold text-slate-500 mb-1">A wasted life at 40 would mean…</div>
                        <div className="text-slate-800">{futureProjection.nonNegotiable.wastedLife || "—"}</div>
                      </div>
                    ),
                  },
                ]}
              />
            </Card>
          </section>
        )}

        {/* SJT alignment */}
        {sjt?.alignmentPct !== undefined && (
          <section className="mb-10">
            <SectionTitle n="8" hint={`Values-in-action alignment across 10 real Indian life dilemmas: ${sjt.alignmentPct}%`}>
              Life Design Dilemmas
            </SectionTitle>
            <Card className="rounded-2xl shadow-sm">
              <Progress percent={sjt.alignmentPct} strokeColor={accent} />
              <p className="text-xs text-slate-400 mt-3">
                This measures how closely your actual choices in realistic dilemmas matched your own stated top values — not a universal "correct" answer key.
              </p>
            </Card>
          </section>
        )}

        <p className="text-center text-xs text-slate-400 mt-2 max-w-2xl mx-auto">
          This report is a scientifically-informed guide, not a destiny. What you value can evolve —
          revisit this test periodically. For guidance use only.
        </p>
      </div>
    </div>
  );
}
