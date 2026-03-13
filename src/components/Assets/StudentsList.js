import { Building2, ChevronLeft, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function StudentsList({
  students,
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  const navigate = useNavigate()
  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* {students.map((student) => (
                <div
                  key={student.studentId}
                  className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                      <span className="text-white font-semibold text-lg">
                        {student?.personalInfo?.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">{student.personalInfo?.fullName}</h3>
                      <p className="text-sm text-slate-500">
                        {student?.academicInfo?.classGrade} {student.academicInfo?.section && `- Section ${student.academicInfo?.section}`}
                      </p>
                    </div>
                    <span className="text-xs text-slate-400">{student?.studentId}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">#{student?.academicInfo?.rollNumber}</span>
                      <span className="text-xs text-slate-400">
                        {student?.addressInfo?.city}, {student?.addressInfo?.state}
                      </span>
                    </div>
                  </div>
                </div>
              ))} */}
        {students.map((student) => {
          const exam = student?.examResults?.[0]

          return (
            <div
              key={student.studentId}
              className="relative bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              onClick={() => navigate(`/assets/${student.studentId}`)}
            >
              {/* PASS / FAIL badge */}
              {exam && (
                <span
                  className={`absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded-full
                    ${
                      exam.resultStatus === "PASS"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                >
                  {exam.resultStatus}
                </span>
              )}

              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-white font-semibold text-lg">
                    {student?.personalInfo?.fullName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">
                    {student.personalInfo?.fullName}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {student?.academicInfo?.classGrade}
                    {student.academicInfo?.section &&
                      ` - Section ${student.academicInfo?.section}`}
                  </p>
                </div>
              </div>

              {/* Meta */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    #{student?.academicInfo?.rollNumber}
                  </span>
                  <span className="text-xs text-slate-400">
                    {student?.addressInfo?.city}, {student?.addressInfo?.state}
                  </span>
                </div>
              </div>

              {/* Percentage */}
              {exam && (
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-slate-500">Result %</span>
                  <span className="text-lg font-bold text-slate-900">
                    {exam.percentage}%
                  </span>
                </div>
              )}
            </div>
          )
        })}
  

      </div>

      {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
            <ChevronLeft />
          </button>
          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages, p + 1))
            }
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </>
  )
}
