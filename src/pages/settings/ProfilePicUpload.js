import React, { useState, useEffect } from "react";
import { Upload, Button, message, Spin } from "antd";
import ImgCrop from "antd-img-crop";
import useAxiosInstance from "../../lib/useAxiosInstance";
import profile from "../../assets/images/placeholder-icon.png";
import { toast, ToastContainer } from "react-toastify";

const ProfilePicUpload = ({ user }) => {
  const axiosInstance = useAxiosInstance();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageSelected, setImageSelected] = useState(false);
  const userID = JSON.parse(user)._id;

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `api/users/info/getProfileImage/${userID}`
        );
        const photoUrl = response?.data?.data?.profileImageLink?.publicUrl;
        setFileList([
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: photoUrl || profile
          }
        ]);
      } catch (error) {
        console.error("Error fetching profile image:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchProfileImage();
  }, []);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setImageSelected(true);
  };

  const onRemove = () => {
    setFileList([]);
    setImageSelected(false);
  };

  const onPreview = async (file) => {
    const src = file.url;
    if (src && typeof src === "string") {
      const image = new Image();
      image.src = src;
      const imgWindow = window.open(src);
      imgWindow?.document.write(image.outerHTML);
    } else {
      message.error("Preview not available. Please save the photo first.");
    }
  };

  const handleSave = async () => {
    const selectedFile = fileList[0];
    if (selectedFile) {
      const formData = new FormData();
      formData.append("profileImageLink", selectedFile.originFileObj);
      try {
        setLoading(true);
        await axiosInstance.put(`api/users/info/profile/${userID}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        toast.success("Profile image uploaded successfully", {
          onClose: () => {
            setTimeout(() => {
              window.location.reload(); // Refresh the page after 1 second
            }, 1000);
          }
        });
      } catch (error) {
        console.error(error);
        toast.error("Error uploading profile image");
      } finally {
        setLoading(false); // Set loading to false after sending data
      }
    }
  };

  return (
    <div className='flex items-center mb-10'>
      <ToastContainer />

      <div className='mt-2'>
        <ImgCrop
          rotationSlider
          modalWidth={500}
          modalOk='Crop'
          modalProps={{
            okButtonProps: {
              className: "custom-ok-modal-button"
            },
            cancelButtonProps: { className: "custom-cancel-modal-button" }
          }}
        >
          <Upload
            listType='picture-card'
            fileList={fileList}
            onChange={onChange}
            onPreview={onPreview}
            beforeUpload={() => false}
          >
            {fileList.length < 1 && "+ Upload"}
          </Upload>
        </ImgCrop>
      </div>
      <div className='profile-pic-buttons'>
        <Spin spinning={loading}>
          <div>
            <Button
              className='upload-photo-btn primary-background'
              type='primary'
              onClick={handleSave}
              disabled={!imageSelected}
            >
              Save Photo
            </Button>
          </div>
          <Button
            className='delete-photo-btn'
            type='primary'
            ghost
            onClick={onRemove}
          >
            Remove Photo
          </Button>
        </Spin>
      </div>
    </div>
  );
};

export default ProfilePicUpload;
