import { createContext, useState } from "react"

const CounsellingContext = createContext({
  modalOpen: false,
  setModalOpen: () => {},
  counselors: [],
  addCounselor: () => {},
  selectedCounselor: null,
  setSelectedCounselor: () => {},
  showDetailModal: false,
  setShowDetailModal: () => {},
  selectedSlot: null,
  setSelectedSlot: () => {},
  bookedSession: null,
  setBookedSession: () => {},
  showConfirmation: false,
  setShowConfirmation: () => {},
})

const sampleCounselors = [
  {
    id: "1",
    name: "Mr. Vijay Jha",
    experience: 25,
    title: "Expert Career Guidance",
    bio: "Educator with over 25 years of experience...",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    availableSlots: [
      { id: "s1", date: "Mon, 19th Jan", time: "4:00 PM" },
      { id: "s2", date: "Mon, 19th Jan", time: "5:00 PM" },
      { id: "s3", date: "Tue, 20th Jan", time: "3:30 PM" },
      { id: "s4", date: "Wed, 21st Jan", time: "6:00 PM" },
    ],
  },
  {
    id: "2",
    name: "Dr. Sarah Williams",
    experience: 18,
    title: "University Admission Expert",
    bio: "Specializes in university admissions guidance...",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop",
    availableSlots: [
      { id: "s5", date: "Tue, 20th Jan", time: "2:00 PM" },
      { id: "s6", date: "Wed, 21st Jan", time: "4:00 PM" },
      { id: "s7", date: "Thu, 22nd Jan", time: "5:30 PM" },
      { id: "s8", date: "Fri, 23rd Jan", time: "3:00 PM" },
    ],
  },
  {
    id: "3",
    name: "Prof. Rajesh Kumar",
    experience: 22,
    title: "Career Path Planning",
    bio: "Expert in career path planning...",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop",
    availableSlots: [
      { id: "s9", date: "Mon, 19th Jan", time: "2:00 PM" },
      { id: "s10", date: "Thu, 22nd Jan", time: "4:00 PM" },
      { id: "s11", date: "Fri, 23rd Jan", time: "2:00 PM" },
      { id: "s12", date: "Sat, 24th Jan", time: "10:00 AM" },
    ],
  },
  {
    id: "4",
    name: "Ms. Priya Patel",
    experience: 15,
    title: "STEM Career Counselor",
    bio: "Passionate about promoting STEM careers...",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop",
    availableSlots: [
      { id: "s13", date: "Tue, 20th Jan", time: "5:00 PM" },
      { id: "s14", date: "Wed, 21st Jan", time: "3:00 PM" },
      { id: "s15", date: "Thu, 22nd Jan", time: "6:00 PM" },
      { id: "s16", date: "Fri, 23rd Jan", time: "4:00 PM" },
    ],
  },
]

export const CounsellingProvider = ({ children }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [counselors, setCounselors] = useState(sampleCounselors)
  const [selectedCounselor, setSelectedCounselor] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [bookedSession, setBookedSession] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const addCounselor = (counselor) => {
    setCounselors((prev) => [...prev, counselor])
  }

  return (
    <CounsellingContext.Provider
      value={{
        modalOpen,
        setModalOpen,
        counselors,
        addCounselor,
        selectedCounselor,
        setSelectedCounselor,
        showDetailModal,
        setShowDetailModal,
        selectedSlot,
        setSelectedSlot,
        bookedSession,
        setBookedSession,
        showConfirmation,
        setShowConfirmation,
      }}
    >
      {children}
    </CounsellingContext.Provider>
  )
}

export default CounsellingContext
