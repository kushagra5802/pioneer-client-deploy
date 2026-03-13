import { Users, GraduationCap } from "lucide-react"

export default function AssetsTabs({
  activeTab,
  setActiveTab,
  employeesCount,
  studentsCount,
  reset,
}) {
  const tabClass = (tab) =>
    `flex items-center gap-2 px-6 py-4 font-medium text-sm relative ${
      activeTab === tab
        ? "text-indigo-600"
        : "text-slate-500 hover:text-slate-700"
    }`

  return (
    <div className="flex border-b">
      <button
        className={tabClass("employees")}
        onClick={() => {
          setActiveTab("employees")
          reset()
        }}
      >
        <Users className="w-4 h-4" />
        School Admins
        <span className="ml-2 badge">{employeesCount}</span>
      </button>

      <button
        className={tabClass("students")}
        onClick={() => {
          setActiveTab("students")
          reset()
        }}
      >
        <GraduationCap className="w-4 h-4" />
        Students
        <span className="ml-2 badge">{studentsCount}</span>
      </button>
    </div>
  )
}
