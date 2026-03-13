import React from "react";
import { Button, Input, Form, Row, Col } from "antd";

import { useQueryClient } from "react-query";
import useAxiosInstance from "../../lib/useAxiosInstance";
import ProfileInformation from "./ProfileInformation";
import { toast } from "react-toastify";

const { TextArea } = Input;

const Profile = ({ userData }) => {
  const axiosInstance = useAxiosInstance();

  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const handleSubmit = async (values) => {
    let data = {
      ...userData,
      phone: Number(userData?.phone),
      password: values?.userPassword,
      bio: values?.bio,
      email: values?.email
    };

    axiosInstance
      .put(`api/users/${userData._id}`, data)
      .then((response) => {
        data["_id"] = userData._id;

        localStorage.setItem("users", JSON.stringify(data));
        queryClient.invalidateQueries("userInfo");
        toast.success(response?.data?.message);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className='SecondTab'>
      <div className='general-form'>
        <ProfileInformation userData={userData} />

        <Form form={form} onFinish={handleSubmit} initialValues={userData}>
          <div className='modal-wrapper-content rounded-none pt-0'>
            <div className='profile-form pb-8'>
              <Row className='add-modal-row'>
                <Col span={6} className='mr-6'>
                  <label>Username</label>
                  <Form.Item name='email'>
                    <Input
                      placeholder='Username'
                      style={{ height: 48, marginTop: "10px" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <label>Password</label>
                  <Form.Item name='userPassword'>
                    <Input.Password
                      placeholder='Password'
                      style={{ height: 48, marginTop: "10px" }}
                    />
                  </Form.Item>
                </Col>
                {/* <Col>
                  <div className='change-password-link'>
                    <p>
                      <a href='#abc'>Change Password</a>
                    </p>
                  </div>
                </Col> */}
              </Row>

              <Row className='add-modal-row'>
                <Col span={16}>
                  <label>Bio</label>
                  <Form.Item name='bio'>
                    <TextArea
                      style={{
                        height: 120,
                        resize: "none",
                        width: "100%",
                        marginTop: "10px"
                      }}
                      placeholder='This is my Bio Text'
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </div>
          <div className='button-bottom-right'>
            <Button className='cancel-btn' ghost>
              Cancel
            </Button>
            <Button type='primary' htmlType='submit' className='primary-btn'>
              Save Changes
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Profile;
