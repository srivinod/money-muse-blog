
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/PageHeader";

const AdminDashboardPage = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
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
      
      <div className="container py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Welcome, Admin</h2>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Blog Posts</h3>
            <p className="text-gray-600 mb-4">Create, edit, and manage your blog posts</p>
            <Link to="/admin/posts">
              <Button>Manage Posts</Button>
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Categories</h3>
            <p className="text-gray-600 mb-4">Organize your content with categories</p>
            <Link to="/admin/categories">
              <Button variant="outline">Manage Categories</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
