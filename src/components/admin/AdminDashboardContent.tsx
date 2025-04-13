
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import AdminDashboardCards from "./AdminDashboardCards";

const AdminDashboardContent = () => {
  const { logout } = useAuth();

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Welcome, Admin</h2>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>
      
      <AdminDashboardCards />
    </div>
  );
};

export default AdminDashboardContent;
