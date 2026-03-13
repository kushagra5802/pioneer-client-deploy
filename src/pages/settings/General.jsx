import React, { useEffect, useState } from "react";
import { Input,  Button, Row, Col } from "antd";
import { AiOutlinePlusCircle, AiOutlineClose } from "react-icons/ai";
import useAxiosInstance from "../../lib/useAxiosInstance";
import {  useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import ErrorMessage from "../../components/Forms/ErrorMessage";

const General = ({ userData }) => {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  // const [userProfile, setUserProfile] = useState({});
  const [isShowEmail, setIsShowEmail] = useState(false);

  const FormSchema = Yup.object().shape({
    firstName: Yup.string()
      .trim()
      .required("First Name is required")
      .min(3, "First Name is minimum 3 character")
      .max(50, "First Name is maximum 50 character"),
    lastName: Yup.string()
      .trim()
      .required("Last Name is required")
      .min(3, "Last Name is minimum 3 character")
      .max(50, "Last Name is maximum 50 character"),
    email: Yup.string()
      .trim()
      .required("Email is required")
      .email("Valid email is required")
      .matches(
        "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
        "Valid email is required"
      )
      .min(10, "Email is minimum 10 character")
      .max(100, "Email is maximum 100 character"),
    alternativeEmail: isShowEmail
      ? Yup.string()
          .trim()
          .email("Valid email is required")
          .matches(
            "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
            "Valid email is required"
          )
          .min(10, "Email is minimum 10 characters")
          .max(100, "Email is maximum 100 characters")
      : null,
    phone: Yup.string()
      .required("Phone is required")
      .min(10, "Phone must be 10 digit")
      .max(10, "Phone must be 10 digit"),
    role: Yup.string().required("Role is required"),
    country: Yup.string().required("Country is required")
  });

  const formik = useFormik({
    initialValues: {
      firstName: userData?.firstName ? userData?.firstName : "",
      lastName: userData?.lastName ? userData?.lastName : "",
      email: userData?.email ? userData?.email : "",
      alternativeEmail: userData?.alternativeEmail
        ? userData?.alternativeEmail
        : "",
      phone: userData?.phone ? userData?.phone : null,
      role: userData?.role ? userData?.role : "",
      country: userData?.country ? userData?.country : "India"
    },
    enableReinitialize: true,
    validationSchema: FormSchema,
    onSubmit: (values, onSubmitProps) => {
      handleSubmit(values, onSubmitProps);
    }
  });

  const handleSubmit = async (value) => {
    let data = {
      ...value,
      password: userData?.userPassword,
      bio: userData?.bio
    };
    data["phone"] = Number(value.phone);

    if (!isShowEmail) {
      delete data.alternativeEmail;
    }

    axiosInstance
      .put(`api/users/${userData._id}`, data)
      .then((response) => {
        data["_id"] = userData._id;
        if (isShowEmail) {
          // eslint-disable-next-line
          data["alternativeEmail"] = data.alternativeEmail;
        }
        localStorage.setItem("users", JSON.stringify(data));
        queryClient.invalidateQueries("userInfo");
        toast.success(`${response?.data?.message}`);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  useEffect(() => {
    let profile = JSON.parse(localStorage.getItem("users"));
    let isEmail = profile?.alternativeEmail ? true : false;
    // setUserProfile(profile);
    // setIsShowEmail(isEmail);
    if (userData?.alternativeEmail) {
      formik.setFieldValue("alternativeEmail", userData.alternativeEmail);
      setIsShowEmail(true);
    } else {
      formik.setFieldValue("alternativeEmail", "");
      setIsShowEmail(isEmail);
    }
    // eslint-disable-next-line
  }, []);

  const handleAddEmail = () => {
    setIsShowEmail(true);
  };
  const handleRemoveEmail = () => {
    // setIsShowEmail(false);
    // formik.setFieldValue("alternativeEmail", "");
    if (userData?.alternativeEmail) {
      formik.setFieldValue("alternativeEmail", userData.alternativeEmail);
      setIsShowEmail(true);
    } else {
      formik.setFieldValue("alternativeEmail", "");
      setIsShowEmail(false);
    }
  };
  return (
    <div className='FirstTab bg-white'>
      <form onSubmit={formik.handleSubmit}>
        <div className='general-form modal-wrapper-content pb-40'>
          <div>
            <p className='text-heading-general-info'>General Information</p>
          </div>

          <Row className='add-modal-row'>
            <Col span={7} className='mr-6'>
              <label>First Name</label>
              <Input
                type='text'
                placeholder='First Name'
                name='firstName'
                onChange={formik.handleChange}
                value={formik.values.firstName}
              />
              <ErrorMessage
                hasError={Boolean(
                  formik.errors.firstName && formik.touched.firstName
                )}
                message={formik.errors.firstName}
              />
            </Col>

            <Col span={7}>
              <label>Last Name</label>
              <Input
                type='text'
                placeholder='Last Name'
                name='lastName'
                onChange={formik.handleChange}
                value={formik.values.lastName}
              />
              <ErrorMessage
                hasError={Boolean(
                  formik.errors.lastName && formik.touched.lastName
                )}
                message={formik.errors.lastName}
              />
            </Col>
          </Row>

          <Row className='add-modal-row pt-1'>
            <Col span={7} className='mr-6'>
              <label>Email</label>
              <Input
                type='text'
                placeholder='Email'
                name='email'
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              <ErrorMessage
                hasError={Boolean(formik.errors.email && formik.touched.email)}
                message={formik.errors.email}
              />
            </Col>

            <Col span={7}>
              <label>Phone</label>
              <Input.Group compact>
                <Input style={{ width: "15%" }} defaultValue='+91' readOnly />
                <Input
                  style={{ width: "85%" }}
                  type='number'
                  name='phone'
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                />
              </Input.Group>
              <ErrorMessage
                hasError={Boolean(formik.errors.phone && formik.touched.phone)}
                message={formik.errors.phone}
              />
            </Col>
          </Row>

          {/* Display the list of alternate emails */}
          <Row className='add-modal-row'>
            <Col span={7} className='mr-6'>
              {isShowEmail ? (
                <>
                  <label>Alternative Email</label>
                  <Input
                    style={{}}
                    type='text'
                    placeholder='Email'
                    name='alternativeEmail'
                    onChange={formik.handleChange}
                    value={formik.values.alternativeEmail}
                  />
                  <ErrorMessage
                    hasError={Boolean(
                      formik.errors.alternativeEmail &&
                        formik.touched.alternativeEmail
                    )}
                    message={formik.errors.alternativeEmail}
                  />
                </>
              ) : (
                <div className='alternate-email-text'>
                  <p>
                    <button onClick={handleAddEmail}>
                      <AiOutlinePlusCircle
                        style={{
                          float: "left",
                          height: 25,
                          width: 25,
                          paddingRight: 5
                        }}
                      />
                      Add Alternate Email
                    </button>
                  </p>
                </div>
              )}
            </Col>
            <Col className='flex items-center pt-5'>
              {isShowEmail && (
                <AiOutlineClose
                  className=''
                  style={{ cursor: "pointer" }}
                  onClick={handleRemoveEmail} // Call handleRemoveEmail when the close icon is clicked
                />
              )}
            </Col>
          </Row>
          <Row className='add-modal-row'>
            <Col span={7} className='mr-6'>
              <label className='block'>Role</label>
              <Input
                name='role'
                onChange={(e) => formik.setFieldValue("role", e.target.value)}
                value={formik.values.role}
                disabled
              />
              {/* <Select size="large" style={{width: "390px", display: "block"}} name='role'
                                    onChange={(value) => formik.setFieldValue('role', value)} value={formik.values.role}
                                    disabled
                            >
                                <Select.Option value="superadmin">Superadmin</Select.Option>
                                <Select.Option value="manager">Manager</Select.Option>
                                <Select.Option value="admin">Admin</Select.Option>
                                <Select.Option value="accountant">Accountant</Select.Option>
                                <Select.Option value="agent">Agent</Select.Option>
                            </Select> */}
              <ErrorMessage
                hasError={Boolean(formik.errors.role && formik.touched.role)}
                message={formik.errors.role}
              />
            </Col>

            <Col span={7}>
              <label className='block'>Country</label>
              <Input
                name='country'
                onChange={(e) =>
                  formik.setFieldValue("country", e.target.value)
                }
                value={formik.values.country}
                disabled
              />
              {/* <Select size="large" style={{width: "390px", display: "block"}} name="country"
                                    onChange={(value) => formik.setFieldValue('country', value)} value={formik.values.country}
                                    options={[
                                        {value: 'India', label: 'India'},
                                        {value: 'USA', label: 'USA'},
                                        {value: 'France', label: 'France'},
                                        {value: 'Japan', label: 'Japan'},
                                    ]}
                            /> */}
              <ErrorMessage
                hasError={Boolean(
                  formik.errors.country && formik.touched.country
                )}
                message={formik.errors.country}
              />
            </Col>
          </Row>
        </div>

        <div className='button-bottom-right'>
          <Button
            className='cancel-btn'
            style={{
              width: "120px !important",
              border: "1px solid #004877",
              color: "#004877",
              fontWeight: "600"
            }}
          >
            Cancel
          </Button>
          <button type='submit' className='primary-btn ant-btn'>
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default General;
