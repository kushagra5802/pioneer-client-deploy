import React, { useState } from "react";
import { Button, Card, Spin } from "antd";
import {
  Brain,
  BookOpen,
  Target,
  Pencil,
  Search,
  Zap,
  PenLine,
  Calculator,
  FlaskConical,
  Users,
  Clock,
  Rocket,
} from "lucide-react";
import { useQuery } from "react-query";
import useAxiosInstance from "../../../lib/useAxiosInstance";
import Assessment from "./Assessment";
import { useNavigate } from "react-router-dom";

const { Meta } = Card;

export default function Info() {

    const axios = useAxiosInstance();
    const navigate = useNavigate();
    const userString = localStorage.getItem("users");
    const user = JSON.parse(userString);
    const [startTest, setStartTest] = useState(false);

  const features = [
    {
      title: "Learning Efficacy",
      description: "Ability to acquire and understand new concepts",
      icon: <Brain size={40} />,
    },
    {
      title: "Reading Comprehension",
      description: "Competence in understanding written materials",
      icon: <BookOpen size={40} />,
    },
    {
      title: "Memory & Retention",
      description: "Capacity to retain and recall information",
      icon: <Target size={40} />,
    },
    {
      title: "Exam Skills",
      description: "Performance under examination conditions",
      icon: <Pencil size={40} />,
    },
    {
      title: "Problem Solving",
      description: "Ability to address complex challenges",
      icon: <Search size={40} />,
    },
    {
      title: "Critical Thinking",
      description: "Analytical and evaluative thinking skills",
      icon: <Zap size={40} />,
    },
    {
      title: "Writing Skills",
      description: "Proficiency in written communication",
      icon: <PenLine size={40} />,
    },
    {
      title: "Mathematical Reasoning",
      description: "Confidence with quantitative concepts",
      icon: <Calculator size={40} />,
    },
    {
      title: "Research Skills",
      description: "Ability to conduct and organize research",
      icon: <FlaskConical size={40} />,
    },
    {
      title: "Collaboration",
      description: "Effectiveness in group settings",
      icon: <Users size={40} />,
    },
    {
      title: "Time Management",
      description: "Organization and prioritization skills",
      icon: <Clock size={40} />,
    },
    {
      title: "Motivation",
      description: "Drive and perseverance in academics",
      icon: <Rocket size={40} />,
    },
  ];

  const { data, isLoading } = useQuery(
    ["academic-questions"],
    async () => {
      const res = await axios.get("/api/psychometric/academicQuestions");
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
    ["academic-result"],
    async () => {
      const res = await axios.get(`/api/psychometric/academicResult/${user?._id}`);
      return res.data;
    }
  );

  const hasResult = resultData?.data;

  if (startTest) {
    return (
      <Assessment
        questions={data?.data || []}
        loading={isLoading}
        onClose={() => setStartTest(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-6xl mx-auto px-4 py-16">

        {/* Hero Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Understand Your Academic Potential
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Academic self-efficacy is your belief in your ability to succeed in academic tasks.
              This comprehensive assessment helps you identify strengths and areas for growth.
            </p>

            <ul className="space-y-2 mb-6 text-gray-700">
              <li>• 40 scientifically-designed questions</li>
              <li>• 12 dimension analysis</li>
              <li>• Personalized recommendations</li>
              <li>• 15-20 minutes to complete</li>
            </ul>

            <div className="flex gap-4">
                <Button className="bg-slate-800" type="primary" size="large" onClick={() => setStartTest(true)}>
                  Start Assessment
                </Button>
                {/* VIEW RESULT BUTTON */}
                {resultLoading ? (
                    <Spin />
                    ) : hasResult && (
                    <Button
                        size="large"
                        onClick={() =>
                        navigate("/psychometric-academic-result", {
                            state: hasResult
                        })
                        }
                    >
                        View Result
                    </Button>
                )}
            </div>

          </div>

          <div className="bg-blue-100 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-600">Comprehensive Academic Assessment Platform</p>
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">
            What You'll Assess
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                hoverable
                className="text-center shadow-sm"
              >
                <div className="flex justify-center mb-4 text-blue-600">
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

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              "Enter Your Details",
              "Answer Questions",
              "Get Scored",
              "View Results",
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
            Ready to Assess Your Academic Confidence?
          </h2>
          <p className="mb-6 text-lg opacity-90">
            Take the assessment now and gain valuable insights into your strengths.
          </p>
          <Button size="large" ghost>
            Start the Assessment
          </Button>
        </section>

      </main>
    </div>
  );
}