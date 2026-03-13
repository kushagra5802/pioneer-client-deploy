import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAxiosInstance from "../../lib/useAxiosInstance";
import AuthLayout from "../../components/Layouts/AuthLayout";
import ErrorMessage from "../../components/Forms/ErrorMessage";
import ButtonLoader from "../../components/Loader/ButtonLoader";
import checkLogo from "../../assets/svg/check-decagram.svg";
import { Input } from "antd";
import Logo from "../../assets/images/logo.png";
import { ToastContainer, toast } from "react-toastify";

const ForgotPassword = () => {
  const axiosInstance = useAxiosInstance();

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const FormSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .required("Email is required")
      .email("Valid email is required")
      .matches(
        "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
        "Valid email is required"
      )
      .min(10, "Email is minimum 10 character")
      .max(100, "Email is maximum 100 character")
  });

  const formik = useFormik({
    initialValues: {
      email: ""
    },
    enableReinitialize: true,
    validationSchema: FormSchema,
    onSubmit: (values, onSubmitProps) => {
      handleSubmit(values, onSubmitProps);
    }
  });

  const handleSubmit = async (value, onSubmitProps) => {
    setIsLoading(true);
    axiosInstance
      .post("api/users/auth/requestResetPassword", value)
      .then((response) => {
        setIsSubmitted(true);
      })
      .catch((error) => {
        setIsSubmitted(false);
        onSubmitProps.setFieldError("email", "Something went wrong. Please try again.");
       })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleResendLink = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("api/users/auth/requestResetPassword", {
        email: formik.values.email
      });
      setIsSubmitted(true);
      const message = response.data.message;
      toast.success(message,{ 
        position: toast.POSITION.BOTTOM_LEFT
      })
    } catch (error) {
      toast.error('Something went wrong. Please try again.',{
        position: toast.POSITION.BOTTOM_LEFT
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <ToastContainer />
      {isSubmitted ? (
        <div className="get-in">
          <div className='logo-submited pb-2'>
            <img className="block mx-auto" src={Logo} alt="Logo" />
          </div>
          <div className="block mx-auto">
            <img src={checkLogo} alt="" />
          </div>
          <div className="sign-in-para">
            <p className="text-center">
              We have sent an email on your Email ID with a link to reset your password.
            </p>
          </div>
          <div className="sign-in-para pt-10 w-full">
            <p className="text-center">
              Didn’t receive email? <span className="resend-link" onClick={handleResendLink} style={{ cursor: 'pointer' }}>Resend</span> Link
            </p>
          </div>
        </div>
      ) : (
        <div className='get-in'>
          <div className='logo'>
            <img className='block mx-auto' src={Logo} alt='Logo' />
          </div>
          <div className='text-content'>
            <h2>Forgot Password</h2>
          </div>

          <div className='sign-in-para'>
            <p>Enter Your email ID below to proceed</p>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className='flex flex-wrap'>
              <div className='py-2 w-full'>
                <div className='add-modal-row mt-7 mb-0'>
                  {/* <label className="leading-7 text-lg text-gray-600">
                                        Email
                                    </label>
                                    <input type='text' placeholder='abc@gmail.com' name='email'
                                           className={`w-full rounded-lg border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-3 mt-2 leading-8 transition duration-200 ease-in-out`}
                                           onChange={formik.handleChange} value={formik.values.email}
                                    /> */}
                  <label className='leading-7 text-lg text-gray-600'>
                    Email
                  </label>
                  <Input
                    type='text'
                    placeholder='E-mail'
                    name='email'
                    className={`w-full rounded-lg text-base py-2 px-3 mt-2`}
                    onChange={formik.handleChange}
                    value={formik.values.email}
                  />
                  <ErrorMessage
                    hasError={Boolean(
                      formik.errors.email && formik.touched.email
                    )}
                    message={formik.errors.email}
                  />
                </div>
              </div>
              <div className='py-2 w-full'>
                <div className='my-4'>
                  <button
                    className='flex mx-auto w-full text-white bg-sky-900 border-0 py-3 justify-center focus:outline-none  rounded-lg text-lg'
                    type='submit'
                    disabled={isLoading}
                  >
                    {isLoading ? <ButtonLoader /> : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
