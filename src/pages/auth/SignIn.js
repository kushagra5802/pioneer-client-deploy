import React, { useState } from "react";
import SchoolLogin from "./SchoolLogin";
import StudentLogin from "./StudentLogin";

const SignIn = () => {
  const [activeTab, setActiveTab] = useState("school");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617]">
      <div className="w-full max-w-md bg-white rounded-3xl px-8 py-10 shadow-xl">
        
        <h2 className="text-center text-2xl font-bold">PROJECT PIONEER</h2>
        <p className="text-center text-gray-500 mb-6">
          Navigating Future Success
        </p>

        {/* Tabs */}
        <div className="flex mb-6 bg-gray-100 rounded-xl overflow-hidden">
          {["school", "student"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-1/2 py-2 font-semibold transition ${
                activeTab === tab
                  ? "bg-[#0f172a] text-white"
                  : "text-gray-500"
              }`}
            >
              {tab === "school" ? "School" : "Student"}
            </button>
          ))}
        </div>

        {activeTab === "school" ? <SchoolLogin /> : <StudentLogin />}

        <p className="text-center text-xs text-gray-400 mt-8">
          © 2026 Singramau Innovation Labs
        </p>
      </div>
    </div>
  );
};

export default SignIn;
