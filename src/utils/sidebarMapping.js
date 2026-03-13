import React from "react";

import Overview from "../assets/svg/dashboard.svg";
import ClientIcon from "../assets/svg/client.svg"; // Renamed to avoid conflict with the variable name
import Users from "../assets/svg/Users.svg";
import Career from "../assets/icons/career.png"
import Dashboard from "../assets/icons/dashboard.png"
import Skill from "../assets/icons/skill.png"
import Blog from "../assets/icons/blog.png"
import Psychometric from "../assets/icons/psychometric.png"
import CV from "../assets/icons/cv.png"
import Counselling from "../assets/icons/counselling.png"
import University from "../assets/icons/university.png"
import Help from "../assets/svg/help.svg";
import Settings from "../assets/icons/settings.png";


// Define Client variable for direct usage
const Client = <img src={ClientIcon} alt='' />;

const SidebarMapping = () => {
  return {
    STUDENT: [
      {
        id: 19,
        path: "/dashboard",
        name: "Dashboard",
        icon: <img src={Dashboard} alt='' className='sidebar-icons' />
      },
      {
        id: 0,
        path: "/careers",
        name: "Careers",
        icon: <img src={Career} alt='' className='sidebar-icons' />
      },
      {
        id: 1,
        path: "/university",
        name: "Universities",
        icon: <img src={University} alt='' className='sidebar-icons' />
      },
      {
        id: 2,
        path: "/counselling",
        name: "1-to-1 Counselling",
        icon: <img src={Counselling} alt='' className='sidebar-icons' />
      },
      {
        id: 3,
        path: "/skills",
        name: "Skills Readiness",
        icon: <img src={Skill} alt='' className='sidebar-icons' />
      },
      {
        id: 4,
        path: "/psychometric",
        name: "Psychometric Test",
        icon: <img src={Psychometric} alt='' className='sidebar-icons' />
      },
      {
        id: 5,
        path: "/studentBlog",
        name: "Student Blog",
        icon: <img src={Blog} alt='' className='sidebar-icons' />
      },
      {
        id: 6,
        path: "/cvBuilder",
        name: "CV Builder",
        icon: <img src={CV} alt='' className='sidebar-icons' />
      },
      {
        id: 13,
        path: "/settings",
        name: "Settings",
        icon: <img src={Settings} alt='' className='sidebar-icons' />
      },
    ],
    SCHOOL_ADMIN: [
      {
        id: 0,
        path: "/assets",
        name: "Assets",
        icon: <img src={Overview} alt='' />
      },
      {
        id: 13,
        path: "/settings",
        name: "Settings",
        icon: <img src={Settings} alt='' className='sidebar-icons' />
      },
    ],
    superadmin: [
      {
        id: 0,
        path: "/dashboard",
        name: "Overview",
        icon: <img src={Overview} alt='' />
      },
      {
        id: 16,
        path: "/schools",
        name: "School",
        icon: Client
      },
      {
        id: 2,
        path: "/users",
        name: "Users",
        icon: <img src={Users} alt='' />
      },
      {
        id: 13,
        path: "/settings",
        name: "Settings",
        icon: <img src={Settings} alt='' className='sidebar-icons' />
      }
    ],
    clientManager: [
      {
        id: 16,
        path: "/schools",
        name: "School",
        icon: Client
      },

      // {
      //   id: 2,
      //   path: "/users",
      //   name: "Users",
      //   icon: <img src={Users} alt='' />
      // },
      {
        id: 11,
        path: "/settings",
        name: "Settings",
        icon: <img src={Settings} alt='' className='sidebar-icons' />
      }
    ],
    accounts: [
      {
        id: 0,
        path: "/dashboard",
        name: "Overview",
        icon: <img src={Overview} alt='' />
      },
      {
        id: 11,
        path: "/settings",
        name: "Settings",
        icon: <img src={Settings} alt='' />
      },
      {
        id: 12,
        path: "/help-center",
        name: "Help",
        icon: <img src={Help} alt='' />
      }
    ]
  };
};

export default SidebarMapping;
