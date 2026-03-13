import { Navigate, Outlet } from "react-router-dom"

export default function ClientRoute({ user }) {
  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Not a client
  if (user.type !== "client") {
    return <Navigate to="/unauthorized" replace />
  }

  // Authorized
  return <Outlet />
}
