import React from "react";
import "../styles/pageHeading.css";
import { Button } from "antd";

const PageHeading = (props) => {
  const isShow =
    ["clientManager"].includes(props.role) && props.pageTitle === "Clients";
  return (
    <>
      <div className='page-heading'>
        <h3>{props.pageTitle}</h3>
        {!isShow && (
          <Button onClick={props.pageModalOpen} icon={props.icon}>
            {props.pageModalTitle}
          </Button>
        )}
      </div>
    </>
  );
};

export default PageHeading;
