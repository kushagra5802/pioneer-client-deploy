import { useContext } from "react"
import { Plus } from "lucide-react"
import CounsellingContext from "../../context/counsellingContext"
import CounselorForm from "./CounselorForm"
import CounselorDetailModal from "./CounselorDetailModal"
import BookingConfirmationModal from "./BookingConfirmationModal"
import PageHeader from "../PageHeader"

function CounsellingContent() {
  const {
    modalOpen,
    setModalOpen,
    counselors,
    setSelectedCounselor,
    setShowDetailModal,
  } = useContext(CounsellingContext)

  const handleCounselorClick = (counselor) => {
    setSelectedCounselor(counselor)
    setShowDetailModal(true)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader name="1-to-1 Counselling" />
      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold mb-8"
        >
          <Plus className="w-5 h-5" />
          Add Counselor
        </button>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {counselors.map((counselor) => (
              <div
                key={counselor.id}
                onClick={() => handleCounselorClick(counselor)}
                className="bg-white rounded-xl p-2 shadow-sm hover:shadow-md cursor-pointer group"
              >
                <div className="relative h-60 overflow-hidden bg-slate-200">
                  <img
                    src={counselor.image || "/placeholder.svg"}
                    alt={counselor.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {counselor.name}
                  </h3>
                  <p className="text-indigo-600 font-semibold text-xs mb-3">
                    {counselor.experience} YEARS EXPERIENCE
                  </p>
                  <p className="text-slate-700 text-xs line-clamp-2">
                    {counselor.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {modalOpen && <CounselorForm />}
        <CounselorDetailModal />
        <BookingConfirmationModal />
      </main>
    </div>
  )
}

export default function CounsellingPage() {
  return (
      <CounsellingContent />
  )
}
