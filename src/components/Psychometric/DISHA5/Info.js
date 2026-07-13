import React, { useState } from "react";
import { Button, Card, Spin, Tag } from "antd";
import {
  Compass,
  Sprout,
  GitBranch,
  Rocket,
  Dices,
  Telescope,
  ShieldCheck,
} from "lucide-react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import useAxiosInstance from "../../../lib/useAxiosInstance";
import DISHA5Assessment from "./DISHA5Assessment";

const navy = "#004877";
const accent = "#3BBEE8";

export default function DISHA5Info() {
  const axios = useAxiosInstance();
  const navigate = useNavigate();

  const userString = localStorage.getItem("users");
  const user = userString ? JSON.parse(userString) : null;

  const [startTest, setStartTest] = useState(false);

  const { data, isLoading } = useQuery(
    ["disha5-questions"],
    async () => {
      const res = await axios.get("/api/psychometric/disha5Questions");
      return res.data;
    },
    { enabled: startTest }
  );

  const { data: resultData, isLoading: resultLoading } = useQuery(
    ["disha5-result"],
    async () => {
      const res = await axios.get(`/api/psychometric/disha5Result/${user?._id}`);
      return res.data;
    }
  );

  const hasResult = resultData?.data;

  const pillars = [
    { icon: <Compass size={34} />, title: "Career Adaptability (4Cs)", desc: "Concern, Control, Curiosity and Confidence — Savickas's model of how ready you are to navigate change." },
    { icon: <Sprout size={34} />, title: "Growth vs Fixed Mindset", desc: "Whether you see ability as developable or fixed — one of the strongest predictors of long-term success." },
    { icon: <GitBranch size={34} />, title: "Decision-Making Style", desc: "How you make big choices — analytical, intuitive, dependent or avoidant — and how it shapes career fit." },
    { icon: <Rocket size={34} />, title: "Learning Agility", desc: "How fast and eagerly you pick up new skills — more predictive than the skills you already have." },
    { icon: <Dices size={34} />, title: "Ambiguity & Risk Tolerance", desc: "Your comfort with uncertainty — the key differentiator between startup-suited and structure-suited paths." },
    { icon: <Telescope size={34} />, title: "Future Orientation & AI-Readiness", desc: "How far ahead you plan and how prepared you are for India's rapidly changing 2030 career landscape." },
  ];

  if (startTest) {
    if (isLoading || !data?.data) {
      return (
        <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
          <Spin size="large" />
          <p className="text-slate-500">Preparing your DISHA Test 5…</p>
        </div>
      );
    }
    return <DISHA5Assessment data={data.data} onClose={() => setStartTest(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-6xl mx-auto px-4 py-14">
        {/* Hero */}
        <section className="rounded-3xl p-8 md:p-12 mb-14 text-white" style={{ background: `linear-gradient(135deg, ${navy}, #013257)` }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Tag color="cyan" className="mb-3 !text-xs !font-semibold">TEST 5 OF 8</Tag>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3">DISHA Test 5</h1>
              <p className="text-lg opacity-90 mb-2">
                Career Adaptability, Decision-Making Style, Growth Mindset, Learning Agility &amp; Future-Readiness
              </p>
              <p className="opacity-80 mb-6 leading-relaxed">
                Tests 1–4 measure who you are today. Test 5 measures who you will need to become
                tomorrow. In an economy where AI is reshaping careers and the average professional
                will change paths 3–5 times, adaptability is the meta-skill that keeps every other
                skill valuable.
              </p>
              <ul className="space-y-1.5 mb-8 opacity-90">
                <li>• 6 dimensions + 15 real career scenarios</li>
                <li>• Classes 9–12 · India-2030 career landscape</li>
                <li>• 25–35 minutes · auto-saves as you go</li>
                <li>• Future-Readiness Index &amp; Career Adaptability quadrant</li>
              </ul>
              <div className="flex gap-3 flex-wrap">
                <Button size="large" onClick={() => setStartTest(true)} style={{ background: accent, border: "none", color: navy, fontWeight: 700 }}>
                  Start Assessment
                </Button>
                {resultLoading ? (
                  <Spin />
                ) : (
                  hasResult && (
                    <Button size="large" ghost onClick={() => navigate("/psychometric-disha5-result", { state: hasResult })}>
                      View My Report
                    </Button>
                  )
                )}
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="text-[120px] leading-none">🚀</div>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="mb-14">
          <h2 className="text-3xl font-bold text-center mb-2 text-slate-900">What Test 5 Measures</h2>
          <p className="text-center text-slate-500 mb-10 max-w-2xl mx-auto">
            How well-equipped you are to navigate a career landscape none of us can fully predict.
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
              <h3 className="font-bold text-lg text-slate-800 mb-2">No style is better than another</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Answer for what is genuinely true for you today, not what seems most ambitious.
                Preferring stability over risk, or valuing family input in decisions, are real strengths
                in the Indian context — not weaknesses. This report helps you find careers that fit your
                real adaptability profile, and shows where a little development could open more doors.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center rounded-2xl p-10" style={{ background: navy }}>
          <h2 className="text-3xl font-bold text-white mb-3">Prepare for the careers of 2030</h2>
          <p className="text-white/80 mb-6">Answer honestly for who you are today — you can save and return.</p>
          <Button size="large" onClick={() => setStartTest(true)} style={{ background: accent, border: "none", color: navy, fontWeight: 700 }}>
            Begin Test 5
          </Button>
        </section>
      </main>
    </div>
  );
}
