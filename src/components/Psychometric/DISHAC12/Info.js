import React, { useState } from "react";
import { Button, Card, Spin, Tag, Empty } from "antd";
import {
  BookOpen,
  Brain,
  Sparkles,
  Compass,
  Briefcase,
  HeartHandshake,
  MapPin,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import useAxiosInstance from "../../../lib/useAxiosInstance";
import DISHAC12Assessment from "./DISHAC12Assessment";

const navy = "#004877";
const accent = "#3BBEE8";

/** classGrade values in this platform look like "12th" / "Class 12" / "12". */
function isClass12(classGrade) {
  if (!classGrade) return false;
  const match = String(classGrade).match(/(\d+)/);
  return !!match && match[1] === "12";
}

export default function DISHAC12Info() {
  const axios = useAxiosInstance();
  const navigate = useNavigate();

  const userString = localStorage.getItem("users");
  const user = userString ? JSON.parse(userString) : null;
  const classGrade = user?.academicInfo?.classGrade;
  const eligible = isClass12(classGrade);

  const [startTest, setStartTest] = useState(false);

  const { data, isLoading, error } = useQuery(
    ["dishac12-questions"],
    async () => {
      const res = await axios.get("/api/psychometric/dishaC12Questions");
      return res.data;
    },
    { enabled: startTest && eligible }
  );

  const { data: resultData, isLoading: resultLoading } = useQuery(
    ["dishac12-result"],
    async () => {
      const res = await axios.get(`/api/psychometric/dishaC12Result/${user?._id}`);
      return res.data;
    },
    { enabled: eligible }
  );

  const hasResult = resultData?.data;

  const pillars = [
    { icon: <BookOpen size={34} />, title: "3-Year Academic Profile", desc: "Class 10, 11 and 12 marks together — showing your trajectory, not just a single snapshot." },
    { icon: <Brain size={34} />, title: "Extended Aptitude", desc: "20 harder Numerical, Verbal, Logical and Abstract questions calibrated for Class 12." },
    { icon: <Sparkles size={34} />, title: "Personality & Full RIASEC", desc: "Big Five personality plus a complete 30-item interest profile across all 6 Holland types." },
    { icon: <Briefcase size={34} />, title: "20 Career Titles Rated", desc: "Real Indian careers rated for genuine appeal — feeding your Top 12 recommendations." },
    { icon: <HeartHandshake size={34} />, title: "Values & Motivations", desc: "What you want from work and what genuinely drives you — including the honest intrinsic-vs-family-expectation gap." },
    { icon: <MapPin size={34} />, title: "Life Design & Context", desc: "Lifestyle, geography, income goals and your real-world constraints — personalising, never blocking, your results." },
    { icon: <Compass size={34} />, title: "Entrance Exam Probability", desc: "Uses your actual scores where available, or a marks-and-aptitude estimate where not yet attempted." },
    { icon: <ScrollText size={34} />, title: "Career Scenarios", desc: "5 real situations Class 12 students face — revealing how you navigate high-stakes decisions." },
  ];

  if (startTest && eligible) {
    if (isLoading || !data?.data) {
      return (
        <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
          <Spin size="large" />
          <p className="text-slate-500">Preparing your Career Selection Test…</p>
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
    return <DISHAC12Assessment data={data.data} onClose={() => setStartTest(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-6xl mx-auto px-4 py-14">
        {/* Hero */}
        <section className="rounded-3xl p-8 md:p-12 mb-14 text-white" style={{ background: `linear-gradient(135deg, ${navy}, #013257)` }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Tag color="cyan" className="mb-3 !text-xs !font-semibold">CLASS 12 ONLY</Tag>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Career Selection Test</h1>
              <p className="text-lg opacity-90 mb-2">Finding your career path</p>
              <p className="opacity-80 mb-6 leading-relaxed">
                A comprehensive 55–70 minute assessment for Class 12 students finalising a career,
                college, and entrance-exam path — combining 3 years of academic data, aptitude,
                personality, interests, values and real-life scenarios.
              </p>
              <ul className="space-y-1.5 mb-8 opacity-90">
                <li>• 9 sections · ~115 questions/items</li>
                <li>• Designed specifically for Class 12 students</li>
                <li>• 55–70 minutes · auto-saves as you go, can be resumed</li>
                <li>• Top 12 career recommendations + exam probability + 5-year vision</li>
              </ul>
              {!eligible ? (
                <div className="bg-white/10 border border-white/20 rounded-xl p-4 max-w-md">
                  <p className="text-sm opacity-95">
                    This assessment is designed specifically for students currently in <strong>Class 12</strong>.
                    {classGrade ? (
                      <> Your profile currently shows <strong>{classGrade}</strong> — check back once you're in
                        Class 12, or ask your school to update your class if this looks wrong.</>
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
                      <Button size="large" ghost onClick={() => navigate("/psychometric-dishac12-result", { state: hasResult })}>
                        View My Report
                      </Button>
                    )
                  )}
                </div>
              )}
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="text-[120px] leading-none">🎯</div>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="mb-14">
          <h2 className="text-3xl font-bold text-center mb-2 text-slate-900">What This Test Measures</h2>
          <p className="text-center text-slate-500 mb-10 max-w-2xl mx-auto">
            Everything that should inform your final career and college decisions — in one sitting.
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
                Answer for what is genuinely true for you — not what sounds impressive. Questions about
                your family and financial situation personalise your report; they never rule out a
                career. If there's a career you're secretly drawn to but feel you can't pursue, that
                question is seen only by your counsellor, never shared with parents without your
                written consent.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        {eligible && (
          <section className="text-center rounded-2xl p-10" style={{ background: navy }}>
            <h2 className="text-3xl font-bold text-white mb-3">Ready to finalise your path?</h2>
            <p className="text-white/80 mb-6">Keep your Class 10, 11 and 12 mark sheets handy — you can save and return.</p>
            <Button size="large" onClick={() => setStartTest(true)} style={{ background: accent, border: "none", color: navy, fontWeight: 700 }}>
              Begin the Test
            </Button>
          </section>
        )}
      </main>
    </div>
  );
}
