"use client"

import { useContext } from "react"
import { X } from "lucide-react"
import CounsellingContext from "../../context/counsellingContext"

export default function CounselorDetailModal() {
  const {
    showDetailModal,
    setShowDetailModal,
    selectedCounselor,
    selectedSlot,
    setSelectedSlot,
    setBookedSession,
    setShowConfirmation,
  } = useContext(CounsellingContext)

  if (!showDetailModal || !selectedCounselor) return null

  const handleBookSession = () => {
    if (selectedSlot) {
      setBookedSession({
        counselor: selectedCounselor.name,
        slot: selectedSlot,
      })
      setShowConfirmation(true)
      setShowDetailModal(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-slate-800 text-white px-8 py-6 flex justify-between items-center">
          <h2 className="text-xl text-white font-bold">
            {selectedCounselor.title}
          </h2>
          <button
            onClick={() => {
              setShowDetailModal(false)
              setSelectedSlot(null)
            }}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 space-y-2">
          <div className="flex gap-8">
            <img
              src={selectedCounselor.image || "/placeholder.svg"}
              alt={selectedCounselor.name}
              width={300}
              height={400}
              className="w-48 h-64 object-cover rounded-2xl"
            />

            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900 mb-1">
                {selectedCounselor.name}
              </h3>
              <p className="text-indigo-600 font-semibold mb-4 text-sm">
                {selectedCounselor.experience} YEARS EXPERIENCE
              </p>
              <p className="text-slate-700 leading-relaxed text-sm">
                {selectedCounselor.bio}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-md font-bold text-slate-900 mb-4">
              Select Available Slot:
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {selectedCounselor.availableSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-5 py-1 rounded-xl font-semibold border-2 transition-all ${
                    selectedSlot && selectedSlot.id === slot.id
                      ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                      : "border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  <div className="text-sm">{slot.date}</div>
                  <div className="text-lg">{slot.time}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleBookSession}
            disabled={!selectedSlot}
            className={`w-full py-4 rounded-xl font-bold text-white text-lg ${
              selectedSlot
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-slate-300 cursor-not-allowed"
            }`}
          >
            Book Session Now
          </button>
        </div>
      </div>
    </div>
  )
}
