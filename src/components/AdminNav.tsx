
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const AdminNav = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <Link to="/login">
        <Button variant="ghost" size="sm">
          Login
        </Button>
      </Link>
    );
  }

  if (isAdmin) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/admin/dashboard">
          <Button variant="ghost" size="sm">
            Dashboard
          </Button>
        </Link>
        <Button variant="ghost" size="sm" onClick={logout}>
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button variant="ghost" size="sm" onClick={logout}>
      Logout
    </Button>
  );
};

export default AdminNav;
