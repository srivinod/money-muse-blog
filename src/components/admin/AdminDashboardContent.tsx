
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import AdminDashboardCards from "./AdminDashboardCards";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchFeaturedPosts, fetchBlogPosts, fetchBlogCategories } from "@/services/blogService";

const AdminDashboardContent = () => {
  const { logout } = useAuth();

  // Fetch blog stats
  const { data: allPosts = [] } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: fetchBlogPosts,
  });

  const { data: featuredPosts = [] } = useQuery({
    queryKey: ['featured-posts'],
    queryFn: fetchFeaturedPosts,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: fetchBlogCategories,
  });

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Welcome, Admin</h2>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>
      
      <AdminDashboardCards />

      {/* Blog Stats Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h3 className="text-xl font-semibold mb-4">Blog Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-600 text-sm">Total Posts</p>
            <p className="text-3xl font-bold">{allPosts.length}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-600 text-sm">Featured Posts</p>
            <p className="text-3xl font-bold">{featuredPosts.length}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-600 text-sm">Categories</p>
            <p className="text-3xl font-bold">{categories.length}</p>
          </div>
        </div>
        
        {/* Featured Posts Quick View */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">Featured Posts</h4>
            <Link to="/admin/posts">
              <Button variant="ghost" size="sm">View All Posts</Button>
            </Link>
          </div>
          
          {featuredPosts.length === 0 ? (
            <p className="text-gray-500 italic">No featured posts yet.</p>
          ) : (
            <div className="bg-gray-50 rounded-md divide-y">
              {featuredPosts.slice(0, 3).map(post => (
                <div key={post.id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-sm text-gray-600">{post.category} • {post.date}</p>
                  </div>
                  <Link to={`/admin/posts/edit/${post.id}`}>
                    <Button size="sm" variant="outline">Edit</Button>
                  </Link>
                </div>
              ))}
              
              {featuredPosts.length > 3 && (
                <div className="p-4 text-center">
                  <Link to="/admin/posts" className="text-primary hover:underline text-sm">
                    View all {featuredPosts.length} featured posts
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardContent;
