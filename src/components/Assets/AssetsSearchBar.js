// import { Plus, Search } from "lucide-react"

// export default function AssetsSearchBar({
//   activeTab,
//   searchQuery,
//   setSearchQuery,
//   onAdd,
// }) {
//   return (
//     <div className="p-6 flex justify-between gap-4">
//       <div className="relative flex-1 max-w-md">
//         <Search className="absolute left-3 top-1/2 w-5 h-5 text-slate-400 -translate-y-1/2" />
//         <input
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           placeholder={
//             activeTab === "employees"
//               ? "Search employees..."
//               : "Search students..."
//           }
//           className="w-full pl-10 pr-4 py-2.5 border rounded-xl"
//         />
//       </div>

//       <button
//         onClick={onAdd}
//         className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 text-white rounded-xl"
//       >
//         <Plus className="w-4 h-4" />
//         Add {activeTab === "employees" ? "School Admin" : "Student"}
//       </button>
//     </div>
//   )
// }


import { Plus, Search, BookOpen } from "lucide-react";

export default function AssetsSearchBar({
  activeTab,
  searchQuery,
  setSearchQuery,
  onAddStudent,
  onAddAcademics,
}) {
  return (
    <div className="p-6 flex justify-between gap-4">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 w-5 h-5 text-slate-400 -translate-y-1/2" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            activeTab === "employees"
              ? "Search employees..."
              : "Search students..."
          }
          className="w-full pl-10 pr-4 py-2.5 border rounded-xl"
        />
      </div>

      {/* Actions */}
      {activeTab === "employees" ? (
        <button
          onClick={onAddStudent}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 text-white rounded-xl"
        >
          <Plus className="w-4 h-4" />
          Add School Admin
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={onAddStudent}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 text-white rounded-xl"
          >
            <Plus className="w-4 h-4" />
            Add Student
          </button>

          <button
            onClick={onAddAcademics}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl"
          >
            <BookOpen className="w-4 h-4" />
            Add Student Academics
          </button>
        </div>
      )}
    </div>
  );
}
