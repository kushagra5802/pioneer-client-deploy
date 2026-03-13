// import { Input } from "antd";
// import { useFormik } from 'formik';
// import React, { useContext, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import * as Yup from 'yup';
// import Logo from "../../assets/images/logo.png";
// import ErrorMessage from '../../components/Forms/ErrorMessage';
// import ButtonLoader from "../../components/Loader/ButtonLoader";
// import { AppContext } from "../../context/AppContextProvider";
// import useAxiosInstance from "../../lib/useAxiosInstance";

// const SignIn = () => {
//     const navigate = useNavigate();
//     const axiosInstance = useAxiosInstance();

//     const { setIsLoggedIn, setTheme } = useContext(AppContext);

//     const [isLoading, setIsLoading] = useState(false);
//     const [showEmailLogin, setShowEmailLogin] = useState(true);
//     const [showOtpScreen, setShowOtpScreen] = useState(false);
//     const [otpResendLoading, setOtpResendLoading] = useState(false);

//     // OTP state
//     const [otp, setOtp] = useState(["", "", "", ""]);
//     const [otpError, setOtpError] = useState("");

//     // Form validation schemas
//     const EmailFormSchema = Yup.object().shape({
//         email: Yup.string().trim().required('Email is required').email('Valid email is required')
//             .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$', 'Valid email is required')
//             .min(10, 'Email is minimum 10 character').max(100, 'Email is maximum 100 character'),
//         password: Yup.string().trim().required('Password is required').min(6, 'Password is minimum 6 character').max(20, 'Password is maximum 20 character')
//     });

//     const PhoneFormSchema = Yup.object().shape({
//         phone: Yup.string().trim().required('Phone is required')
//             .matches(/^\d{10}$/, 'Phone number should be 10 digits'),
//         password: Yup.string().trim().required('Password is required').min(6, 'Password is minimum 6 character').max(20, 'Password is maximum 20 character')
//     });

//     const emailFormik = useFormik({
//         initialValues: {
//             email: '',
//             password: ''
//         },
//         enableReinitialize: true,
//         validationSchema: EmailFormSchema,
//         onSubmit: (values) => {
//             handleSubmit(values);
//         }
//     });

//     const phoneFormik = useFormik({
//         initialValues: {
//             phone: '',
//             password: ''
//         },
//         enableReinitialize: true,
//         validationSchema: PhoneFormSchema,
//         onSubmit: (values) => {
//             handleSubmit(values);
//         }
//     });

//     const handleLoginFormChangeType = () => {
//         setShowEmailLogin(!showEmailLogin);
//         emailFormik.resetForm();
//         phoneFormik.resetForm();
//     };

//     // OTP input handlers
//     const handleOtpChange = (index, value) => {
//         if (isNaN(value)) return;

//         const newOtp = [...otp];
//         newOtp[index] = value;
//         setOtp(newOtp);

//         // Auto focus to next input
//         if (value && index < 3) {
//             document.getElementById(`otp-input-${index + 1}`).focus();
//         }
//     };

//     const handleOtpKeyDown = (index, e) => {
//         // Handle backspace to move to previous input
//         if (e.key === 'Backspace' && !otp[index] && index > 0) {
//             document.getElementById(`otp-input-${index - 1}`).focus();
//         }
//     };

//     const handleSubmit = async (values) => {
//         setIsLoading(true);
//         const reqBody = showEmailLogin ?
//             { email: values.email, password: values.password } :
//             { phone: values.phone, password: values.password };

//         axiosInstance.post("api/users/login", reqBody)
//             .then((response) => {
//                 if (response.data.message === "OTP sent on registered mobile number") {
//                     toast.success("OTP sent on registered mobile number");
//                     setShowOtpScreen(true);
//                 } else {
//                     setIsLoggedIn(true);
//                     localStorage.clear();
//                     localStorage.setItem("token", response.data.data.token);
//                     localStorage.setItem("users", JSON.stringify(response.data.data.user));

//                     // Set theme when navigating to the dashboard
//                     setTheme((storedTheme) => storedTheme || "light");

//                     navigate("/dashboard");
//                 }
//             })
//             .catch((error) => {
//                 const formik = showEmailLogin ? emailFormik : phoneFormik;
//                 if (error.response) {
//                     const errorMessage = error.response.data.message;
//                     const emailErrorMsg = error.response.data.error;

//                     if (errorMessage === "This account is suspended.") {
//                         formik.setFieldError('password', 'This account is suspended.');
//                     }
//                     else if (emailErrorMsg === "Can't find User! please enter correct email") {
//                         formik.setFieldError('password', "User does not exist.");
//                     }
//                     else {
//                         formik.setFieldError('password', 'Invalid credentials. Please try again.');
//                     }
//                 } else {
//                     // Handle other types of errors (e.g., network errors)
//                     formik.setFieldError('password', 'Invalid credentials. Please try again.');
//                 }
//             })
//             .finally(() => {
//                 setIsLoading(false);
//             });
//     };

//     // Handle OTP verification
//     const handleVerifyOtp = (e) => {
//         e.preventDefault();

//         const otpValue = otp.join("");
//         if (otpValue.length !== 4) {
//             setOtpError("Please enter a valid 4-digit OTP");
//             return;
//         }

//         setIsLoading(true);

//         let reqBody;
//         if (showEmailLogin) {
//             reqBody = {
//                 email: emailFormik.values.email,
//                 otp: otpValue
//             };
//         } else {
//             reqBody = {
//                 phone: phoneFormik.values.phone,
//                 otp: otpValue
//             };
//         }

//         axiosInstance
//             .post("api/users/verify-otp-login", reqBody)
//             .then((response) => {
//                 setIsLoggedIn(true);
//                 localStorage.clear();
//                 localStorage.setItem("token", response.data.data.token);
//                 localStorage.setItem("users", JSON.stringify(response.data.data.user));

//                 // Set theme when navigating to the dashboard
//                 setTheme((storedTheme) => storedTheme || "light");

//                 navigate("/dashboard");
//             })
//             .catch((error) => {
//                 if (error?.response?.data?.message === "Incorrect OTP. Please try again.") {
//                     setOtpError("Incorrect OTP. Please try again.");
//                 } else if (error?.response?.data?.message === "Timeout. Please try again.") {
//                     setOtpError("Timeout. Please try again");
//                 } else {
//                     setOtpError(error?.response?.data?.message || "Something went wrong");
//                 }
//             })
//             .finally(() => {
//                 setIsLoading(false);
//             });
//     };

//     // Handle resend OTP
//     const handleResendOtp = () => {
//         setOtpResendLoading(true);

//         const values = showEmailLogin ? emailFormik.values : phoneFormik.values;
//         const reqBody = showEmailLogin ?
//             { email: values.email, password: values.password } :
//             { phone: values.phone, password: values.password };

//         axiosInstance.post("api/users/login", reqBody)
//             .then((response) => {
//                 if (response.data.message === "OTP sent on registered mobile number") {
//                     toast.success("OTP sent on registered mobile number");
//                 }
//             })
//             .catch((error) => {
//                 setOtpError(error?.response?.data?.message || "Something went wrong");
//             })
//             .finally(() => {
//                 setOtpResendLoading(false);
//             });
//     };

//     // Go back to login screen from OTP screen
//     const handleBackToLogin = () => {
//         setShowOtpScreen(false);
//         setOtp(["", "", "", ""]);
//         setOtpError("");
//     };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] to-[#020617]">
//       <ToastContainer />

//       {/* Login Card */}
//       <div className="w-full max-w-md bg-white rounded-3xl shadow-xl px-8 py-10">
        
//         {/* Logo */}
//         {/* <div className="flex justify-center mb-4">
//           <img src={Logo} alt="Project Pioneer" className="h-14" />
//         </div> */}

//         {/* Heading */}
//         <h2 className="text-center text-2xl font-bold text-gray-900">
//           PROJECT PIONEER
//         </h2>
//         <p className="text-center text-gray-500 text-sm mt-1 mb-8">
//           Navigating Future Success
//         </p>

//         {!showOtpScreen ? (
//           <form
//             onSubmit={
//               showEmailLogin
//                 ? emailFormik.handleSubmit
//                 : phoneFormik.handleSubmit
//             }
//           >
//             {/* Email / Phone */}
//             {showEmailLogin ? (
//               <div className="mb-4">
//                 <Input
//                   name="email"
//                   placeholder="Unique Student ID"
//                   className="h-12 rounded-xl"
//                   value={emailFormik.values.email}
//                   onChange={emailFormik.handleChange}
//                 />
//                 <ErrorMessage
//                   hasError={Boolean(
//                     emailFormik.errors.email && emailFormik.touched.email
//                   )}
//                   message={emailFormik.errors.email}
//                 />
//               </div>
//             ) : (
//               <div className="mb-4">
//                 <Input
//                   name="phone"
//                   placeholder="Phone Number"
//                   className="h-12 rounded-xl"
//                   value={phoneFormik.values.phone}
//                   onChange={phoneFormik.handleChange}
//                 />
//                 <ErrorMessage
//                   hasError={Boolean(
//                     phoneFormik.errors.phone && phoneFormik.touched.phone
//                   )}
//                   message={phoneFormik.errors.phone}
//                 />
//               </div>
//             )}

//             {/* Password */}
//             <div className="mb-4">
//               <Input.Password
//                 name="password"
//                 placeholder="Password"
//                 className="h-12 rounded-xl"
//                 value={
//                   showEmailLogin
//                     ? emailFormik.values.password
//                     : phoneFormik.values.password
//                 }
//                 onChange={
//                   showEmailLogin
//                     ? emailFormik.handleChange
//                     : phoneFormik.handleChange
//                 }
//               />
//               <ErrorMessage
//                 hasError={Boolean(
//                   showEmailLogin
//                     ? emailFormik.errors.password &&
//                       emailFormik.touched.password
//                     : phoneFormik.errors.password &&
//                       phoneFormik.touched.password
//                 )}
//                 message={
//                   showEmailLogin
//                     ? emailFormik.errors.password
//                     : phoneFormik.errors.password
//                 }
//               />
//             </div>

//             {/* Switch + Forgot */}
//             <div className="flex justify-between text-sm text-gray-500 mb-6">
//               <span
//                 onClick={handleLoginFormChangeType}
//                 className="cursor-pointer hover:text-sky-900"
//               >
//                 {showEmailLogin ? "Login with Phone" : "Login with Email"}
//               </span>

//               <Link to="/login/forgot-password" className="hover:text-sky-900">
//                 Recover Password
//               </Link>
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full h-12 bg-[#0f172a] text-white rounded-xl font-semibold tracking-wide hover:bg-[#020617] transition"
//             >
//               {isLoading ? <ButtonLoader /> : "ACCESS DASHBOARD"}
//             </button>
//           </form>
//         ) : (
//           /* OTP SCREEN */
//           <form onSubmit={handleVerifyOtp}>
//             <p className="text-center text-gray-600 mb-4">
//               Enter 4-digit OTP
//             </p>

//             <div className="flex justify-center gap-4 mb-4">
//               {[0, 1, 2, 3].map((index) => (
//                 <input
//                   key={index}
//                   id={`otp-input-${index}`}
//                   maxLength="1"
//                   value={otp[index]}
//                   onChange={(e) =>
//                     handleOtpChange(index, e.target.value)
//                   }
//                   onKeyDown={(e) =>
//                     handleOtpKeyDown(index, e)
//                   }
//                   className="w-14 h-14 text-center text-xl font-bold border rounded-xl focus:outline-none focus:border-sky-900"
//                 />
//               ))}
//             </div>

//             {otpError && (
//               <p className="text-center text-red-500 text-sm mb-3">
//                 {otpError}
//               </p>
//             )}

//             <div className="flex justify-between text-sm mb-6">
//               <button
//                 type="button"
//                 onClick={handleBackToLogin}
//                 className="text-gray-500 hover:text-sky-900"
//               >
//                 ← Back
//               </button>

//               <button
//                 type="button"
//                 onClick={handleResendOtp}
//                 disabled={otpResendLoading}
//                 className="text-gray-500 hover:text-sky-900"
//               >
//                 {otpResendLoading ? "Resending..." : "Resend OTP"}
//               </button>
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full h-12 bg-[#0f172a] text-white rounded-xl font-semibold"
//             >
//               {isLoading ? <ButtonLoader /> : "VERIFY OTP"}
//             </button>
//           </form>
//         )}

//         {/* Footer */}
//         <p className="text-center text-xs text-gray-400 mt-8">
//           © 2026 Singramau Innovation Labs
//         </p>
//       </div>
//     </div>
// );

// };

// export default SignIn;

import React, { useState } from "react";
import SchoolLogin from "./SchoolLogin";
import StudentLogin from "./StudentLogin";

const SignIn = () => {
  const [activeTab, setActiveTab] = useState("school");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617]">
      <div className="w-full max-w-md bg-white rounded-3xl px-8 py-10 shadow-xl">
        
        <h2 className="text-center text-2xl font-bold">PROJECT PIONEER</h2>
        <p className="text-center text-gray-500 mb-6">
          Navigating Future Success
        </p>

        {/* Tabs */}
        <div className="flex mb-6 bg-gray-100 rounded-xl overflow-hidden">
          {["school", "student"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-1/2 py-2 font-semibold transition ${
                activeTab === tab
                  ? "bg-[#0f172a] text-white"
                  : "text-gray-500"
              }`}
            >
              {tab === "school" ? "School" : "Student"}
            </button>
          ))}
        </div>

        {activeTab === "school" ? <SchoolLogin /> : <StudentLogin />}

        <p className="text-center text-xs text-gray-400 mt-8">
          © 2026 Singramau Innovation Labs
        </p>
      </div>
    </div>
  );
};

export default SignIn;
