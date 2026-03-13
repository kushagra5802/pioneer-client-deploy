import { useState } from 'react';
import useAxiosInstance from '../../lib/useAxiosInstance';
import { useNavigate } from 'react-router-dom';

export default function FinalAssessment({
  assessment,
  questions = [],
  onBack
}) {
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const axios = useAxiosInstance();
  const navigate = useNavigate();

  const handleSingleSelect = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { selectedOptionIds: [optionId] }
    }));
  };

  const handleMultipleSelect = (questionId, optionId) => {
    setAnswers(prev => {
      const current = prev[questionId]?.selectedOptionIds || [];

      const updated = current.includes(optionId)
        ? current.filter(id => id !== optionId)
        : [...current, optionId];

      return {
        ...prev,
        [questionId]: { selectedOptionIds: updated }
      };
    });
  };

  const handleWrittenAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { writtenAnswer: value }
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        assessmentId: assessment?.id,
        answers: Object.entries(answers).map(
          ([questionId, value]) => ({
            questionId,
            selectedOptionIds: value.selectedOptionIds || [],
            writtenAnswer: value.writtenAnswer || null
          })
        )
      };

      const res = await axios.post(
        'api/skillReadiness/submitFinalAssessment',
        payload
      );

      navigate('/assessment-result', {
        state: res.data.data
      });

      onBack();
    } catch (err) {
      console.error(err);
      alert('Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const isComplete = questions.every(q => {
    const ans = answers[q.id];
    if (!ans) return false;

    if (q.type === 'single' || q.type === 'multiple') {
      return ans.selectedOptionIds?.length > 0;
    }

    if (q.type === 'text' || q.type === 'number') {
      return ans.writtenAnswer?.trim();
    }

    return false;
  });

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {assessment.title}
        </h2>

        <button
          onClick={onBack}
          className="border px-4 py-2 rounded-lg"
        >
          Back
        </button>
      </div>

      {questions.map((question, index) => (
        <div key={question.id} className="mb-8">
          <div className="font-semibold mb-4">
            {index + 1}. {question.questionText}
          </div>

          {(question.type === 'single' || question.type === 'multiple') && (
            <div className="grid grid-cols-2 gap-4">
              {question.options.map(option => (
                <button
                  key={option.id}
                  onClick={() =>
                    question.type === 'single'
                      ? handleSingleSelect(question.id, option.id)
                      : handleMultipleSelect(question.id, option.id)
                  }
                  className={`p-4 border-2 rounded-lg text-left ${
                    answers[question.id]?.selectedOptionIds?.includes(option.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  {option.text}
                </button>
              ))}
            </div>
          )}

          {(question.type === 'text' || question.type === 'number') && (
            <input
              type={question.type === 'number' ? 'number' : 'text'}
              value={answers[question.id]?.writtenAnswer || ''}
              onChange={e =>
                handleWrittenAnswer(question.id, e.target.value)
              }
              className="w-full px-4 py-3 border-2 rounded-lg"
              placeholder="Enter your answer"
            />
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={!isComplete || loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg disabled:bg-gray-300"
      >
        {loading ? 'Submitting...' : 'Submit Final Assessment'}
      </button>
    </div>
  );
}