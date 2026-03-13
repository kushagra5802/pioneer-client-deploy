import React from "react";

// import useAxiosInstance from "../../lib/useAxiosInstance";

// import { toast } from "react-toastify";
// import { useQueryClient } from "react-query";
import ProfilePicUpload from "./ProfilePicUpload";
const ProfileInformation = ({ userData }) => {
  const user = localStorage.getItem("users");
  // const axiosInstance = useAxiosInstance();
  // const queryClient = useQueryClient();
  // const [avatar, setAvatar] = useState(userData?.profileImageLink);
  // const fileInput = useRef(null);

  // const handleChange = async (event) => {
  //   const selectedFile = event.target.files[0];

  //   if (selectedFile) {
  //     const formData = new FormData();
  //     formData.append("profileImageLink", selectedFile, "profile-image.png");

  //     try {
  //       const response = await axiosInstance.post(
  //         `api/users/info/profile/${userData?._id}`,
  //         formData,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data"
  //           }
  //         }
  //       );

  //       // Handle the success response
  //       queryClient.invalidateQueries("userInfo");
  //       setAvatar(userData?.profileImageLink);
  //       toast.success("Profile image uploaded successfully");
  //     } catch (error) {
  //       // Handle the error response
  //       console.error(error);
  //       toast.error("Error uploading profile image");
  //     }
  //   }
  // };

  // const handleDelete = () => {
  //   setAvatar(null);
  // };

  // const handleUploadClick = () => {
  //   fileInput.current.value = "";
  //   fileInput.current.click();
  // };

  return (
    <>
      <div className='modal-wrapper-content rounded-none'>
        <p className='text-heading-general-info'>Profile Information</p>
        <ProfilePicUpload user={user} />
      </div>
    </>
  );
};

export default ProfileInformation;
