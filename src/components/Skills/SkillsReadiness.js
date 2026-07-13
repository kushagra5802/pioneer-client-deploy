import { useState } from 'react';
import PageHeader from '../PageHeader';
import { useQuery } from 'react-query';
import useAxiosInstance from '../../lib/useAxiosInstance';
import WeekContentView from './WeekContentView';
import WeekAssessmentView from './WeekAssessmentView';
import { Calendar, ChevronLeft, ChevronRight, CheckCircle, Clock, AlertCircle, BookOpen, Trophy, Lock } from 'lucide-react';
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

const WEEK_COLORS = [
  { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', icon: 'text-blue-500' },
  { bg: 'bg-violet-50', border: 'border-violet-200', badge: 'bg-violet-100 text-violet-700', icon: 'text-violet-500' },
  { bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', icon: 'text-emerald-500' },
  { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', icon: 'text-amber-500' },
];

function StatusBadge({ status }) {
  if (!status) return null;
  const map = {
    completed: { icon: <CheckCircle className="w-3.5 h-3.5" />, label: 'Completed', className: 'bg-green-100 text-green-700' },
    late_submitted: { icon: <AlertCircle className="w-3.5 h-3.5" />, label: 'Late', className: 'bg-orange-100 text-orange-700' },
    pending: { icon: <Clock className="w-3.5 h-3.5" />, label: 'Pending', className: 'bg-yellow-100 text-yellow-700' },
  };
  const item = map[status];
  if (!item) return null;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${item.className}`}>
      {item.icon}
      {item.label}
    </span>
  );
}

export default function SkillsReadiness() {
  const today = new Date();
  const axios = useAxiosInstance();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [activeWeek, setActiveWeek] = useState(null);
  const [view, setView] = useState('list');
  const navigate = useNavigate();

  const {
    data: skill,
    isLoading: skillLoading,
    isError: skillError,
  } = useQuery({
    queryKey: ['skill', selectedYear, selectedMonth],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/skillReadiness/skill?year=${selectedYear}&month=${selectedMonth}`);
        if (!res.data.status) throw new Error(res.data.error?.message || 'Skill not found');
        return res.data.data;
      } catch (error) {
        throw new Error(error.response?.data?.error?.message || error.message || 'Failed to fetch skill');
      }
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const skillId = skill?.id;

  const {
    data: weekData,
  } = useQuery({
    queryKey: ['week', skillId, activeWeek],
    queryFn: async () => {
      const res = await axios.get(`/api/skillReadiness/weeks?skillId=${skillId}&weekNumber=${activeWeek}`);
      return res.data.data;
    },
    enabled: !!skillId && !!activeWeek,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const { data: finalAssessmentData } = useQuery({
    queryKey: ['finalAssessment', skillId],
    queryFn: async () => {
      const res = await axios.get(`/api/skillReadiness/finalAssessment?skillId=${skillId}`);
      return res.data.data;
    },
    enabled: !!skillId && view === 'final',
  });

  const { refetch: fetchFinalResult, isFetching: isFetchingFinalResult } = useQuery({
    queryKey: ['finalAssessmentResult', finalAssessmentData?.assessment?.id],
    queryFn: async () => {
      const res = await axios.get('api/skillReadiness/getFinalAssessmentResult', {
        params: { assessmentId: finalAssessmentData?.assessment?.id },
      });
      return res.data;
    },
    enabled: false,
  });

  const handleViewFinalResponses = async () => {
    const res = await fetchFinalResult();
    if (res?.data?.status) navigate('/assessment-result', { state: res.data.data });
  };

  const monthName = MONTHS.find(m => m.value === selectedMonth)?.name || '';

  const handlePreviousMonth = () => {
    if (selectedMonth === 1) { setSelectedMonth(12); setSelectedYear(y => y - 1); }
    else setSelectedMonth(m => m - 1);
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) { setSelectedMonth(1); setSelectedYear(y => y + 1); }
    else setSelectedMonth(m => m + 1);
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
    if (skill?.finalAssessmentStatus === 'completed') return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader name="Skill Readiness" />

      {/* Month + Year Selector */}
      {view === 'list' && (
        <div className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Calendar className="text-indigo-600" size={20} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Select Period</div>
                  <div className="text-xl font-bold text-slate-900">{monthName} {selectedYear}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousMonth}
                  className="w-9 h-9 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {[selectedYear - 2, selectedYear - 1, selectedYear, selectedYear + 1].map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <button
                  onClick={handleNextMonth}
                  className="w-9 h-9 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
              {MONTHS.map((month) => {
                const future = isFutureMonth(month.value);
                const unlocked = isUnlocked(month.value);
                const isActive = selectedMonth === month.value;

                return (
                  <button
                    key={month.value}
                    disabled={!unlocked}
                    onClick={() => unlocked && setSelectedMonth(month.value)}
                    className={`relative px-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex flex-col items-center gap-0.5 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                        : unlocked
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-slate-50 text-slate-300 cursor-not-allowed'
                    }`}
                  >
                    {month.label}
                    {!unlocked && <Lock size={8} className="text-slate-300" />}
                    {isActive && skill?.finalAssessmentStatus === 'completed' && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {skillLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              <p className="text-slate-500 text-sm">Loading skill program...</p>
            </div>
          </div>
        )}

        {skillError && (
          <div className="py-12">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-slate-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">No Skill Program Available</h2>
              <p className="text-slate-500">
                There is no skill program assigned for {monthName} {selectedYear}. Check another month.
              </p>
            </div>
          </div>
        )}

        {/* List View */}
        {view === 'list' && skill && !skillError && (
          <div>
            {/* Skill Header Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-8 shadow-lg text-white mb-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold bg-white/20 text-indigo-100 px-3 py-1 rounded-full uppercase tracking-wider">
                      {monthName} {selectedYear}
                    </span>
                    {skill.finalAssessmentStatus && (
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${
                        skill.finalAssessmentStatus === 'completed' ? 'bg-green-400/20 text-green-200' :
                        skill.finalAssessmentStatus === 'pending' ? 'bg-yellow-400/20 text-yellow-200' :
                        'bg-orange-400/20 text-orange-200'
                      }`}>
                        {skill.finalAssessmentStatus === 'completed' ? '✓ Completed' :
                         skill.finalAssessmentStatus === 'pending' ? '⏳ In Progress' : '⚠ Late'}
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold mb-2">{skill.title}</h1>
                  <p className="text-indigo-200 max-w-lg leading-relaxed">{skill.description}</p>
                </div>
                <div className="ml-6 flex-shrink-0">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-indigo-200" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section Label */}
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Weekly Modules</h2>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Week Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[1, 2, 3, 4].map((week) => {
                const colors = WEEK_COLORS[week - 1];
                return (
                  <button
                    key={week}
                    onClick={() => {
                      setActiveWeek(week);
                      setView('week');
                    }}
                    className={`${colors.bg} border ${colors.border} rounded-2xl p-6 text-left hover:shadow-md transition-all group`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm`}>
                        <span className={`text-sm font-bold ${colors.icon}`}>{week}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${colors.icon} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    </div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Week {week}</div>
                    <div className="font-semibold text-slate-800">View Content & Assessment</div>
                  </button>
                );
              })}
            </div>

            {/* Section Label */}
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Final Evaluation</h2>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Final Assessment Card */}
            <button
              onClick={() => setView('final')}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-2xl p-6 flex items-center justify-between transition-all shadow-md hover:shadow-lg group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-indigo-200" />
                </div>
                <div className="text-left">
                  <div className="text-sm text-indigo-200 font-medium mb-0.5">Complete the Program</div>
                  <div className="text-xl font-bold">Final Assessment</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Week Detail View */}
        {view === 'week' && weekData && (
          <WeekContentView
            weekData={weekData}
            weekNumber={activeWeek}
            onBack={() => setView('list')}
            onStartAssessment={() => setView('assessment')}
          />
        )}

        {/* Assessment View */}
        {view === 'assessment' && weekData?.assessment && (
          <WeekAssessmentView
            assessment={weekData.assessment}
            onBack={() => setView('week')}
            questions={weekData?.questions}
          />
        )}

        {/* Final Assessment Overview */}
        {view === 'final' && finalAssessmentData && (
          <div className="space-y-6">
            <button onClick={() => setView('list')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-medium">
              <ChevronLeft className="w-4 h-4" /> Back to Program
            </button>

            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-8 shadow-lg text-white">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-6 h-6 text-indigo-200" />
                <span className="text-sm text-indigo-200 font-medium uppercase tracking-wider">Final Evaluation</span>
              </div>
              <h2 className="text-3xl font-bold">{finalAssessmentData.assessment.title}</h2>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 text-lg mb-1">Final Assessment</h3>
                  <p className="text-sm text-slate-500 mb-3">
                    Passing Score: <span className="font-semibold text-slate-700">{finalAssessmentData.assessment.passingScore}%</span>
                  </p>

                  {!finalAssessmentData.submission && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-yellow-600">Not yet attempted</span>
                    </div>
                  )}

                  {finalAssessmentData.submission && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {finalAssessmentData.submission.passed ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm font-semibold ${finalAssessmentData.submission.passed ? 'text-green-600' : 'text-red-600'}`}>
                          {finalAssessmentData.submission.passed ? 'Passed' : 'Not Passed'}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-3">
                        <div className="bg-slate-50 rounded-xl p-3 text-center">
                          <div className="text-xl font-bold text-slate-900">
                            {finalAssessmentData.submission.score?.toFixed(1)}%
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">Score</div>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 text-center">
                          <div className="text-xl font-bold text-slate-900">
                            {finalAssessmentData.submission.totalCorrect}/{finalAssessmentData.submission.totalQuestions}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">Correct</div>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 text-center">
                          <div className="text-xl font-bold text-slate-900">
                            {finalAssessmentData.submission.attemptNumber}/5
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">Attempts</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 flex-shrink-0">
                  {!finalAssessmentData.submission && (
                    <button
                      onClick={() => setView('finalExam')}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors"
                    >
                      Start
                    </button>
                  )}

                  {finalAssessmentData.submission && (
                    <>
                      <button
                        onClick={() => setView('finalExam')}
                        disabled={
                          finalAssessmentData.submission.attemptNumber >= 3 ||
                          finalAssessmentData.submission.passed
                        }
                        className={`px-6 py-2.5 rounded-xl font-semibold transition-colors text-white ${
                          finalAssessmentData.submission.attemptNumber >= 3 || finalAssessmentData.submission.passed
                            ? 'bg-slate-300 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                      >
                        {finalAssessmentData.submission.passed
                          ? 'Already Passed'
                          : finalAssessmentData.submission.attemptNumber >= 3
                          ? 'Max Attempts'
                          : 'Re-attempt'}
                      </button>
                      <button
                        onClick={handleViewFinalResponses}
                        disabled={isFetchingFinalResult}
                        className="px-6 py-2.5 rounded-xl border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold transition-colors"
                      >
                        {isFetchingFinalResult ? 'Loading...' : 'View Responses'}
                      </button>
                    </>
                  )}
                </div>
              </div>
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
