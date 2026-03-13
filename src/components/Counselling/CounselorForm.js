"use client"

import { useState, useContext } from "react"
import { X } from "lucide-react"
import CounsellingContext from "../../context/counsellingContext"

export default function CounselorForm() {
  const { setModalOpen, addCounselor } = useContext(CounsellingContext)

  const [formData, setFormData] = useState({
    name: "",
    experience: "",
    title: "",
    bio: "",
    image: "",
  })

  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const newCounselor = {
        id: Date.now().toString(),
        name: formData.name,
        experience: parseInt(formData.experience, 10),
        title: formData.title,
        bio: formData.bio,
        image:
          formData.image ||
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop",
        availableSlots: [],
      }

      addCounselor(newCounselor)
      setFormData({ name: "", experience: "", title: "", bio: "", image: "" })
      setModalOpen(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 text-white px-8 py-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">Add Counselor</h2>
          <button
            onClick={() => setModalOpen(false)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Full name"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                Experience (Years)
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Years of experience"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Expert Career Guidance"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Brief biography and expertise"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
              Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Image URL"
            />
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-600">
              Note: After adding a counselor, you can configure available time
              slots in the counselor management panel.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Counselor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
