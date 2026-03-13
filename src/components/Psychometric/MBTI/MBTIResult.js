import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Progress, Tag } from "antd";
import { MBTI_TYPES } from "./mbtiTypes";

export default function MBTIResult() {

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

  const { mbti_type, percentages, scores, completionTimeSeconds } = state;
  const typeInfo = MBTI_TYPES[mbti_type];

  const getColor = (a, b, colorA, colorB) => {
    return a >= b ? colorA : colorB;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          MBTI Personality Result
        </h1>

        {/* MBTI Type */}
        <Card className="mb-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Your Personality Type</h2>

          <Tag color="blue" className="text-2xl px-6 py-2">
            {mbti_type}
          </Tag>

          <p className="mt-4 text-gray-600">
            Completion Time: {completionTimeSeconds}s
          </p>
        </Card>

        {/* Personality Description */}
        <Card className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {typeInfo?.title}
          </h2>

          <p className="text-gray-700 mb-6">
            {typeInfo?.description}
          </p>

          <div className="grid md:grid-cols-3 gap-6">

            <div>
              <h3 className="font-semibold mb-2">Strengths</h3>
              <ul className="list-disc ml-6">
                {typeInfo?.strengths.map((s,i)=>(
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Growth Areas</h3>
              <ul className="list-disc ml-6">
                {typeInfo?.weaknesses.map((w,i)=>(
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Recommended Careers</h3>
              <ul className="list-disc ml-6">
                {typeInfo?.careers.map((c,i)=>(
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

          </div>
        </Card>

        {/* Dimension Percentages */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold mb-6">
            Personality Dimensions
          </h2>

          <div className="space-y-6">

            {/* EI */}
            <div>
              <p className="mb-1 font-medium">Extraversion vs Introversion</p>
              <Progress
                percent={percentages.EI}
                strokeColor={getColor(scores.E, scores.I, "#3b82f6", "#8b5cf6")}
              />
              <p className="text-sm text-gray-500">
                E: {scores.E} | I: {scores.I}
              </p>
            </div>

            {/* SN */}
            <div>
              <p className="mb-1 font-medium">Sensing vs Intuition</p>
              <Progress
                percent={percentages.SN}
                strokeColor={getColor(scores.S, scores.N, "#22c55e", "#f97316")}
              />
              <p className="text-sm text-gray-500">
                S: {scores.S} | N: {scores.N}
              </p>
            </div>

            {/* TF */}
            <div>
              <p className="mb-1 font-medium">Thinking vs Feeling</p>
              <Progress
                percent={percentages.TF}
                strokeColor={getColor(scores.T, scores.F, "#06b6d4", "#ec4899")}
              />
              <p className="text-sm text-gray-500">
                T: {scores.T} | F: {scores.F}
              </p>
            </div>

            {/* JP */}
            <div>
              <p className="mb-1 font-medium">Judging vs Perceiving</p>
              <Progress
                percent={percentages.JP}
                strokeColor={getColor(scores.J, scores.P, "#eab308", "#d946ef")}
              />
              <p className="text-sm text-gray-500">
                J: {scores.J} | P: {scores.P}
              </p>
            </div>

          </div>
        </Card>

        {/* Strengths */}
        {state.strengths?.length > 0 && (
          <Card className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Strengths</h2>
            <ul className="list-disc ml-6">
              {state.strengths.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Card>
        )}

        {/* Growth Areas */}
        {state.growthAreas?.length > 0 && (
          <Card className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Growth Areas</h2>
            <ul className="list-disc ml-6">
              {state.growthAreas.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Card>
        )}

        {/* Recommendations */}
        {state.recommendations?.length > 0 && (
          <Card className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
            <ul className="list-disc ml-6">
              {state.recommendations.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Card>
        )}

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