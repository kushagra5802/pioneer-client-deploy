import React, { useState, useContext } from "react";
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

const SchoolLogin = () => {
  const navigate = useNavigate();
  const axios = useAxiosInstance();
  const { setIsLoggedIn, setTheme } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(true);
  const [loginPayload, setLoginPayload] = useState(null);

  const schema = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().min(6).required(),
  });

  const formik = useFormik({
    initialValues: { email: "", phone: "", password: "" },
    validationSchema: schema,
    onSubmit: async values => {
      setIsLoading(true);
      const payload = showEmailLogin
        ? { email: values.email, password: values.password }
        : { phone: values.phone, password: values.password };

      try {
        const res = await axios.post("api/schools/login", payload);
        if (res.data.message?.includes("OTP")) {
          setLoginPayload(payload);
          setShowOtp(true);
          toast.success("OTP sent");
        } else {
          completeLogin(res.data);
        }
      } catch {
        formik.setFieldError("password", "Invalid credentials");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const completeLogin = data => {
    setIsLoggedIn(true);
    localStorage.setItem("token", data?.data?.token);
    localStorage.setItem("users", JSON.stringify(data?.data?.clientUser));
    setTheme(t => t || "light");
    navigate("/assets");
  };

  if (showOtp) {
    return (
      <OtpScreen
        payload={loginPayload}
        verifyUrl="api/users/verify-otp-login"
        resendUrl="api/schools/login"
        onSuccess={completeLogin}
        onBack={() => setShowOtp(false)}
      />
    );
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Input
        name={showEmailLogin ? "email" : "phone"}
        placeholder={showEmailLogin ? "School Email" : "Phone Number"}
        className="h-12 mb-3"
        onChange={formik.handleChange}
      />
      <ErrorMessage hasError message={formik.errors.email || formik.errors.phone} />

      <Input.Password
        name="password"
        placeholder="Password"
        className="h-12 mb-3"
        onChange={formik.handleChange}
      />

      <div className="flex justify-between text-sm mb-6">
        <span
          onClick={() => setShowEmailLogin(!showEmailLogin)}
          className="cursor-pointer text-gray-500"
        >
          {showEmailLogin ? "Login with Phone" : "Login with Email"}
        </span>

        <Link to="/login/forgot-password">Forgot Password?</Link>
      </div>

      <button className="w-full h-12 bg-[#0f172a] text-white rounded-xl">
        {isLoading ? <ButtonLoader /> : "LOGIN"}
      </button>
    </form>
  );
};

export default SchoolLogin;
