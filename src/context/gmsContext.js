import React, {useState} from "react";

const GmsContext = React.createContext({
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

export const GmsContextProvider = ({children}) => {

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

    return <GmsContext.Provider value={contextValue}>{children}</GmsContext.Provider>;
};

export default GmsContext;