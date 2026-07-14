import { useState, useContext } from "react"
import { useQuery } from "react-query"
import AssetsContext from "../../context/assetContext"
import PageHeader from "../PageHeader"
import AssetsTabs from "./AssetsTabs"
import EmployeesList from "./EmployeesList"
import StudentsList from "./StudentsList"
import AssetsSearchBar from "./AssetsSearchBar"
import EmployeeForm from "./EmployeeForm"
import StudentForm from "./StudentForm"
import useAxiosInstance from "../../lib/useAxiosInstance"
import StudentAcademicForm from "./StudentAcademicForm"

const ITEMS_PER_PAGE = 12

export default function AssetsContent() {
  const axios = useAxiosInstance()
  const {
    employeeModalOpen,
    studentModalOpen,
    academicModalOpen,
    setEmployeeModalOpen,
    setStudentModalOpen,
    setAcademicModalOpen,
    setEditingStudent
  } = useContext(AssetsContext)

  const [activeTab, setActiveTab] = useState("employees")
  const [searchQuery, setSearchQuery] = useState("")

  // Separate pagination states
  const [employeePage, setEmployeePage] = useState(1)
  const [studentPage, setStudentPage] = useState(1)

  /* =======================
     FETCH EMPLOYEES
  ======================= */

  const {
    data: employeesResponse,
    isLoading: employeesLoading,
    isError: employeesError,
  } = useQuery(
    ["schoolUsers", employeePage, searchQuery],
    async () => {
      const res = await axios.get("/api/schools/schoolUsers", {
        params: {
          page: employeePage,
          limit: ITEMS_PER_PAGE,
          keyword: searchQuery || undefined,
        },
      })
      return res.data
    },
    {
      enabled: activeTab === "employees",
      refetchOnWindowFocus: false,
      retry: 1,
      keepPreviousData: true,
    }
  )

  const employees = employeesResponse?.data || []
  const totalEmployees = employeesResponse?.total || employees.length
  const totalEmployeePages = Math.ceil(totalEmployees / ITEMS_PER_PAGE)
  /* =======================
     FETCH STUDENTS
  ======================= */

  const {
    data: studentsResponse,
    isLoading: studentsLoading,
    isError: studentsError,
  } = useQuery(
    ["students", studentPage, searchQuery],
    async () => {
      const res = await axios.get("/api/students", {
        params: {
          page: studentPage,
          limit: ITEMS_PER_PAGE,
          keyword: searchQuery || undefined,
        },
      })
      return res.data
    },
    {
      refetchOnWindowFocus: false,
      retry: 1,
      keepPreviousData: true,
    }
  )
  const students = studentsResponse?.data || []
  const totalStudents = studentsResponse?.total || students.length
  const totalStudentPages = Math.ceil(totalStudents / ITEMS_PER_PAGE)
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader name="Assets" />

      <main className="flex-1 pl-8">
        <div className="bg-white rounded-2xl shadow-sm border mb-6">
          <AssetsTabs
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab)
              setSearchQuery("")
              tab === "employees"
                ? setEmployeePage(1)
                : setStudentPage(1)
            }}
            employeesCount={totalEmployees}
            studentsCount={totalStudents}
          />
          <AssetsSearchBar
            activeTab={activeTab}
            searchQuery={searchQuery}
            setSearchQuery={(value) => {
                setSearchQuery(value)
                activeTab === "employees"
                ? setEmployeePage(1)
                : setStudentPage(1)
            }}
            onAddStudent={() => {
                if (activeTab === "employees") {
                  setEmployeeModalOpen(true)
                } else {
                  setEditingStudent(null)
                  setStudentModalOpen(true)
                }
            }}
            onAddAcademics={() => setAcademicModalOpen(true)}
            />
        </div>

        {/* =======================
            CONTENT
        ======================= */}

        {activeTab === "employees" ? (
          <EmployeesList
            employees={employees}
            isLoading={employeesLoading}
            isError={employeesError}
            currentPage={employeePage}
            totalPages={totalEmployeePages}
            setCurrentPage={setEmployeePage}
          />
        ) : (
          <StudentsList
            students={students}
            isLoading={studentsLoading}
            isError={studentsError}
            currentPage={studentPage}
            totalPages={totalStudentPages}
            setCurrentPage={setStudentPage}
          />
        )}
      </main>

      {/* Modals */}
      <EmployeeForm isOpen={employeeModalOpen} />
      <StudentForm isOpen={studentModalOpen} />
      <StudentAcademicForm isOpen={academicModalOpen} />
    </div>
  )
}
