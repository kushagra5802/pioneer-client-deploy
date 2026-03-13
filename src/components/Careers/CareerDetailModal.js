"use client"

import { X, Heart } from "lucide-react"

export default function CareerDetailModal({ career, onClose }) {
  if (!career) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header - Dark Slate */}
        <div className="bg-slate-800 px-8 py-8">
          <div className="flex items-start justify-between mb-4">
            <span className="inline-flex px-4 py-1.5 bg-slate-700 text-slate-200 text-xs font-semibold tracking-wider uppercase rounded-full">
              {career.industry}
            </span>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors">
                <Heart className="w-4 h-4" />
                SHORTLIST
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-300" />
              </button>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">{career.title}</h1>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Role Description & Progression */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2 bg-slate-50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-indigo-500 rounded-full" />
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  What The Role Entails
                </h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {career.description}
              </p>
            </div>

            <div className="bg-indigo-600 rounded-xl p-6 text-white">
              <h3 className="text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-3">
                Progression
              </h3>
              <p className="text-lg font-semibold">
                {career.progression}
              </p>
            </div>
          </div>

          {/* Key Skills */}
          {career.keySkills?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Key Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {career.keySkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg border border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Institutions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Top Institutions India */}
            {career.topInstitutionsIndia?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Top Institutions (India)
                </h3>
                <div className="space-y-3">
                  {career.topInstitutionsIndia.map((institution, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100"
                    >
                      <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                      <span className="text-slate-700 font-medium">
                        {institution}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Global Pathways */}
            {career.globalPathways?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Global Pathways
                </h3>
                <div className="space-y-3">
                  {career.globalPathways.map((pathway, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100"
                    >
                      <div className="w-2 h-2 bg-slate-500 rounded-full" />
                      <span className="text-slate-700 font-medium">
                        {pathway}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
