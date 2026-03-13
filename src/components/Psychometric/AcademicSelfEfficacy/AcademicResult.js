import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Progress } from "antd";

export default function AcademicResult() {

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

  const getColor = (level) => {
    switch (level) {
      case "High":
        return "#22c55e"; // green
      case "Moderate":
        return "#facc15"; // yellow
      case "Low":
        return "#ef4444"; // red
      default:
        return "#1677ff"; // default
    }
  };

  return (

    <div className="min-h-screen bg-gray-50 p-10">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          Academic Self-Efficacy Result
        </h1>

        {/* Overall Summary */}

        <Card className="mb-8">

          <h2 className="text-xl font-semibold mb-4">
            Overall Performance
          </h2>

          <p><strong>Total Score:</strong> {state.totalScore}</p>
          <p><strong>Percentage:</strong> {state.percentage}%</p>
          <p><strong>Level:</strong> {state.level}</p>

          <Progress
            percent={Math.round(state.percentage)}
            strokeColor={getColor(state.level)}
          />

        </Card>


        {/* Dimension Breakdown */}

        <h2 className="text-xl font-semibold mb-6">
          Dimension Breakdown
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {state.dimensions.map((dim, index) => (

            <Card key={index}>

              <h3 className="font-semibold mb-2">
                {dim.name}
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