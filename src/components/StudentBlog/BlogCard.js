import placeholder from "../../assets/images/placeholderImage.png";

function BlogCard({ blog, onOpen, isPersonalView }) {
  const image =
    blog?.imageUrls?.length > 0
      ? blog.imageUrls[0].url
      : placeholder;

  const description =
    blog?.description?.length > 120
      ? blog.description.slice(0, 120) + "..."
      : blog.description;

  return (
    <div
      onClick={() => onOpen(blog)}
      className="cursor-pointer group"
    >
      {/* Image */}
      <div className="overflow-hidden">
        <img
          src={image}
          alt={blog.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
        />
      </div>

      {/* Content Card */}
      <div className="relative overflow-hidden bg-[#F6FCFF] p-4 rounded-xl -mt-10 mr-10">

        {/* Hover Background Animation */}
        <div className="absolute inset-0 bg-slate-800 w-0 group-hover:w-full transition-all duration-500 ease-in-out"></div>

        {/* Content */}
        <div className="relative z-10 transition-colors duration-300">

          <div className="flex justify-between">
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-white">
                {blog.title}
              </h3>
              {/* Status Badge */}
        {isPersonalView && (
          <span
            className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full font-semibold
              ${
                blog.isApproved
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
          >
            {blog.isApproved ? "Approved" : "Pending"}
          </span>
        )}
          </div>

          <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide group-hover:text-gray-300">
            {new Date(blog.createdAt).toDateString()} •{" "}
            {blog.studentId?.personalInfo?.fullName || "Student"}
          </p>

          <p className="text-sm text-gray-600 mb-4 line-clamp-3 group-hover:text-gray-200">
            {description}
          </p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpen(blog);
            }}
            className="text-red-500 text-sm font-semibold tracking-wide group-hover:text-white"
          >
            READ MORE →
          </button>

          

        </div>
      </div>
    </div>
  );
}

export default BlogCard;