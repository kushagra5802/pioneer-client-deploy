import React from "react";

const ErrorMessage = ({hasError, message}) => {
    if (!hasError) {
        return null;
    }

    return (
        <div className="text-red-600">{message}</div>
    );
};

export default ErrorMessage;