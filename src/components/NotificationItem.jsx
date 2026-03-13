import React from "react";
import "./notificationItem.css";
import formatTimeDifference from "../utils/formatTime";
import icon from "../assets/images/placeholder-icon.png";

const NotificationItem = ({ url, title, content, time, bgColor }) => {
  return (
    <div
      className='notification-item-window'
      style={{
        backgroundColor: bgColor,
        padding: "10px",
        borderBottom: "1px solid #CCDAE4"
      }}
    >
      <div className='child1-window icon-div-window'>
        <img className='icon-window' src={url || icon} alt='icon' />
      </div>
      <div className='child2-window notification-content-window'>
        <div className='flex justify-between'>
          <p className='notification-item-title-window'>{title}</p>
          <div className='child3-window time-div-window'>
            <p>{formatTimeDifference(time)}</p>
          </div>
        </div>
        <p className='notification-content-item-window'>
          {content.charAt(0).toUpperCase() + content.slice(1)}
        </p>
      </div>
    </div>
  );
};

export default NotificationItem;
