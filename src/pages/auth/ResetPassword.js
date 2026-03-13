
import React, { useState } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useAxiosInstance from "../../lib/useAxiosInstance";
import AuthLayout from "../../components/Layouts/AuthLayout";
import ErrorMessage from '../../components/Forms/ErrorMessage';
import ButtonLoader from "../../components/Loader/ButtonLoader";
import checkLogo from "../../assets/svg/check-decagram.svg";
import { Input } from "antd";
import Logo from "../../assets/images/logo.png";
import { Link, useLocation } from 'react-router-dom';


const ResetPassword = () => {
    // const { token, id } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const id = searchParams.get('id');
    const axiosInstance = useAxiosInstance();

    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const FormSchema = Yup.object().shape({
        password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
        confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
    });

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: ''
        },
        enableReinitialize: true,
        validationSchema: FormSchema,
        onSubmit: (values, onSubmitProps) => {
            handleSubmit(values, onSubmitProps);
        }
    });

    const handleSubmit = async (values, onSubmitProps) => {
        setIsLoading(true);
        axiosInstance.post(`api/users/auth/passwordReset?token=${token}&id=${id}`, values)
            .then((response) => {
                // Handle success, show success message or navigate to a success page
                setIsSubmitted(true);
            })
            .catch((error) => {
                // Handle error, show error message
                onSubmitProps.setFieldError('confirmPassword', 'Something went wrong. Please try again.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <AuthLayout>
            {isSubmitted ? (
                <div className="get-in">
                    <div className="block mx-auto">
                        <img src={checkLogo} alt="" />
                    </div>
                    <div className="sign-in-para text-center p-1">
                        <p>
                            Your password has been reset successfully.
                        </p>
                    </div>
                    <div className='my-2 text-center'>
                        <p>Click here to <Link to='/' className='forgot-pass-text'>Login</Link></p>
                    </div>
                </div>
            ) : (
                <div className="get-in">
                    <div className='logo'>
                        <img className="block mx-auto" src={Logo} alt="Logo" />
                    </div>
                    <div className="text-content">
                        <h2>Reset Password</h2>
                    </div>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="flex flex-wrap">
                            <div className="py-2 w-full">
                                <div className="add-modal-row mt-7 mb-0">
                                    <label className="leading-7 text-lg text-gray-600">
                                        Password
                                    </label>
                                    <Input.Password type='password' placeholder='Password' name='password'
                                        className={`w-full rounded-lg text-base py-2 px-3 mt-2`}
                                        onChange={formik.handleChange} value={formik.values.password}
                                    />
                                    <ErrorMessage hasError={Boolean(formik.errors.password && formik.touched.password)} message={formik.errors.password} />
                                </div>
                            </div>
                            <div className="py-2 w-full">
                                <div className="add-modal-row mt-7 mb-0">
                                    <label className="leading-7 text-lg text-gray-600">
                                        Confirm Password
                                    </label>
                                    <Input.Password type='password' placeholder='Confirm Password' name='confirmPassword'
                                        className={`w-full rounded-lg text-base py-2 px-3 mt-2`}
                                        onChange={formik.handleChange} value={formik.values.confirmPassword}
                                    />
                                    <ErrorMessage hasError={Boolean(formik.errors.confirmPassword && formik.touched.confirmPassword)} message={formik.errors.confirmPassword} />
                                </div>
                            </div>
                            <div className="py-2 w-full">
                                <div className="my-4">
                                    <button className="flex mx-auto w-full text-white bg-sky-900 border-0 py-3 justify-center focus:outline-none  rounded-lg text-lg"
                                        type="submit" disabled={isLoading}
                                    >
                                        {isLoading ? <ButtonLoader /> : 'Submit'}
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

export default ResetPassword;