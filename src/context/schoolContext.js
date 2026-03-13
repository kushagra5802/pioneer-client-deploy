import React, {useState} from "react";

const SchoolContext = React.createContext({
    isOpenModal: false,
    updateOpenModal: () => {
    },

    isStatusModal: false,
    updateStatusModal: () => {
    },

    isAddMode: true,
    updateAddMode: () => {
    },

    editData: {},
    updateEditData: () => {
    },
});

export const SchoolContextProvider = ({children}) => {

    const [isOpenModalState, setIsOpenModalState] = useState(false);
    const [isStatusModalState, setIsStatusModalState] = useState(false);
    const [isAddModeState, setIsAddModeState] = useState(true);
    const [editDataState, setEditDataState] = useState({});

    const contextValue = {
        isOpenModal: isOpenModalState,
        updateOpenModal: setIsOpenModalState,

        isStatusModal: isStatusModalState,
        updateStatusModal: setIsStatusModalState,

        isAddMode: isAddModeState,
        updateAddMode: setIsAddModeState,

        editData: editDataState,
        updateEditData: setEditDataState,
    };

    return <SchoolContext.Provider value={contextValue}>{children}</SchoolContext.Provider>;
};

export default SchoolContext;