import React, { useState, useEffect } from "react";
import "../styles/notificationWindow.css";
import NotificationItem from "./NotificationItem";
// import NoDataIcon from "../assets/svg/no-data-icon.svg";
import NoDataIcon from "../assets/svg/no-data.svg";

import useAxiosInstance from "../lib/useAxiosInstance";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { Skeleton } from "antd";

const NotificationsWindow = ({
  bgColor,
  handleMarkAllRead,
  seeAllLink,
  setShowNotificationDot = () => {},
  setShowNotificationWindow = () => {}
}) => {
  const axiosInstance = useAxiosInstance();

  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    const response = await axiosInstance.get("api/notification");
    return response.data;
  };

  const { data, isLoading } = useQuery("notifications", fetchNotifications, {
    refetchOnWindowFocus: false,
    retry: 1,
    onError: (error) => {
      console.error("Error fetching notifications:", error);
    }
  });
  useEffect(() => {
    if (data?.message?.data) {
      setNotifications(data?.message?.data);
    }
  }, [data]);

  const isViewedData = notifications
    .filter((item) => item.isViewed === false)
    .map((item) => item._id);

  useEffect(() => {
    setShowNotificationDot(false);
    if (isViewedData.length > 0) {
      axiosInstance
        .post("api/notification/markAsRead", {
          notificationIds: isViewedData
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error marking notifications as read:", error);
        });
    }
    // eslint-disable-next-line
  }, [isViewedData.length]);

  return (
    <div className='notification-window'>
      <div className='notification-title'>
        <p>Notifications</p>
        <p
          onClick={handleMarkAllRead}
          style={{ color: seeAllLink }}
          className='cursor-pointer'
        >
          {" "}
          Mark all as Reads{" "}
        </p>
      </div>
      <div className='notifications-box'>
        {isLoading ? (
          <Skeleton
            title={false}
            className='mt-4 p-2 '
            active
            paragraph={{
              rows: 5,
              width: ["100%", "100%", "100%", "100%", "100%"],
              height: ["30px", "30px", "30px", "30px", "30px"]
            }}
          />
        ) : notifications && notifications.length > 0 ? (
          notifications.map((item) => (
            <NotificationItem
              key={item?._id}
              url={item?.profileURL}
              title={item?.title}
              content={item?.content}
              time={item?.createdAt}
              bgColor={
                item?.isViewed ? "var(--notification-read-background" : bgColor
              }
            />
          ))
        ) : (
          <div className='no-data-icon m-20'>
            <img src={NoDataIcon} alt='' />
            <h1>No Notification Available</h1>
          </div>
        )}
      </div>
      <div className='all-notification-text border-t-2'>
        <p>
          <button
            onClick={() => {
              setShowNotificationWindow(false);
              navigate("/notifications");
            }}
          >
            See all notifications
          </button>
        </p>
      </div>
    </div>
  );
};

export default NotificationsWindow;
