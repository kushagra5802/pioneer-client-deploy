import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Progress } from "antd";

export default function CareerResult() {

  const { state } = useLocation();
  const navigate = useNavigate();

  const result = state;

  if (!result) {
    return (
      <div className="p-10 text-center">
        <h2>No Result Data Found</h2>
        <Button type="primary" onClick={() => navigate("/")}>
          Go Home
        </Button>
      </div>
    );
  }

  const formatDimensionName = (name) => {
    const map = {
      careerConcern: "Career Concern",
      careerCuriosity: "Career Curiosity",
      careerConfidence: "Career Confidence",
      careerConsultation: "Career Consultation"
    };

    return map[name] || name;
  };

  const getColor = (level) => {
    switch (level) {
      case "High":
        return "#22c55e"; 
      case "Moderate":
        return "#facc15"; 
      case "Low":
        return "#ef4444"; 
      default:
        return "#1677ff"; 
    }
  };

  return (

    <div className="min-h-screen bg-gray-50 p-10">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          Career Maturity Assessment Result
        </h1>

        {/* Overall Summary */}

        <Card className="mb-8">

          <h2 className="text-xl font-semibold mb-4">
            Overall Career Readiness
          </h2>

          <p><strong>Total Score:</strong> {result.totalScore} / 24</p>
          <p><strong>Percentage:</strong> {result.percentage.toFixed(2)}%</p>
          <p><strong>Level:</strong> {result.level}</p>
          <p><strong>Attempts:</strong> {result.attemptNumber}</p>
          <p><strong>Completion Time:</strong> {result.completionTimeSeconds}s</p>

          <Progress
            percent={Math.round(result.percentage)}
            strokeColor={getColor(result.level)}
          />

        </Card>


        {/* Dimension Breakdown */}

        <h2 className="text-xl font-semibold mb-6">
          Career Dimension Breakdown
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {result.dimensions.map((dim, index) => (

            <Card key={index}>

              <h3 className="font-semibold mb-2">
                {formatDimensionName(dim.name)}
              </h3>

              <p>
                Score: {dim.score} / {dim.maxScore}
              </p>

              <p>
                Level: {dim.level}
              </p>

              <Progress
                percent={Math.round(dim.percentage)}
                strokeColor={getColor(dim.level)}
              />

            </Card>

          ))}

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