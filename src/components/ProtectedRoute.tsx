
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (requireAdmin && !isAdmin) {
      navigate("/");
    }
  }, [isAuthenticated, isAdmin, navigate, requireAdmin]);

  if (!isAuthenticated || (requireAdmin && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
