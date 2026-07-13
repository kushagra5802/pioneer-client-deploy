import React, { useState } from "react";
import { Button, Card, Spin, Tag, Empty } from "antd";
import {
  BookOpen,
  Brain,
  Compass,
  HeartHandshake,
  GitCompare,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import useAxiosInstance from "../../../lib/useAxiosInstance";
import DISHAC10Assessment from "./DISHAC10Assessment";

const navy = "#004877";
const accent = "#3BBEE8";

/** classGrade values in this platform look like "10th" / "Class 10" / "10". */
function isClass10(classGrade) {
  if (!classGrade) return false;
  const match = String(classGrade).match(/(\d+)/);
  return !!match && match[1] === "10";
}

export default function DISHAC10Info() {
  const axios = useAxiosInstance();
  const navigate = useNavigate();

  const userString = localStorage.getItem("users");
  const user = userString ? JSON.parse(userString) : null;
  const classGrade = user?.academicInfo?.classGrade;
  const eligible = isClass10(classGrade);

  const [startTest, setStartTest] = useState(false);

  const { data, isLoading, error } = useQuery(
    ["dishac10-questions"],
    async () => {
      const res = await axios.get("/api/psychometric/dishaC10Questions");
      return res.data;
    },
    { enabled: startTest && eligible }
  );

  const { data: resultData, isLoading: resultLoading } = useQuery(
    ["dishac10-result"],
    async () => {
      const res = await axios.get(`/api/psychometric/dishaC10Result/${user?._id}`);
      return res.data;
    },
    { enabled: eligible }
  );

  const hasResult = resultData?.data;

  const pillars = [
    { icon: <BookOpen size={34} />, title: "Academic Profile", desc: "Your marks across 6 subjects, verified by you, plus how much you genuinely enjoy each one." },
    { icon: <Brain size={34} />, title: "Aptitude Snapshot", desc: "14 timed questions across Numerical, Verbal, Logical and Abstract reasoning." },
    { icon: <Compass size={34} />, title: "Interest Profile", desc: "18 activities rated for genuine enjoyment — not what you think you should like." },
    { icon: <HeartHandshake size={34} />, title: "Values & Preferences", desc: "What actually matters to you in a future career — security, growth, impact, freedom." },
    { icon: <GitCompare size={34} />, title: "Stream Preferences", desc: "6 head-to-head choices that directly signal which stream genuinely appeals to you." },
    { icon: <ScrollText size={34} />, title: "Real-Life Scenarios", desc: "5 situations Class 10 students commonly face — how you'd navigate marks, family and identity." },
  ];

  if (startTest && eligible) {
    if (isLoading || !data?.data) {
      return (
        <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
          <Spin size="large" />
          <p className="text-slate-500">Preparing your Stream Selection Test…</p>
        </div>
      );
    }
    if (error || data?.status === false) {
      return (
        <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
          <Empty description={data?.error?.message || "Could not load this assessment"} />
          <Button onClick={() => setStartTest(false)}>Back</Button>
        </div>
      );
    }
    return <DISHAC10Assessment data={data.data} onClose={() => setStartTest(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-6xl mx-auto px-4 py-14">
        {/* Hero */}
        <section className="rounded-3xl p-8 md:p-12 mb-14 text-white" style={{ background: `linear-gradient(135deg, ${navy}, #013257)` }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Tag color="cyan" className="mb-3 !text-xs !font-semibold">CLASS 10 ONLY</Tag>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Stream Selection Test</h1>
              <p className="text-lg opacity-90 mb-2">
                Finding your stream for Class 11
              </p>
              <p className="opacity-80 mb-6 leading-relaxed">
                A focused, 35–40 minute assessment that combines your real marks, aptitude, genuine
                interests and values into a clear recommendation across Science (PCM), Science (PCB),
                Commerce + Maths, Commerce and Humanities.
              </p>
              <ul className="space-y-1.5 mb-8 opacity-90">
                <li>• 7 sections · 59 questions/items</li>
                <li>• Designed specifically for Class 10 students</li>
                <li>• 35–40 minutes · auto-saves as you go</li>
                <li>• No stream is ever "blocked" — only personalised</li>
              </ul>
              {!eligible ? (
                <div className="bg-white/10 border border-white/20 rounded-xl p-4 max-w-md">
                  <p className="text-sm opacity-95">
                    This assessment is designed specifically for students currently in <strong>Class 10</strong>.
                    {classGrade ? (
                      <> Your profile currently shows <strong>{classGrade}</strong> — check back once you're in
                        Class 10, or ask your school to update your class if this looks wrong.</>
                    ) : (
                      <> We couldn't find your class in your profile — please ask your school to update it.</>
                    )}
                  </p>
                </div>
              ) : (
                <div className="flex gap-3 flex-wrap">
                  <Button size="large" onClick={() => setStartTest(true)} style={{ background: accent, border: "none", color: navy, fontWeight: 700 }}>
                    Start Assessment
                  </Button>
                  {resultLoading ? (
                    <Spin />
                  ) : (
                    hasResult && (
                      <Button size="large" ghost onClick={() => navigate("/psychometric-dishac10-result", { state: hasResult })}>
                        View My Report
                      </Button>
                    )
                  )}
                </div>
              )}
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="text-[120px] leading-none">🧭</div>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="mb-14">
          <h2 className="text-3xl font-bold text-center mb-2 text-slate-900">What This Test Measures</h2>
          <p className="text-center text-slate-500 mb-10 max-w-2xl mx-auto">
            Everything that should inform a Class 11 stream choice — in one focused sitting.
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
              <h3 className="font-bold text-lg text-slate-800 mb-2">Honest answers, no blocked options</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Answer for yourself, not for your parents or friends. Questions about your family
                situation personalise your report — they never rule out a stream. If there's a stream
                or career you're secretly drawn to but feel you can't pursue, that question is seen only
                by your counsellor, never shared with parents without your written consent.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        {eligible && (
          <section className="text-center rounded-2xl p-10" style={{ background: navy }}>
            <h2 className="text-3xl font-bold text-white mb-3">Ready to find your stream?</h2>
            <p className="text-white/80 mb-6">Keep your recent mark sheet handy — you can save and return.</p>
            <Button size="large" onClick={() => setStartTest(true)} style={{ background: accent, border: "none", color: navy, fontWeight: 700 }}>
              Begin the Test
            </Button>
          </section>
        )}
      </main>
    </div>
  );
}
