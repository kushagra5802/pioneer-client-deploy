// import { useState } from "react";
// import useAxiosInstance from "../../lib/useAxiosInstance";
// import { toast } from "react-toastify";

// function BlogForm({ onClose }) {
//   const axiosInstance = useAxiosInstance();
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!title.trim() || !content.trim()) {
//       toast.warning("Please fill in all fields");
//       return;
//     }

//     try {
//       setIsLoading(true);

//       const response = await axiosInstance.post(
//         "/api/studentBlog/createBlog",
//         {
//           title: title.trim(),
//           description: content.trim()
//         }
//       );

//       if (response.data.status) {
//         toast.success("Blog submitted for approval! Our team will review it.");

//         setTitle("");
//         setContent("");

//         if (onClose) {
//           onClose();
//         }
//       } else {
//         toast.error(response.data.message || "Failed to submit blog");
//       }

//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong while submitting the blog");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="w-full">
//       <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 md:p-12 text-white">
//         <div className="max-w-2xl">
//           <h2 className="text-4xl md:text-5xl font-bold mb-4">
//             Voice of the Students
//           </h2>

//           <p className="text-indigo-100 mb-8 text-lg">
//             Share your journey, tips, and experiences with the Project Pioneer community.
//           </p>

//           <div className="space-y-4">
//             <div>
//               <input
//                 type="text"
//                 placeholder="Blog Title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="w-full bg-indigo-500 placeholder-indigo-200 text-white border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-white focus:bg-indigo-600"
//                 required
//               />
//             </div>

//             <div>
//               <textarea
//                 placeholder="Write your thoughts..."
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//                 rows={6}
//                 className="w-full bg-indigo-500 placeholder-indigo-200 text-white border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-white focus:bg-indigo-600 resize-none"
//                 required
//               />
//             </div>

//             <div className="flex gap-3 pt-4">
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold px-8 py-3 rounded-lg"
//               >
//                 {isLoading ? "Submitting..." : "Submit for Approval"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </form>
//   );
// }

// export default BlogForm;

import { useState, useRef } from "react";
import useAxiosInstance from "../../lib/useAxiosInstance";
import { toast } from "react-toastify";

function BlogForm({ onClose }) {
  const axiosInstance = useAxiosInstance();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /* =========================
     MEDIA UPLOAD
  ========================= */

  const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("media", file));

    try {
      setUploading(true);

      const res = await axiosInstance.post(
        "/api/studentBlog/mediaUpload",
        formData
      );

      setMedia((prev) => [...prev, ...res.data.data]);

      toast.success("Image uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Media upload failed");
    } finally {
      setUploading(false);
      fileInputRef.current.value = "";
    }
  };

  const removeMedia = (index) => {
    const updated = [...media];
    updated.splice(index, 1);
    setMedia(updated);
  };

  /* =========================
     BLOG SUBMIT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.warning("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axiosInstance.post(
        "/api/studentBlog/createBlog",
        {
          title: title.trim(),
          description: content.trim(),
          media
        }
      );

      if (response.data.status) {
        toast.success("Blog submitted for approval!");

        setTitle("");
        setContent("");
        setMedia([]);

        if (onClose) onClose();
      } else {
        toast.error(response.data.message || "Failed to submit blog");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while submitting the blog");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 md:p-12 text-white">
        <div className="max-w-2xl">

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Voice of the Students
          </h2>

          <p className="text-indigo-100 mb-8 text-lg">
            Share your journey, tips, and experiences with the community.
          </p>

          <div className="space-y-4">

            {/* Title */}
            <input
              type="text"
              placeholder="Blog Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-indigo-500 placeholder-indigo-200 text-white rounded-lg px-4 py-3"
              required
            />

            {/* Description */}
            <textarea
              placeholder="Write your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full bg-indigo-500 placeholder-indigo-200 text-white rounded-lg px-4 py-3 resize-none"
              required
            />

            {/* MEDIA UPLOAD BOX */}
            <div
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed border-indigo-300 rounded-xl p-6 text-center cursor-pointer hover:bg-indigo-700"
            >
              <p className="text-sm font-semibold">
                Upload Blog Image
              </p>

              <p className="text-xs text-indigo-200">
                JPG, PNG allowed
              </p>

              {uploading && (
                <p className="text-white mt-2">Uploading...</p>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleMediaUpload}
            />

            {/* IMAGE PREVIEW */}
            {media.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {media.map((item, idx) => (
                  <div
                    key={idx}
                    className="relative bg-white rounded-lg overflow-hidden"
                  >
                    <img
                      src={item.url}
                      alt={item.name}
                      className="h-24 w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeMedia(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold px-8 py-3 rounded-lg"
            >
              {isLoading ? "Submitting..." : "Submit for Approval"}
            </button>

          </div>
        </div>
      </div>
    </form>
  );
}

export default BlogForm;