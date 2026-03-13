import { useState, useEffect } from 'react';
import PageHeader from '../PageHeader';
import { useQuery } from 'react-query';
import useAxiosInstance from '../../lib/useAxiosInstance';
import WeekContentView from './WeekContentView';
import WeekAssessmentView from './WeekAssessmentView';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import FinalAssessment from './FinalAssessment';
import { useNavigate } from 'react-router-dom';


const MONTHS = [
  { label: 'Jan', value: 1, name: 'January' },
  { label: 'Feb', value: 2, name: 'February' },
  { label: 'Mar', value: 3, name: 'March' },
  { label: 'Apr', value: 4, name: 'April' },
  { label: 'May', value: 5, name: 'May' },
  { label: 'Jun', value: 6, name: 'June' },
  { label: 'Jul', value: 7, name: 'July' },
  { label: 'Aug', value: 8, name: 'August' },
  { label: 'Sep', value: 9, name: 'September' },
  { label: 'Oct', value: 10, name: 'October' },
  { label: 'Nov', value: 11, name: 'November' },
  { label: 'Dec', value: 12, name: 'December' },
];

// const questions = [
//     {
//       id: 'q1',
//       questionText: 'What is the primary goal of critical thinking?',
//       options: [
//         { id: 'q1o1', text: 'Confirming biases' },
//         { id: 'q1o2', text: 'Guided action based on evaluation' },
//         { id: 'q1o3', text: 'Ignoring evidence' },
//         { id: 'q1o4', text: 'Quick decision making' },
//       ],
//     },
//     {
//       id: 'q2',
//       questionText: 'Which of these is a universal intellectual value?',
//       options: [
//         { id: 'q2o1', text: 'Speed' },
//         { id: 'q2o2', text: 'Clarity' },
//         { id: 'q2o3', text: 'Popularity' },
//         { id: 'q2o4', text: 'Novelty' },
//       ],
//     },
//   ];

export default function SkillsReadiness() {
  const today = new Date();
  const axios = useAxiosInstance();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [loadingSkill, setLoadingSkill] = useState(false);
  const [loadingWeek, setLoadingWeek] = useState(false);
  const [activeWeek, setActiveWeek] = useState(null);
  const [view, setView] = useState('list');
  const navigate = useNavigate();
  /* ---------------- FETCH SKILL (YEAR + MONTH) ---------------- */
  const {
    data: skill,
    isLoading: skillLoading,
    isError: skillError,
  } = useQuery({
    queryKey: ['skill', selectedYear, selectedMonth],
    // queryFn: async () => {
    //   const res = await axios.get(`/api/skillReadiness/skill?year=${selectedYear}&month=${selectedMonth}`);
    //   return res.data.data;
    // },
    queryFn: async () => {
      try {
        const res = await axios.get(
          `/api/skillReadiness/skill?year=${selectedYear}&month=${selectedMonth}`
        );

        if (!res.data.status) {
          throw new Error(res.data.error?.message || 'Skill not found');
        }

        return res.data.data;

      } catch (error) {
        throw new Error(
          error.response?.data?.error?.message ||
          error.message ||
          'Failed to fetch skill'
        );
      }
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    retry: 1,
  });
  const skillId = skill?.id;

  /* ---------------- FETCH WEEK DATA ---------------- */
  const {
    data: weekData,
    isLoading: weekLoading,
    isError: weekError,
  } = useQuery({
    queryKey: ['week', skillId, activeWeek],
    queryFn: async () => {
      const res = await axios.get(`/api/skillReadiness/weeks?skillId=${skillId}&weekNumber=${activeWeek}`);
      return res.data.data;
    },
    enabled: !!skillId && !!activeWeek, // Only run when skillId exists
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  /* ---------------- FETCH FINALASSESSMENT QUESTIONS ---------------- */
  const {
  data: finalAssessmentData,
  isLoading: finalLoading,
} = useQuery({
  queryKey: ['finalAssessment', skillId],
  queryFn: async () => {
    const res = await axios.get(
      `/api/skillReadiness/finalAssessment?skillId=${skillId}`
    );
    return res.data.data;
  },
  enabled: !!skillId && view === 'final',
});

/* ---------------- FETCH FINAL RESULT ---------------- */
const {
  refetch: fetchFinalResult,
  isFetching: isFetchingFinalResult
} = useQuery({
  queryKey: ['finalAssessmentResult', finalAssessmentData?.assessment?.id],
  queryFn: async () => {
    const res = await axios.get(
      'api/skillReadiness/getFinalAssessmentResult',
      {
        params: {
          assessmentId: finalAssessmentData?.assessment?.id
        }
      }
    );
    return res.data;
  },
  enabled: false
});

const handleViewFinalResponses = async () => {
  const res = await fetchFinalResult();

  if (res?.data?.status) {
    navigate('/assessment-result', {
      state: res.data.data
    });
  }
};

  const monthName = MONTHS.find(m => m.value === selectedMonth)?.name || '';

  const handlePreviousMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const isFutureMonth = (monthValue) => {
    if (selectedYear > currentYear) return true;
    if (selectedYear === currentYear && monthValue > currentMonth) return true;
    return false;
  };

  const isUnlocked = (monthValue) => {
    if (!isFutureMonth(monthValue)) return true;

    // Unlock if final assessment completed
    if (skill?.finalAssessmentStatus === 'completed') return true;

    return false;
  };
  console.log("finalAssessmentData",finalAssessmentData)

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader name="Skill Readiness" />

      {/* ---------------- MONTH + YEAR SELECTOR ---------------- */}
      {view==='list' && <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Calendar className="text-indigo-700" size={24} />
              <div>
                <div className="text-sm text-slate-600 font-medium">Select Period</div>
                <div className="text-2xl font-bold text-slate-900">{monthName} {selectedYear}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePreviousMonth}
                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="border border-slate-300 rounded-lg px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[selectedYear - 2, selectedYear - 1, selectedYear, selectedYear + 1].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
            {/* {MONTHS.map((month) => (
              <button
                key={month.value}
                onClick={() => setSelectedMonth(month.value)}
                className={`px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  selectedMonth === month.value
                    ? 'bg-indigo-700 text-white shadow-lg shadow-blue-200 scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105'
                }`}
              >
                {month.label}
              </button>
            ))} */}
            {MONTHS.map((month) => {
              const future = isFutureMonth(month.value);
              const unlocked = isUnlocked(month.value);

              const isActive = selectedMonth === month.value;

              let statusBadge = null;

              if (isActive && skill?.finalAssessmentStatus) {
                if (skill.finalAssessmentStatus === 'completed') {
                  statusBadge = (
                    <span className="text-xs ml-1 text-green-600 font-semibold">
                      ✔ Completed
                    </span>
                  );
                }

                if (skill.finalAssessmentStatus === 'late_submitted') {
                  statusBadge = (
                    <span className="text-xs ml-1 text-orange-600 font-semibold">
                      ⚠ Late
                    </span>
                  );
                }

                if (skill.finalAssessmentStatus === 'pending') {
                  statusBadge = (
                    <span className="text-xs ml-1 text-yellow-600 font-semibold">
                      ⏳ Pending
                    </span>
                  );
                }
              }

              return (
                <button
                  key={month.value}
                  disabled={!unlocked}
                  onClick={() => unlocked && setSelectedMonth(month.value)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center ${
                    isActive
                      ? 'bg-indigo-700 text-white shadow-lg shadow-blue-200 scale-105'
                      : unlocked
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {month.label}
                  {statusBadge}
                </button>
              );
            })}
          </div>
        </div>
      </div>}
      {/* ---------------- MAIN CONTENT ---------------- */}
      {/* ---------------- LIST VIEW ---------------- */}
      <main className="max-w-7xl mx-auto px-6 py-8 bg-slate-100">
        {skillLoading && (
          <div className="text-center py-20 text-gray-500">
            Loading skill...
          </div>
        )}

        {skillError && (
          <div className="text-center py-20">
            <div className="text-red-600 font-semibold text-lg">
              {skillError.message}
            </div>
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <h2 className="text-xl font-semibold text-red-600">
                No Skill Available
              </h2>
              <p className="text-gray-500 mt-3">
                There is no skill assigned for {monthName} {selectedYear}.
              </p>
            </div>
          </div>
        )}
        {view === 'list' && skill && !skillError && (
          <>
            <div className="mb-10">
              <h1 className="text-3xl font-semibold text-slate-900">
                {skill.title}
              </h1>
              <p className="mt-2 text-slate-600 max-w-2xl">
                {skill.description}
              </p>
            </div>

            <div className="space-y-4">
              {[1, 2, 3, 4].map((week) => (
                <button
                  key={week}
                  onClick={() => {
                    setActiveWeek(week);
                    setView('week');
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl p-6 flex justify-between items-center hover:border-indigo-500 transition"
                >
                  <div className="text-left">
                    <div className="text-sm text-slate-500">
                      Week {week}
                    </div>
                    <div className="font-medium text-slate-900">
                      View Content
                    </div>
                  </div>

                  <ChevronRight className="text-slate-400" />
                </button>
              ))}
            </div>
            <div className="pt-6 border-t border-slate-200">
              <button
                onClick={() => setView('final')}
                className="w-full bg-indigo-700 text-white rounded-xl p-6 flex justify-between items-center hover:bg-indigo-800 transition"
              >
                <div className="text-left">
                  <div className="text-sm opacity-80">
                    Complete Program
                  </div>
                  <div className="font-semibold text-lg">
                    Final Assessment
                  </div>
                </div>

                <ChevronRight />
              </button>
          </div>
          </>
        )}
        {/* ---------------- WEEK DETAIL VIEW ---------------- */}
        {view === 'week' && weekData && (
          <WeekContentView
            weekData={weekData}
            weekNumber={activeWeek}
            onBack={() => setView('list')}
            onStartAssessment={() => setView('assessment')}
          />
        )}
        {/* ---------------- ASSESSMENT VIEW ---------------- */}
        {view === 'assessment' && weekData?.assessment && (
          <WeekAssessmentView
            assessment={weekData.assessment}
            onBack={() => setView('week')}
            questions={weekData?.questions}
          />
        )}
        {/* {view === 'final' && finalAssessmentData && (
          <FinalAssessment
            assessment={finalAssessmentData.assessment}
            questions={finalAssessmentData.questions}
            onBack={() => setView('list')}
          />
        )} */}
        {view === 'final' && finalAssessmentData && (
          <div className="space-y-6">

            {/* Back Button */}
            <button
              onClick={() => setView('list')}
              className="text-slate-500 hover:text-slate-900"
            >
              ← Back
            </button>

            {/* Title */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-8 shadow-lg text-white">
              <h2 className="text-3xl font-bold">
                {finalAssessmentData.assessment.title}
              </h2>
              <p className="mt-3 text-indigo-100">
                Final Skill Evaluation
              </p>
            </div>

            {/* Assessment Card */}
            <div className="border border-indigo-200 bg-indigo-50 rounded-xl p-6 flex justify-between items-center">

              <div>
                <h3 className="font-medium text-slate-900">
                  Final Assessment
                </h3>

                <p className="text-sm text-slate-600">
                  Passing Score: {finalAssessmentData.assessment.passingScore}%
                </p>

                {/* STATUS */}
                {!finalAssessmentData.submission && (
                  <p className="text-sm mt-2 text-yellow-600 font-medium">
                    Status: Pending
                  </p>
                )}

                {finalAssessmentData.submission && (
                  <div className="mt-2 space-y-1 text-sm">

                    <p>
                      <strong>Status:</strong>{' '}
                      <span
                        className={
                          finalAssessmentData.submission.passed === true
                            ? 'text-green-600 font-semibold'
                            : 'text-red-600 font-semibold'
                        }
                      >
                        {finalAssessmentData.submission.passed === true
                          ? 'Passed'
                          : 'Not Passed'}
                      </span>
                    </p>

                    <p>
                      <strong>Score:</strong>{' '}
                      {finalAssessmentData.submission.score?.toFixed(2)}%
                    </p>

                    <p>
                      <strong>Correct:</strong>{' '}
                      {finalAssessmentData.submission.totalCorrect} /{' '}
                      {finalAssessmentData.submission.totalQuestions}
                    </p>

                    <p>
                      <strong>Attempts:</strong>{' '}
                      {finalAssessmentData.submission.attemptNumber} / 5
                    </p>

                  </div>
                )}
              </div>

              {/* BUTTONS */}
              {!finalAssessmentData.submission && (
                <button
                  onClick={() => setView('finalExam')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition"
                >
                  Start
                </button>
              )}

              {finalAssessmentData.submission && (
                <div className="flex flex-col gap-2">

                  <button
                    onClick={() => setView('finalExam')}
                    disabled={
                      finalAssessmentData.submission.attemptNumber >= 3 ||
                      finalAssessmentData.submission.passed
                    }
                    className={`px-5 py-2.5 rounded-lg transition text-white ${
                      finalAssessmentData.submission.attemptNumber >= 3 ||
                      finalAssessmentData.submission.passed
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {finalAssessmentData.submission.passed
                      ? 'Already Passed'
                      : finalAssessmentData.submission.attemptNumber >= 3
                      ? 'Max Attempts Reached'
                      : 'Re-attempt'}
                  </button>

                  <button
                    onClick={handleViewFinalResponses}
                    disabled={isFetchingFinalResult}
                    className="px-5 py-2.5 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition"
                  >
                    {isFetchingFinalResult ? 'Loading...' : 'View Responses'}
                  </button>

                </div>
              )}

            </div>
          </div>
        )}
        {view === 'finalExam' && finalAssessmentData && (
          <FinalAssessment
            assessment={finalAssessmentData.assessment}
            questions={finalAssessmentData.questions}
            onBack={() => setView('final')}
          />
        )}
      </main>
    </div>
  );
}
