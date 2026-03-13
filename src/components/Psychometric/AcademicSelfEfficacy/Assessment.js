import React, { useState } from "react";
import { Button, Radio, message } from "antd";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import useAxiosInstance from "../../../lib/useAxiosInstance";

const options = [
  { label: "Exactly True", value: 5 },
  { label: "Nearly True", value: 4 },
  { label: "Neutral", value: 3 },
  { label: "Nearly False", value: 2 },
  { label: "Exactly False", value: 1 },
];

export default function Assessment({ questions, loading, onClose }) {
  const axios = useAxiosInstance();
  const navigate = useNavigate();

  const [answers, setAnswers] = useState([]);
  const [startTime] = useState(Date.now());

  const handleChange = (question, value) => {
    setAnswers((prev) => {
      const existing = prev.find(a => a.questionId === question._id);

      if (existing) {
        return prev.map(a =>
          a.questionId === question._id
            ? { ...a, selectedOption: value }
            : a
        );
      }

      return [
        ...prev,
        {
          questionId: question._id,
          selectedOption: value,
        },
      ];
    });
  };

  const submitMutation = useMutation(
    async (payload) => {
      const res = await axios.post(
        "/api/psychometric/academicAssessment",
        payload
      );
      return res.data;
    },
    {
      onSuccess: (response) => {
        message.success("Assessment submitted successfully!");

        navigate("/psychometric-academic-result", {
          state: response.data
        });
      },
      onError: (error) => {
        message.error(
          error?.response?.data?.error?.message ||
          "Submission failed"
        );
      },
    }
  );

  const handleSubmit = () => {
    const completionTimeSeconds = Math.floor(
      (Date.now() - startTime) / 1000
    );

    const payload = {
      completionTimeSeconds,
      answers: answers.map(a => ({
        questionId: a.questionId,
        selectedOption: a.selectedOption
      }))
    };

    submitMutation.mutate(payload);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg">
        Loading Questions...
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto p-10">
      <div className="max-w-5xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Academic Assessment</h2>
          <Button danger onClick={onClose}>Exit</Button>
        </div>

        {questions.map((question, index) => (
          <div
            key={question._id}
            className="border-[3px] rounded-lg p-6 mb-6 shadow-sm"
          >
            <p className="font-semibold mb-4">
              {index + 1}. {question.questionText}
            </p>

            <Radio.Group
              onChange={(e) => handleChange(question, e.target.value)}
              className="flex justify-between"
              value={
                answers.find(a => a.questionId === question._id)?.selectedOption
              }
            >
              {options.map((opt) => (
                <Radio key={opt.value} value={opt.value}>
                  {opt.label}
                </Radio>
              ))}
            </Radio.Group>
          </div>
        ))}

        <div className="text-center mt-10">
          <Button
            type="primary"
            size="large"
            loading={submitMutation.isLoading}
            disabled={answers.length !== questions.length}
            className="bg-slate-800"
            onClick={handleSubmit}
          >
            Submit Assessment
          </Button>
        </div>

      </div>
    </div>
  );
}