import { X } from "lucide-react";
import { useState } from "react";

export default function BlogDetailModal({ blog, onClose, isPersonalView }) {
  const [activeImage, setActiveImage] = useState(null);

  if (!blog) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="relative w-full max-w-4xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">

          {/* Header */}
          <div className="bg-slate-800 px-8 py-8">
            <div className="flex items-center justify-between mb-4">

              <span className="inline-flex px-4 py-1.5 bg-slate-700 text-slate-200 text-xs font-semibold tracking-wider uppercase rounded-full">
                Student Blog
              </span>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-slate-300" />
              </button>
            </div>

            <h1 className="text-3xl font-bold text-white mb-3">
              {blog.title}
            </h1>

            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <span>
                By {blog.studentId?.personalInfo?.fullName || "Student"}
              </span>

              <span>•</span>

              <span>
                {new Date(blog.createdAt).toLocaleDateString()}
              </span>

              {isPersonalView && (
                <>
                  <span>•</span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      blog.isApproved
                        ? "bg-green-500/20 text-green-300"
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}
                  >
                    {blog.isApproved ? "Approved" : "Pending"}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">

            {/* Description */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-indigo-500 rounded-full" />
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Blog Description
                </h3>
              </div>

              <p className="text-slate-700 leading-relaxed whitespace-pre-line text-lg">
                {blog.description}
              </p>
            </div>

            {/* Images Section */}
            {blog?.imageUrls?.length > 0 && ( 
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-5 bg-indigo-500 rounded-full" />
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Images ({blog.imageUrls.length})
                  </h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {blog.imageUrls.map((img, index) => (
                    <img
                      key={index}
                      src={img.url}
                      alt={img.name || "Blog image"}
                      onClick={() => setActiveImage(img.url)}
                      className="w-full h-40 object-cover rounded-lg cursor-pointer hover:scale-105 transition"
                    />
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setActiveImage(null)}
          />

          <div className="relative">

            <button
              onClick={() => setActiveImage(null)}
              className="absolute -top-12 right-0 text-white bg-black/10 hover:bg-black/70 rounded-full p-2"
            >
              <X size={22} />
            </button>

            <img
              src={activeImage}
              alt="Preview"
              className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-2xl"
            />

          </div>
        </div>
      )}
    </>
  );
}