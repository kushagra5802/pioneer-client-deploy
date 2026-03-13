import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Progress, Tag } from "antd";
import riasecMap from "./riasec_interest_code_mapping.json";

export default function RiasecResult() {

  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="p-10 text-center">
        <h2>No Result Data Found</h2>
        <Button type="primary" onClick={() => navigate("/")}>
          Go Home
        </Button>
      </div>
    );
  }

  const { totalScore, dimensionScores, interestCode } = state;
  const dimensionNames = {
    R: "Realistic",
    I: "Investigative",
    A: "Artistic",
    S: "Social",
    E: "Enterprising",
    C: "Conventional"
  };

  const maxScorePerDimension = 7;

  const getColor = (score) => {
    const percentage = (score / maxScorePerDimension) * 100;

    if (percentage >= 70) return "#22c55e";
    if (percentage >= 40) return "#facc15";
    return "#ef4444";
  };

  /* =========================
     GET INTEREST CODE DETAILS
  ========================= */

  const codeInfo = riasecMap[interestCode];

  return (

    <div className="min-h-screen bg-gray-50 p-10">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          RIASEC Career Interest Result
        </h1>

        {/* Holland Code */}

        <Card className="mb-8 text-center">

          <h2 className="text-xl font-semibold mb-4">
            Your Holland Code
          </h2>

          <Tag color="blue" className="text-3xl px-6 py-2">
            {interestCode}
          </Tag>

          <p className="text-gray-600 mt-4">
            This code represents your dominant career interests.
          </p>
        </Card>


        {/* Code Explanation */}

        {codeInfo && (
          <Card className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {codeInfo.title}
            </h2>

            <p className="mb-4 text-gray-700">
              {codeInfo.summary}
            </p>

            <h3 className="font-semibold mt-4 mb-2">
              Work Style
            </h3>

            <p className="text-gray-700 mb-4">
              {codeInfo.work_style}
            </p>

            <h3 className="font-semibold mt-4 mb-2">
              Student Guidance
            </h3>

            <p className="text-gray-700">
              {codeInfo.student_guidance}
            </p>
          </Card>
        )}


        {/* Overall Score */}

        <Card className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Overall Interest Score
          </h2>

          <p>
            <strong>Total Score:</strong> {totalScore} / 42
          </p>

          <Progress percent={Math.round((totalScore / 42) * 100)} />
        </Card>


        {/* Dimension Breakdown */}

        <h2 className="text-xl font-semibold mb-6">
          Interest Dimensions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {Object.entries(dimensionScores).map(([key, score]) => {

            const percentage = (score / maxScorePerDimension) * 100;

            return (

              <Card key={key}>

                <h3 className="font-semibold mb-2">
                  {dimensionNames[key]}
                </h3>

                <p>
                  Score: {score} / {maxScorePerDimension}
                </p>

                <Progress
                  percent={Math.round(percentage)}
                  strokeColor={getColor(score)}
                />

              </Card>

            );

          })}

        </div>


        {/* Navigation */}

        <div className="text-center mt-10">

          <Button
            type="primary"
            className="bg-slate-800"
            onClick={() => navigate("/psychometric")}
          >
            Back to Psychometric
          </Button>

        </div>

      </div>

    </div>

  );

}