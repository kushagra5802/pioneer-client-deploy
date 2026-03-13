// UnauthorizedPage.js
import React from "react";
import icon from "../assets/images/Unauthorized.png";
import "./UnauthorizedPage.css"; // Import a separate CSS file for styling

const UnauthorizedPage = ({ role }) => {
  return (
    <div className='unauthorized-container'>
      <img src={icon} alt={"Unauthorized"} className='unauthorized-icon' />
      <h2 className='unauthorized-title'>Unauthorized Access</h2>
      <div className='unauthorized-content'>
        {role === "accounts" && (
          <p>You only have access to Billing and Overview sections.</p>
        )}
        {role === "clientManager" && (
          <p>You don't have access to User, Billing and Overview sections.</p>
        )}
        {/* Add more content or styling as needed */}
      </div>
    </div>
  );
};

export default UnauthorizedPage;
