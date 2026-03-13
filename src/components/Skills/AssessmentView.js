import { useState } from 'react';

export default function AssessmentView({
  skill,
  weeks,
  selectedWeek,
  assessment,
  questions,
  onSubmit,
  onBack,
}) {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleAnswerSelect = (questionId, optionId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = () => {
    onSubmit(selectedAnswers);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 mb-6 shadow-lg">
        <div className="text-blue-100 text-sm font-semibold uppercase mb-2">
          Skill of the Month
        </div>
        <h2 className="text-4xl font-bold text-white mb-6">
          {skill.title}
        </h2>

        <div className="flex gap-3">
          {weeks.map((week) => (
            <div
              key={week.id}
              className={`px-4 py-2 rounded-lg ${
                selectedWeek === week.week_number
                  ? 'bg-white text-blue-600'
                  : 'bg-blue-500 text-white'
              }`}
            >
              Week {week.week_number}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-md">
        <h3 className="text-2xl font-bold mb-8">
          {assessment.title}
        </h3>

        {questions.map((question, index) => (
          <div key={question.id} className="mb-8">
            <div className="font-semibold mb-4">
              {index + 1}. {question.question_text}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {question.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() =>
                    handleAnswerSelect(question.id, option.id)
                  }
                  className={`p-4 border-2 rounded-lg text-left ${
                    selectedAnswers[question.id] === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  {option.option_text}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="border px-6 py-3 rounded-lg"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              Object.keys(selectedAnswers).length !== questions.length
            }
            className="flex-1 bg-green-600 text-white py-3 rounded-lg disabled:bg-gray-300"
          >
            Submit Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
