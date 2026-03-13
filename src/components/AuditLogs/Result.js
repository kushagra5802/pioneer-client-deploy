import React, { useState, useContext } from "react";
import "../../styles/constituencyManagement.css";
import { ToastContainer } from "react-toastify";
import AuditLogsList from "./AuditLogsList";


const Result = () => {

  return (
    <div className='constituency-section'>
      <ToastContainer />

      <div className='pageTitle flex items-center justify-between pr-5 heading-sec pl-4'> 
          <h1 className='heading-text'>Audit Logs Dashboard</h1>
      </div>

      <div className='constituency-map'>
        <AuditLogsList/>
      </div>
    </div>
  );
};

export default Result;
