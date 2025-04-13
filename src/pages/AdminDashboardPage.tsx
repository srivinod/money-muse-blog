
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/PageHeader";
import AdminDashboardContent from "@/components/admin/AdminDashboardContent";

const AdminDashboardPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate("/login");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div>
      <PageHeader 
        title="Admin Dashboard" 
        description="Manage your blog content"
      />
      <AdminDashboardContent />
    </div>
  );
};

export default AdminDashboardPage;
