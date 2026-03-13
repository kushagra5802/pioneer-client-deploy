import React, { useState } from "react";
import "../../styles/settings.css";
import { useNavigate } from "react-router-dom";
import General from "./General";
import Profile from "./profile";

// import Notification from "./Notifications";
import { ToastContainer } from "react-toastify";
import { useQuery } from "react-query";
import useAxiosInstance from "../../lib/useAxiosInstance";

const Settings = () => {
  const navigate = useNavigate();
  const axiosInstance = useAxiosInstance();

  const [activeTab, setActiveTab] = useState("general");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`../${tab}`);
  };

  const profile = JSON.parse(localStorage.getItem("users"));
  const fetchUserInfo = async (userId) => {
    const response = await axiosInstance.get(`api/users/info/${profile?._id}`);
    // Handle the response or set state as needed
    return response;
  };

  // Replace this with the actual user ID
  const userInfoData = useQuery(["userInfo"], () => fetchUserInfo(), {
    refetchOnWindowFocus: false,
    retry: 1
  });
  const userData = userInfoData?.data?.data?.data || {};

  return (
    <div className='gms-page-section'>
      <ToastContainer />

      <div className='gms-wrapper'>
        <h1 className='heading-text'>Settings</h1>
        <div className='tabs1 setting-tabs'>
          <div className='gms-table-tabs setting-body'>
            <button
              className={`tab-button tab-btn1 ${
                activeTab === "general" ? "active" : ""
              }`}
              onClick={() => handleTabChange("general")}
            >
              General
            </button>

            <button
              className={`tab-button ${
                activeTab === "profile" ? "active" : ""
              }`}
              onClick={() => handleTabChange("profile")}
            >
              Profile
            </button>
            {/* 
                        <button className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
                                onClick={() => handleTabChange('notifications')}
                        >
                            Notifications
                        </button> */}
          </div>
        </div>

        <div className='tab-content'>
          {activeTab === "general" && <General userData={userData} />}
          {activeTab === "profile" && <Profile userData={userData} />}
          {/* {activeTab === 'notifications' && <Notification/>} */}
        </div>
      </div>
    </div>
  );
};

export default Settings;
