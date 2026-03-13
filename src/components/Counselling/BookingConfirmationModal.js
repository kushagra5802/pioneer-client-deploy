"use client"

import { useContext } from "react"
import CounsellingContext from "../../context/counsellingContext"

export default function BookingConfirmationModal() {
  const { showConfirmation, setShowConfirmation, bookedSession } =
    useContext(CounsellingContext)

  if (!showConfirmation || !bookedSession) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border-2 border-teal-300 w-full max-w-2xl p-8 md:p-12 text-center shadow-2xl">
        <h2 className="text-4xl md:text-5xl font-bold text-emerald-700 mb-6">
          Congratulations!
        </h2>

        <p className="text-lg md:text-xl text-emerald-800 mb-8 leading-relaxed">
          You have successfully booked a session with{" "}
          <span className="font-bold">
            {bookedSession.counselor}
          </span>{" "}
          for{" "}
          <span className="font-bold">
            {bookedSession.slot.date} - {bookedSession.slot.time}
          </span>
          .
        </p>

        <button
          onClick={() => setShowConfirmation(false)}
          className="inline-block text-teal-600 font-bold text-lg hover:text-teal-700 underline"
        >
          Back to Counselling
        </button>
      </div>
    </div>
  )
}
