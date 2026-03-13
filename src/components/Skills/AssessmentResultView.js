import { useLocation, useNavigate } from 'react-router-dom';

export default function AssessmentResultView() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return <div className="p-8">No result data found.</div>;
  }

  const {
    score,
    passed,
    totalQuestions,
    totalCorrect,
    results,
    attemptNumber
  } = state;
  console.log("state",state)
  const MAX_ATTEMPTS = 5;

  return (
    <div className="max-w-5xl mx-auto p-8">

      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">
          Assessment Result
        </h1>

        <div className="grid grid-cols-2 gap-4 text-lg">
          <div>
            <strong>Score:</strong> {score.toFixed(2)}%
          </div>
          <div>
            <strong>Status:</strong>{' '}
            <span
              className={
                passed ? 'text-green-600 font-bold' : 'text-red-600 font-bold'
              }
            >
              {passed ? 'Passed' : 'Failed'}
            </span>
          </div>
          <div>
            <strong>Total Questions:</strong> {totalQuestions}
          </div>
          <div>
            <strong>Correct Answers:</strong> {totalCorrect}
          </div>
        </div>
      </div>

      {/* Question Breakdown */}
      <div className="space-y-6">
        {results.map((item, index) => (
          <div
            key={index}
            className="bg-white border rounded-lg p-6 shadow-sm"
          >
            <h3 className="font-semibold mb-2">
              {index + 1}. {item.questionText}
            </h3>

            <div className="mb-2">
              <strong>Your Answer:</strong>{' '}
              {item.userWrittenAnswer ||
                (item.userSelectedOptionIds?.length
                  ? item.userSelectedOptionIds.join(', ')
                  : 'Not answered')}
            </div>

            {/* <div className="mb-2 text-green-600">
              <strong>Correct Answer:</strong>{' '}
              {item.correctAnswerText ||
                item.correctOptions.join(', ')}
            </div> */}
            {(passed || attemptNumber===5) ? (
                <div className="mb-2 text-green-600">
                    <strong>Correct Answer:</strong>{' '}
                    {item.correctAnswerText ||
                    item.correctOptions.join(', ')}
                </div>
                ) : (
                <div className="mb-2 text-gray-500 italic">
                    Correct answers will be visible if you pass the assessment
                </div>
            )}

            {(passed || attemptNumber===5) && (
                <div>
                    <strong>Status:</strong>{' '}
                    <span
                    className={
                        item.isCorrect
                        ? 'text-green-600 font-bold'
                        : 'text-red-600 font-bold'
                    }
                    >
                    {item.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                </div>
                )}
          </div>
        ))}
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <button
          onClick={() => navigate('/skills')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Back to Skills
        </button>
      </div>
    </div>
  );
}