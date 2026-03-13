import React, { useState } from "react";
import { Button, Card, Spin } from "antd";
import {
  Wrench,
  Microscope,
  Palette,
  Users,
  TrendingUp,
  ClipboardList
} from "lucide-react";

import { useQuery } from "react-query";
import useAxiosInstance from "../../../lib/useAxiosInstance";
import RiasecAssessment from "./RiasecAssessment";
import { useNavigate } from "react-router-dom";

const { Meta } = Card;

export default function RiasecInfo() {

  const axios = useAxiosInstance();
  const navigate = useNavigate();

  const userString = localStorage.getItem("users");
  const user = JSON.parse(userString);

  const [startTest, setStartTest] = useState(false);

  const features = [

    {
      title: "Realistic",
      description: "Hands-on activities involving tools, machines, or physical work.",
      icon: <Wrench size={40} />,
    },

    {
      title: "Investigative",
      description: "Analytical and scientific interests focused on research and problem solving.",
      icon: <Microscope size={40} />,
    },

    {
      title: "Artistic",
      description: "Creative expression through art, design, music, or writing.",
      icon: <Palette size={40} />,
    },

    {
      title: "Social",
      description: "Helping, teaching, or supporting others through interaction.",
      icon: <Users size={40} />,
    },

    {
      title: "Enterprising",
      description: "Leadership, persuasion, and business or entrepreneurial activities.",
      icon: <TrendingUp size={40} />,
    },

    {
      title: "Conventional",
      description: "Organizing data, managing details, and working with structured tasks.",
      icon: <ClipboardList size={40} />,
    }

  ];

  const { data, isLoading } = useQuery(
    ["riasec-questions"],
    async () => {
      const res = await axios.get("/api/psychometric/riasecQuestions");
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
    ["riasec-result"],
    async () => {
      const res = await axios.get(`/api/psychometric/riasecResult/${user?._id}`);
      return res.data;
    }
  );

  const hasResult = resultData?.data;

  if (startTest) {
    return (
      <RiasecAssessment
        questions={data?.data || []}
        loading={isLoading}
        onClose={() => setStartTest(false)}
      />
    );
  }

  return (

    <div className="min-h-screen bg-gray-50">

      <main className="max-w-6xl mx-auto px-4 py-16">

        {/* Hero */}

        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">

          <div>

            <h2 className="text-3xl font-bold mb-4">
              Discover Your Career Interests
            </h2>

            <p className="text-gray-600 text-lg mb-6">
              The RIASEC test identifies your career personality type
              using Holland's theory of vocational interests.
              It helps match your interests with suitable careers.
            </p>

            <ul className="space-y-2 mb-6 text-gray-700">

              <li>• 42 scientifically designed questions</li>
              <li>• 6 interest dimensions</li>
              <li>• Personalized Holland Code</li>
              <li>• 10-15 minutes to complete</li>

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
                      navigate("/psychometric-riasec-result", {
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

          <div className="bg-blue-100 rounded-2xl p-12 text-center">

            <div className="text-6xl mb-4">🧭</div>

            <p className="text-gray-600">
              Holland Career Interest Assessment
            </p>

          </div>

        </section>

        {/* Dimensions */}

        <section className="mb-16">

          <h2 className="text-3xl font-bold text-center mb-10">
            What You'll Discover
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

        {/* Steps */}

        <section className="mb-16">

          <h2 className="text-3xl font-bold text-center mb-10">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            {[
              "Enter Your Details",
              "Answer Questions",
              "Generate Holland Code",
              "View Career Matches",
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
            Ready to Discover Your Career Interests?
          </h2>

          <p className="mb-6 text-lg opacity-90">
            Find out which careers align best with your personality.
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