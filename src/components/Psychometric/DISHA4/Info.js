import React, { useState } from "react";
import { Button, Card, Spin, Tag } from "antd";
import {
  Heart,
  Shield,
  TrendingUp,
  Users2,
  Globe2,
  ScrollText,
  LifeBuoy,
} from "lucide-react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import useAxiosInstance from "../../../lib/useAxiosInstance";
import DISHA4Assessment from "./DISHA4Assessment";

const navy = "#004877";
const accent = "#3BBEE8";

export default function DISHA4Info() {
  const axios = useAxiosInstance();
  const navigate = useNavigate();

  const userString = localStorage.getItem("users");
  const user = userString ? JSON.parse(userString) : null;

  const [startTest, setStartTest] = useState(false);

  const { data, isLoading } = useQuery(
    ["disha4-questions"],
    async () => {
      const res = await axios.get("/api/psychometric/disha4Questions");
      return res.data;
    },
    { enabled: startTest }
  );

  const { data: resultData, isLoading: resultLoading } = useQuery(
    ["disha4-result"],
    async () => {
      const res = await axios.get(`/api/psychometric/disha4Result/${user?._id}`);
      return res.data;
    }
  );

  const hasResult = resultData?.data;

  const pillars = [
    { icon: <Heart size={34} />, title: "Emotional Self-Awareness", desc: "Identifying, naming and understanding your own emotions — including the exam-pressure and family emotions Indian students know well." },
    { icon: <Shield size={34} />, title: "Emotional Self-Regulation", desc: "Staying composed under pressure, managing exam panic, and recovering from setbacks without spiralling." },
    { icon: <TrendingUp size={34} />, title: "Resilience, Grit & Mindset", desc: "The strongest predictor of competitive-exam success — bounce-back, sustained effort, and a growth mindset." },
    { icon: <Users2 size={34} />, title: "Empathy & Interpersonal", desc: "Reading others, building relationships, giving feedback, and the seva orientation valued across Indian careers." },
    { icon: <Globe2 size={34} />, title: "Social & Cultural Adaptability", desc: "Comfort with diversity, language switching, and geographic mobility — predicting fit for IAS postings, MNCs and more." },
    { icon: <ScrollText size={34} />, title: "Real Indian Scenarios", desc: "15 emotionally realistic dilemmas — pre-board failure, Kota hostels, family pressure — measuring EI in action." },
  ];

  if (startTest) {
    if (isLoading || !data?.data) {
      return (
        <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
          <Spin size="large" />
          <p className="text-slate-500">Preparing your DISHA Test 4…</p>
        </div>
      );
    }
    return <DISHA4Assessment data={data.data} onClose={() => setStartTest(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-6xl mx-auto px-4 py-14">
        {/* Hero */}
        <section className="rounded-3xl p-8 md:p-12 mb-14 text-white" style={{ background: `linear-gradient(135deg, ${navy}, #013257)` }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Tag color="cyan" className="mb-3 !text-xs !font-semibold">TEST 4 OF 8</Tag>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3">DISHA Test 4</h1>
              <p className="text-lg opacity-90 mb-2">
                Emotional Intelligence, Resilience, Stress Management &amp; Interpersonal Fit
              </p>
              <p className="opacity-80 mb-6 leading-relaxed">
                This test measures the dimension that most separates high-achieving students from
                high-fulfilling professionals. In India's pressure-saturated environment, emotional
                intelligence and resilience are not soft skills — they are survival skills and career
                success predictors.
              </p>
              <ul className="space-y-1.5 mb-8 opacity-90">
                <li>• 5 EI / resilience sections + 15 scenarios</li>
                <li>• Classes 9–12 · India-localised throughout</li>
                <li>• 25–40 minutes · auto-saves as you go</li>
                <li>• Does not diagnose — measures functional EI for career fit</li>
              </ul>
              <div className="flex gap-3 flex-wrap">
                <Button size="large" onClick={() => setStartTest(true)} style={{ background: accent, border: "none", color: navy, fontWeight: 700 }}>
                  Start Assessment
                </Button>
                {resultLoading ? (
                  <Spin />
                ) : (
                  hasResult && (
                    <Button size="large" ghost onClick={() => navigate("/psychometric-disha4-result", { state: hasResult })}>
                      View My Report
                    </Button>
                  )
                )}
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="text-[120px] leading-none">💚</div>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="mb-14">
          <h2 className="text-3xl font-bold text-center mb-2 text-slate-900">What Test 4 Measures</h2>
          <p className="text-center text-slate-500 mb-10 max-w-2xl mx-auto">
            How you handle emotions, pressure, setbacks and people — translated into career fit.
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

        {/* Trust / wellbeing */}
        <section className="rounded-2xl bg-white border border-slate-200 p-8 mb-14">
          <div className="flex items-start gap-4">
            <LifeBuoy size={36} style={{ color: accent }} className="shrink-0" />
            <div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">There are no right or wrong answers</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                This test asks about how you handle difficult emotions and challenging situations.
                Reaching out for support is a sign of emotional intelligence, not weakness — many of
                India's most successful people have sought help during high-pressure periods. If any
                question feels heavy, you can skip it, and wellbeing resources (iCall 9152987821,
                Vandrevala Foundation 1860-2662-345) are listed at the end for everyone.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center rounded-2xl p-10" style={{ background: navy }}>
          <h2 className="text-3xl font-bold text-white mb-3">Understand how you handle pressure</h2>
          <p className="text-white/80 mb-6">Answer honestly for what is typically true for you — you can save and return.</p>
          <Button size="large" onClick={() => setStartTest(true)} style={{ background: accent, border: "none", color: navy, fontWeight: 700 }}>
            Begin Test 4
          </Button>
        </section>
      </main>
    </div>
  );
}
