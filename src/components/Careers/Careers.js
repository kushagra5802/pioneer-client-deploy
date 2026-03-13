import { useState } from "react"
import { useQuery } from "react-query"
import PageHeader from "../PageHeader"
import useAxiosInstance from "../../lib/useAxiosInstance"
import { Plus, Search, ArrowLeft, ChevronRight, Building2 } from "lucide-react"
import CareerDetailModal from "./CareerDetailModal"

const industries = [
  { id: "cs", name: "Computer Science & IT", icon: Building2 },
  { id: "law", name: "Law, Policy & Governance", icon: Building2 },
  { id: "medicine", name: "Medicine & Clinical Health", icon: Building2 },
  { id: "enigneering", name: "Engineering & Manufacturing", icon: Building2 },
  { id: "finance", name: "Finance & Banking", icon: Building2 },
  { id: "arts", name: "Arts & Design", icon: Building2 },
  { id: "education", name: "Education & Research", icon: Building2 },
]

export default function CareersPage() {
  const axios = useAxiosInstance()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [selectedCareer, setSelectedCareer] = useState(null)

    const {
    data: careersResponse,
    isLoading,
    isError,
    } = useQuery(
    ["careers", searchQuery, selectedIndustry],
    async () => {
        const res = await axios.get("/api/careers", {
        params: {
            keyword: searchQuery || undefined,
            industry: selectedIndustry || undefined,
        },
        })
        return res.data
    },
    {
        refetchOnWindowFocus: false,
        retry: 1,
    }
    )

  const careers = careersResponse?.data || []

  const openCareerDetail = (career) => {
    setSelectedCareer(career)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Keep Existing Header */}
      <PageHeader name="Careers" />

      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                  Discover Your
                  <br />
                  <span>Ideal Career Path</span>
                </h1>
                <p className="text-slate-500 max-w-xl">
                  Explore a comprehensive library of career trajectories curated for the modern Indian economy.
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search careers, skills, or industries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-slate-200 
                  placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

          {/* Industry Sectors */}
          {!selectedIndustry ? (
            <>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">
                Industry Sectors
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {industries.map((industry) => (
                  <div
                    key={industry.id}
                    onClick={() => setSelectedIndustry(industry.name)}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md cursor-pointer group"
                  >
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                      <industry.icon className="w-6 h-6 text-slate-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                      {industry.name}
                    </h3>
                    <button className="flex items-center gap-2 text-sm font-semibold text-indigo-500 uppercase tracking-wider group-hover:gap-3">
                      Explore Pathways
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Career Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isLoading ? (
                <div className="col-span-2 text-center py-12">Loading careers...</div>
              ) : isError ? (
                <div className="col-span-2 text-center py-12 text-red-500">
                  Failed to load careers.
                </div>
              ) : careers.length > 0 ? (
                careers.map((career) => (
                  <div
                    key={career._id}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md"
                  >
                    <span className="inline-flex px-3 py-1 bg-indigo-100 text-indigo-600 text-xs font-semibold uppercase rounded-full mb-4">
                      {career.industry}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {career.title}
                    </h3>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                      {career.description}
                    </p>
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
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    No careers in this sector yet
                  </h3>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <CareerDetailModal career={selectedCareer} onClose={() => setSelectedCareer(null)} />
    </div>
  )
}
