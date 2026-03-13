import React, { useState } from "react";
import { Button, Card, Progress, Spin } from "antd";
import MBTIAssessment from "./MBTIAssessment";
import useAxiosInstance from "../../../lib/useAxiosInstance";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";

export default function MBTIInfo() {
  const [startTest, setStartTest] = useState(false);
  const axios = useAxiosInstance();
  const navigate = useNavigate();
  const userString = localStorage.getItem("users");
  const user = JSON.parse(userString);

  /* ===============================
     FETCH MBTI RESULT
  =============================== */

  const {
    data: resultData,
    isLoading: resultLoading,
  } = useQuery(
    ["mbti-result"],
    async () => {
      const res = await axios.get(
        `/api/psychometric/mbtiResult/${user?._id}`
      );
      return res.data;
    }
  );

  const hasResult = resultData?.data;

  if (startTest) {
    return <MBTIAssessment />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-16">

        {/* Hero */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Discover Your MBTI Personality Type
            </h2>

            <p className="text-gray-600 text-lg mb-6">
              The MBTI Personality Type Test helps you understand:
            </p>

            <ul className="space-y-2 text-gray-700 mb-6">
              <li>• How you gain energy (E / I)</li>
              <li>• How you process information (S / N)</li>
              <li>• How you make decisions (T / F)</li>
              <li>• How you organise your life (J / P)</li>
            </ul>

            <ul className="space-y-2 text-gray-600 mb-6">
              <li>• 70 forced-choice questions</li>
              <li>• No neutral answers</li>
              <li>• One question per screen</li>
              <li>• ~15 minutes</li>
            </ul>
            <div className="flex gap-4">
            <Button
              type="primary"
              size="large"
              className="bg-slate-800"
              onClick={() => setStartTest(true)}
            >
              Start Assessment
            </Button>
            {/* VIEW RESULT BUTTON */}
              {resultLoading ? (
                <Spin />
              ) : (
                hasResult && (
                  <Button
                    size="large"
                    onClick={() =>
                      navigate("/psychometric-mbti-result", {
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

          <div className="bg-indigo-100 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🧠</div>
            <p className="text-gray-600">
              Understand your natural preferences — not your limits.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}