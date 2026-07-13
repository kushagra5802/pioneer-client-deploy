import { useMemo, useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { toast } from "react-toastify"
import PageHeader from "../PageHeader"
import useAxiosInstance from "../../lib/useAxiosInstance"
import { Search, ArrowLeft, ChevronRight, Building2, Heart, ChevronLeft, X, Bookmark } from "lucide-react"
import CareerDetailModal from "./CareerDetailModal"

export default function CareersPage() {
  const axios = useAxiosInstance()
  const queryClient = useQueryClient()
  const PAGE_SIZE = 50

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState(null)
  const [selectedCareer, setSelectedCareer] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [shortlistPanelOpen, setShortlistPanelOpen] = useState(true)

  const {
    data: careersResponse,
    isLoading,
    isError,
  } = useQuery(
    ["careers", searchQuery, selectedIndustry, currentPage],
    async () => {
      const res = await axios.get("/api/careers", {
        params: {
          keyword: searchQuery.trim() || undefined,
          industry: selectedIndustry || undefined,
          limit: PAGE_SIZE,
          page: currentPage,
        },
      })
      return res.data
    },
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  )

  const careers = useMemo(() => careersResponse?.data || [], [careersResponse])
  const totalCareerPages = careersResponse?.totalPages || 1
  const totalCareers = careersResponse?.total || 0

  const { data: shortlistResponse } = useQuery(
    "student-shortlist-careers",
    async () => {
      const res = await axios.get("/api/student-shortlist")
      return res.data
    },
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  )

  const shortlistedCareers = useMemo(
    () => shortlistResponse?.data?.shortlistedCareers?.filter(Boolean) || [],
    [shortlistResponse]
  )

  const shortlistedCareerIds = useMemo(
    () => new Set(shortlistedCareers.map((career) => career._id)),
    [shortlistedCareers]
  )

  const industryBuckets = useMemo(() => {
    return careers.reduce((acc, career) => {
      if (!career?.industry) return acc
      if (!acc[career.industry]) acc[career.industry] = []
      acc[career.industry].push(career)
      return acc
    }, {})
  }, [careers])

  const visibleIndustries = useMemo(
    () =>
      Object.entries(industryBuckets).map(([name, items]) => ({
        name,
        count: items.length,
      })),
    [industryBuckets]
  )

  const openCareerDetail = (career) => setSelectedCareer(career)

  const toggleCareerShortlist = async (career) => {
    try {
      const res = await axios.post("/api/student-shortlist/careers/toggle", {
        careerId: career._id,
      })
      toast.success(res?.data?.message || "Shortlist updated")
      await queryClient.invalidateQueries("student-shortlist-careers")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update shortlist")
    }
  }

  const hasShortlisted = shortlistedCareers.length > 0

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader name="Careers" />

      <div className="flex">
        {/* Main Content Area */}
        <main
          className="p-8 transition-all duration-300"
          style={{ width: hasShortlisted && shortlistPanelOpen ? "75%" : "100%" }}
        >
          <div className="max-w-5xl">
            {/* Hero */}
            <div className="mb-10">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                  Discover Your
                  <br />
                  <span>Ideal Career Path</span>
                </h1>
                <p className="text-slate-500 max-w-xl">
                  Explore a comprehensive library of career trajectories curated for the modern Indian economy.
                </p>
              </div>

              <div className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search careers, skills, or industries..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setSelectedIndustry(null)
                    setCurrentPage(1)
                  }}
                  className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Back Button */}
            {selectedIndustry && (
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setSelectedIndustry(null)}
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  BACK TO SECTORS
                </button>
                <span className="text-sm font-semibold text-indigo-500 uppercase tracking-wider">
                  {selectedIndustry} Catalogue
                </span>
              </div>
            )}

            {/* Industry Sectors or Career Cards */}
            {!selectedIndustry ? (
              <>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">
                  Industry Sectors
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {isLoading ? (
                    <div className="col-span-3 text-center py-10">Loading industries...</div>
                  ) : isError ? (
                    <div className="col-span-3 text-center py-10 text-red-500">Failed to load industries</div>
                  ) : visibleIndustries.length > 0 ? (
                    visibleIndustries.map((industry) => (
                      <div
                        key={industry.name}
                        onClick={() => {
                          setSelectedIndustry(industry.name)
                          setCurrentPage(1)
                        }}
                        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md cursor-pointer group"
                      >
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                          <Building2 className="w-6 h-6 text-slate-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4">{industry.name}</h3>
                        <button className="flex items-center gap-2 text-sm font-semibold text-indigo-500 uppercase tracking-wider group-hover:gap-3">
                          Explore {industry.count} Pathways
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-10">No industries found for this search</div>
                  )}
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                  <div className="col-span-2 text-center py-12">Loading careers...</div>
                ) : isError ? (
                  <div className="col-span-2 text-center py-12 text-red-500">Failed to load careers.</div>
                ) : careers.length > 0 ? (
                  careers.map((career) => (
                    <div key={career._id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <span className="inline-flex px-3 py-1 bg-indigo-100 text-indigo-600 text-xs font-semibold uppercase rounded-full">
                          {career.industry}
                        </span>
                        <button
                          onClick={() => toggleCareerShortlist(career)}
                          className={`inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider ${
                            shortlistedCareerIds.has(career._id)
                              ? "text-rose-500"
                              : "text-slate-400 hover:text-rose-500"
                          }`}
                        >
                          <Heart
                            className="w-4 h-4"
                            fill={shortlistedCareerIds.has(career._id) ? "currentColor" : "none"}
                          />
                          {shortlistedCareerIds.has(career._id) ? "Saved" : "Save"}
                        </button>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{career.title}</h3>
                      <p className="text-slate-500 text-sm mb-4 line-clamp-2">{career.description}</p>
                      <button
                        onClick={() => openCareerDetail(career)}
                        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-500"
                      >
                        DETAILS
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 bg-white rounded-xl p-12 text-center shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No careers in this sector yet</h3>
                  </div>
                )}
              </div>
            )}

            {careers.length > 0 && (
              <div className="mt-8 flex items-center justify-between rounded-2xl bg-white px-6 py-4 shadow-sm">
                <p className="text-sm text-slate-500">
                  Showing page {currentPage} of {totalCareerPages} · {totalCareers} careers
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
                    disabled={currentPage >= totalCareerPages}
                    onClick={() => setCurrentPage((page) => Math.min(totalCareerPages, page + 1))}
                    className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Shortlist Toggle Tab (visible when panel closed or no items) */}
        {hasShortlisted && !shortlistPanelOpen && (
          <button
            onClick={() => setShortlistPanelOpen(true)}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-slate-900 text-white flex flex-col items-center gap-2 px-2 py-4 rounded-l-xl shadow-lg"
          >
            <Bookmark className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-widest uppercase" style={{ writingMode: "vertical-rl" }}>
              Shortlist ({shortlistedCareers.length})
            </span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Shortlist Right Panel */}
        {hasShortlisted && shortlistPanelOpen && (
          <aside className="w-1/4 min-h-screen bg-slate-900 p-5 overflow-y-auto flex-shrink-0 sticky top-0 self-start" style={{ maxHeight: "100vh" }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-indigo-300" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  My Shortlist
                </h2>
                <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {shortlistedCareers.length}
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
              {shortlistedCareers.map((career) => (
                <div
                  key={career._id}
                  className="bg-white/10 rounded-xl p-4 hover:bg-white/15 transition-colors"
                >
                  <span className="inline-flex px-2 py-0.5 bg-indigo-500/30 text-indigo-200 text-[10px] font-semibold uppercase rounded-full mb-2">
                    {career.industry}
                  </span>
                  <h3 className="text-sm font-bold text-white mb-1 line-clamp-2">{career.title}</h3>
                  <p className="text-slate-400 text-xs mb-3 line-clamp-2">{career.description}</p>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => openCareerDetail(career)}
                      className="flex items-center gap-1 text-[10px] font-bold text-indigo-300 uppercase tracking-wider hover:text-white"
                    >
                      Details <ChevronRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => toggleCareerShortlist(career)}
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

      <CareerDetailModal
        career={selectedCareer}
        onClose={() => setSelectedCareer(null)}
        isShortlisted={selectedCareer ? shortlistedCareerIds.has(selectedCareer._id) : false}
        onToggleShortlist={toggleCareerShortlist}
      />
    </div>
  )
}
