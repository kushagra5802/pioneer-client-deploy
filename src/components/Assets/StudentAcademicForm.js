"use client";

import { useContext, useState, useRef, useEffect } from "react";
import {
  X,
  FileSpreadsheet,
  Upload,
  User,
  BookOpen
} from "lucide-react";
import { toast } from "react-toastify";

import useAxiosInstance from "../../lib/useAxiosInstance";
import AssetsContext from "../../context/assetContext";

/* -------------------- CONSTANTS -------------------- */

const exams = ["UNIT_TEST", "MIDTERM", "FINAL"];
const academicYears = ["2023-24", "2024-25"];

/* -------------------- COMPONENT -------------------- */

const StudentAcademicForm = ({ isOpen }) => {
  const { setAcademicModalOpen } = useContext(AssetsContext);
  const axios = useAxiosInstance();

  const [mode, setMode] = useState("single");
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedStudent, setSelectedStudent] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [exam, setExam] = useState("");
  const [marks, setMarks] = useState({});

  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  /* -------------------- FETCH DATA -------------------- */

  useEffect(() => {
    if (isOpen) {
      fetchStudents();
    }
  }, [isOpen]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("/api/students");
      setStudents(res.data.data || []);
    } catch {
      toast.error("Failed to fetch students");
    }
  };

  const fetchSubjects = async (classGrade) => {
    try {
      const res = await axios.get(`/api/subjects?class=${classGrade}`);
      setSubjects(res.data.data || []);
    } catch {
      toast.error("Failed to fetch subjects");
    }
  };

  /* -------------------- HANDLERS -------------------- */

  const closeModal = () => {
    setAcademicModalOpen(false);
    setMode("single");
    setFile(null);
    setMarks({});
    setSelectedStudent("");
  };

  const handleStudentChange = (studentId) => {
    setSelectedStudent(studentId);
    const student = students.find(s => s._id === studentId);
    if (student?.academicInfo?.classGrade) {
      fetchSubjects(student.academicInfo.classGrade);
    }
  };

  const handleMarksChange = (subjectId, value) => {
    setMarks(prev => ({
      ...prev,
      [subjectId]: value
    }));
  };

  /* -------------------- SINGLE SUBMIT -------------------- */

  const handleSingleSubmit = async () => {
    if (!selectedStudent || !academicYear || !exam) {
      toast.error("Please fill all required fields");
      return;
    }

    const subjectPayload = subjects.map(sub => ({
      subjectId: sub._id,
      marksObtained: Number(marks[sub._id] || 0)
    }));

    try {
      await axios.post("/api/academics/student", {
        studentId: selectedStudent,
        academicYear,
        exam,
        subjects: subjectPayload
      });

      toast.success("Academic record added");
      closeModal();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save record");
    }
  };

  /* -------------------- BULK UPLOAD -------------------- */

  const handleBulkUpload = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("csvFile", file);

      await axios.post("/api/students/uploadMarks", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success("Marks uploaded successfully");
      closeModal();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  /* -------------------- UI -------------------- */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/60" onClick={closeModal} />

      <div className="relative w-full max-w-3xl bg-slate-100 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="bg-slate-800 px-8 py-6 flex justify-between">
          <h2 className="text-xl text-white font-semibold">
            Add Academic Record
          </h2>
          <button onClick={closeModal}>
            <X className="text-white" />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="px-8 pt-6">
          <div className="flex gap-2 bg-slate-200 p-1 rounded-xl w-fit">
            <button
              onClick={() => setMode("single")}
              className={`px-6 py-2 rounded-lg ${
                mode === "single" ? "bg-white shadow" : ""
              }`}
            >
              Single Entry
            </button>
            <button
              onClick={() => setMode("bulk")}
              className={`px-6 py-2 rounded-lg ${
                mode === "bulk" ? "bg-white shadow" : ""
              }`}
            >
              Bulk Upload
            </button>
          </div>
        </div>

        {/* BULK UPLOAD */}
        {mode === "bulk" ? (
          <div className="p-8 text-center">
            <FileSpreadsheet className="mx-auto text-indigo-500 mb-4" size={40} />
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />

            <div
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed rounded-xl p-8 cursor-pointer"
            >
              <Upload className="mx-auto mb-2 text-slate-400" />
              {file ? file.name : "Click to upload Excel"}
            </div>

            <button
              onClick={handleBulkUpload}
              disabled={isUploading}
              className="mt-6 px-8 py-3 bg-indigo-500 text-white rounded-lg"
            >
              {isUploading ? "Uploading..." : "Upload Marks"}
            </button>
          </div>
        ) : (
          /* SINGLE ENTRY */
          <div className="p-8 space-y-6">
            {/* Student Selection */}
            <div>
              <label className="text-sm font-medium">Student</label>
              <select
                className="w-full px-4 py-3 rounded-lg border"
                onChange={(e) => handleStudentChange(e.target.value)}
              >
                <option value="">Select Student</option>
                {students.map(s => (
                  <option key={s._id} value={s._id}>
                    {s.studentId} - {s.personalInfo.fullName}
                  </option>
                ))}
              </select>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-4">
              <select
                className="px-4 py-3 rounded-lg border"
                onChange={(e) => setAcademicYear(e.target.value)}
              >
                <option value="">Academic Year</option>
                {academicYears.map(y => (
                  <option key={y}>{y}</option>
                ))}
              </select>

              <select
                className="px-4 py-3 rounded-lg border"
                onChange={(e) => setExam(e.target.value)}
              >
                <option value="">Exam</option>
                {exams.map(ex => (
                  <option key={ex}>{ex}</option>
                ))}
              </select>
            </div>

            {/* Marks */}
            {subjects.map(sub => (
              <div key={sub._id} className="flex justify-between gap-4">
                <span>{sub.name}</span>
                <input
                  type="number"
                  max={sub.maxMarks}
                  className="w-32 px-3 py-2 border rounded"
                  onChange={(e) =>
                    handleMarksChange(sub._id, e.target.value)
                  }
                />
              </div>
            ))}

            <button
              onClick={handleSingleSubmit}
              className="w-full mt-4 bg-indigo-500 text-white py-3 rounded-lg"
            >
              Save Academic Record
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAcademicForm;
