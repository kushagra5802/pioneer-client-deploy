import React, { useState } from "react";

const PowerBiContext = React.createContext({
  isOpenModal: false,
  updateOpenModal: () => {},

  isOpenExportModal: false,
  updateOpenExportModal: () => {},

  isAddMode: true,
  updateAddMode: () => {},

  isExportMode: true,
  updateExportMode: () => {},

  editData: null,
  updateEditData: () => {},
});

export const PowerBiContextProvider = ({ children }) => {
  const [isOpenModalState, setIsOpenModalState] = useState(false);
  const [isExportModalState, setIsExportModalState] = useState(false);
  const [isExportModeState, setIsExportModeState] = useState(true);
  const [isAddModeState, setIsAddModeState] = useState(true);
  const [editData, setEditData] = useState(null);

  const contextValue = {
    isOpenModal: isOpenModalState,
    updateOpenModal: setIsOpenModalState,

    isOpenExportModal: isExportModalState,
    updateOpenExportModal: setIsExportModalState,

    isExportMode: isExportModeState,
    updateExportMode: setIsExportModeState,

    isAddMode: isAddModeState,
    updateAddMode: setIsAddModeState,

    editData,
    updateEditData: setEditData,
  };

  return (
    <PowerBiContext.Provider value={contextValue}>
      {children}
    </PowerBiContext.Provider>
  );
};

export default PowerBiContext;
