import React, { useState } from "react";
import { Button, Card, Spin, Tag } from "antd";
import {
  Compass,
  Briefcase,
  HeartHandshake,
  Flame,
  Building2,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import useAxiosInstance from "../../../lib/useAxiosInstance";
import DISHA2Assessment from "./DISHA2Assessment";

const navy = "#004877";
const accent = "#3BBEE8";

export default function DISHA2Info() {
  const axios = useAxiosInstance();
  const navigate = useNavigate();

  const userString = localStorage.getItem("users");
  const user = userString ? JSON.parse(userString) : null;

  const [startTest, setStartTest] = useState(false);

  const { data, isLoading } = useQuery(
    ["disha2-questions"],
    async () => {
      const res = await axios.get("/api/psychometric/disha2Questions");
      return res.data;
    },
    { enabled: startTest }
  );

  const { data: resultData, isLoading: resultLoading } = useQuery(
    ["disha2-result"],
    async () => {
      const res = await axios.get(`/api/psychometric/disha2Result/${user?._id}`);
      return res.data;
    }
  );

  const hasResult = resultData?.data;

  const pillars = [
    { icon: <Compass size={34} />, title: "Activity Preferences (RIASEC)", desc: "90 concrete activities map your Holland Code — the deepest interest measure available for Indian students." },
    { icon: <Briefcase size={34} />, title: "Occupational Appeal", desc: "Rate 60 India-specific careers on how appealing they sound — a reality check on your interests." },
    { icon: <HeartHandshake size={34} />, title: "Work Values", desc: "What you want from a career — security, prestige, autonomy, family duty, societal contribution and more." },
    { icon: <Flame size={34} />, title: "Career Motivations", desc: "WHY you want what you want — distinguishing genuine passion from family and social expectation." },
    { icon: <Building2 size={34} />, title: "Work Environment", desc: "Sector, location and work-style preferences that filter recommendations to fit your real life." },
    { icon: <ScrollText size={34} />, title: "Situational Judgment", desc: "15 real Indian career dilemmas measuring values-in-action when interests, family and money collide." },
  ];

  if (startTest) {
    if (isLoading || !data?.data) {
      return (
        <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
          <Spin size="large" />
          <p className="text-slate-500">Preparing your DISHA Test 2…</p>
        </div>
      );
    }
    return <DISHA2Assessment data={data.data} onClose={() => setStartTest(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-6xl mx-auto px-4 py-14">
        {/* Hero */}
        <section className="rounded-3xl p-8 md:p-12 mb-14 text-white" style={{ background: `linear-gradient(135deg, ${navy}, #013257)` }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Tag color="cyan" className="mb-3 !text-xs !font-semibold">TEST 2 OF 8</Tag>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3">DISHA Test 2</h1>
              <p className="text-lg opacity-90 mb-2">
                Interests, Work Values, Career Motivations &amp; Occupational Preferences
              </p>
              <p className="opacity-80 mb-6 leading-relaxed">
                Test 1 measures what you <strong>can</strong> do. Test 2 answers a different
                question — even if you can do something, will you <strong>want</strong> to do it
                and sustain effort over a lifetime?
              </p>
              <ul className="space-y-1.5 mb-8 opacity-90">
                <li>• 6 modules · ~185 items</li>
                <li>• Classes 9–12 · India-localised throughout</li>
                <li>• 30–45 minutes · auto-saves as you go</li>
                <li>• Deepens your RIASEC Holland Code from Test 1</li>
              </ul>
              <div className="flex gap-3 flex-wrap">
                <Button size="large" onClick={() => setStartTest(true)} style={{ background: accent, border: "none", color: navy, fontWeight: 700 }}>
                  Start Assessment
                </Button>
                {resultLoading ? (
                  <Spin />
                ) : (
                  hasResult && (
                    <Button size="large" ghost onClick={() => navigate("/psychometric-disha2-result", { state: hasResult })}>
                      View My Report
                    </Button>
                  )
                )}
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="text-[120px] leading-none">🎯</div>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="mb-14">
          <h2 className="text-3xl font-bold text-center mb-2 text-slate-900">What Test 2 Measures</h2>
          <p className="text-center text-slate-500 mb-10 max-w-2xl mx-auto">
            Six modules build a complete map of what you enjoy, value, and find meaningful.
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
              <h3 className="font-bold text-lg text-slate-800 mb-2">There are no right answers</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Rate what is genuinely true for you — not what your family would approve of or what
                seems impressive. If your motivations are shaped by family expectations, that is very
                common in Indian families and reflects love and responsibility, not weakness. This
                report is a guide for reflection and counselling, never a verdict.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center rounded-2xl p-10" style={{ background: navy }}>
          <h2 className="text-3xl font-bold text-white mb-3">Discover what truly drives you</h2>
          <p className="text-white/80 mb-6">Set aside about 40 minutes in a quiet space — you can save and return.</p>
          <Button size="large" onClick={() => setStartTest(true)} style={{ background: accent, border: "none", color: navy, fontWeight: 700 }}>
            Begin Test 2
          </Button>
        </section>
      </main>
    </div>
  );
}
