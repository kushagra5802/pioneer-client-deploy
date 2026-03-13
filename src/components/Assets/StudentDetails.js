import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import useAxiosInstance from "../../lib/useAxiosInstance"
import { useNavigate } from "react-router-dom"
import { BookOpen, User, MapPin, ConstructionIcon, Phone, Mail, ArrowLeft, Eye, EyeOff } from "lucide-react"

export default function StudentDetails() {
  const axios = useAxiosInstance()
  const navigate = useNavigate()
  const { studentId } = useParams()
  const [activeTab, setActiveTab] = useState("details")
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
    const [selectedExamType, setSelectedExamType] = useState("")
    const [showPassword, setShowPassword] = useState(false)

  const fetchStudent = async (studentId) => {
    const { data } = await axios.get(`/api/students/${studentId}`)
    return data?.data
  }

  const fetchStudentMarks = async (studentId) => {
    const { data } = await axios.get(
      `/api/students/getStudentMarks/${studentId}`
    )
    return data?.data
  }

  const { data: student, isLoading: studentLoading } = useQuery({
    queryKey: ["student", studentId],
    queryFn: () => fetchStudent(studentId),
  })
  const { data: marks, isLoading: marksLoading } = useQuery({
    queryKey: ["studentMarks", studentId],
    queryFn: () => fetchStudentMarks(studentId),
  })

  console.log("marks",marks)

  const academicRecords = marks || []

    const academicYears = [...new Set(academicRecords.map(r => r.academicYear))]
    const classGrades = [...new Set(academicRecords.map(r => r.classGrade))]
    const examTypes = [...new Set(academicRecords.map(r => r.exam?.type))]

    useEffect(() => {
      if (academicYears.length && !selectedYear) setSelectedYear(academicYears[0])
      if (classGrades.length && !selectedClass) setSelectedClass(classGrades[0])
      if (examTypes.length && !selectedExamType) setSelectedExamType(examTypes[0])
    }, [academicYears, classGrades, examTypes])
    
    const filteredRecords = academicRecords.filter(r => {
  if (selectedYear && r.academicYear !== selectedYear) return false
  if (selectedClass && r.classGrade !== selectedClass) return false
  if (selectedExamType && r.exam?.type !== selectedExamType) return false
  return true
})
const selectedRecord = filteredRecords[0] || null

    // const selectedRecord = academicRecords.find(r => {
    // if (selectedYear && r.academicYear !== selectedYear) return false
    // if (selectedClass && r.classGrade !== selectedClass) return false
    // if (selectedExamType && r.exam?.type !== selectedExamType) return false
    // return true
    // }) || academicRecords[0]

  if (studentLoading) return <div>Loading student...</div>
    console.log("selectedRecord",selectedRecord)
  return (
    <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
            <button
            onClick={() => navigate("/assets")}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
            <ArrowLeft className="w-4 h-4" />
            Back to Students
            </button>

            <div className="text-right">
            <p className="text-[10px] font-semibold tracking-wider text-indigo-400 uppercase">
                Student Details
            </p>
            <p className="text-sm font-semibold text-slate-900">
                {student?.personalInfo?.fullName}
            </p>
            </div>
        </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* MAIN CARD */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border overflow-hidden">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-8 text-white">
            <h1 className="text-3xl font-bold">
              {student?.personalInfo?.fullName}
            </h1>
            <p className="text-indigo-100 mt-1">
              Student ID: {student?.studentId}
            </p>
          </div>

          {/* TABS */}
          <div className="border-b px-8 pt-6 flex gap-6">
            <button
              onClick={() => setActiveTab("details")}
              className={`pb-3 font-medium ${
                activeTab === "details"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-slate-400"
              }`}
            >
              Details
            </button>

            {student?.examResults.length>0 && <button
              onClick={() => setActiveTab("academic")}
              className={`pb-3 font-medium ${
                activeTab === "academic"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-slate-400"
              }`}
            >
              Academic Results
            </button>}
          </div>

          {/* CONTENT */}
          <div className="p-8 space-y-8">

            {/* DETAILS TAB */}
            {activeTab === "details" && (
              <>
                {/* Academic Info */}
                <div>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    Academic Information
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <InfoCard label="Class" value={student?.academicInfo?.classGrade} />
                    <InfoCard label="Section" value={student?.academicInfo?.section} />
                    <InfoCard label="Roll No" value={student?.academicInfo?.rollNumber} />
                  </div>
                </div>

                {/* Personal Info */}
                <div>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-600" />
                    Personal Information
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <InfoCard label="Gender" value={student?.personalInfo?.gender} />
                    <InfoCard label="Date of Birth" value={new Date(student?.personalInfo?.dateOfBirth).toLocaleDateString()} />
                    <InfoCard label="Phone Number" value={student?.contactInfo?.mobileNumber} />
                    <InfoCard label="Email" value={student?.contactInfo?.studentEmail} />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    Location Information
                  </h2>
                    <InfoCard label="Address" value={student?.addressInfo?.address} />
                  <div className="grid grid-cols-2 gap-4 mt-5">
                    <InfoCard label="City" value={student?.addressInfo?.city} />
                    <InfoCard label="State" value={student?.addressInfo?.state} />
                  </div>
                </div>
              </>
            )}

            {/* ACADEMIC TAB */}
            {activeTab === "academic" && (
                <>
                    {marksLoading ? (
                    <div>Loading academic records...</div>
                    ) : !selectedRecord ? (
                    <div className="text-slate-500">No academic data available</div>
                    ) : (
                    <div className="space-y-8">

                        {/* FILTERS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase">
                            Academic Year
                            </label>
                            <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="w-full mt-1 border rounded-lg p-2"
                            >
                            {academicYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase">
                            Class Grade
                            </label>
                            <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full mt-1 border rounded-lg p-2"
                            >
                            <option value="">All</option>
                            {classGrades.map(classGrade => (
                                <option key={classGrade} value={classGrade}>{classGrade}</option>
                            ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase">
                            Exam Type
                            </label>
                            <select
                            value={selectedExamType}
                            onChange={(e) => setSelectedExamType(e.target.value)}
                            className="w-full mt-1 border rounded-lg p-2"
                            >
                            <option value="">All</option>
                            {examTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                            </select>
                        </div>
                        </div>

                        {/* SUMMARY CARDS (LIKE DETAILS TAB) */}
                        <div>
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-indigo-600" />
                            Exam Summary
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="relative">
                              <InfoCard label="Result" value={selectedRecord.resultStatus} />
                              <span
                                className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full
                                  ${
                                    selectedRecord.resultStatus === "PASS"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                              >
                                {selectedRecord.resultStatus}
                              </span>
                            </div>
                            <InfoCard label="Academic Year" value={selectedRecord.academicYear} />
                            <InfoCard label="Class" value={selectedRecord.classGrade} />
                            <InfoCard label="Section" value={selectedRecord.section} />
                            <InfoCard label="Exam" value={selectedRecord.exam?.name} />
                            {/* <InfoCard label="Result" value={selectedRecord.resultStatus} /> */}
                            <InfoCard
                            label="Percentage"
                            value={`${selectedRecord.percentage}%`}
                            />
                        </div>
                        </div>

                        {/* TOTAL MARKS */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <InfoCard
                            label="Total Marks"
                            value={`${selectedRecord.totalMarks} / ${selectedRecord.maxTotalMarks}`}
                        />
                        </div>

                    </div>
                    )}
                </>
            )}
          </div>
        </div>
        {activeTab === 'academic' && 
            (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Subject-wise Performance
                </h3>
                
                <div className="space-y-3">
                    {selectedRecord.subjects?.map((subj, idx) => {
                    const pct = Math.round((subj.marksObtained / subj.maxMarks) * 100)

                    return (
                      <div
                        key={idx}
                        className="bg-slate-50 border rounded-xl p-4 space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-slate-800">
                              {subj.subjectName}
                            </p>
                            <p className="text-xs text-slate-400">
                              {subj.marksObtained} / {subj.maxMarks}
                            </p>
                          </div>
                          <span className="font-semibold text-slate-700">
                            {pct}%
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all
                              ${pct >= 75 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500"}
                            `}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
            </div>
        )
        }
        {/* Sidebar Cards */}
         {activeTab==="details" && <div className="space-y-6">
            {/* Parent/Guardian Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Parent/Guardian</h3>
              <div className="space-y-4">
                {student?.familyInfo?.fatherName && <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Father</p>
                  <p className="text-sm font-medium text-slate-900">{student?.familyInfo?.fatherName || student?.familyInfo?.guardianName}</p>
                </div>}
                {student?.familyInfo?.motherName && <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Mother</p>
                  <p className="text-sm font-medium text-slate-900">{student.familyInfo?.motherName}</p>
                </div>}
                {student?.guardianName && (
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Guardian</p>
                    <p className="text-sm font-medium text-slate-900">{student.guardianName}</p>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-4">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Parent Contact</p>
                  <a
                    href={`tel:${student?.familyInfo.parentMobile}`}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-2"
                  >
                    <Phone className="w-4 h-4" />
                    {student?.familyInfo.parentMobile}
                  </a>
                  <a
                    href={`mailto:${student?.familyInfo.parentEmail}`}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    {student?.familyInfo?.parentEmail}
                  </a>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Additional Info</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                    Student Password
                  </p>

                  <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                    <p className="text-sm font-medium text-slate-900 tracking-wider">
                      {showPassword
                        ? student?.studentPassword || "N/A"
                        : student?.studentPassword
                        ? "••••••••"
                        : "N/A"}
                    </p>

                    {student?.studentPassword && (
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-500 hover:text-indigo-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Parent Occupation</p>
                  <p className="text-sm font-medium text-slate-900">{student?.familyInfo.parentOccupation || "N/A"}</p>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Member Since</p>
                  <p className="text-sm font-medium text-slate-900">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>}
      </div>
    </div>
  )
}

/* Reusable UI helpers */

function InfoCard({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-lg p-4">
      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-sm font-semibold text-slate-900">
        {value || "N/A"}
      </p>
    </div>
  )
}

function SidebarItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-sm font-medium text-slate-900">
        {value || "N/A"}
      </p>
    </div>
  )
}
