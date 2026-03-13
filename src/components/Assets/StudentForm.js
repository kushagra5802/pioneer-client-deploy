import { useContext, useState, useRef } from "react";
import {  } from "lucide-react";
import { X, User, MapPin, Users, FileSpreadsheet, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";

import useAxiosInstance from "../../lib/useAxiosInstance";
import AssetsContext from "../../context/assetContext";

/* -------------------- CONSTANTS -------------------- */

const states = [
  "Andhra Pradesh",
  "Bihar",
  "Delhi",
  "Gujarat",
  "Karnataka",
  "Kerala",
  "Maharashtra",
  "Tamil Nadu",
  "Uttar Pradesh",
  "West Bengal",
];

const classes = ["6th", "7th", "8th", "9th", "10th", "11th", "12th"];
const sections = ["A", "B", "C", "D"];
const genders = ["Male", "Female", "Other"];

/* -------------------- VALIDATION -------------------- */

const schema = Yup.object({
  personalInfo: Yup.object({
    fullName: Yup.string().required("Student name required"),
    dateOfBirth: Yup.string().required("Date of birth required"),
    gender: Yup.string().required(),
  }),
  academicInfo: Yup.object({
    classGrade: Yup.string().required("Class required"),
    rollNumber: Yup.string().required("Roll number required"),
    section: Yup.string(),
  }),
  addressInfo: Yup.object({
    state: Yup.string().required("State required"),
    city: Yup.string().required("City required"),
    address: Yup.string(),
  }),
  contactInfo: Yup.object({
    mobileNumber: Yup.string(),
    studentEmail: Yup.string().email("Invalid email"),
  }),
  familyInfo: Yup.object({
    fatherName: Yup.string(),
    motherName: Yup.string(),
    guardianName: Yup.string(),
    parentMobile: Yup.string().required("Parent mobile required"),
    parentEmail: Yup.string()
      .email("Invalid email")
      .required("Parent email required"),
    parentOccupation: Yup.string(),
  }),
});

/* -------------------- COMPONENT -------------------- */

const StudentForm = ({ isOpen }) => {
  const { setStudentModalOpen, addStudent } = useContext(AssetsContext);
  const axios = useAxiosInstance();
  const [mode, setMode] = useState("form");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      personalInfo: { gender: "Male" },
    },
  });

  const closeModal = () => {
    setStudentModalOpen(false);
    reset();
  };

  const onSubmit = async (values) => {
    try {
      const res = await axios.post("/api/students", values);
      toast.success("Student added successfully");
      closeModal();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add student");
    }
  };

  if (!isOpen) return null;

  const handleBulkUpload = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("csvFile", file);

      await axios.post("/api/students/uploadSheet", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Students uploaded successfully");
      closeModal();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Bulk upload failed"
      );
    } finally {
      setIsUploading(false);
    }
  };

  /* -------------------- INPUT COMPONENTS -------------------- */

  const InputField = ({ name, placeholder, type = "text" }) => (
    <div className="flex flex-col gap-1.5">
      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={`w-full px-4 py-3 rounded-lg border bg-white
          ${errors?.[name]?.message ? "border-red-400" : "border-slate-200"}`}
      />
      {errors?.[name]?.message && (
        <span className="text-xs text-red-500">
          {errors[name]?.message}
        </span>
      )}
    </div>
  );

  const SelectField = ({ name, options }) => (
    <select
      {...register(name)}
      className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white"
    >
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );

  /* -------------------- UI -------------------- */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={closeModal}
      />

      <div className="relative w-full max-w-3xl mx-4 bg-slate-100 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-slate-800 px-8 py-6 flex justify-between">
          <h2 className="text-xl font-semibold text-white">Add Student</h2>
          <button onClick={closeModal}>
            <X className="text-white" />
          </button>
        </div>

        <div className="px-8 pt-6">
          <div className="flex gap-2 p-1 bg-slate-200 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setMode("form")}
              className={`px-6 py-2 rounded-lg text-sm font-medium ${
                mode === "form"
                  ? "bg-white shadow text-slate-900"
                  : "text-slate-600"
              }`}
            >
              Form Fill
            </button>
            <button
              type="button"
              onClick={() => setMode("bulk")}
              className={`px-6 py-2 rounded-lg text-sm font-medium ${
                mode === "bulk"
                  ? "bg-white shadow text-slate-900"
                  : "text-slate-600"
              }`}
            >
              Bulk Upload
            </button>
          </div>
        </div>

        {mode === "bulk" ? (
          <div className="p-8">
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileSpreadsheet className="w-8 h-8 text-indigo-500" />
              </div>

              <h3 className="text-lg font-semibold mb-2">
                Upload Student Excel File
              </h3>

              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />

              <div
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed rounded-xl p-8 cursor-pointer hover:bg-indigo-50"
              >
                <Upload className="mx-auto mb-2 text-slate-400" />
                <p className="text-sm">
                  {file ? file.name : "Click to upload Excel / CSV"}
                </p>
              </div>

              <button
                onClick={handleBulkUpload}
                disabled={isUploading}
                className="mt-6 px-8 py-3 bg-indigo-500 text-white rounded-lg disabled:opacity-50"
              >
                {isUploading ? "Uploading..." : "Add Students"}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            {/* Basic Info */}
            <section className="bg-white p-6 rounded-xl">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <User className="w-4 h-4" /> Basic Info
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  name="personalInfo.fullName"
                  placeholder="Full Name"
                />
                <InputField
                  name="personalInfo.dateOfBirth"
                  type="date"
                />
                <SelectField
                  name="personalInfo.gender"
                  options={genders}
                />
                <InputField
                  name="contactInfo.mobileNumber"
                  placeholder="Student Mobile"
                />
                <InputField
                  name="contactInfo.studentEmail"
                  placeholder="Student Email"
                />
              </div>
            </section>

            {/* Academic */}
            <section className="bg-white p-6 rounded-xl">
              <h3 className="text-sm font-semibold mb-4">Academic Info</h3>
              <div className="grid grid-cols-3 gap-4">
                <SelectField
                  name="academicInfo.classGrade"
                  options={classes}
                />
                <SelectField
                  name="academicInfo.section"
                  options={sections}
                />
                <InputField
                  name="academicInfo.rollNumber"
                  placeholder="Roll Number"
                />
              </div>
            </section>

            {/* Address */}
            <section className="bg-white p-6 rounded-xl">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Address
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  name="addressInfo.state"
                  options={states}
                />
                <InputField
                  name="addressInfo.city"
                  placeholder="City"
                />
                <InputField
                  name="addressInfo.address"
                  placeholder="Address"
                />
              </div>
            </section>

            {/* Family */}
            <section className="bg-slate-800 p-6 rounded-xl text-white">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Users className="w-4 h-4" /> Parent / Guardian
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <InputField name="familyInfo.fatherName" placeholder="Father Name" />
                <InputField name="familyInfo.motherName" placeholder="Mother Name" />
                <InputField
                  name="familyInfo.parentMobile"
                  placeholder="Parent Mobile"
                />
                <InputField
                  name="familyInfo.parentEmail"
                  placeholder="Parent Email"
                />
              </div>
            </section>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-3 rounded-lg text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-indigo-500 text-white rounded-lg"
              >
                {isSubmitting ? "Saving..." : "Add Student"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default StudentForm;
