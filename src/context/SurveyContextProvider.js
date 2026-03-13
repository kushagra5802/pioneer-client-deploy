import React from 'react'
import { useState } from 'react'
import { createContext } from 'react'

export const surveyContext = createContext()
const SurveyContextProvider = ({ children }) => {

    // FOR EDIT MODAL
    const [editModal, setEditModal] = useState(false)
    const [surveyEdit, setSurveyEdit] = useState({
        surveyName: "",
        resourceLocation: [
            {
                name: "",
                key: "",
                publicUrl: ""
            }
        ],
        subscribers: [],
        surveyDescription: "",
        reportStatus: ""
    })
    const showEditModal = (record) => {
        setEditModal(!editModal);
        setSurveyEdit({ ...record })
        setSurveyToDeactivate({ ...record });
    }
    // FOR DEACTIVATE Survey MODAL
    const [deactivateSurvey, setDeactivateSurvey] = useState(false);
    const [surveyToDeactivate, setSurveyToDeactivate] = useState(null);
    const handleModalDeactivate = (record) => {
        setSurveyToDeactivate(record);
        setDeactivateSurvey(true);
    };

// FOR MANAGE SUBSCRIBERS MODAL
const [surveySubscribers, setSurveySubscribers] = useState(false);
const [selectedClients, setSelectedClients] = useState({
    reportName: "",
    resourceLocation: [
        {
            name: "",
            key: "",
            publicUrl: ""
        }
    ],
    subscribers: []
});
const showSurveySubscribers = (record) => {
    setSurveySubscribers(!surveySubscribers);
    setSelectedClients({ ...record })
};
    const surveyValues = {
        editModal, setEditModal, surveyEdit, setSurveyEdit, showEditModal,
        deactivateSurvey, setDeactivateSurvey,surveyToDeactivate, setSurveyToDeactivate,
        handleModalDeactivate,surveySubscribers, setSurveySubscribers,
        selectedClients, setSelectedClients,showSurveySubscribers
    }


    return (
        <surveyContext.Provider value={surveyValues}>{children}</surveyContext.Provider>
    )
}

export default SurveyContextProvider