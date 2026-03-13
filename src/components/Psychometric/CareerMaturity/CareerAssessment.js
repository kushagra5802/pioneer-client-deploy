import React, { useState } from "react";
import { Button, Radio, message } from "antd";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import useAxiosInstance from "../../../lib/useAxiosInstance";

/* ===============================
   QUESTIONS
================================ */

// const questions = [
//   { id: 1, text: "There is no point in deciding on a job when the future is so uncertain.", dimension: "careerConcern", scoreIf: "D" },
//   { id: 2, text: "I know very little about the requirements of jobs.", dimension: "careerCuriosity", scoreIf: "D" },
//   { id: 3, text: "I have so many interests that it is hard to choose just one occupation.", dimension: "careerConfidence", scoreIf: "D" },
//   { id: 4, text: "Choosing a job is something that you do on your own.", dimension: "careerConsultation", scoreIf: "A" },
//   { id: 5, text: "I can’t seem to become very concerned about my future occupation.", dimension: "careerConcern", scoreIf: "D" },
//   { id: 6, text: "I don’t know how to go about getting into the kind of work I want to do.", dimension: "careerCuriosity", scoreIf: "D" },
//   { id: 7, text: "Everyone seems to tell me something different; as a result I don’t know what kind of work to choose.", dimension: "careerConfidence", scoreIf: "D" },
//   { id: 8, text: "If you have doubts about what you want to do, ask your parents or friends for advice.", dimension: "careerConsultation", scoreIf: "A" },
//   { id: 9, text: "I seldom think about the job that I want to enter.", dimension: "careerConcern", scoreIf: "D" },
//   { id: 10, text: "I am having difficulty preparing myself for the work that I want to do.", dimension: "careerCuriosity", scoreIf: "D" },
//   { id: 11, text: "I keep changing my occupational choice.", dimension: "careerConfidence", scoreIf: "D" },
//   { id: 12, text: "When it comes to choosing a career, I will ask other people to help me.", dimension: "careerConsultation", scoreIf: "A" },
//   { id: 13, text: "I’m not going to worry about choosing an occupation until I am out of school.", dimension: "careerConcern", scoreIf: "D" },
//   { id: 14, text: "I don’t know what courses I should take in school.", dimension: "careerCuriosity", scoreIf: "D" },
//   { id: 15, text: "I often daydream about what I want to be, but I really have not chosen an occupation yet.", dimension: "careerConfidence", scoreIf: "D" },
//   { id: 16, text: "I will choose my career without paying attention to the feelings of other people.", dimension: "careerConsultation", scoreIf: "D" },
//   { id: 17, text: "As far as choosing an occupation is concerned, something will come along sooner or later.", dimension: "careerConcern", scoreIf: "D" },
//   { id: 18, text: "I don’t know whether my occupational plans are realistic.", dimension: "careerCuriosity", scoreIf: "D" },
//   { id: 19, text: "There are so many things to consider in choosing an occupation, it is hard to make a decision.", dimension: "careerConfidence", scoreIf: "D" },
//   { id: 20, text: "It is important to consult close friends and get their ideas before making an occupational choice.", dimension: "careerConsultation", scoreIf: "A" },
//   { id: 21, text: "I really can’t find any work that has much appeal to me.", dimension: "careerConcern", scoreIf: "D" },
//   { id: 22, text: "I keep wondering how I can reconcile the kind of person I am with the kind of person I want to be in my occupation.", dimension: "careerCuriosity", scoreIf: "D" },
//   { id: 23, text: "I can’t understand how some people can be so certain about what they want to do.", dimension: "careerConfidence", scoreIf: "D" },
//   { id: 24, text: "In making career choices, one should pay attention to the thoughts and feelings of family members.", dimension: "careerConsultation", scoreIf: "A" }
// ];

/* ===============================
   OPTIONS
================================ */

const options = [
  { label: "Agree", value: "A" },
  { label: "Disagree", value: "D" }
];

/* ===============================
   COMPONENT
================================ */

export default function CareerAssessment({ questions,onClose }) {

  const axios = useAxiosInstance();
  const navigate = useNavigate();

  const [answers, setAnswers] = useState([]);
  const [startTime] = useState(Date.now());

  const handleChange = (question, value) => {

    setAnswers((prev) => {

      const existing = prev.find(a => a.questionId === question.id);

      if (existing) {
        return prev.map(a =>
          a.questionId === question.id
            ? { ...a, selectedOption: value }
            : a
        );
      }

      return [
        ...prev,
        {
          questionId: question.id,
          selectedOption: value
        }
      ];
    });

  };

  /* ===============================
     SUBMIT API
  =============================== */

  const submitMutation = useMutation(

    async (payload) => {
      const res = await axios.post(
        "/api/psychometric/careerAssessment",
        payload
      );
      return res.data;
    },

    {
      onSuccess: (response) => {

        message.success("Career Assessment submitted successfully!");

        navigate("/psychometric-career-result", {
          state: response.data
        });

      },

      onError: (error) => {

        message.error(
          error?.response?.data?.error?.message ||
          "Submission failed"
        );

      }

    }

  );

  const handleSubmit = () => {

    const completionTimeSeconds = Math.floor(
      (Date.now() - startTime) / 1000
    );

    const payload = {
      completionTimeSeconds,
      answers
    };

    submitMutation.mutate(payload);

  };

  /* ===============================
     UI
  =============================== */

  return (

    <div className="fixed inset-0 bg-white z-50 overflow-y-auto p-10">

      <div className="max-w-5xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <h2 className="text-2xl font-bold">
            Career Maturity Assessment
          </h2>

          <Button danger onClick={onClose}>
            Exit
          </Button>

        </div>

        {questions.map((question, index) => (

          <div
            key={question.id}
            className="border-[3px] rounded-lg p-6 mb-6 shadow-sm"
          >

            <p className="font-semibold mb-4">
              {index + 1}. {question.text}
            </p>

            <Radio.Group
              onChange={(e) =>
                handleChange(question, e.target.value)
              }
              className="flex gap-10"
              value={
                answers.find(a => a.questionId === question.id)?.selectedOption
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