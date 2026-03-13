"use client"

import React, { useContext, useState } from "react"
import { X, User, Mail, Phone, Shield, Eye, EyeOff } from "lucide-react"
import { useMutation } from "react-query"
import useAxiosInstance from "../../lib/useAxiosInstance";
import AssetsContext from "../../context/assetContext"
import { toast } from 'react-toastify';

const roles = [
  { value: "SCHOOL_ADMIN", label: "School Admin" },
  { value: "TEACHER", label: "Teacher" },
  { value: "COUNSELLOR", label: "Counsellor" },
  { value: "DATA_OPERATOR", label: "Data Operator" },
]

export default function EmployeeForm({ isOpen }) {
 
    const axios = useAxiosInstance()
  const { setEmployeeModalOpen, addEmployee } = useContext(AssetsContext)

  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "SCHOOL_ADMIN",
    permissions: [],
    password: "",
    isActive: true,
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  /* =======================
     Validation
  ======================= */

  const validate = () => {
    const e = {}
    if (!formData.firstName) e.firstName = "First name is required"
    if (!formData.lastName) e.lastName = "Last name is required"
    if (!formData.email) e.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      e.email = "Invalid email format"
    if (!formData.phone) e.phone = "Phone is required"
    if (!formData.password) e.password = "Password is required"
    else if (formData.password.length < 8)
      e.password = "Password must be at least 8 characters"
    return e
  }

  /* =======================
     API Mutation
  ======================= */

  const createEmployeeMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axios.post(
        "/api/schools/schoolUsers",
        payload
      )
      return res.data
    },
    onSuccess: (data) => {
      toast.success(`Employee Created successfully`);
      addEmployee(data)
      closeModal()
    },
    onError: (error) => {
    toast.error(error?.response?.data?.message || 'An error occurred while creating an employee');
    },
  })

  /* =======================
     Handlers
  ======================= */

  const handleSubmit = (e) => {
    e.preventDefault()

    const validationErrors = validate()
    setErrors(validationErrors)
    setTouched(
      Object.keys(formData).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      )
    )

    if (Object.keys(validationErrors).length === 0) {
      createEmployeeMutation.mutate(formData)
    }
  }

  const closeModal = () => {
    setEmployeeModalOpen(false)
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "SCHOOL_ADMIN",
      permissions: [],
      password: "",
      isActive: true,
    })
    setErrors({})
    setTouched({})
  }

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors(validate())
  }

  if (!isOpen) return null

  /* =======================
     UI
  ======================= */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={closeModal}
      />

      <div className="relative w-full max-w-2xl mx-4 bg-slate-100 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-slate-800 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Add School Admin
              </h2>
              <p className="text-slate-400 text-sm">
                Fill in the employee details
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-slate-300" />
          </button>
        </div>

         <form onSubmit={handleSubmit} className="p-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-5">
              <User className="w-4 h-4 text-indigo-500" />
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  onBlur={() => handleBlur("firstName")}
                  placeholder="Enter first name"
                  className={`w-full px-4 py-3 rounded-lg border bg-white text-slate-900 placeholder:text-slate-400
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all
                    ${touched.firstName && errors.firstName ? "border-red-400" : "border-slate-200"}`}
                />
                {touched.firstName && errors.firstName && (
                  <span className="text-xs text-red-500 mt-1">{errors.firstName}</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  onBlur={() => handleBlur("lastName")}
                  placeholder="Enter last name"
                  className={`w-full px-4 py-3 rounded-lg border bg-white text-slate-900 placeholder:text-slate-400
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all
                    ${touched.lastName && errors.lastName ? "border-red-400" : "border-slate-200"}`}
                />
                {touched.lastName && errors.lastName && (
                  <span className="text-xs text-red-500 mt-1">{errors.lastName}</span>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-5">
              <Mail className="w-4 h-4 text-indigo-500" />
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="email@school.com"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-white text-slate-900 placeholder:text-slate-400
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all
                      ${touched.email && errors.email ? "border-red-400" : "border-slate-200"}`}
                  />
                </div>
                {touched.email && errors.email && <span className="text-xs text-red-500 mt-1">{errors.email}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    onBlur={() => handleBlur("phone")}
                    placeholder="+91 98765 43210"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-white text-slate-900 placeholder:text-slate-400
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all
                      ${touched.phone && errors.phone ? "border-red-400" : "border-slate-200"}`}
                  />
                </div>
                {touched.phone && errors.phone && <span className="text-xs text-red-500 mt-1">{errors.phone}</span>}
              </div>
            </div>
          </div>

          {/* Role & Permissions */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-5">
              <Shield className="w-4 h-4 text-indigo-500" />
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Role & Permissions</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleChange("isActive", e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500"
                />
                <label htmlFor="isActive" className="text-sm text-slate-700">
                  Active Employee
                </label>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-5">
              <Shield className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Security</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  placeholder="Enter password"
                  className={`w-full px-4 py-3 pr-12 rounded-lg border bg-white text-slate-900 placeholder:text-slate-400
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all
                    ${touched.password && errors.password ? "border-red-400" : "border-slate-200"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {touched.password && errors.password && (
                <span className="text-xs text-red-400 mt-1">{errors.password}</span>
              )}
              <p className="text-slate-500 text-xs mt-2">Password must be at least 8 characters long</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-6 py-3 rounded-lg text-slate-600 font-medium hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createEmployeeMutation.isPending}
              className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg 
                transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createEmployeeMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                "Add Employee"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
