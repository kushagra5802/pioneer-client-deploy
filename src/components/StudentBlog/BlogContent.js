import { useState } from "react";
import { useQuery } from "react-query";
import BlogForm from "./BlogForm";
import BlogDetailModal from "./BlogDetailModal";
import useAxiosInstance from "../../lib/useAxiosInstance";
import PageHeader from "../PageHeader";
import BlogCard from "./BlogCard";

function BlogContent() {
  const axiosInstance = useAxiosInstance();

  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("latest");
  const [selectedBlog, setSelectedBlog] = useState(null);

  const limit = 6;

  const {
    data: latestData,
    isLoading: latestLoading,
  } = useQuery(
    ["approvedBlogs", page],
    async () => {
      const res = await axiosInstance.get(
        `/api/studentBlog/approvedBlogs?page=${page}&limit=${limit}`
      );
      return res.data;
    },
    {
      enabled: activeTab === "latest",
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: personalData,
    isLoading: personalLoading,
  } = useQuery(
    ["personalBlogs", page],
    async () => {
      const res = await axiosInstance.get(
        `/api/studentBlog/personalBlogs?page=${page}&limit=${limit}`
      );
      return res.data;
    },
    {
      enabled: activeTab === "personal",
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const data = activeTab === "latest" ? latestData : personalData;
  const isLoading = activeTab === "latest" ? latestLoading : personalLoading;

  const blogs = data?.data?.blogs || [];
  const pagination = data?.data?.pagination || {};

  const openBlogDetail = (blog) => {
    setSelectedBlog(blog);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <PageHeader name="Student Blogs" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="mb-16">
          <BlogForm />
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b mb-8">
          <button
            onClick={() => {
              setActiveTab("latest");
              setPage(1);
            }}
            className={`pb-2 ${
              activeTab === "latest"
                ? "border-b-2 border-indigo-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            Latest Stories
          </button>

          <button
            onClick={() => {
              setActiveTab("personal");
              setPage(1);
            }}
            className={`pb-2 ${
              activeTab === "personal"
                ? "border-b-2 border-indigo-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            Your Blogs
          </button>
        </div>

        {/* Blog Grid */}
        {isLoading ? (
          <p className="text-center text-gray-500">Loading blogs...</p>
        ) : blogs.length > 0 ? (
          <>
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  onClick={() => openBlogDetail(blog)}
                  className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer border border-slate-100"
                >
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 line-clamp-2">
                    {blog.title}
                  </h3>

                  <p className="text-sm text-indigo-600 font-medium mb-1">
                    {blog.studentId?.personalInfo?.fullName || "Student"}
                  </p>

                  <p className="text-sm text-slate-500 mb-2">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>

                  {activeTab === "personal" && (
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        blog.isApproved
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {blog.isApproved ? "Approved" : "Pending Approval"}
                    </span>
                  )}
                </div>
              ))}
            </div> */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  onOpen={openBlogDetail}
                  isPersonalView={activeTab === "personal"}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-4 mt-10">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>

              <span className="px-4 py-2">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              <button
                disabled={page === pagination.totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600">No blogs found.</p>
          </div>
        )}
      </div>

      {/* Blog Modal */}
      <BlogDetailModal
        blog={selectedBlog}
        isPersonalView={activeTab === "personal"}
        onClose={() => setSelectedBlog(null)}
      />
    </div>
  );
}

export default BlogContent;