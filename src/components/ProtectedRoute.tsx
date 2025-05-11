import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "@/contexts/UserContext";

interface ProtectedRouteProps {
  allowedRoles: Array<"RECRUITER" | "DEVELOPER" | "ADMINISTRATOR">;
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthorized, simpleUserJson } = useUserContext();

  if (!simpleUserJson) {
    return <Navigate to="/" replace />;
  }

  if (!isAuthorized(allowedRoles)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
} 