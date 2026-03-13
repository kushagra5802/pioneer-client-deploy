import React, { useState } from 'react'

const CustSupportContext = React.createContext({
    isOpenModal: false,
    updateOpenModal: () => {
    },

    editData: {},
    updateEditData: () => {
    },

    ticketDetails: {},
    updateTicketDetails: () => { },
})

export const CustSupportContextProvider = ({ children }) => {

    const [isOpenModalState, setIsOpenModalState] = useState(false);
    const [editDataState, setEditDataState] = useState({});
    const [ticketDetailsState,setTicketDetailsState]=useState("")

    const contextValue = {
        isOpenModal: isOpenModalState,
        updateOpenModal: setIsOpenModalState,

        // isAddMode: isAddModeState,
        // updateAddMode: setIsAddModeState,

        editData: editDataState,
        updateEditData: setEditDataState,

        ticketDetails: ticketDetailsState,
        updateTicketDetails: setTicketDetailsState,
    };
    return <CustSupportContext.Provider value={contextValue}>{children}</CustSupportContext.Provider>
}

export default CustSupportContext