"use client";

import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { Tooltip } from "antd";
import { LogOut as LogOutIcon } from "lucide-react";

import { AppContext } from "../context/AppContextProvider";
import SidebarMapping from "../utils/sidebarMapping";
import LogOut from "./Modal/LogOut";

const Sidebar = ({ role, user }) => {
  
  const { isOpen, toggle } = useContext(AppContext);
  const [logoutModal, setLogoutModal] = useState(false);

  const mappedSidebar = SidebarMapping();
  const mainMenuItems = mappedSidebar[role].slice(0, -1);
  const bottomMenuItems = mappedSidebar[role].slice(-1);
  return (
    <aside
      className="fixed top-0 left-0 h-screen bg-white flex flex-col border-r border-slate-700 transition-all duration-300 z-50000000"
      style={{ width: isOpen ? 256 : 80 }} 
    > 
      {/* Header (non-scrollable) */}
      <div className="p-6 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center"
          >
            <span className="text-white font-bold text-lg">P</span>
          </button>

          {isOpen && (
            <div className="flex flex-col">
              <span className="font-bold text-black text-sm">
                PROJECT
              </span>
              <span className="font-bold text-black text-sm">
                PIONEER
              </span>
            </div>
          )}
        </div>
      </div>

      {/* User Info (non-scrollable) */}
      {isOpen && (
        <div className="px-6 pb-6 shrink-0">
          <p className="text-[10px] font-semibold tracking-[0.15em] text-indigo-800 uppercase mb-2">
            Verified Student
          </p>
          <h3 className="font-semibold text-black text-base">
            {user?.personalInfo?.fullName || "Aryan Sharma"}
          </h3>
          <p className="text-sm text-indigo-900">
            {user?.academicInfo?.classGrade || "12"}th Grade - Section {user?.academicInfo?.section || ""}
          </p>
          <p className="text-sm text-indigo-900">
            Roll Number - {user?.academicInfo?.rollNumber || 0}
          </p>
        </div>
      )}

      <div className="mx-6 border-t border-slate-700 shrink-0" />

      {/* SCROLLABLE NAV AREA */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto">
        <ul className="space-y-1">
          {mainMenuItems.map((item) => (
            <Tooltip
              key={item.id}
              placement="right"
              title={!isOpen ? item.name : ""}
            >
              <li>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-indigo-300 text-white"
                        : "text-slate-900 hover:bg-slate-400"
                    }`
                  }
                >
                  <img src={item.icon?.props?.src} alt="" />
                  {isOpen && (
                    <span className="font-medium text-sm">
                      {item.name}
                    </span>
                  )}
                </NavLink>
              </li>
            </Tooltip>
          ))}
        </ul>
      </nav>

      {/* Footer (non-scrollable) */}
      <div className="px-3 py-4 border-t border-slate-700 shrink-0">
        {bottomMenuItems.map((item) => (
          <Tooltip
            key={item.id}
            placement="right"
            title={!isOpen ? item.name : ""}
          >
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-700"
                }`
              }
            >
              {item.icon}
              {isOpen && (
                <span className="font-medium text-sm">
                  {item.name}
                </span>
              )}
            </NavLink>
          </Tooltip>
        ))}

        <Tooltip placement="right" title={!isOpen ? "Logout" : ""}>
          <button
            onClick={() => setLogoutModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-700 transition-colors"
          >
            <LogOutIcon className="w-5 h-5 text-black" />
            {isOpen && <span className="font-medium text-sm">Logout</span>}
          </button>
        </Tooltip>

        {isOpen && (
          <p className="text-[10px] text-slate-500 text-center mt-4 tracking-wide">
            © 2026 SINGRAMAU INNOVATION LABS
          </p>
        )}
      </div>

      <LogOut logoutModal={logoutModal} setLogoutModal={setLogoutModal} />
    </aside>
  );
};

export default Sidebar;
