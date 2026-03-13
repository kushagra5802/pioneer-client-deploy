import React, { useContext } from "react";
// eslint-disable-next-line no-unused-vars
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import Overview from "../pages/overview";
import Sidebar from "../components/Sidebar";
import { AppContext } from "../context/AppContextProvider";
import Settings from "../pages/settings";

// For Auth
import SignIn from "../pages/auth/SignIn";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import Assets from "../pages/assets";
import StudentDetails from "../components/Assets/StudentDetails";
import ClientRoute from "./ClientRoute";
import Careers from "../pages/careers";
import Counselling from "../pages/counselling"
import University from "../pages/university";
import Skills from "../pages/skills";
import CVBuilder from "../pages/cvBuilder";
import Dashboard from "../pages/dashboard";
import WeekContentView from "../components/Skills/WeekContentView";
import AssessmentResultView from "../components/Skills/AssessmentResultView";
import Psychometric from "../pages/psychometric";
import AcademicResult from "../components/Psychometric/AcademicSelfEfficacy/AcademicResult";
import MBTIResult from "../components/Psychometric/MBTI/MBTIResult";
import CareerResult from "../components/Psychometric/CareerMaturity/CareerResult";
import RiasecResult from "../components/Psychometric/Riasec/RiasecResult";
import StudentBlog from "../pages/studentBlog";
const RouteApps = () => {
  const { isLoggedIn } = useContext(AppContext);
  const userString = localStorage.getItem("users");
  const user = JSON.parse(userString);
  // const role = user?.role;
  let role;
  if (user?.type==='client'){
    role=user?.role
  }
  else{
    role="STUDENT"
  }
  return (
    <>
      {isLoggedIn ? (
        <>
          {/* <Navbar /> */}
          <div className='grid-container'>
            <div className='grid-child'>
              <Sidebar role={role} user={user} />
            </div>

            <div className='grid-child'>
              <Routes>
                <Route
                  path='*'
                  element={<Navigate to='/dashboard' replace />}
                />
                <Route element={<ClientRoute user={user} />}>
                  <Route path="/assets" element={<Assets />} />
                  <Route path="/assets/:studentId" element={<StudentDetails />} />
                </Route>
                
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/careers" element={<Careers />} />

                <Route path="/university" element={<University />} />
                <Route path="/counselling" element={<Counselling />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="/assessment-result" element={<AssessmentResultView />} />
                <Route path="/psychometric" element={<Psychometric />} />
                <Route path="/psychometric-academic-result" element={<AcademicResult />} />
                <Route path="/psychometric-mbti-result" element={<MBTIResult />} />
                <Route path="/psychometric-career-result" element={<CareerResult />} />
                <Route path="/psychometric-riasec-result" element={<RiasecResult />} />
                <Route path="/cvBuilder" element={<CVBuilder />} />
                <Route path="/studentBlog" element={<StudentBlog />} />
                <Route path='/settings'>
                  <Route index element={<Navigate to='general' replace />} />
                  <Route path=':source' element={<Settings />} />
                </Route>
                
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <Routes>
          <Route path='/' element={<SignIn />} />
          <Route path='*' element={<Navigate to='/' replace />} />
          <Route path='/login/forgot-password' element={<ForgotPassword />} />
          <Route path='/api/users/auth/passwordReset' element={<ResetPassword />} />    
        </Routes>
      )}
    </>
  );
};

export default RouteApps;
