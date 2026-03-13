import React, { createContext, useState, useEffect, useContext } from "react";
import ClientContextProvider, { clientContext } from "./ClientContextProvider";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);
 
  const deleteToken = () => {
    console.log("DELETED TOKEN")
    localStorage.removeItem("token");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    deleteToken();
    localStorage.clear();
  };
  //
  // LIGHT DARK THEME
  const [theme, setTheme] = useState(() => {
    // Retrieve theme preference from local storage on component mount
    const storedTheme = localStorage.getItem("theme");
    return storedTheme || "light";
  });

  // Set theme directly on component mount
  document.body.className = theme;

  // CLIENT CONTEXT
  const clientContextValue = useContext(clientContext);
  const contextValues = {
    ...clientContextValue
  };
  // Table Action Dropdown
  const [openDropdown, setOpenDropdown] = useState([]);

  // Dropdown

  const handleClick = (index) => {
    setOpenDropdown((prevOpenDropdown) => {
      const updatedOpenDropdown = [...prevOpenDropdown];
      updatedOpenDropdown[index] = !updatedOpenDropdown[index];
      return updatedOpenDropdown;
    });
  };
  const [hoveredDropdown, setHoveredDropdown] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredDropdown(index);
  };

  const handleMouseLeave = () => {
    setHoveredDropdown(null);
  };

  const isDropdownOpen = (index) => {
    return hoveredDropdown === index;
  };
  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        // getToken,
        handleLogout,
        isOpen,
        toggle,
        // authToken
        openDropdown,
        handleClick,
        handleMouseEnter,
        handleMouseLeave,
        isDropdownOpen,
        theme,
        setTheme
      }}
    >
      <ClientContextProvider value={contextValues}>
            {children}
      </ClientContextProvider>
    </AppContext.Provider>
  );
};

export default AppContextProvider;
