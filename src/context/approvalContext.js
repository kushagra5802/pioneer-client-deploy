import React, { useState } from "react";

const ApprovalContext = React.createContext({
    isOpenModal: false,
    updateOpenModal: () => {
    },

    isOpenExportModal: false,
    updateOpenExportModal: () => {
    },

    isAddMode: true,
    updateAddMode: () => {
    },

    isExportMode: true,
    updateExportMode: () => {
    },

   
});

export const ApprovalContextProvider = ({ children }) => {

    const [isOpenModalState, setIsOpenModalState] = useState(false);
    const [isExportModalState, setIsExportModalState] = useState(false);
    const [isExportModeState, setIsExportModeState] = useState(true);
    const [isAddModeState, setIsAddModeState] = useState(true);

    const contextValue = {
        isOpenModal: isOpenModalState,
        updateOpenModal: setIsOpenModalState,

        isOpenExportModal: isExportModalState,
        updateOpenExportModal: setIsExportModalState,

               
        isExportMode: isExportModeState,
        updateExportMode: setIsExportModeState,

        isAddMode: isAddModeState,
        updateAddMode: setIsAddModeState,

       
    };

    return <ApprovalContext.Provider value={contextValue}>{children}</ApprovalContext.Provider>;
};

export default ApprovalContext;
