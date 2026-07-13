import React, { useState } from "react";
import { Button, Card, Spin, Tag } from "antd";
import {
  Crown,
  ClipboardList,
  Users,
  Landmark,
  Scale,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import useAxiosInstance from "../../../lib/useAxiosInstance";
import DISHA7Assessment from "./DISHA7Assessment";

const navy = "#004877";
const accent = "#3BBEE8";

export default function DISHA7Info() {
  const axios = useAxiosInstance();
  const navigate = useNavigate();

  const userString = localStorage.getItem("users");
  const user = userString ? JSON.parse(userString) : null;

  const [startTest, setStartTest] = useState(false);

  const { data, isLoading } = useQuery(
    ["disha7-questions"],
    async () => {
      const res = await axios.get("/api/psychometric/disha7Questions");
      return res.data;
    },
    { enabled: startTest }
  );

  const { data: resultData, isLoading: resultLoading } = useQuery(
    ["disha7-result"],
    async () => {
      const res = await axios.get(`/api/psychometric/disha7Result/${user?._id}`);
      return res.data;
    }
  );

  const hasResult = resultData?.data;

  const pillars = [
    { icon: <Crown size={34} />, title: "Leadership Potential Index", desc: "Vision, influence, decision-making under pressure and motivation of others — combined into a single Leadership Potential Index benchmarked to Indian Class 9–12 students." },
    { icon: <ClipboardList size={34} />, title: "Management Aptitude", desc: "Planning, delegation, coordination and execution — the practical ability to make things work through others, distinct from leadership vision." },
    { icon: <Users size={34} />, title: "Team Role Profile", desc: "A Belbin-adapted map of the 8 roles you naturally play in a team — Coordinator, Shaper, Implementer, Plant, Specialist and more." },
    { icon: <Landmark size={34} />, title: "Authority & Power Orientation", desc: "How comfortable you are holding and exercising authority — distinguishing IAS/Army fit from startup fit from technical-specialist fit." },
    { icon: <Scale size={34} />, title: "Ethical Leadership", desc: "The most India-critical dimension: integrity, accountability and social responsibility — and a genuine differentiator for civil services." },
    { icon: <Building2 size={34} />, title: "Organisational Fit", desc: "Where you will thrive: Corporate, Government/PSU, Startup, NGO/Social Sector, or Family Business — each has a distinct leadership culture." },
  ];

  if (startTest) {
    if (isLoading || !data?.data) {
      return (
        <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
          <Spin size="large" />
          <p className="text-slate-500">Preparing your DISHA Test 7…</p>
        </div>
      );
    }
    return <DISHA7Assessment data={data.data} onClose={() => setStartTest(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-6xl mx-auto px-4 py-14">
        {/* Hero */}
        <section className="rounded-3xl p-8 md:p-12 mb-14 text-white" style={{ background: `linear-gradient(135deg, ${navy}, #013257)` }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Tag color="cyan" className="mb-3 !text-xs !font-semibold">TEST 7 OF 8</Tag>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3">DISHA Test 7</h1>
              <p className="text-lg opacity-90 mb-2">
                Leadership Potential, Management Aptitude, Teamwork Skills &amp; Organisational Fit
              </p>
              <p className="opacity-80 mb-6 leading-relaxed">
                India's most celebrated careers — IAS officer, IIM CEO, Army officer, hospital
                director, family-business leader, startup founder — each demand a different flavour of
                leadership. This test finds where your current profile fits, and values every style:
                authoritative, servant, entrepreneurial, collaborative and quiet expert leadership.
              </p>
              <ul className="space-y-1.5 mb-8 opacity-90">
                <li>• 7 leadership dimensions + 15 real Indian scenarios</li>
                <li>• Classes 9–12 · India-contextualised throughout</li>
                <li>• 25–40 minutes · auto-saves as you go</li>
                <li>• Leadership Potential Index + leadership style + org-culture fit</li>
              </ul>
              <div className="flex gap-3 flex-wrap">
                <Button size="large" onClick={() => setStartTest(true)} style={{ background: accent, border: "none", color: navy, fontWeight: 700 }}>
                  Start Assessment
                </Button>
                {resultLoading ? (
                  <Spin />
                ) : (
                  hasResult && (
                    <Button size="large" ghost onClick={() => navigate("/psychometric-disha7-result", { state: hasResult })}>
                      View My Report
                    </Button>
                  )
                )}
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="text-[120px] leading-none">👑</div>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="mb-14">
          <h2 className="text-3xl font-bold text-center mb-2 text-slate-900">What Test 7 Measures</h2>
          <p className="text-center text-slate-500 mb-10 max-w-2xl mx-auto">
            Not whether you will become a great leader — but the kind of leadership role that will bring out your best.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((p, i) => (
              <Card key={i} hoverable className="shadow-sm rounded-2xl">
                <div className="mb-3" style={{ color: navy }}>{p.icon}</div>
                <h3 className="font-bold text-lg text-slate-800 mb-1">{p.title}</h3>
                <p className="text-slate-500 text-sm">{p.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Trust / ethics */}
        <section className="rounded-2xl bg-white border border-slate-200 p-8 mb-14">
          <div className="flex items-start gap-4">
            <ShieldCheck size={36} style={{ color: accent }} className="shrink-0" />
            <div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">Every leadership style is valued</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Preferring to be a deep individual contributor rather than a manager is NOT a weakness —
                some of India's most important careers (research, clinical medicine, deep technical work)
                reward mastery, not people-management. Answer honestly: this test maps you to the roles
                where you'll genuinely thrive, not to a single ideal of "leader".
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center rounded-2xl p-10" style={{ background: navy }}>
          <h2 className="text-3xl font-bold text-white mb-3">Discover your Leadership Potential Index</h2>
          <p className="text-white/80 mb-6">Answer honestly — you can save and return anytime.</p>
          <Button size="large" onClick={() => setStartTest(true)} style={{ background: accent, border: "none", color: navy, fontWeight: 700 }}>
            Begin Test 7
          </Button>
        </section>
      </main>
    </div>
  );
}
