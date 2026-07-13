import React, { useContext } from "react";
// eslint-disable-next-line no-unused-vars
import {
  Route,
  Routes,
  Navigate,
  useLocation
} from "react-router-dom";
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
import AssessmentResultView from "../components/Skills/AssessmentResultView";
import Psychometric from "../pages/psychometric";
import AcademicResult from "../components/Psychometric/AcademicSelfEfficacy/AcademicResult";
import MBTIResult from "../components/Psychometric/MBTI/MBTIResult";
import CareerResult from "../components/Psychometric/CareerMaturity/CareerResult";
import RiasecResult from "../components/Psychometric/Riasec/RiasecResult";
import DISHAResult from "../components/Psychometric/DISHA/DISHAResult";
import DISHA2Result from "../components/Psychometric/DISHA2/DISHA2Result";
import DISHA3Result from "../components/Psychometric/DISHA3/DISHA3Result";
import DISHA4Result from "../components/Psychometric/DISHA4/DISHA4Result";
import DISHA5Result from "../components/Psychometric/DISHA5/DISHA5Result";
import DISHAC10Result from "../components/Psychometric/DISHAC10/DISHAC10Result";
import DISHAC12Result from "../components/Psychometric/DISHAC12/DISHAC12Result";
import DISHA6Result from "../components/Psychometric/DISHA6/DISHA6Result";
import DISHA7Result from "../components/Psychometric/DISHA7/DISHA7Result";
import DISHA8Result from "../components/Psychometric/DISHA8/DISHA8Result";
import StudentBlog from "../pages/studentBlog";
import Welcome from "../pages/welcome";
import Resources from "../pages/resources";
import ExploreCity from "../pages/exploreCity";
import ProfilePage from "../pages/profile";
import { readWelcomeProfile } from "../data/studentExperience";
const RouteApps = () => {
  const { isLoggedIn } = useContext(AppContext);
  const location = useLocation();
  const userString = localStorage.getItem("users");
  const user = JSON.parse(userString);
  const welcomeProfile = readWelcomeProfile();
  const hasCompletedWelcome = Boolean(welcomeProfile?.grade);
  const isSchoolUser = user?.type === "client";
  const role = isSchoolUser ? user?.role : "STUDENT";
  const shouldShowWelcome = !isSchoolUser;
  const defaultAuthenticatedRoute = isSchoolUser
    ? "/assets"
    : hasCompletedWelcome
      ? "/dashboard"
      : "/welcome";

  if (
    isLoggedIn &&
    shouldShowWelcome &&
    !hasCompletedWelcome &&
    location.pathname !== "/welcome"
  ) {
    return <Navigate to="/welcome" replace />;
  }

  if (isLoggedIn && isSchoolUser && location.pathname === "/welcome") {
    return <Navigate to="/assets" replace />;
  }

  return (
    <>
      {isLoggedIn ? (
        <>
          {/* <Navbar /> */}
          <div className={location.pathname === "/welcome" ? "" : "grid-container"}>
            {location.pathname !== "/welcome" && (
              <div className='grid-child'>
                <Sidebar role={role} user={user} />
              </div>
            )}

            <div className='grid-child'>
              <Routes>
                <Route
                  path='*'
                  element={
                    <Navigate
                      to={defaultAuthenticatedRoute}
                      replace
                    />
                  }
                />
                <Route path="/welcome" element={<Welcome user={user} />} />
                <Route element={<ClientRoute user={user} />}>
                  <Route path="/assets" element={<Assets />} />
                  <Route path="/assets/:studentId" element={<StudentDetails />} />
                </Route>
                
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/careers" element={<Careers />} />

                <Route path="/university" element={<University />} />
                <Route path="/counselling" element={<Counselling />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/explore-city" element={<ExploreCity />} />
                <Route path="/assessment-result" element={<AssessmentResultView />} />
                <Route path="/psychometric" element={<Psychometric />} />
                <Route path="/psychometric-academic-result" element={<AcademicResult />} />
                <Route path="/psychometric-mbti-result" element={<MBTIResult />} />
                <Route path="/psychometric-career-result" element={<CareerResult />} />
                <Route path="/psychometric-riasec-result" element={<RiasecResult />} />
                <Route path="/psychometric-disha-result" element={<DISHAResult />} />
                <Route path="/psychometric-disha2-result" element={<DISHA2Result />} />
                <Route path="/psychometric-disha3-result" element={<DISHA3Result />} />
                <Route path="/psychometric-disha4-result" element={<DISHA4Result />} />
                <Route path="/psychometric-disha5-result" element={<DISHA5Result />} />
                <Route path="/psychometric-dishac10-result" element={<DISHAC10Result />} />
                <Route path="/psychometric-dishac12-result" element={<DISHAC12Result />} />
                <Route path="/psychometric-disha6-result" element={<DISHA6Result />} />
                <Route path="/psychometric-disha7-result" element={<DISHA7Result />} />
                <Route path="/psychometric-disha8-result" element={<DISHA8Result />} />
                <Route path="/cvBuilder" element={<CVBuilder />} />
                <Route path="/studentBlog" element={<StudentBlog />} />
                <Route path="/profile" element={<ProfilePage />} />
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
