import React, { useState, useEffect, useContext } from "react";
import Logo from "../assets/images/ps-logo.png";
// import { HiOutlineSearch, HiX } from "react-icons/hi";
import { notification } from "antd";
import { IoIosNotifications } from "react-icons/io";
import { AiOutlineArrowRight } from "react-icons/ai";
import NotificationsWindow from "./NotificationsWindow";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContextProvider";
import profile from "../assets/images/placeholder-icon.png";
import { Switch } from "antd";
import sunImg from "../assets/svg/sunImg.svg";
import moonImg from "../assets/svg/moonImg.svg";
import useAxiosInstance from "../lib/useAxiosInstance";
import io from "socket.io-client";
import { useQueryClient, useMutation } from "react-query";

function Navbar() {
  const { isOpen, theme, setTheme } = useContext(AppContext);
  const [photoUrl, setPhotoUrl] = useState();
  const queryClient = useQueryClient();
  const axiosInstance = useAxiosInstance();
  // user data
  const userString = localStorage.getItem("users");
  const user = JSON.parse(userString);
  const [showNotificationWindow, setShowNotificationWindow] = useState(false);
  const [showNotificationDot, setShowNotificationDot] = useState(false);

  // for toggle search
  // const [isSearchOpen, setIsSearchOpen] = useState(false);
  // const toggleSearch = () => {
  //   setIsSearchOpen(!isSearchOpen);
  // };

  // USER PROFILE DROPDOWN
  const [showTooltip, setShowTooltip] = useState(false);

  // Toggle tooltip directly when clicking user profile icon
  const toggleTooltipDirectly = () => {
    setShowTooltip((prevShowTooltip) => !prevShowTooltip);
  };

  // Function to close the tooltip
  const closeTooltip = () => {
    setShowTooltip(false);
  };

  const handleOutsideClick = (event) => {
    if (event.target && !event.target.closest(".tooltip-container")) {
      closeTooltip();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL, {
      transports: ["websocket", "polling", "flashsocket"]
    });

    socket.on(user?._id, (data) => {
      notification.open({
        placement: "top",
        message: data.title + " Notification",
        description:
          data?.content.charAt(0).toUpperCase() + data?.content.slice(1),
        duration: 400,
        icon: <IoIosNotifications color='#004877' />
      });
      setShowNotificationDot(true);
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const notificationIcon = document.querySelector(".notification-icon");
      const isNotificationIconClicked =
        notificationIcon && notificationIcon.contains(event.target);

      if (isNotificationIconClicked) {
        setShowNotificationWindow((prevState) => !prevState); // toggle notification window
      } else {
        const notificationWindow = document.querySelector(
          ".notification-window"
        );
        const isNotificationWindowClicked =
          notificationWindow && notificationWindow.contains(event.target);

        if (!isNotificationWindowClicked) {
          setShowNotificationWindow(false);
        }
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  // FOR UNREAD MESSAGE
  const bgColor = "var(--notification-unread-background)";
  const [seeAllLink, setSeeAllLink] = useState("var(--dark-color)");
  // eslint-disable-next-line
  const [unreadNotifications, setUnreadNotifications] = useState();
  const handleMarkAllRead = async () => {
    try {
      await markAllReadMutation.mutateAsync();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const markAllReadMutation = useMutation(
    async () => {
      await axiosInstance.post("/api/notification/markAsReadAll");
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("notifications");
        setSeeAllLink("var(--stat-text");
        setShowNotificationDot(false);
      }
    }
  );
  // Change Navbar Background Color On Scrolling
  const [navBg, setNavBg] = useState(false);
  const changeNavBg = () => {
    if (window.scrollY >= 10) {
      setNavBg(true);
    } else {
      setNavBg(false);
    }
  };
  window.addEventListener("scroll", changeNavBg);

  // bg change in dashboard

  const location = useLocation();
  const [isDashboard, setIsDashboard] = useState(false);

  useEffect(() => {
    setIsDashboard(location.pathname === "/dashboard");
  }, [location]);
  // LIGHT DARK THEME
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    // Save theme preference to local storage
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axiosInstance.get(
          `api/users/info/getProfileImage/${user?._id}`
        );
        const url = response?.data?.data?.profileImageLink?.publicUrl;
        setPhotoUrl(url);
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    fetchProfileImage();
    // eslint-disable-next-line
  }, []);

  return (
    <div className=''>
      {/* {isLoggedIn && ( */}
      <nav
        className={`nav ${isOpen ? "navbar-bg" : ""} ${
          navBg ? "nav-bg-color" : ""
        }  ${isDashboard ? "dashboard-page-bg" : ""}`}
      >
        <div className='nav-left'>
          <div className='logo'>
            <NavLink to='/dashboard'>
              <img src={Logo} alt='Logo' />
            </NavLink>
          </div>
        </div>

        <div className='nav-right'>
          <div className='nav-right-item custom-switch'>
            <Switch
              onClick={toggleTheme}
              checkedChildren={
                <img
                  src={moonImg}
                  alt='moon'
                  style={{ height: "2.3em", paddingRight: "1px" }}
                />
              }
              unCheckedChildren={
                <img
                  src={sunImg}
                  alt='sun'
                  style={{ height: "1.3em", marginLeft: "4px" }}
                />
              }
              checked={theme === "dark"}
            />
          </div>
          {/* <div className="nav-right-item">
            <img src={Sun} alt="toggle button" className="toggle-btn" />
          </div> */}
          {/* <div className="nav-right-item">
            {isSearchOpen && (
              <input
                type="text"
                placeholder="Search..."
              />
            )}
            {isSearchOpen ? (
              <HiX size="1.2em" className="ml-2" onClick={toggleSearch} />
            ) : (
              <HiOutlineSearch size="1.3em" onClick={toggleSearch} />
            )}
          </div> */}

          <div className='nav-right-item  notification-icon'>
            <IoIosNotifications size='1.3em' />
            <div
              className='notification-dot'
              style={{
                display: showNotificationDot ? "block" : "none",
                marginRight: "20px"
              }}
            />
          </div>
          {unreadNotifications > 0 && (
            <div className='notification-count'>{unreadNotifications}</div>
          )}

          <div className='nav-right-item user-profile'>
            <div className='tooltip-container mr-2'>
              {/* <FaUserCircle size='1.3em' onClick={toggleTooltipDirectly} /> */}
              <img
                src={photoUrl || profile}
                alt='User'
                style={{ height: "30px", width: "30px" }}
                onClick={toggleTooltipDirectly}
              />
              {showTooltip && (
                <div className='tooltip1'>
                  <div className='flex'>
                    <div>
                      <img src={photoUrl || profile} alt='user profile' />
                    </div>
                    <div className='user-name'>
                      <span className='username'>
                        {user?.firstName + " " + user?.lastName}
                      </span>
                      <span>{user?.role}</span>
                      <span>
                        <NavLink
                          to='/settings'
                          className='flex'
                          onClick={closeTooltip}
                        >
                          <span className='mb-2'> View Profile</span>{" "}
                          <AiOutlineArrowRight className='ml-1' />
                        </NavLink>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showNotificationWindow && (
        <NotificationsWindow
          seeAllLink={seeAllLink}
          bgColor={bgColor}
          handleMarkAllRead={handleMarkAllRead}
          setShowNotificationDot={setShowNotificationDot}
          setShowNotificationWindow={setShowNotificationWindow}
        />
      )}
    </div>
  );
}

export default Navbar;
