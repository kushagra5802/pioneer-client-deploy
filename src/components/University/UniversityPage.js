import { useMemo, useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { toast } from "react-toastify"
import PageHeader from "../PageHeader"
import useAxiosInstance from "../../lib/useAxiosInstance"
import { Search, MapPin, ChevronDown, Heart, Bookmark, ChevronLeft, ChevronRight, X } from "lucide-react"
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
  const [shortlistPanelOpen, setShortlistPanelOpen] = useState(true)

  const universityQueryParams = useMemo(() => {
    const params = {}
    const keyword = searchQuery.trim()
    if (keyword) params.keyword = keyword
    if (selectedRegion && selectedRegion !== "All Regions") params.state = selectedRegion
    params.limit = PAGE_SIZE
    params.page = currentPage
    return params
  }, [searchQuery, selectedRegion, currentPage])

  const {
    data: universitiesResponse,
    isLoading,
    isError,
  } = useQuery(
    ["universities", searchQuery, selectedRegion, currentPage],
    async () => {
      const res = await axios.get("/api/university", { params: universityQueryParams })
      return res.data
    },
    { refetchOnWindowFocus: false, retry: 1 }
  )

  const universities = useMemo(() => universitiesResponse?.data || [], [universitiesResponse])
  const totalUniversityPages = universitiesResponse?.totalPages || 1
  const totalUniversities = universitiesResponse?.total || 0

  const { data: shortlistResponse } = useQuery(
    "student-shortlist-universities",
    async () => {
      const res = await axios.get("/api/student-shortlist")
      return res.data
    },
    { refetchOnWindowFocus: false, retry: 1 }
  )

  const shortlistedUniversities = useMemo(
    () => shortlistResponse?.data?.shortlistedUniversities?.filter(Boolean) || [],
    [shortlistResponse]
  )

  const shortlistedUniversityIds = useMemo(
    () => new Set(shortlistedUniversities.map((u) => u._id)),
    [shortlistedUniversities]
  )

  const getInitial = (name = "") => name.charAt(0).toUpperCase()

  const openUniversityDetail = (university) => setSelectedUniversity(university)

  const toggleUniversityShortlist = async (university) => {
    try {
      const res = await axios.post("/api/student-shortlist/universities/toggle", {
        universityId: university._id,
      })
      toast.success(res?.data?.message || "Shortlist updated")
      await queryClient.invalidateQueries("student-shortlist-universities")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update shortlist")
    }
  }

  const hasShortlisted = shortlistedUniversities.length > 0

  return (
    <div className="min-h-screen bg-slate-100">
      <PageHeader name="Universities" />

      <div className="flex">
        {/* Main Content */}
        <main
          className="p-8 transition-all duration-300"
          style={{ width: hasShortlisted && shortlistPanelOpen ? "75%" : "100%" }}
        >
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
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Filter by State</span>
              <div className="relative">
                <button
                  onClick={() => setIsRegionOpen(!isRegionOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-colors min-w-[150px] justify-between"
                >
                  {selectedRegion}
                  <ChevronDown className={`w-4 h-4 transition-transform ${isRegionOpen ? "rotate-180" : ""}`} />
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
                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors ${
                          selectedRegion === region ? "text-teal-600 font-medium bg-teal-50" : "text-slate-600"
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
            <div className="text-center py-12 text-red-500">Failed to load universities.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {universities.map((university) => (
                  <div
                    key={university._id}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div
                        onClick={() => openUniversityDetail(university)}
                        className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-slate-200 transition-colors cursor-pointer"
                      >
                        <span className="text-lg font-bold text-slate-600">{getInitial(university.name)}</span>
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
                          fill={shortlistedUniversityIds.has(university._id) ? "currentColor" : "none"}
                        />
                      </button>
                    </div>
                    <h3
                      onClick={() => openUniversityDetail(university)}
                      className="font-bold text-slate-900 mb-2 line-clamp-2 cursor-pointer"
                    >
                      {university.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mb-4">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs text-slate-500 uppercase tracking-wider">{university.city}</span>
                    </div>
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
                  <p className="text-slate-500">No universities found matching your criteria.</p>
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
                      onClick={() => setCurrentPage((page) => Math.min(totalUniversityPages, page + 1))}
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

        {/* Shortlist Toggle Tab (when panel closed) */}
        {hasShortlisted && !shortlistPanelOpen && (
          <button
            onClick={() => setShortlistPanelOpen(true)}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-slate-900 text-white flex flex-col items-center gap-2 px-2 py-4 rounded-l-xl shadow-lg"
          >
            <Bookmark className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-widest uppercase" style={{ writingMode: "vertical-rl" }}>
              Shortlist ({shortlistedUniversities.length})
            </span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Shortlist Right Panel */}
        {hasShortlisted && shortlistPanelOpen && (
          <aside
            className="w-1/4 bg-slate-900 p-5 overflow-y-auto flex-shrink-0 sticky top-0 self-start"
            style={{ maxHeight: "100vh" }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-teal-300" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">My Shortlist</h2>
                <span className="bg-teal-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {shortlistedUniversities.length}
                </span>
              </div>
              <button
                onClick={() => setShortlistPanelOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {shortlistedUniversities.map((university) => (
                <div
                  key={university._id}
                  className="bg-white/10 rounded-xl p-4 hover:bg-white/15 transition-colors"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-xs font-bold text-white">{getInitial(university.name)}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1 line-clamp-2">{university.name}</h3>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-3">
                    {university.city}{university.state ? `, ${university.state}` : ""}
                  </p>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => openUniversityDetail(university)}
                      className="flex items-center gap-1 text-[10px] font-bold text-teal-300 uppercase tracking-wider hover:text-white"
                    >
                      Details <ChevronRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => toggleUniversityShortlist(university)}
                      className="flex items-center gap-1 text-[10px] font-semibold text-rose-400 hover:text-rose-300"
                    >
                      <Heart className="w-3 h-3" fill="currentColor" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>

      <UniversityDetailModal
        university={selectedUniversity}
        onClose={() => setSelectedUniversity(null)}
        isShortlisted={selectedUniversity ? shortlistedUniversityIds.has(selectedUniversity._id) : false}
        onToggleShortlist={toggleUniversityShortlist}
      />
    </div>
  )
}
