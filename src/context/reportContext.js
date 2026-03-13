import React, {useState} from "react";

const ReportContext = React.createContext({
    isOpenModal: false,
    updateOpenModal: () => {
    },
    isOpenRequestModal: false,
    updateOpenRequestModal: () => {
    },
    isStatusModal: false,
    updateStatusModal: () => {
    },

    isAddMode: true,
    updateAddMode: () => {
    },
    isRequestAddMode: true,
    updateRequestAddMode: () => {
    },
    editData: {},
    updateEditData: () => {
    },
    editRequestData: {},
    updateEditRequestData: () => {
    },

});

export const ReportContextProvider = ({children}) => {

    const [isOpenModalState, setIsOpenModalState] = useState(false);
    const [isRequestModalState, setIsRequestModalState] = useState(false);
    const [isStatusModalState, setIsStatusModalState] = useState(false);
    const [isAddModeState, setIsAddModeState] = useState(true);
    const [isRequestAddState, setIsRequestAddState] = useState(true);
    const [editDataState, setEditDataState] = useState({});

    const contextValue = {
        isOpenModal: isOpenModalState,
        updateOpenModal: setIsOpenModalState,

        isOpenRequestModal: isRequestModalState,
        updateOpenRequestModal: setIsRequestModalState,

        isStatusModal: isStatusModalState,
        updateStatusModal: setIsStatusModalState,

        isAddMode: isAddModeState,
        updateAddMode: setIsAddModeState,

        isRequestAddMode: isRequestAddState,
        updateRequestAddMode: setIsRequestAddState,

        editData: editDataState,
        updateEditData: setEditDataState,

        editRequestData: editDataState,
        updateEditRequestData: setEditDataState,
    };

    return <ReportContext.Provider value={contextValue}>{children}</ReportContext.Provider>;
};

export default ReportContext;