import React, { createContext, useState } from 'react'
// import { AppContext } from './AppContextProvider';
import 'react-toastify/dist/ReactToastify.css';

export const clientContext = createContext();

const ClientContextProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientData, setClientData] = useState([]);
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  // eslint-disable-next-line
  const [sort, setSort] = useState("DES");

 

  const validateForm = (validClient) => {
    const errors = {};
    let formValid = true;

    // Check required fields
    if (!validClient.adminFirstName) {
      errors.adminFirstName = "First name is required";
      formValid = false;
    }
    if (!validClient.adminLastName) {
      errors.lastName = "Last name is required";
      formValid = false;
    }
    if (!validClient.adminEmail) {
      errors.adminEmail = "Email is required";
      formValid = false;
    }
    if (!validClient.adminContact) {
      errors.phone = "Phone is required";
      formValid = false;
    }
    if (!validClient.password) {
      errors.password = "Password is required";
      formValid = false;
    }

    setErrors(errors);
    return formValid;
  };

  // Dropdown
  const [openDropdown, setOpenDropdown] = useState([]);

  const handleClick = (index) => {
    setOpenDropdown((prevOpenDropdown) => {
      const updatedOpenDropdown = [...prevOpenDropdown];
      updatedOpenDropdown[index] = !updatedOpenDropdown[index];
      return updatedOpenDropdown;
    });
  }




  const clientValues = {
    isModalOpen, setIsModalOpen,clientData, setClientData,
    errors, setErrors, openDropdown, setOpenDropdown, handleClick,
    validateForm, currentPage, setCurrentPage, limit, setLimit,total,
    setTotal, sort
  }
  return (
    <clientContext.Provider value={clientValues}>
      {children}
    </clientContext.Provider>
  );
}

export default ClientContextProvider
