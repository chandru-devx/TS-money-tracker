import { Navigate } from "react-router-dom"

type ProtectedRouteProps = {
  user: unknown
  children: React.ReactNode
}

const ProtectedRoute = ({ user, children }: ProtectedRouteProps) => {

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute