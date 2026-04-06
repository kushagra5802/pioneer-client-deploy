import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CalendarDays, GraduationCap, Sparkles } from "lucide-react";
import useAxiosInstance from "../../lib/useAxiosInstance";
import {
  buildInterestEvents,
  getInitialGrade,
  getStudentName,
  gradeCategories,
  interestOptions,
  isSeniorGrade,
  readWelcomeProfile,
  saveWelcomeProfile,
  targetExams,
} from "../../data/studentExperience";

export default function WelcomeExperience({ user }) {
  const axios = useAxiosInstance();
  const navigate = useNavigate();
  const savedProfile = readWelcomeProfile();
  const [selectedGrade, setSelectedGrade] = useState(
    savedProfile?.grade || getInitialGrade(user)
  );
  const [selectedInterests, setSelectedInterests] = useState(
    savedProfile?.interests || ["sports", "arts"]
  );

  const studentName = getStudentName(user);
  const seniorGrade = isSeniorGrade(selectedGrade);

  const { data: targetExamResponse } = useQuery(
    ["welcome-target-exams", selectedGrade],
    async () => {
      const res = await axios.get("/api/student-experience", {
        params: {
          contentScope: "WELCOME",
          contentType: "TARGET_EXAM",
          grade: selectedGrade,
          activeOnly: true,
        },
      });
      return res.data;
    },
    { refetchOnWindowFocus: false, retry: 1 }
  );

  const { data: eventResponse } = useQuery(
    ["welcome-events", selectedGrade, selectedInterests.join(",")],
    async () => {
      const res = await axios.get("/api/student-experience", {
        params: {
          contentScope: "WELCOME",
          contentType: "UPCOMING_EVENT",
          grade: selectedGrade,
          interest: selectedInterests.join(","),
          activeOnly: true,
        },
      });
      return res.data;
    },
    { refetchOnWindowFocus: false, retry: 1 }
  );

  const dynamicTargetExams = useMemo(() => {
    const records = targetExamResponse?.data || [];

    if (!records.length) return targetExams;

    return records.slice(0, 3).map((item) => ({
      title: item.title,
      tag: item.categoryLabel,
      date: item.dateLabel,
      detail: item.description,
    }));
  }, [targetExamResponse]);

  const eventFeed = useMemo(() => {
    const records = eventResponse?.data || [];

    if (!records.length) {
      return buildInterestEvents(selectedInterests).slice(0, 3);
    }

    return records.slice(0, 3).map((item) => ({
      title: item.title,
      category: item.categoryLabel,
      date: item.dateLabel,
      location: item.locationLabel || item.description,
    }));
  }, [eventResponse, selectedInterests]);

  const toggleInterest = (interest) => {
    setSelectedInterests((current) => {
      if (current.includes(interest)) {
        return current.filter((item) => item !== interest);
      }
      return [...current, interest];
    });
  };

  const continueToDashboard = () => {
    saveWelcomeProfile({
      grade: selectedGrade,
      interests: selectedInterests.length ? selectedInterests : ["sports"],
      completedAt: new Date().toISOString(),
    });
    navigate("/dashboard", { replace: true });
  };

  const previewItems = seniorGrade ? dynamicTargetExams : eventFeed;

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[32px] bg-slate-900 p-8 text-white shadow-xl">
          <div className="flex items-start justify-between gap-6">
            <div className="max-w-2xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200">
                <Sparkles size={14} />
                Welcome Experience
              </p>
              <h1 className="text-5xl font-bold leading-tight">
                Hi {studentName}, let&apos;s personalize your Pioneer journey.
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-300">
                Pick your grade and interests so we can surface the most relevant
                exams, local opportunities, and next actions before opening your
                dashboard.
              </p>
            </div>
            <div className="hidden rounded-3xl bg-white/10 p-6 text-right md:block">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Starting with
              </p>
              <p className="mt-2 text-4xl font-bold text-white">
                Grade {selectedGrade}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[390px_1fr]">
          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Select Grade Category
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {gradeCategories.map((grade) => (
                <button
                  key={grade.value}
                  type="button"
                  onClick={() => setSelectedGrade(grade.value)}
                  className={`rounded-2xl border px-4 py-4 text-left transition-all ${
                    selectedGrade === grade.value
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-200"
                  }`}
                >
                  <GraduationCap size={20} />
                  <p className="mt-3 text-sm font-semibold">{grade.label}</p>
                </button>
              ))}
            </div>

            {!seniorGrade && (
              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Interests
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {interestOptions.map((interest) => {
                    const isActive = selectedInterests.includes(interest.value);
                    return (
                      <button
                        key={interest.value}
                        type="button"
                        onClick={() => toggleInterest(interest.value)}
                        className={`rounded-full px-5 py-3 text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {interest.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={continueToDashboard}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-6 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-indigo-600"
            >
              Proceed to Main Dashboard
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {seniorGrade ? "Top 3 Target Exams" : "Upcoming Events"}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {seniorGrade
                    ? "Focused exam pathways for senior secondary students"
                    : "Interest-led opportunities near you"}
                </h2>
              </div>
              <span className="rounded-2xl bg-indigo-50 p-4 text-indigo-600">
                <CalendarDays size={22} />
              </span>
            </div>

            <div className="mt-8 grid gap-4">
              {previewItems.map((item) => (
                <div
                  key={`${item.title}-${item.date}`}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-500">
                        {item.tag || item.category}
                      </p>
                      <h3 className="mt-2 text-2xl font-bold text-slate-900">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-sm font-semibold text-slate-500">
                      {item.date}
                    </p>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {item.detail || item.location}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
