import { useMemo, useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { toast } from "react-toastify"
import PageHeader from "../PageHeader"
import useAxiosInstance from "../../lib/useAxiosInstance"
import { Search, MapPin, ChevronDown, Heart } from "lucide-react"
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
  const queryClient = useQueryClient()
  const PAGE_SIZE = 50

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("All Regions")
  const [isRegionOpen, setIsRegionOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const [selectedUniversity, setSelectedUniversity] = useState(null)

  const universityQueryParams = useMemo(() => {
    const params = {}
    const keyword = searchQuery.trim()

    if (keyword) {
      params.keyword = keyword
    }

    if (selectedRegion && selectedRegion !== "All Regions") {
      params.state = selectedRegion
    }

    params.limit = PAGE_SIZE
    params.page = currentPage

    return params
  }, [searchQuery, selectedRegion, currentPage])

  /* =======================
     FETCH UNIVERSITIES
  ======================= */

  const {
    data: universitiesResponse,
    isLoading,
    isError,
  } = useQuery(
    ["universities", searchQuery, selectedRegion, currentPage],
    async () => {
      const res = await axios.get("/api/university", {
        params: universityQueryParams,
      })
      return res.data
    },
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  )

  const universities = useMemo(
    () => universitiesResponse?.data || [],
    [universitiesResponse]
  )
  const totalUniversityPages = universitiesResponse?.totalPages || 1
  const totalUniversities = universitiesResponse?.total || 0

  const { data: shortlistResponse } = useQuery(
    "student-shortlist-universities",
    async () => {
      const res = await axios.get("/api/student-shortlist")
      return res.data
    },
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  )

  const shortlistedUniversities = useMemo(
    () => shortlistResponse?.data?.shortlistedUniversities?.filter(Boolean) || [],
    [shortlistResponse]
  )

  const shortlistedUniversityIds = useMemo(
    () => new Set(shortlistedUniversities.map((university) => university._id)),
    [shortlistedUniversities]
  )

  const getInitial = (name = "") => name.charAt(0).toUpperCase()

  const openUniversityDetail = (university) => {
    setSelectedUniversity(university)
  }

  const toggleUniversityShortlist = async (university) => {
    try {
      const res = await axios.post(
        "/api/student-shortlist/universities/toggle",
        { universityId: university._id }
      )
      toast.success(res?.data?.message || "Shortlist updated")
      await queryClient.invalidateQueries("student-shortlist-universities")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update shortlist")
    }
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
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
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
                        setCurrentPage(1)
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
            {shortlistedUniversities.length > 0 && (
              <section className="mb-10">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">
                  My Shortlisted Universities
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {shortlistedUniversities.map((university) => (
                    <div
                      key={university._id}
                      className="bg-slate-900 rounded-2xl p-6 shadow-sm text-white"
                    >
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                        <span className="text-lg font-bold text-white">
                          {getInitial(university.name)}
                        </span>
                      </div>
                      <h3 className="font-bold text-white mb-2 line-clamp-2">
                        {university.name}
                      </h3>
                      <p className="text-xs text-slate-300 uppercase tracking-wider mb-5">
                        {university.city}
                        {university.state ? `, ${university.state}` : ""}
                      </p>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => openUniversityDetail(university)}
                          className="text-xs font-bold uppercase tracking-wider text-teal-300"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => toggleUniversityShortlist(university)}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-rose-300"
                        >
                          <Heart className="w-4 h-4" fill="currentColor" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {universities.map((university) => (
                <div
                  key={university._id}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                  {/* Initial Avatar */}
                    <div
                      onClick={() => openUniversityDetail(university)}
                      className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      <span className="text-lg font-bold text-slate-600">
                        {getInitial(university.name)}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleUniversityShortlist(university)}
                      className={`inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider ${
                        shortlistedUniversityIds.has(university._id)
                          ? "text-rose-500"
                          : "text-slate-400 hover:text-rose-500"
                      }`}
                    >
                      <Heart
                        className="w-4 h-4"
                        fill={
                          shortlistedUniversityIds.has(university._id)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>
                  </div>

                  {/* University Name */}
                  <h3
                    onClick={() => openUniversityDetail(university)}
                    className="font-bold text-slate-900 mb-2 line-clamp-2 cursor-pointer"
                  >
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

            {universities.length > 0 && (
              <div className="mt-8 flex items-center justify-between rounded-2xl bg-white px-6 py-4 shadow-sm">
                <p className="text-sm text-slate-500">
                  Showing page {currentPage} of {totalUniversityPages} · {totalUniversities} universities
                </p>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={currentPage >= totalUniversityPages}
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(totalUniversityPages, page + 1)
                      )
                    }
                    className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <UniversityDetailModal
        university={selectedUniversity}
        onClose={() => setSelectedUniversity(null)}
        isShortlisted={
          selectedUniversity
            ? shortlistedUniversityIds.has(selectedUniversity._id)
            : false
        }
        onToggleShortlist={toggleUniversityShortlist}
      />
    </div>
  )
}
