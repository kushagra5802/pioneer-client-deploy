import React, {useState} from "react";

const UserContext = React.createContext({
    isOpenModal: false,
    updateOpenModal: () => {
    },
    
    isAddMode: true,
    updateAddMode: () => {
    },

    editData: {},
    updateEditData: () => {
    },
});

export const UserContextProvider = ({children}) => {

    const [isOpenModalState, setIsOpenModalState] = useState(false);
    const [isAddModeState, setIsAddModeState] = useState(true);
    const [editDataState, setEditDataState] = useState({});

    const contextValue = {
        isOpenModal: isOpenModalState,
        updateOpenModal: setIsOpenModalState,

        isAddMode: isAddModeState,
        updateAddMode: setIsAddModeState,

        editData: editDataState,
        updateEditData: setEditDataState,
    };

    return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export default UserContext;