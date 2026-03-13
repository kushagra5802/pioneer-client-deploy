export default function EmployeesList({ employees }) {

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "SCHOOL_ADMIN":
        return "bg-indigo-100 text-indigo-700"
      case "TEACHER":
        return "bg-emerald-100 text-emerald-700"
      case "COUNSELLOR":
        return "bg-amber-100 text-amber-700"
      case "DATA_OPERATOR":
        return "bg-slate-100 text-slate-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }
  
  const formatRole = (role) => {
    return role.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {employees.map((employee) => (
        <div
          key={employee.id}
          className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-semibold text-lg">
                  {employee.firstName[0]}
                  {employee.lastName[0]}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  {employee.firstName} {employee.lastName}
                </h3>
                <p className="text-sm text-slate-500">{employee.email}</p>
              </div>
            </div>
            <div
              className={`w-2.5 h-2.5 rounded-full ${employee.isActive ? "bg-emerald-500" : "bg-slate-300"}`}
              title={employee.isActive ? "Active" : "Inactive"}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(employee.role)}`}>
              {formatRole(employee.role)}
            </span>
            <span className="text-xs text-slate-400">{employee.phone}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
