import React, { useContext, useState } from "react";
import { Input } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { AppContext } from "../../context/AppContextProvider";
import useAxiosInstance from "../../lib/useAxiosInstance";
import ButtonLoader from "../../components/Loader/ButtonLoader";
import ErrorMessage from "../../components/Forms/ErrorMessage";
import OtpScreen from "./OtpScreen";

const StudentLogin = () => {
  const navigate = useNavigate();
  const axiosInstance = useAxiosInstance();
  const { setIsLoggedIn, setTheme } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(true);
  const [loginPayload, setLoginPayload] = useState(null);

  /* =======================
     Validation Schemas
  ======================= */

  const EmailSchema = Yup.object({
    studentId: Yup.string()
      .trim()
      .required("Student ID / Email is required"),
    password: Yup.string()
      .trim()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),
  });

  const PhoneSchema = Yup.object({
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    password: Yup.string()
      .trim()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),
  });

  /* =======================
     Formik
  ======================= */

  const formik = useFormik({
    initialValues: {
      studentId: "",
      phone: "",
      password: "",
    },
    validationSchema: showEmailLogin ? EmailSchema : PhoneSchema,
    onSubmit: async values => {
      setIsLoading(true);

      const payload = showEmailLogin
        ? { studentId: values.studentId, password: values.password }
        : { phone: values.phone, password: values.password };

      try {
        const response = await axiosInstance.post(
          "api/students/login",
          payload
        );

        if (response.data.message?.includes("OTP")) {
          toast.success("OTP sent successfully");
          setLoginPayload(payload);
          setShowOtpScreen(true);
        } else {
          completeLogin(response.data);
        }
      } catch (error) {
        formik.setFieldError(
          "password",
          error?.response?.data?.message || "Invalid credentials"
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  /* =======================
     Helpers
  ======================= */

  const completeLogin = data => {
    setIsLoggedIn(true);
    localStorage.clear();
    localStorage.setItem("token", data.data.token);
    console.log("data.data",data.data)
    localStorage.setItem("users", JSON.stringify(data.data.clientUser));
    setTheme(t => t || "light");
    navigate("/dashboard");
  };

  /* =======================
     OTP Screen
  ======================= */

  if (showOtpScreen) {
    return (
      <OtpScreen
        payload={loginPayload}
        verifyUrl="api/users/verify-otp-login"
        resendUrl="api/students/login"
        onSuccess={completeLogin}
        onBack={() => setShowOtpScreen(false)}
      />
    );
  }

  /* =======================
     Login Screen
  ======================= */

  return (
    <form onSubmit={formik.handleSubmit}>
      {/* Student ID / Email OR Phone */}
      <div className="mb-4">
        <Input
          name={showEmailLogin ? "studentId" : "phone"}
          placeholder={
            showEmailLogin ? "Student ID / Email" : "Phone Number"
          }
          className="h-12 rounded-xl"
          value={
            showEmailLogin
              ? formik.values.studentId
              : formik.values.phone
          }
          onChange={formik.handleChange}
        />
        <ErrorMessage
          hasError={
            showEmailLogin
              ? Boolean(formik.errors.studentId)
              : Boolean(formik.errors.phone)
          }
          message={
            showEmailLogin
              ? formik.errors.studentId
              : formik.errors.phone
          }
        />
      </div>

      {/* Password */}
      <div className="mb-4">
        <Input.Password
          name="password"
          placeholder="Password"
          className="h-12 rounded-xl"
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        <ErrorMessage
          hasError={Boolean(formik.errors.password)}
          message={formik.errors.password}
        />
      </div>

      {/* Switch + Forgot */}
      <div className="flex justify-between text-sm text-gray-500 mb-6">
        <span
          onClick={() => {
            setShowEmailLogin(!showEmailLogin);
            formik.resetForm();
          }}
          className="cursor-pointer hover:text-sky-900"
        >
          {showEmailLogin
            ? "Login with Phone"
            : "Login with Student ID / Email"}
        </span>

        <Link
          to="/login/forgot-password"
          className="hover:text-sky-900"
        >
          Forgot Password?
        </Link>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-[#0f172a] text-white rounded-xl font-semibold"
      >
        {isLoading ? <ButtonLoader /> : "LOGIN"}
      </button>
    </form>
  );
};

export default StudentLogin;
