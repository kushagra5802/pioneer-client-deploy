import React, { useState } from "react";
import { Button, Card, Spin } from "antd";
import {
  Target,
  Search,
  ShieldCheck,
  Users
} from "lucide-react";
import { useQuery } from "react-query";
import useAxiosInstance from "../../../lib/useAxiosInstance";
import CareerAssessment from "./CareerAssessment";
import { useNavigate } from "react-router-dom";

const { Meta } = Card;

export default function CareerInfo() {

  const axios = useAxiosInstance();
  const navigate = useNavigate();

  const userString = localStorage.getItem("users");
  const user = JSON.parse(userString);

  const [startTest, setStartTest] = useState(false);

  const features = [
    {
      title: "Career Concern",
      description:
        "Awareness of the importance of planning for your future career.",
      icon: <Target size={40} />,
    },
    {
      title: "Career Curiosity",
      description:
        "Exploring different careers and understanding the world of work.",
      icon: <Search size={40} />,
    },
    {
      title: "Career Confidence",
      description:
        "Belief in your ability to make effective career decisions.",
      icon: <ShieldCheck size={40} />,
    },
    {
      title: "Career Consultation",
      description:
        "Willingness to seek advice and discuss career decisions with others.",
      icon: <Users size={40} />,
    },
  ];

  /* ===============================
     FETCH QUESTIONS
  =============================== */

  const { data, isLoading } = useQuery(
    ["career-questions"],
    async () => {
      const res = await axios.get("/api/psychometric/careerQuestions");
      return res.data;
    },
    {
      enabled: startTest,
    }
  );

  /* ===============================
     FETCH EXISTING RESULT
  =============================== */

  const {
    data: resultData,
    isLoading: resultLoading,
  } = useQuery(
    ["career-result"],
    async () => {
      const res = await axios.get(`/api/psychometric/careerResult/${user?._id}`);
      return res.data;
    }
  );

  const hasResult = resultData?.data;

  if (startTest) {
    return (
      <CareerAssessment
        questions={data?.data || []}
        loading={isLoading}
        onClose={() => setStartTest(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-6xl mx-auto px-4 py-16">

        {/* HERO */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">

          <div>

            <h2 className="text-3xl font-bold mb-4">
              Understand Your Career Readiness
            </h2>

            <p className="text-gray-600 text-lg mb-6">
              The Career Maturity Inventory helps you understand how prepared you are
              to make thoughtful and informed career decisions. It evaluates your
              awareness, exploration, confidence, and consultation habits when planning
              your future career.
            </p>

            <ul className="space-y-2 mb-6 text-gray-700">
              <li>• 24 scientifically designed questions</li>
              <li>• 4 career readiness dimensions</li>
              <li>• Personalized insights and recommendations</li>
              <li>• 10–15 minutes to complete</li>
            </ul>

            <div className="flex gap-4">

              <Button
                className="bg-slate-800"
                type="primary"
                size="large"
                onClick={() => setStartTest(true)}
              >
                Start Assessment
              </Button>

              {resultLoading ? (
                <Spin />
              ) : (
                hasResult && (
                  <Button
                    size="large"
                    onClick={() =>
                      navigate("/psychometric-career-result", {
                        state: hasResult,
                      })
                    }
                  >
                    View Result
                  </Button>
                )
              )}

            </div>

          </div>

          <div className="bg-green-100 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-600">
              Career Readiness & Planning Assessment
            </p>
          </div>

        </section>

        {/* FEATURES */}

        <section className="mb-16">

          <h2 className="text-3xl font-bold text-center mb-10">
            What You'll Assess
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {features.map((feature, index) => (
              <Card key={index} hoverable className="text-center shadow-sm">

                <div className="flex justify-center mb-4 text-green-600">
                  {feature.icon}
                </div>

                <Meta
                  title={feature.title}
                  description={feature.description}
                />

              </Card>
            ))}

          </div>

        </section>

        {/* HOW IT WORKS */}

        <section className="mb-16">

          <h2 className="text-3xl font-bold text-center mb-10">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            {[
              "Read Each Statement",
              "Choose Agree or Disagree",
              "Scores Are Calculated",
              "Get Career Insights",
            ].map((step, index) => (
              <Card key={index} className="text-center shadow-sm">

                <h3 className="text-xl font-bold mb-2">
                  Step {index + 1}
                </h3>

                <p className="text-gray-600">{step}</p>

              </Card>
            ))}

          </div>

        </section>

        {/* CTA */}

        <section className="bg-slate-800 text-white rounded-2xl p-12 text-center">

          <h2 className="text-3xl font-bold mb-4">
            Ready to Explore Your Career Readiness?
          </h2>

          <p className="mb-6 text-lg opacity-90">
            Take the assessment to discover how prepared you are to plan
            and make confident career decisions.
          </p>

          <Button
            size="large"
            ghost
            onClick={() => setStartTest(true)}
          >
            Start the Assessment
          </Button>

        </section>

      </main>

    </div>
  );
}