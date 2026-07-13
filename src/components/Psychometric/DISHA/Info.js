import React, { useState } from "react";
import { Button, Card, Spin, Tag } from "antd";
import {
  Brain,
  GraduationCap,
  Compass,
  HeartHandshake,
  ScrollText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import useAxiosInstance from "../../../lib/useAxiosInstance";
import DISHAAssessment from "./DISHAAssessment";

const navy = "#004877";
const accent = "#3BBEE8";

export default function DISHAInfo() {
  const axios = useAxiosInstance();
  const navigate = useNavigate();

  const userString = localStorage.getItem("users");
  const user = userString ? JSON.parse(userString) : null;

  const [startTest, setStartTest] = useState(false);

  const { data, isLoading } = useQuery(
    ["disha-questions"],
    async () => {
      const res = await axios.get("/api/psychometric/dishaQuestions");
      return res.data;
    },
    { enabled: startTest }
  );

  const { data: resultData, isLoading: resultLoading } = useQuery(
    ["disha-result"],
    async () => {
      const res = await axios.get(`/api/psychometric/dishaResult/${user?._id}`);
      return res.data;
    }
  );

  const hasResult = resultData?.data;

  const pillars = [
    { icon: <GraduationCap size={34} />, title: "Academic Marks", desc: "Your real subject performance and trends — weighted 25–30% of your career match." },
    { icon: <Brain size={34} />, title: "Aptitude (10 dimensions)", desc: "Verbal, numerical, logical, spatial, abstract, clerical, mechanical, memory & creativity." },
    { icon: <Sparkles size={34} />, title: "Personality (OCEAN)", desc: "Big Five traits with India-specific facets like exam-grit and joint-family comfort." },
    { icon: <Compass size={34} />, title: "Interests (RIASEC)", desc: "Your Holland Code from forced-choice and rating items, India-localised throughout." },
    { icon: <HeartHandshake size={34} />, title: "Work Values & Context", desc: "What you want from work, plus the family and contextual factors that shape your path." },
    { icon: <ScrollText size={34} />, title: "Situational Judgment", desc: "15 real Indian dilemmas measuring resilience, assertiveness and decision-making." },
  ];

  if (startTest) {
    if (isLoading || !data?.data) {
      return (
        <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
          <Spin size="large" />
          <p className="text-slate-500">Preparing your DISHA assessment…</p>
        </div>
      );
    }
    return <DISHAAssessment data={data.data} onClose={() => setStartTest(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-6xl mx-auto px-4 py-14">
        {/* Hero */}
        <section className="rounded-3xl p-8 md:p-12 mb-14 text-white" style={{ background: `linear-gradient(135deg, ${navy}, #013257)` }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Tag color="cyan" className="mb-3 !text-xs !font-semibold">FLAGSHIP · TEST 1 OF 8</Tag>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3">DISHA</h1>
              <p className="text-lg opacity-90 mb-2">
                Differential Intelligence &amp; Scholastic Horizon Assessment
              </p>
              <p className="opacity-80 mb-6 leading-relaxed">
                The only Indian assessment that combines your <strong>actual academic marks</strong> with
                aptitude, personality, interests, values and real-world judgment — to map careers that
                truly fit you.
              </p>
              <ul className="space-y-1.5 mb-8 opacity-90">
                <li>• 11 modules · ~185 scored items</li>
                <li>• Classes 9–12 · India-localised throughout</li>
                <li>• 65–80 minutes · auto-saves as you go</li>
                <li>• Combined Career Recommendation Engine (CCRE)</li>
              </ul>
              <div className="flex gap-3 flex-wrap">
                <Button size="large" onClick={() => setStartTest(true)} style={{ background: accent, border: "none", color: navy, fontWeight: 700 }}>
                  Start Assessment
                </Button>
                {resultLoading ? (
                  <Spin />
                ) : (
                  hasResult && (
                    <Button size="large" ghost onClick={() => navigate("/psychometric-disha-result", { state: hasResult })}>
                      View My Report
                    </Button>
                  )
                )}
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="text-[120px] leading-none">🧭</div>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="mb-14">
          <h2 className="text-3xl font-bold text-center mb-2 text-slate-900">What DISHA Measures</h2>
          <p className="text-center text-slate-500 mb-10 max-w-2xl mx-auto">
            Six pillars feed one Career Fit Score — your marks count as much as your aptitude.
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
              <h3 className="font-bold text-lg text-slate-800 mb-2">A guide, not a verdict</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                This is not an IQ test and there are no perfect answers — answer what is true for you,
                not what seems impressive. Your effort, passion and choices always outweigh any score.
                DISHA is for guidance only and is never used for admissions, scholarship, or employment
                decisions. Some context answers are shared only with your counsellor.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center rounded-2xl p-10" style={{ background: navy }}>
          <h2 className="text-3xl font-bold text-white mb-3">Ready to discover your direction?</h2>
          <p className="text-white/80 mb-6">Set aside about an hour in a quiet space — you can save and return.</p>
          <Button size="large" onClick={() => setStartTest(true)} style={{ background: accent, border: "none", color: navy, fontWeight: 700 }}>
            Begin DISHA
          </Button>
        </section>
      </main>
    </div>
  );
}
