import React, { useState } from "react";
import { Button, Card, Spin, Tag } from "antd";
import {
  Heart,
  Scale,
  MapPin,
  Wallet,
  HandHeart,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import useAxiosInstance from "../../../lib/useAxiosInstance";
import DISHA8Assessment from "./DISHA8Assessment";

const navy = "#004877";
const accent = "#3BBEE8";

export default function DISHA8Info() {
  const axios = useAxiosInstance();
  const navigate = useNavigate();

  const userString = localStorage.getItem("users");
  const user = userString ? JSON.parse(userString) : null;

  const [startTest, setStartTest] = useState(false);

  const { data, isLoading } = useQuery(
    ["disha8-questions"],
    async () => {
      const res = await axios.get("/api/psychometric/disha8Questions");
      return res.data;
    },
    { enabled: startTest }
  );

  const { data: resultData, isLoading: resultLoading } = useQuery(
    ["disha8-result"],
    async () => {
      const res = await axios.get(`/api/psychometric/disha8Result/${user?._id}`);
      return res.data;
    }
  );

  const hasResult = resultData?.data;

  const pillars = [
    { icon: <Heart size={34} />, title: "Core Life Values", desc: "10 fundamental life values — Family, Achievement, Security, Autonomy, Seva, Status, Adventure, Spirituality, Intellectual Growth, Dharma — ranked in your own priority order." },
    { icon: <Scale size={34} />, title: "Work-Life Balance", desc: "How much career intensity you can genuinely sustain, and what family time, elder care and recovery actually require of your career." },
    { icon: <MapPin size={34} />, title: "Lifestyle & Life Design", desc: "Where you see yourself living, what income means to you, joint vs nuclear family preference, and international mobility — captured explicitly, not assumed." },
    { icon: <Wallet size={34} />, title: "Money Mindset", desc: "Your real relationship with financial security vs growth — and the family financial responsibilities that shape your career choices." },
    { icon: <HandHeart size={34} />, title: "Purpose Orientation", desc: "Seva (service) vs personal success vs both together — no orientation is 'better'. This names what genuinely drives you, honestly." },
    { icon: <Sparkles size={34} />, title: "Future Life Projection", desc: "A guided reflection on your life at 35, 40 and 60 — including the single most important question in the entire DISHA battery." },
  ];

  if (startTest) {
    if (isLoading || !data?.data) {
      return (
        <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
          <Spin size="large" />
          <p className="text-slate-500">Preparing your DISHA Test 8…</p>
        </div>
      );
    }
    return <DISHA8Assessment data={data.data} onClose={() => setStartTest(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-6xl mx-auto px-4 py-14">
        {/* Hero */}
        <section className="rounded-3xl p-8 md:p-12 mb-14 text-white" style={{ background: `linear-gradient(135deg, ${navy}, #013257)` }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Tag color="cyan" className="mb-3 !text-xs !font-semibold">TEST 8 OF 8 — CAPSTONE</Tag>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3">DISHA Test 8</h1>
              <p className="text-lg opacity-90 mb-2">
                Long-term Life Values, Work-Life Balance, Lifestyle Goals &amp; Career Satisfaction Predictors
              </p>
              <p className="opacity-80 mb-6 leading-relaxed">
                Tests 1–7 measured who you are. Test 8 asks the question they've all been building
                toward: what kind of life do you actually want to live? This is the most important —
                and most frequently skipped — question in Indian career counselling.
              </p>
              <ul className="space-y-1.5 mb-8 opacity-90">
                <li>• 6 dimensions + 5 future-life reflections + 10 real Indian dilemmas</li>
                <li>• Classes 9–12 · reflective, not diagnostic — no right answers</li>
                <li>• 25–35 minutes · no time limit on the reflective sections</li>
                <li>• Life Values Profile + Satisfaction Prediction Index + Career Regret risk check</li>
              </ul>
              <div className="flex gap-3 flex-wrap">
                <Button size="large" onClick={() => setStartTest(true)} style={{ background: accent, border: "none", color: navy, fontWeight: 700 }}>
                  Start Assessment
                </Button>
                {resultLoading ? (
                  <Spin />
                ) : (
                  hasResult && (
                    <Button size="large" ghost onClick={() => navigate("/psychometric-disha8-result", { state: hasResult })}>
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
          <h2 className="text-3xl font-bold text-center mb-2 text-slate-900">What Test 8 Measures</h2>
          <p className="text-center text-slate-500 mb-10 max-w-2xl mx-auto">
            Not your abilities or preferences — the actual life you want, and whether your career direction will produce it.
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
              <h3 className="font-bold text-lg text-slate-800 mb-2">Answer honestly — not how you think you should</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Several questions in this test have no "better" answer — wanting financial security is
                just as valid as wanting adventure; wanting to serve society is just as valid as wanting
                personal achievement. The one open-ended question near the end — about what would make
                your life at 40 feel genuinely good, or genuinely wasted — is the single most important
                item in the entire DISHA battery. Take your time with it. It is shared only with you and
                your counsellor.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center rounded-2xl p-10" style={{ background: navy }}>
          <h2 className="text-3xl font-bold text-white mb-3">Discover what kind of life you actually want</h2>
          <p className="text-white/80 mb-6">Find a quiet space — this test rewards genuine reflection, not speed.</p>
          <Button size="large" onClick={() => setStartTest(true)} style={{ background: accent, border: "none", color: navy, fontWeight: 700 }}>
            Begin Test 8
          </Button>
        </section>
      </main>
    </div>
  );
}
