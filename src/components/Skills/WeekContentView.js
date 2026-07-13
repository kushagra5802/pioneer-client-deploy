import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import useAxiosInstance from '../../lib/useAxiosInstance';

function Section({ title, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border rounded-xl mb-4 overflow-hidden bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-6 py-4 font-semibold text-left"
      >
        {title}
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isOpen && (
        <div className="px-6 pb-6 text-gray-700">
          {children}
        </div>
      )}
    </div>
  );
}

export default function WeekContentView({
  weekData,
  selectedWeek,
  onBack,
  onStartAssessment
}) {
  const navigate = useNavigate();
  const axios = useAxiosInstance();

  /* =========================
     Fetch Assessment Result
  ========================= */
  const { refetch: fetchResult, isFetching } = useQuery({
    queryKey: ['assessmentResult', weekData?.assessment?.id],
    queryFn: async () => {
      const res = await axios.get(
        'api/skillReadiness/getAssessmentResult',
        {
          params: {
            assessmentId: weekData?.assessment?.id
          }
        }
      );
      return res.data;
    },
    enabled: false 
  });

  const handleViewResponses = async () => {
    const res = await fetchResult();

    if (res?.data?.status) {
      navigate('/assessment-result', {
        state: res.data.data
      });
    }
  };

  return (
    <div className="space-y-6">
        {/* Header */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="text-slate-500 hover:text-slate-900"
        >
          ← Back
        </button>
      </div>
      {/* Title Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 shadow-lg text-white">
        <h2 className="text-3xl font-bold">
          {weekData.title}
        </h2>
        <p className="mt-3 text-blue-100">
          {weekData.description}
        </p>
      </div>

      {/* Content Section */}
      <Section title="Content">
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: weekData.content }}
        />
      </Section>

      {/* Resources Section */}
      {weekData.resources?.length > 0 && (
        <Section title="Resources" defaultOpen={false}>
          <ul className="space-y-2">
            {weekData.resources.map((resource) => (
              <li key={resource.id}>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {resource.title}
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Images Section */}
      {weekData.images?.length > 0 && (
        <Section title="Images" defaultOpen={false}>
          <div className="grid grid-cols-2 gap-4">
            {weekData.images.map((img) => (
              <img
                key={img.key}
                src={img.url}
                alt={img.name}
                className="rounded-xl shadow"
              />
            ))}
          </div>
        </Section>
      )}

      {/* Videos Section */}
      {weekData.videos?.length > 0 && (
        <Section title="Videos" defaultOpen={false}>
          <div className="space-y-4">
            {weekData.videos.map((video) => (
              <video
                key={video.key}
                controls
                className="w-full rounded-xl shadow"
              >
                <source src={video.url} />
              </video>
            ))}
          </div>
        </Section>
      )}
      
      {weekData.assessment && (
        <div className="border border-indigo-200 bg-indigo-50 rounded-xl p-6 flex justify-between items-center">

          <div>
            <h3 className="font-medium text-slate-900">
              Assessment
            </h3>

            <p className="text-sm text-slate-600">
              Passing Score: {weekData.assessment.passingScore}%
            </p>

            {/* ===== STATUS DISPLAY ===== */}
            {!weekData.submission && (
              <p className="text-sm mt-2 text-yellow-600 font-medium">
                Status: Pending
              </p>
            )}

            {weekData.submission && (
              <div className="mt-2 space-y-1 text-sm">

                {/* STATUS */}
                <p>
                  <strong>Status:</strong>{' '}
                  <span
                    className={
                      weekData.submission.passed
                        ? 'text-green-600 font-semibold'
                        : 'text-red-600 font-semibold'
                    }
                  >
                    {weekData.submission.passed
                      ? 'Passed'
                      : 'Not Passed'}
                  </span>
                </p>

                {/* SCORE */}
                <p>
                  <strong>Score:</strong>{' '}
                  {weekData.submission.percentage?.toFixed(2)}%
                </p>

                {/* CORRECT */}
                <p>
                  <strong>Correct:</strong>{' '}
                  {weekData.submission.totalCorrect} /{' '}
                  {weekData.submission.totalQuestions}
                </p>

                {/* ATTEMPTS */}
                <p>
                  <strong>Attempts:</strong>{' '}
                  {weekData.submission.attemptNumber} / 5
                </p>

              </div>
            )}
          </div>

          {/* ===== BUTTON SECTION ===== */}

          {/* FIRST ATTEMPT */}
          {!weekData.submission && (
            <button
              onClick={onStartAssessment}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition"
            >
              Start
            </button>
          )}

          {/* AFTER SUBMISSION */}
          {weekData.submission && (
            <div className="flex flex-col gap-2">

              <button
                onClick={onStartAssessment}
                disabled={
                  weekData.submission.attemptNumber >= 5 ||
                  weekData.submission.passed
                }
                className={`px-5 py-2.5 rounded-lg transition text-white ${
                  weekData.submission.attemptNumber >= 5 ||
                  weekData.submission.passed
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {weekData.submission.passed
                  ? 'Already Passed'
                  : weekData.submission.attemptNumber >= 5
                  ? 'Max Attempts Reached'
                  : 'Re-attempt'}
              </button>

              <button
                onClick={handleViewResponses}
                disabled={isFetching}
                className="px-5 py-2.5 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition"
              >
                {isFetching ? 'Loading...' : 'View Responses'}
              </button>

            </div>
          )}

        </div>
      )}
    </div>
  );
}
