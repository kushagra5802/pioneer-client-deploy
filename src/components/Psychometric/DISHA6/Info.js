import React, { useState } from "react";
import { Button, Card, Spin, Tag } from "antd";
import {
  Lightbulb,
  Palette,
  Rocket,
  Puzzle,
  Brush,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import useAxiosInstance from "../../../lib/useAxiosInstance";
import DISHA6Assessment from "./DISHA6Assessment";

const navy = "#004877";
const accent = "#3BBEE8";

export default function DISHA6Info() {
  const axios = useAxiosInstance();
  const navigate = useNavigate();

  const userString = localStorage.getItem("users");
  const user = userString ? JSON.parse(userString) : null;

  const [startTest, setStartTest] = useState(false);

  const { data, isLoading } = useQuery(
    ["disha6-questions"],
    async () => {
      const res = await axios.get("/api/psychometric/disha6Questions");
      return res.data;
    },
    { enabled: startTest }
  );

  const { data: resultData, isLoading: resultLoading } = useQuery(
    ["disha6-result"],
    async () => {
      const res = await axios.get(`/api/psychometric/disha6Result/${user?._id}`);
      return res.data;
    }
  );

  const hasResult = resultData?.data;

  const pillars = [
    { icon: <Lightbulb size={34} />, title: "Creative Thinking (TTCT-adapted)", desc: "8 open-ended tasks measuring fluency, flexibility, originality and elaboration — India-contextualised, with no 'textbook answer'." },
    { icon: <Palette size={34} />, title: "Creative Identity & Self-Report", desc: "Whether you see yourself as creative, your track record of independent creative output, and how exam culture may have suppressed it." },
    { icon: <Puzzle size={34} />, title: "Innovation Mindset", desc: "Problem-finding, experimentation, systems thinking, and your natural preference for incremental vs radical ideas." },
    { icon: <Rocket size={34} />, title: "Entrepreneurial Readiness Index", desc: "Opportunity recognition, risk tolerance, execution drive and business resilience — are you Founder-Ready, Intrapreneur, or Stability Preferrer?" },
    { icon: <Brush size={34} />, title: "Design Sensitivity", desc: "Aesthetic sensitivity and design thinking, including your connection to Indian design traditions alongside contemporary digital design." },
    { icon: <ScrollText size={34} />, title: "Creative & Entrepreneurial Scenarios", desc: "15 real Indian dilemmas — hackathons, family business, startup pitches — revealing how you actually make creative decisions under pressure." },
  ];

  if (startTest) {
    if (isLoading || !data?.data) {
      return (
        <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
          <Spin size="large" />
          <p className="text-slate-500">Preparing your DISHA Test 6…</p>
        </div>
      );
    }
    return <DISHA6Assessment data={data.data} onClose={() => setStartTest(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-6xl mx-auto px-4 py-14">
        {/* Hero */}
        <section className="rounded-3xl p-8 md:p-12 mb-14 text-white" style={{ background: `linear-gradient(135deg, ${navy}, #013257)` }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Tag color="cyan" className="mb-3 !text-xs !font-semibold">TEST 6 OF 8</Tag>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3">DISHA Test 6</h1>
              <p className="text-lg opacity-90 mb-2">
                Creative Thinking, Innovation Mindset, Entrepreneurial Potential &amp; Problem-Solving Style
              </p>
              <p className="opacity-80 mb-6 leading-relaxed">
                India has produced Sundar Pichai, Falguni Nayar and Byju Raveendran — proof that
                creativity and rote-learning education can coexist. This test finds out where you sit
                on that spectrum, and which specific career pathways will channel it best.
              </p>
              <ul className="space-y-1.5 mb-8 opacity-90">
                <li>• 8 open-ended creative tasks + 5 dimensions + 15 scenarios</li>
                <li>• Classes 9–12 · India-contextualised throughout</li>
                <li>• 30–45 minutes · auto-saves as you go</li>
                <li>• Creative Quotient (CQ) profile + Entrepreneurial Readiness Index</li>
              </ul>
              <div className="flex gap-3 flex-wrap">
                <Button size="large" onClick={() => setStartTest(true)} style={{ background: accent, border: "none", color: navy, fontWeight: 700 }}>
                  Start Assessment
                </Button>
                {resultLoading ? (
                  <Spin />
                ) : (
                  hasResult && (
                    <Button size="large" ghost onClick={() => navigate("/psychometric-disha6-result", { state: hasResult })}>
                      View My Report
                    </Button>
                  )
                )}
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="text-[120px] leading-none">💡</div>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="mb-14">
          <h2 className="text-3xl font-bold text-center mb-2 text-slate-900">What Test 6 Measures</h2>
          <p className="text-center text-slate-500 mb-10 max-w-2xl mx-auto">
            Not just whether you're creative — but the TYPE of creativity you have, and where it fits.
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
              <h3 className="font-bold text-lg text-slate-800 mb-2">Write quickly — don't filter your ideas</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                For the open-ended tasks, there are no right or wrong answers — unusual, creative or
                unexpected ideas are especially valued. If years of exam-focused study have made
                generating ideas on demand feel hard, that is common and does not mean you lack
                creative potential — your report accounts for this directly.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center rounded-2xl p-10" style={{ background: navy }}>
          <h2 className="text-3xl font-bold text-white mb-3">Discover your Creative Quotient</h2>
          <p className="text-white/80 mb-6">Find a quiet space with a timer — you can save and return.</p>
          <Button size="large" onClick={() => setStartTest(true)} style={{ background: accent, border: "none", color: navy, fontWeight: 700 }}>
            Begin Test 6
          </Button>
        </section>
      </main>
    </div>
  );
}
