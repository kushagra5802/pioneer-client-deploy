import { AssetsProvider } from "../../context/assetContext"
import AssetsContent from "../../components/Assets/AssetsContent"
import { ToastContainer } from "react-toastify"

export default function Assets() {
  return (
    <AssetsProvider>
      <ToastContainer />
      <AssetsContent />
    </AssetsProvider>
  )
}
