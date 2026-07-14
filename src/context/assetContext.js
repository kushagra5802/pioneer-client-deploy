// "use client"

// import { createContext, useState } from "react"

// /* =======================
//    Context
// ======================= */

// const AssetsContext = createContext({
//   employeeModalOpen: false,
//   setEmployeeModalOpen: () => {},
//   studentModalOpen: false,
//   setStudentModalOpen: () => {},
//   academicModalOpen: false,
//   setAcademicModalOpen: () => {},
//   employees: [],
//   addEmployee: () => {},
//   students: [],
//   addStudent: () => {},
//   addStudentsBulk: () => {},
// })

// /* =======================
//    Sample Employees
// ======================= */

// const sampleEmployees = [
//   {
//     id: "1",
//     schoolId: "school-1",
//     firstName: "Rajesh",
//     lastName: "Kumar",
//     email: "rajesh.kumar@school.com",
//     phone: "+91 98765 43210",
//     role: "SCHOOL_ADMIN",
//     permissions: ["UPLOAD_MARKS", "VIEW_REPORTS", "MANAGE_USERS"],
//     isActive: true,
//     createdAt: new Date("2024-01-15"),
//   },
//   {
//     id: "2",
//     schoolId: "school-1",
//     firstName: "Priya",
//     lastName: "Sharma",
//     email: "priya.sharma@school.com",
//     phone: "+91 98765 43211",
//     role: "SCHOOL_ADMIN",
//     permissions: ["UPLOAD_MARKS", "VIEW_REPORTS"],
//     isActive: true,
//     createdAt: new Date("2024-02-20"),
//   },
//   {
//     id: "3",
//     schoolId: "school-1",
//     firstName: "Amit",
//     lastName: "Patel",
//     email: "amit.patel@school.com",
//     phone: "+91 98765 43212",
//     role: "SCHOOL_ADMIN",
//     permissions: ["VIEW_REPORTS"],
//     isActive: true,
//     createdAt: new Date("2024-03-10"),
//   },
//   {
//     id: "4",
//     schoolId: "school-2",
//     firstName: "Sneha",
//     lastName: "Gupta",
//     email: "sneha.gupta@school.com",
//     phone: "+91 98765 43213",
//     role: "SCHOOL_ADMIN",
//     permissions: ["UPLOAD_MARKS"],
//     isActive: false,
//     createdAt: new Date("2024-04-05"),
//   },
// ]

// /* =======================
//    Sample Students
// ======================= */

// const sampleStudents = [
//   {
//     id: "1",
//     admissionNumber: "2024001",
//     fullName: "Aarav Sharma",
//     dateOfBirth: "2008-05-15",
//     gender: "Male",
//     classGrade: "10th",
//     section: "A",
//     rollNumber: "01",
//     schoolId: "school-1",
//     schoolName: "Delhi Public School",
//     state: "Delhi",
//     city: "New Delhi",
//     address: "123, Green Park, New Delhi",
//     mobileNumber: "+91 98765 11111",
//     studentEmail: "aarav.s@student.com",
//     fatherName: "Vikram Sharma",
//     motherName: "Meera Sharma",
//     guardianName: "",
//     parentMobile: "+91 98765 22222",
//     parentEmail: "vikram.sharma@email.com",
//     parentOccupation: "Engineer",
//     createdAt: new Date("2024-01-10"),
//   },
//   {
//     id: "2",
//     admissionNumber: "2024002",
//     fullName: "Ananya Gupta",
//     dateOfBirth: "2008-08-22",
//     gender: "Female",
//     classGrade: "10th",
//     section: "A",
//     rollNumber: "02",
//     schoolId: "school-1",
//     schoolName: "Delhi Public School",
//     state: "Delhi",
//     city: "New Delhi",
//     address: "456, Saket, New Delhi",
//     mobileNumber: "+91 98765 33333",
//     studentEmail: "ananya.g@student.com",
//     fatherName: "Rahul Gupta",
//     motherName: "Priya Gupta",
//     guardianName: "",
//     parentMobile: "+91 98765 44444",
//     parentEmail: "rahul.gupta@email.com",
//     parentOccupation: "Doctor",
//     createdAt: new Date("2024-01-12"),
//   },
//   {
//     id: "3",
//     admissionNumber: "2024003",
//     fullName: "Rohan Patel",
//     dateOfBirth: "2008-03-10",
//     gender: "Male",
//     classGrade: "10th",
//     section: "B",
//     rollNumber: "01",
//     schoolId: "school-2",
//     schoolName: "St. Xavier's School",
//     state: "Maharashtra",
//     city: "Mumbai",
//     address: "789, Andheri West, Mumbai",
//     mobileNumber: "+91 98765 55555",
//     studentEmail: "rohan.p@student.com",
//     fatherName: "Kiran Patel",
//     motherName: "Neha Patel",
//     guardianName: "",
//     parentMobile: "+91 98765 66666",
//     parentEmail: "kiran.patel@email.com",
//     parentOccupation: "Business",
//     createdAt: new Date("2024-01-15"),
//   },
// ]

// /* =======================
//    Provider
// ======================= */

// export const AssetsProvider = ({ children }) => {
//   const [employeeModalOpen, setEmployeeModalOpen] = useState(false)
//   const [studentModalOpen, setStudentModalOpen] = useState(false)
//   const [employees, setEmployees] = useState(sampleEmployees)
//   const [students, setStudents] = useState(sampleStudents)

//   const addEmployee = (employee) => {
//     const newEmployee = {
//       ...employee,
//       id: Date.now().toString(),
//       createdAt: new Date(),
//     }
//     setEmployees((prev) => [newEmployee, ...prev])
//   }

//   const addStudent = (student) => {
//     const newStudent = {
//       ...student,
//       id: Date.now().toString(),
//       createdAt: new Date(),
//     }
//     setStudents((prev) => [newStudent, ...prev])
//   }

//   const addStudentsBulk = (newStudents) => {
//     const studentsWithIds = newStudents.map((s, index) => ({
//       ...s,
//       id: (Date.now() + index).toString(),
//       createdAt: new Date(),
//     }))
//     setStudents((prev) => [...studentsWithIds, ...prev])
//   }

//   return (
//     <AssetsContext.Provider
//       value={{
//         employeeModalOpen,
//         setEmployeeModalOpen,
//         studentModalOpen,
//         setStudentModalOpen,
//         employees,
//         addEmployee,
//         students,
//         addStudent,
//         addStudentsBulk,
//       }}
//     >
//       {children}
//     </AssetsContext.Provider>
//   )
// }

// export default AssetsContext


"use client"

import { createContext, useState } from "react"

/* =======================
   Context
======================= */

const AssetsContext = createContext({
  employeeModalOpen: false,
  setEmployeeModalOpen: () => {},

  studentModalOpen: false,
  setStudentModalOpen: () => {},

  editingStudent: null,
  setEditingStudent: () => {},

  academicModalOpen: false,              // ✅ NEW
  setAcademicModalOpen: () => {},         // ✅ NEW

  employees: [],
  addEmployee: () => {},

  students: [],
  addStudent: () => {},
  addStudentsBulk: () => {},
})

/* =======================
   Sample Employees
======================= */

const sampleEmployees = [
  {
    id: "1",
    schoolId: "school-1",
    firstName: "Rajesh",
    lastName: "Kumar",
    email: "rajesh.kumar@school.com",
    phone: "+91 98765 43210",
    role: "SCHOOL_ADMIN",
    permissions: ["UPLOAD_MARKS", "VIEW_REPORTS", "MANAGE_USERS"],
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    schoolId: "school-1",
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya.sharma@school.com",
    phone: "+91 98765 43211",
    role: "SCHOOL_ADMIN",
    permissions: ["UPLOAD_MARKS", "VIEW_REPORTS"],
    isActive: true,
    createdAt: new Date("2024-02-20"),
  },
]

/* =======================
   Sample Students
======================= */

const sampleStudents = [
  {
    id: "1",
    admissionNumber: "2024001",
    fullName: "Aarav Sharma",
    classGrade: "10th",
    section: "A",
    rollNumber: "01",
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "2",
    admissionNumber: "2024002",
    fullName: "Ananya Gupta",
    classGrade: "10th",
    section: "A",
    rollNumber: "02",
    createdAt: new Date("2024-01-12"),
  },
]

/* =======================
   Provider
======================= */

export const AssetsProvider = ({ children }) => {
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false)
  const [studentModalOpen, setStudentModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)

  const [academicModalOpen, setAcademicModalOpen] = useState(false) // ✅ NEW

  const [employees, setEmployees] = useState(sampleEmployees)
  const [students, setStudents] = useState(sampleStudents)

  /* -----------------------
     Actions
  ------------------------ */

  const addEmployee = (employee) => {
    const newEmployee = {
      ...employee,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setEmployees((prev) => [newEmployee, ...prev])
  }

  const addStudent = (student) => {
    const newStudent = {
      ...student,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setStudents((prev) => [newStudent, ...prev])
  }

  const addStudentsBulk = (newStudents) => {
    const studentsWithIds = newStudents.map((s, index) => ({
      ...s,
      id: (Date.now() + index).toString(),
      createdAt: new Date(),
    }))
    setStudents((prev) => [...studentsWithIds, ...prev])
  }

  /* -----------------------
     Provider
  ------------------------ */

  return (
    <AssetsContext.Provider
      value={{
        employeeModalOpen,
        setEmployeeModalOpen,

        studentModalOpen,
        setStudentModalOpen,

        editingStudent,
        setEditingStudent,

        academicModalOpen,
        setAcademicModalOpen,         

        employees,
        addEmployee,

        students,
        addStudent,
        addStudentsBulk,
      }}
    >
      {children}
    </AssetsContext.Provider>
  )
}

export default AssetsContext
