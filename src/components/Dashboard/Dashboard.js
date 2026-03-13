import { LogOut, Calendar, TrendingUp, BookOpen, Target } from "lucide-react"
import PageHeader from "../PageHeader"
import { Link } from "react-router-dom"

export default function DashboardPage() {
  const academicPerformance = [
    { subject: "Mathematics", percentage: 92 },
    { subject: "Physics", percentage: 88 },
    { subject: "Chemistry", percentage: 85 },
    { subject: "English", percentage: 95 },
  ]

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        
        {/* Header */}
        <PageHeader name="Dashboard"/>

        {/* Content */}
        <div className="flex-1 p-8">

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
                Next Exam
              </p>
              <p className="text-2xl font-bold mb-3">CUET-PG (Est)</p>
              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">APRIL 2026</span>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-3 gap-6">

            {/* Academic Performance */}
            <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm">
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

            {/* Career Shortlist */}
            <div className="bg-slate-800 rounded-xl p-6 shadow-sm text-white">
              <h2 className="text-[11px] tracking-[0.15em] text-slate-400 uppercase font-semibold mb-4">
                Career Shortlist
              </h2>

              <p className="text-slate-400 text-sm mb-6">
                Shortlist your top 3 careers to unlock targeted prep.
              </p>

              <Link
                to="/careers"
                className="block w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-center rounded-lg transition-colors"
              >
                EXPLORE ALL PATHWAYS
              </Link>
            </div>
          </div>

          {/* College Shortlist */}
          <div className="mt-6">
            <h2 className="text-[11px] tracking-[0.15em] text-slate-400 uppercase font-semibold mb-4">
              College Shortlist
            </h2>

            <p className="text-slate-400 text-sm mb-4">
              No colleges shortlisted yet.
            </p>

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
