import {
  ArrowRight,
  BookOpen,
  Calendar,
  FileText,
  PlayCircle,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useMemo } from "react";
import { useQuery } from "react-query";
import PageHeader from "../PageHeader";
import { Link } from "react-router-dom";
import useAxiosInstance from "../../lib/useAxiosInstance";
import {
  buildInterestEvents,
  isSeniorGrade,
  readWelcomeProfile,
} from "../../data/studentExperience";

export default function DashboardPage() {
  const axios = useAxiosInstance();
  const welcomeProfile = readWelcomeProfile();
  const seniorGrade = isSeniorGrade(welcomeProfile?.grade || "12");

  const { data: dashboardContentResponse } = useQuery(
    [
      "dashboard-experience",
      welcomeProfile?.grade,
      (welcomeProfile?.interests || []).join(","),
    ],
    async () => {
      const res = await axios.get("/api/student-experience", {
        params: {
          contentScope: "DASHBOARD",
          grade: welcomeProfile?.grade,
          interest: (welcomeProfile?.interests || []).join(","),
          activeOnly: true,
        },
      });
      return res.data;
    },
    { refetchOnWindowFocus: false, retry: 1 }
  );

  const dashboardRecords = useMemo(
    () => dashboardContentResponse?.data || [],
    [dashboardContentResponse]
  );

  const { data: shortlistResponse } = useQuery(
    "student-shortlist-dashboard",
    async () => {
      const res = await axios.get("/api/student-shortlist");
      return res.data;
    },
    { refetchOnWindowFocus: false, retry: 1 }
  );

  const shortlistedCareers =
    shortlistResponse?.data?.shortlistedCareers?.filter(Boolean) || [];
  const shortlistedUniversities =
    shortlistResponse?.data?.shortlistedUniversities?.filter(Boolean) || [];

  const upcomingProgram = useMemo(() => {
    const apiEvent = dashboardRecords.find(
      (item) => item.contentType === "UPCOMING_EVENT"
    );

    if (apiEvent) {
      return {
        title: apiEvent.title,
        date: apiEvent.dateLabel || "Coming Soon",
        type: apiEvent.categoryLabel || "Upcoming Session",
        route: apiEvent.actionLink || "/counselling",
      };
    }

    return seniorGrade
      ? {
          title: "CUET strategy webinar with alumni mentors",
          date: "09 Apr 2026",
          type: "Live Webinar",
          route: "/counselling",
        }
      : {
          title:
            buildInterestEvents(welcomeProfile?.interests)[0]?.title ||
            "District student portfolio workshop",
          date:
            buildInterestEvents(welcomeProfile?.interests)[0]?.date ||
            "12 Apr 2026",
          type: "Upcoming Local Session",
          route: "/explore-city",
        };
  }, [dashboardRecords, seniorGrade, welcomeProfile?.interests]);

  const academicPerformance = [
    { subject: "Mathematics", percentage: 92 },
    { subject: "Physics", percentage: 88 },
    { subject: "Chemistry", percentage: 85 },
    { subject: "English", percentage: 95 },
  ];

  const continueActivities = useMemo(() => {
    const apiActivities = dashboardRecords
      .filter((item) => item.contentType === "CONTINUE_ACTIVITY")
      .map((item, index) => ({
        title: item.title,
        progress: item.description || item.categoryLabel,
        route: item.actionLink || "/resources",
        icon:
          index % 3 === 0 ? (
            <Target size={20} />
          ) : index % 3 === 1 ? (
            <PlayCircle size={20} />
          ) : (
            <FileText size={20} />
          ),
      }));

    if (apiActivities.length) return apiActivities.slice(0, 3);

    return [
      {
        title: "Career Exploration",
        progress: "2 of 5 pathways shortlisted",
        route: "/careers",
        icon: <Target size={20} />,
      },
      {
        title: "Skill Course: Communication",
        progress: "Week 2 content pending",
        route: "/skills",
        icon: <PlayCircle size={20} />,
      },
      {
        title: "Reading Module",
        progress: "Resume your stream-selection guide",
        route: "/resources",
        icon: <FileText size={20} />,
      },
    ];
  }, [dashboardRecords]);

  const priorityAction = useMemo(() => {
    const apiNextStep = dashboardRecords.find(
      (item) => item.contentType === "NEXT_STEP"
    );

    if (apiNextStep) {
      return {
        label: apiNextStep.title,
        detail: apiNextStep.description,
        route: apiNextStep.actionLink || "/psychometric",
        buttonText: apiNextStep.actionLabel || "Continue",
      };
    }

    return seniorGrade
      ? {
          label: "Complete Career Quiz",
          detail: `Grade ${
            welcomeProfile?.grade || "12"
          } profile is ready for exam-aligned career matching.`,
          route: "/psychometric",
          buttonText: "Open Psychometric Test",
        }
      : {
          label: "Apply for Event",
          detail:
            "You have new local opportunities based on your selected interests.",
          route: "/explore-city",
          buttonText: "Review Events",
        };
  }, [dashboardRecords, seniorGrade, welcomeProfile?.grade]);

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        
        {/* Header */}
        <PageHeader name="Dashboard"/>

        {/* Content */}
        <div className="flex-1 p-8">
          {/* <div className="mb-6 rounded-[28px] bg-slate-900 p-8 text-white shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200">
              Welcome Back
            </p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <h1 className="max-w-2xl text-4xl font-bold">
                {studentName}, your dashboard is ready with your next best move.
              </h1>
              <div className="rounded-3xl bg-white/10 px-6 py-4 text-right">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                  Focus Area
                </p>
                <p className="mt-2 text-xl font-bold text-white">
                  {seniorGrade ? targetExams[0].title : "Local Opportunities"}
                </p>
              </div>
            </div>
          </div> */}

          {/* Top Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            
            {/* Readiness */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <p className="text-[10px] tracking-[0.15em] text-slate-400 uppercase mb-2">
                Readiness Level
              </p>
              <p className="text-4xl font-bold text-slate-900 mb-1">Tier 1</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-sm text-emerald-600 font-medium">
                  Profile Strong
                </span>
              </div>
            </div>

            {/* Skills Completed */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <p className="text-[10px] tracking-[0.15em] text-slate-400 uppercase mb-2">
                Skills Completed
              </p>
              <p className="text-4xl font-bold text-slate-900 mb-1">3</p>
              <div className="flex items-center gap-2 text-slate-500">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Above Average</span>
              </div>
            </div>

            {/* Active Modules */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <p className="text-[10px] tracking-[0.15em] text-slate-400 uppercase mb-2">
                Active Modules
              </p>
              <p className="text-4xl font-bold text-slate-900 mb-1">2</p>
              <div className="flex items-center gap-2 text-slate-500">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">In Progress</span>
              </div>
            </div>

            {/* Next Exam */}
            <div className="bg-slate-800 rounded-xl p-5 shadow-sm text-white">
              <p className="text-[10px] tracking-[0.15em] text-slate-400 uppercase mb-2">
                {seniorGrade ? "Next Exam" : "Featured Event"}
              </p>
              <p className="text-2xl font-bold mb-3">
                {seniorGrade ? "CUET-UG" : "District Camp"}
              </p>
              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {seniorGrade ? "MAY 2026" : "APRIL 2026"}
                </span>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 grid gap-6">
              <div className="bg-indigo-500 rounded-[24px] p-6 shadow-sm text-white">
                <p className="text-[11px] tracking-[0.18em] uppercase font-semibold text-indigo-100">
                  Next Step
                </p>
                <h2 className="mt-3 text-3xl font-bold">{priorityAction.label}</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100">
                  {priorityAction.detail}
                </p>
                <Link
                  to={priorityAction.route}
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-indigo-600 hover:bg-indigo-50"
                >
                  {priorityAction.buttonText}
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[11px] tracking-[0.15em] text-slate-400 uppercase font-semibold">
                    Academic Performance
                  </h2>
                  <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                    FULL TRANSCRIPT
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  {academicPerformance.map((item) => (
                    <div key={item.subject}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-700 font-medium">
                          {item.subject}
                        </span>
                        <span className="text-xl font-bold text-slate-900">
                          {item.percentage}%
                        </span>
                      </div>

                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-slate-800 rounded-full transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="bg-white rounded-[24px] p-6 shadow-sm">
                <p className="text-[11px] tracking-[0.15em] text-slate-400 uppercase font-semibold">
                  Upcoming Talk/Event
                </p>
                <h2 className="mt-4 text-2xl font-bold text-slate-900">
                  {upcomingProgram.title}
                </h2>
                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-100 p-4 text-slate-700">
                  <Calendar size={18} />
                  <div>
                    <p className="text-sm font-semibold">{upcomingProgram.date}</p>
                    <p className="text-xs text-slate-500">
                      {upcomingProgram.type}
                    </p>
                  </div>
                </div>
                <Link
                  to={upcomingProgram.route}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  View Schedule
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="bg-slate-800 rounded-[24px] p-6 shadow-sm text-white">
                <h2 className="text-[11px] tracking-[0.15em] text-slate-400 uppercase font-semibold mb-4">
                  Career Shortlist
                </h2>
                {shortlistedCareers.length ? (
                  <div className="space-y-3 mb-6">
                    {shortlistedCareers.slice(0, 3).map((career) => (
                      <div
                        key={career._id}
                        className="rounded-2xl bg-white/10 px-4 py-3"
                      >
                        <p className="text-sm font-semibold text-white">
                          {career.title}
                        </p>
                        <p className="text-xs uppercase tracking-[0.14em] text-indigo-200">
                          {career.industry}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm mb-6">
                    Shortlist your top 3 careers to unlock targeted prep.
                  </p>
                )}
                <Link
                  to="/careers"
                  className="block w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-center rounded-lg transition-colors"
                >
                  EXPLORE ALL PATHWAYS
                </Link>
              </div>
            </div>
          </div>

          <section className="mt-6 rounded-[24px] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
                <Trophy size={20} />
              </span>
              <h2 className="text-[11px] tracking-[0.15em] text-slate-400 uppercase font-semibold">
                Continue Activity
              </h2>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {continueActivities.map((activity) => (
                <Link
                  key={activity.title}
                  to={activity.route}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition-all hover:border-indigo-200 hover:bg-indigo-50"
                >
                  <span className="inline-flex rounded-2xl bg-white p-3 text-slate-700">
                    {activity.icon}
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-slate-900">
                    {activity.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {activity.progress}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* College Shortlist */}
          <div className="mt-6">
            <h2 className="text-[11px] tracking-[0.15em] text-slate-400 uppercase font-semibold mb-4">
              College Shortlist
            </h2>

            {shortlistedUniversities.length ? (
              <div className="grid gap-3 mb-4 md:grid-cols-3">
                {shortlistedUniversities.slice(0, 3).map((university) => (
                  <div
                    key={university._id}
                    className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100"
                  >
                    <p className="text-sm font-bold text-slate-900">
                      {university.name}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.14em] text-slate-500">
                      {university.city}
                      {university.state ? `, ${university.state}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm mb-4">
                No colleges shortlisted yet.
              </p>
            )}

            <Link
              to="/university"
              className="inline-flex items-center gap-2 px-8 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Target className="w-4 h-4" />
              UNIVERSITY PREP
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
