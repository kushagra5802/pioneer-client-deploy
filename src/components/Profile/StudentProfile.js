import { useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { toast } from "react-toastify"
import useAxiosInstance from "../../lib/useAxiosInstance"
import PageHeader from "../PageHeader"
import {
  ContactRound, GraduationCap, MapPin, Phone, UsersRound, Award,
  Edit3, Save, X, Lock, KeyRound, CheckCircle, ChevronDown, ChevronUp, Eye, EyeOff
} from "lucide-react"

const GENDER_OPTIONS = ["Male", "Female", "Other"]

function SectionCard({ title, icon: Icon, iconColor, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${iconColor} flex items-center justify-center`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-slate-800">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="px-6 pb-6 pt-2">{children}</div>}
    </div>
  )
}

function Field({ label, value, editMode, type = "text", name, onChange, options }) {
  if (editMode && options) {
    return (
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
        <select
          name={name}
          value={value || ""}
          onChange={onChange}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="">Select {label}</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
    )
  }

  if (editMode) {
    return (
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    )
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
      <p className="text-slate-800 font-medium">{value || <span className="text-slate-400 font-normal">—</span>}</p>
    </div>
  )
}

export default function StudentProfile() {
  const axios = useAxiosInstance()
  const queryClient = useQueryClient()

  const [editSection, setEditSection] = useState(null)
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)

  const [pwMode, setPwMode] = useState(false)
  const [pwData, setPwData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false })
  const [pwSaving, setPwSaving] = useState(false)

  const { data: profileResponse, isLoading } = useQuery(
    "student-self-profile",
    async () => {
      const res = await axios.get("/api/students/profile/me")
      return res.data
    },
    { refetchOnWindowFocus: false, retry: 1 }
  )

  const profile = profileResponse?.data || {}

  const startEdit = (section) => {
    setEditSection(section)
    setFormData({
      personalInfo: { ...profile.personalInfo },
      academicInfo: { ...profile.academicInfo },
      addressInfo: { ...profile.addressInfo },
      contactInfo: { ...profile.contactInfo },
      familyInfo: { ...profile.familyInfo },
    })
  }

  const cancelEdit = () => {
    setEditSection(null)
    setFormData({})
  }

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }))
  }

  const handleSave = async (section) => {
    setSaving(true)
    try {
      const payload = { [section]: formData[section] }
      const res = await axios.put("/api/students/profile/me", payload)
      if (res.data?.status) {
        toast.success("Profile updated successfully")
        queryClient.invalidateQueries("student-self-profile")
        setEditSection(null)
      } else {
        toast.error(res.data?.message || "Failed to update")
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (pwData.newPassword !== pwData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    if (pwData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }
    setPwSaving(true)
    try {
      const res = await axios.put("/api/students/profile/me/password", {
        currentPassword: pwData.currentPassword,
        newPassword: pwData.newPassword,
      })
      if (res.data?.status) {
        toast.success("Password changed successfully")
        setPwMode(false)
        setPwData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      } else {
        toast.error(res.data?.message || "Failed to change password")
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to change password")
    } finally {
      setPwSaving(false)
    }
  }

  const EditActions = ({ section }) => (
    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
      <button
        onClick={() => handleSave(section)}
        disabled={saving}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
      >
        <Save className="w-4 h-4" />
        {saving ? "Saving..." : "Save Changes"}
      </button>
      <button
        onClick={cancelEdit}
        className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold rounded-xl transition-colors"
      >
        <X className="w-4 h-4" />
        Cancel
      </button>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <PageHeader name="My Profile" />
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-slate-500 text-sm">Loading your profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader name="My Profile" />

      <main className="px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-[340px_minmax(0,1fr)] gap-6 items-start">
          {/* LEFT: Sticky summary */}
          <aside className="space-y-6 xl:sticky xl:top-8">
            {/* Profile Header */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {profile.personalInfo?.fullName?.charAt(0)?.toUpperCase() || "S"}
                  </span>
                </div>
                <h1 className="text-xl font-bold mt-4">{profile.personalInfo?.fullName || "Student"}</h1>
                <p className="text-indigo-200 text-sm mt-1">
                  {profile.academicInfo?.classGrade && `Grade ${profile.academicInfo.classGrade}`}
                  {profile.academicInfo?.section && ` · Sec ${profile.academicInfo.section}`}
                  {profile.academicInfo?.rollNumber && ` · Roll ${profile.academicInfo.rollNumber}`}
                </p>
                {profile.studentId && (
                  <span className="inline-flex mt-3 text-xs bg-white/10 text-indigo-100 px-3 py-1 rounded-full font-medium">
                    ID: {profile.studentId}
                  </span>
                )}
              </div>
            </div>

            {/* At a glance */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">At a Glance</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm">
                  <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><Phone className="w-4 h-4" /></span>
                  <span className="text-slate-700 font-medium truncate">{profile.contactInfo?.mobileNumber || "—"}</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><MapPin className="w-4 h-4" /></span>
                  <span className="text-slate-700 font-medium truncate">
                    {[profile.addressInfo?.city, profile.addressInfo?.state].filter(Boolean).join(", ") || "—"}
                  </span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><GraduationCap className="w-4 h-4" /></span>
                  <span className="text-slate-700 font-medium truncate">
                    {profile.academicInfo?.classGrade ? `Class ${profile.academicInfo.classGrade}` : "—"}
                  </span>
                </li>
              </ul>
            </div>
          </aside>

          {/* RIGHT: Sections flow into balanced columns to fill the page */}
          <div className="gap-6 lg:columns-2 [column-fill:_balance] [&>*]:mb-6 [&>*]:break-inside-avoid">
        {/* Personal Information */}
        <SectionCard title="Personal Information" icon={ContactRound} iconColor="bg-indigo-500">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-500">Full name, date of birth, gender</span>
            {editSection !== "personalInfo" ? (
              <button
                onClick={() => startEdit("personalInfo")}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            ) : null}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field
              label="Full Name"
              name="fullName"
              value={editSection === "personalInfo" ? formData.personalInfo?.fullName : profile.personalInfo?.fullName}
              editMode={editSection === "personalInfo"}
              onChange={(e) => handleChange("personalInfo", "fullName", e.target.value)}
            />
            <Field
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={editSection === "personalInfo"
                ? formData.personalInfo?.dateOfBirth?.slice(0, 10)
                : profile.personalInfo?.dateOfBirth?.slice(0, 10)}
              editMode={editSection === "personalInfo"}
              onChange={(e) => handleChange("personalInfo", "dateOfBirth", e.target.value)}
            />
            <Field
              label="Gender"
              name="gender"
              value={editSection === "personalInfo" ? formData.personalInfo?.gender : profile.personalInfo?.gender}
              editMode={editSection === "personalInfo"}
              options={GENDER_OPTIONS}
              onChange={(e) => handleChange("personalInfo", "gender", e.target.value)}
            />
          </div>
          {editSection === "personalInfo" && <EditActions section="personalInfo" />}
        </SectionCard>

        {/* Academic Information */}
        <SectionCard title="Academic Information" icon={GraduationCap} iconColor="bg-indigo-500">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-500">Grade, section, roll number</span>
            {editSection !== "academicInfo" ? (
              <button
                onClick={() => startEdit("academicInfo")}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            ) : null}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Field
              label="Class / Grade"
              name="classGrade"
              value={editSection === "academicInfo" ? formData.academicInfo?.classGrade : profile.academicInfo?.classGrade}
              editMode={editSection === "academicInfo"}
              onChange={(e) => handleChange("academicInfo", "classGrade", e.target.value)}
            />
            <Field
              label="Section"
              name="section"
              value={editSection === "academicInfo" ? formData.academicInfo?.section : profile.academicInfo?.section}
              editMode={editSection === "academicInfo"}
              onChange={(e) => handleChange("academicInfo", "section", e.target.value)}
            />
            <Field
              label="Roll Number"
              name="rollNumber"
              value={editSection === "academicInfo" ? formData.academicInfo?.rollNumber : profile.academicInfo?.rollNumber}
              editMode={editSection === "academicInfo"}
              onChange={(e) => handleChange("academicInfo", "rollNumber", e.target.value)}
            />
          </div>
          {editSection === "academicInfo" && <EditActions section="academicInfo" />}
        </SectionCard>

        {/* Address Information */}
        <SectionCard title="Address Information" icon={MapPin} iconColor="bg-indigo-500" defaultOpen={false}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-500">State, city, address</span>
            {editSection !== "addressInfo" ? (
              <button
                onClick={() => startEdit("addressInfo")}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            ) : null}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field
              label="State"
              name="state"
              value={editSection === "addressInfo" ? formData.addressInfo?.state : profile.addressInfo?.state}
              editMode={editSection === "addressInfo"}
              onChange={(e) => handleChange("addressInfo", "state", e.target.value)}
            />
            <Field
              label="City"
              name="city"
              value={editSection === "addressInfo" ? formData.addressInfo?.city : profile.addressInfo?.city}
              editMode={editSection === "addressInfo"}
              onChange={(e) => handleChange("addressInfo", "city", e.target.value)}
            />
            <div className="sm:col-span-2">
              <Field
                label="Full Address"
                name="address"
                value={editSection === "addressInfo" ? formData.addressInfo?.address : profile.addressInfo?.address}
                editMode={editSection === "addressInfo"}
                onChange={(e) => handleChange("addressInfo", "address", e.target.value)}
              />
            </div>
          </div>
          {editSection === "addressInfo" && <EditActions section="addressInfo" />}
        </SectionCard>

        {/* Contact Information */}
        <SectionCard title="Contact Information" icon={Phone} iconColor="bg-indigo-500" defaultOpen={false}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-500">Mobile number, email address</span>
            {editSection !== "contactInfo" ? (
              <button
                onClick={() => startEdit("contactInfo")}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            ) : null}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field
              label="Mobile Number"
              name="mobileNumber"
              value={editSection === "contactInfo" ? formData.contactInfo?.mobileNumber : profile.contactInfo?.mobileNumber}
              editMode={editSection === "contactInfo"}
              onChange={(e) => handleChange("contactInfo", "mobileNumber", e.target.value)}
            />
            <Field
              label="Email Address"
              name="studentEmail"
              type="email"
              value={editSection === "contactInfo" ? formData.contactInfo?.studentEmail : profile.contactInfo?.studentEmail}
              editMode={editSection === "contactInfo"}
              onChange={(e) => handleChange("contactInfo", "studentEmail", e.target.value)}
            />
          </div>
          {editSection === "contactInfo" && <EditActions section="contactInfo" />}
        </SectionCard>

        {/* Family Information */}
        <SectionCard title="Family Information" icon={UsersRound} iconColor="bg-indigo-500" defaultOpen={false}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-500">Parents and guardian details</span>
            {editSection !== "familyInfo" ? (
              <button
                onClick={() => startEdit("familyInfo")}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            ) : null}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field
              label="Father's Name"
              name="fatherName"
              value={editSection === "familyInfo" ? formData.familyInfo?.fatherName : profile.familyInfo?.fatherName}
              editMode={editSection === "familyInfo"}
              onChange={(e) => handleChange("familyInfo", "fatherName", e.target.value)}
            />
            <Field
              label="Mother's Name"
              name="motherName"
              value={editSection === "familyInfo" ? formData.familyInfo?.motherName : profile.familyInfo?.motherName}
              editMode={editSection === "familyInfo"}
              onChange={(e) => handleChange("familyInfo", "motherName", e.target.value)}
            />
            <Field
              label="Guardian Name"
              name="guardianName"
              value={editSection === "familyInfo" ? formData.familyInfo?.guardianName : profile.familyInfo?.guardianName}
              editMode={editSection === "familyInfo"}
              onChange={(e) => handleChange("familyInfo", "guardianName", e.target.value)}
            />
            <Field
              label="Parent Mobile"
              name="parentMobile"
              value={editSection === "familyInfo" ? formData.familyInfo?.parentMobile : profile.familyInfo?.parentMobile}
              editMode={editSection === "familyInfo"}
              onChange={(e) => handleChange("familyInfo", "parentMobile", e.target.value)}
            />
            <Field
              label="Parent Email"
              name="parentEmail"
              type="email"
              value={editSection === "familyInfo" ? formData.familyInfo?.parentEmail : profile.familyInfo?.parentEmail}
              editMode={editSection === "familyInfo"}
              onChange={(e) => handleChange("familyInfo", "parentEmail", e.target.value)}
            />
            <Field
              label="Parent Occupation"
              name="parentOccupation"
              value={editSection === "familyInfo" ? formData.familyInfo?.parentOccupation : profile.familyInfo?.parentOccupation}
              editMode={editSection === "familyInfo"}
              onChange={(e) => handleChange("familyInfo", "parentOccupation", e.target.value)}
            />
          </div>
          {editSection === "familyInfo" && <EditActions section="familyInfo" />}
        </SectionCard>

        {/* Exam Results (read-only) */}
        {profile.examResults?.length > 0 && (
          <SectionCard title="Exam Results" icon={Award} iconColor="bg-indigo-500" defaultOpen={false}>
            <p className="text-xs text-slate-500 mb-4">Academic performance records (read-only)</p>
            <div className="space-y-3">
              {profile.examResults.map((exam, index) => (
                <div key={index} className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{exam.examType}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-400">{exam.academicYear}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-800">
                      {exam.totalMarks} / {exam.maxTotalMarks} marks
                    </div>
                    {exam.percentage !== undefined && (
                      <div className="text-xs text-slate-500 mt-0.5">{exam.percentage?.toFixed(1)}%</div>
                    )}
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                    exam.resultStatus === "PASS"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {exam.resultStatus === "PASS" ? (
                      <CheckCircle className="w-3.5 h-3.5" />
                    ) : (
                      <X className="w-3.5 h-3.5" />
                    )}
                    {exam.resultStatus}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Change Password */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <button
            onClick={() => setPwMode(!pwMode)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                <KeyRound className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-slate-800">Change Password</span>
            </div>
            {pwMode ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {pwMode && (
            <form onSubmit={handlePasswordChange} className="px-6 pb-6 pt-2">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPw.current ? "text" : "password"}
                      value={pwData.currentPassword}
                      onChange={(e) => setPwData(d => ({ ...d, currentPassword: e.target.value }))}
                      className="w-full px-4 py-2.5 pr-10 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(s => ({ ...s, current: !s.current }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPw.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPw.new ? "text" : "password"}
                      value={pwData.newPassword}
                      onChange={(e) => setPwData(d => ({ ...d, newPassword: e.target.value }))}
                      className="w-full px-4 py-2.5 pr-10 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(s => ({ ...s, new: !s.new }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPw.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPw.confirm ? "text" : "password"}
                      value={pwData.confirmPassword}
                      onChange={(e) => setPwData(d => ({ ...d, confirmPassword: e.target.value }))}
                      className="w-full px-4 py-2.5 pr-10 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(s => ({ ...s, confirm: !s.confirm }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPw.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {pwData.newPassword && pwData.confirmPassword && pwData.newPassword !== pwData.confirmPassword && (
                  <p className="text-xs text-red-500 font-medium">Passwords do not match</p>
                )}
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={pwSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
                >
                  <Lock className="w-4 h-4" />
                  {pwSaving ? "Updating..." : "Update Password"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPwMode(false)
                    setPwData({ currentPassword: "", newPassword: "", confirmPassword: "" })
                  }}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold rounded-xl transition-colors"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </form>
          )}
        </div>
          </div>
        </div>
      </main>
    </div>
  )
}
