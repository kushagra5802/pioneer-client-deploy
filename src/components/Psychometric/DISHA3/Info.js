import React, { useState } from "react";
import { Button, Card, Spin, Tag } from "antd";
import {
  BarChart3,
  BookOpen,
  Lightbulb,
  Clock4,
  ShieldAlert,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import useAxiosInstance from "../../../lib/useAxiosInstance";
import DISHA3Assessment from "./DISHA3Assessment";

const navy = "#004877";
const accent = "#3BBEE8";

export default function DISHA3Info() {
  const axios = useAxiosInstance();
  const navigate = useNavigate();

  const userString = localStorage.getItem("users");
  const user = userString ? JSON.parse(userString) : null;

  const [startTest, setStartTest] = useState(false);

  const { data, isLoading } = useQuery(
    ["disha3-questions"],
    async () => {
      const res = await axios.get("/api/psychometric/disha3Questions");
      return res.data;
    },
    { enabled: startTest }
  );

  const { data: resultData, isLoading: resultLoading } = useQuery(
    ["disha3-result"],
    async () => {
      const res = await axios.get(`/api/psychometric/disha3Result/${user?._id}`);
      return res.data;
    }
  );

  const hasResult = resultData?.data;

  const pillars = [
    { icon: <BarChart3 size={34} />, title: "Academic Marks Analysis", desc: "Enter your real marks across terms — we compute Subject Strength Index, trends and your overall academic profile." },
    { icon: <BookOpen size={34} />, title: "Subject Strengths & Identity", desc: "Comfort vs enjoyment per subject, cross-checked with your marks to surface hidden interests and confidence gaps." },
    { icon: <Lightbulb size={34} />, title: "Learning Styles (VARK)", desc: "How you learn best — with India-specific adaptations for coaching, group study and rote vs conceptual learning." },
    { icon: <Clock4 size={34} />, title: "Study Habits & Motivation", desc: "Consistency, planning, focus, academic resilience and what truly drives your studying." },
    { icon: <ShieldAlert size={34} />, title: "Exam Preparedness & Stress", desc: "Preparation quality, test anxiety and test-taking strategy — feeding entrance-exam probability estimates." },
    { icon: <ScrollText size={34} />, title: "Situational Judgment", desc: "10 real Indian academic dilemmas measuring how you respond to marks pressure and setbacks." },
  ];

  if (startTest) {
    if (isLoading || !data?.data) {
      return (
        <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
          <Spin size="large" />
          <p className="text-slate-500">Preparing your DISHA Test 3…</p>
        </div>
      );
    }
    return <DISHA3Assessment data={data.data} onClose={() => setStartTest(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-6xl mx-auto px-4 py-14">
        {/* Hero */}
        <section className="rounded-3xl p-8 md:p-12 mb-14 text-white" style={{ background: `linear-gradient(135deg, ${navy}, #013257)` }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Tag color="cyan" className="mb-3 !text-xs !font-semibold">TEST 3 OF 8</Tag>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3">DISHA Test 3</h1>
              <p className="text-lg opacity-90 mb-2">
                Academic Performance, Subject Strengths, Learning Styles &amp; Study Habits
              </p>
              <p className="opacity-80 mb-6 leading-relaxed">
                Test 1 measures what you <strong>can</strong> do; Test 2, what you <strong>want</strong>.
                Test 3 measures what you are actually <strong>performing</strong> at — and why. It grounds
                every recommendation in your real marks, the most decisive factor in India's
                marks-gated pathways.
              </p>
              <ul className="space-y-1.5 mb-8 opacity-90">
                <li>• 6 sections + marks module · India-localised</li>
                <li>• Subject Strength Index, trends &amp; stream recommendation</li>
                <li>• 35–50 minutes · auto-saves as you go</li>
                <li>• Entrance-exam probability estimates (JEE / NEET / CLAT / CUET)</li>
              </ul>
              <div className="flex gap-3 flex-wrap">
                <Button size="large" onClick={() => setStartTest(true)} style={{ background: accent, border: "none", color: navy, fontWeight: 700 }}>
                  Start Assessment
                </Button>
                {resultLoading ? (
                  <Spin />
                ) : (
                  hasResult && (
                    <Button size="large" ghost onClick={() => navigate("/psychometric-disha3-result", { state: hasResult })}>
                      View My Report
                    </Button>
                  )
                )}
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="text-[120px] leading-none">📊</div>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="mb-14">
          <h2 className="text-3xl font-bold text-center mb-2 text-slate-900">What Test 3 Measures</h2>
          <p className="text-center text-slate-500 mb-10 max-w-2xl mx-auto">
            Your marks plus how you study — turned into a realistic academic profile and stream fit.
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
              <h3 className="font-bold text-lg text-slate-800 mb-2">Your marks stay private</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Enter your actual marks — accurate figures give you the most useful report. Weak or
                declining marks are never treated as a character flaw; they are specific, solvable
                patterns. Your marks data is the most sensitive part of this battery and is used only
                to personalise your own recommendations — never shared with schools, teachers, or
                other students.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center rounded-2xl p-10" style={{ background: navy }}>
          <h2 className="text-3xl font-bold text-white mb-3">Ground your plan in reality</h2>
          <p className="text-white/80 mb-6">Keep a recent mark sheet handy — you can save and return.</p>
          <Button size="large" onClick={() => setStartTest(true)} style={{ background: accent, border: "none", color: navy, fontWeight: 700 }}>
            Begin Test 3
          </Button>
        </section>
      </main>
    </div>
  );
}
