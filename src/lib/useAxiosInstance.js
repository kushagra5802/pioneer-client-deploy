
import { useContext } from 'react';
import { AppContext } from '../context/AppContextProvider';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useAxiosInstance = () => {
  const { setIsLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();

  // axios instance for making requests
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      const errorMessage = response?.data?.message;
      if (
        errorMessage === "Access Denied" ||
        errorMessage === "User does not exist" ||
        errorMessage === "This account is suspended."

        )
      {
        console.log("errorMessage",errorMessage)
        console.log("ERROR OCCURED")
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/'); // Redirect to the login page
      }
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  return axiosInstance;
};




export default useAxiosInstance;

