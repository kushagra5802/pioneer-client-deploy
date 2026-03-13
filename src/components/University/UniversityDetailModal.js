"use client"

import { X, Heart, TrendingUp, ExternalLink } from "lucide-react"

export default function UniversityDetailModal({ university, onClose }) {
  if (!university) return null

  const {
    name,
    city,
    state,
    rankAccreditation,
    modeOfEntry,
    acceptanceRate,
    entranceExams = [],
    cutOffTrend,
    officialWebsite,
  } = university

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-800 px-8 py-8">
          <div className="flex items-start justify-between mb-4">
            {rankAccreditation && (
              <span className="inline-flex px-3 py-1.5 bg-teal-500 text-white text-[10px] font-bold tracking-wider uppercase rounded">
                {rankAccreditation}
              </span>
            )}

            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-full bg-teal-500 hover:bg-teal-600 flex items-center justify-center transition-colors">
                <Heart className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-300" />
              </button>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">{name}</h1>
          <p className="text-slate-400 text-sm uppercase tracking-wider">
            {city}
            {state ? `, ${state}` : ""}
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Mode of Entry & Acceptance Rate */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Mode of Entry
              </h3>
              <p className="text-slate-900 font-semibold">
                {modeOfEntry || "—"}
              </p>
            </div>
            <div>
              <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Acceptance Rate
              </h3>
              <p className="text-slate-900 font-semibold">
                {acceptanceRate || "—"}
              </p>
            </div>
          </div>

          {/* Entrance Exams */}
          <div className="bg-slate-50 rounded-xl p-5 mb-6">
            <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Entrance Exams
            </h3>

            {entranceExams.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {entranceExams.map((exam, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-white text-slate-700 text-sm font-medium rounded-lg border border-slate-200"
                  >
                    {exam}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No entrance exams required</p>
            )}
          </div>

          {/* Cut-off Trend */}
          <div className="mb-8">
            <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Cut-off Trend (Last 3 Years)
            </h3>
            <div className="flex items-center gap-2 text-teal-600">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">
                {cutOffTrend || "—"}
              </span>
            </div>
          </div>

          {/* Visit Website */}
          {officialWebsite && (
            <button
              onClick={() => window.open(officialWebsite, "_blank")}
              className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl 
                transition-colors flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Visit Official Website
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
