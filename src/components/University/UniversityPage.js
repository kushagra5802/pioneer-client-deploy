import { useState } from "react"
import { useQuery } from "react-query"
import PageHeader from "../PageHeader"
import useAxiosInstance from "../../lib/useAxiosInstance"
import { Search, MapPin, ChevronDown, Plus } from "lucide-react"
import UniversityDetailModal from "./UniversityDetailModal"

const regions = [
  "All Regions",
  "Tamil Nadu",
  "West Bengal",
  "Kerala",
  "Maharashtra",
  "Karnataka",
  "Delhi",
]

export default function UniversityPage() {
  const axios = useAxiosInstance()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("All Regions")
  const [isRegionOpen, setIsRegionOpen] = useState(false)

  const [openModal, setOpenModal] = useState(false)
  const [selectedUniversity, setSelectedUniversity] = useState(null)

  /* =======================
     FETCH UNIVERSITIES
  ======================= */

  const {
    data: universitiesResponse,
    isLoading,
    isError,
  } = useQuery(
    ["universities", searchQuery, selectedRegion],
    async () => {
      const res = await axios.get("/api/university", {
        params: {
          keyword: searchQuery || undefined,
          state:
            selectedRegion && selectedRegion !== "All Regions"
              ? selectedRegion
              : undefined,
        },
      })
      return res.data
    },
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  )

  const universities = universitiesResponse?.data || []

  const getInitial = (name = "") => name.charAt(0).toUpperCase()

  const openUniversityDetail = (university) => {
    setSelectedUniversity(university)
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header (matches your system) */}
      <PageHeader name="Universities" />

      <main className="p-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl p-4 mb-8 flex items-center gap-4 shadow-sm">
          <div className="flex-1 flex items-center gap-3 px-4">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search 500+ top colleges in India..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 py-2 text-slate-600 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Filter by State
            </span>

            {/* Region Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsRegionOpen(!isRegionOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-colors min-w-[150px] justify-between"
              >
                {selectedRegion}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isRegionOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isRegionOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-20">
                  {regions.map((region) => (
                    <button
                      key={region}
                      onClick={() => {
                        setSelectedRegion(region)
                        setIsRegionOpen(false)
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors
                        ${
                          selectedRegion === region
                            ? "text-teal-600 font-medium bg-teal-50"
                            : "text-slate-600"
                        }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* University Grid */}
        {isLoading ? (
          <div className="text-center py-12">Loading universities...</div>
        ) : isError ? (
          <div className="text-center py-12 text-red-500">
            Failed to load universities.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {universities.map((university) => (
                <div
                  key={university._id}
                  onClick={() => openUniversityDetail(university)}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  {/* Initial Avatar */}
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-slate-200 transition-colors">
                    <span className="text-lg font-bold text-slate-600">
                      {getInitial(university.name)}
                    </span>
                  </div>

                  {/* University Name */}
                  <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">
                    {university.name}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-500 uppercase tracking-wider">
                      {university.city}
                    </span>
                  </div>

                  {/* Rank / Accreditation */}
                  {university.rankAccreditation && (
                    <span className="inline-flex px-3 py-1 bg-slate-800 text-white text-[10px] font-bold tracking-wider uppercase rounded">
                      {university.rankAccreditation}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {universities.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500">
                  No universities found matching your criteria.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <UniversityDetailModal
        university={selectedUniversity}
        onClose={() => setSelectedUniversity(null)}
      />
    </div>
  )
}
