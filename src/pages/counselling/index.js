import { CounsellingProvider } from "../../context/counsellingContext"
import CounsellingContent from "../../components/Counselling/CounsellingContent"
import { ToastContainer } from "react-toastify"

export default function Counselling() {
  return (
    <CounsellingProvider>
      <ToastContainer />
      <CounsellingContent />
    </CounsellingProvider>
  )
}
