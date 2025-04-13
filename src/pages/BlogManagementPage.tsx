
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/PageHeader";
import { blogPosts } from "@/data/blogData";

const BlogManagementPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState(blogPosts);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate("/login");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setPosts(posts.filter(post => post.id !== id));
      toast({
        title: "Post deleted",
        description: "The blog post has been deleted successfully",
      });
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div>
      <PageHeader 
        title="Blog Posts Management" 
        description="Create, edit, and delete blog posts"
      />
      
      <div className="container py-12">
        <div className="flex justify-between items-center mb-8">
          <Link to="/admin/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
          <Link to="/admin/posts/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>{post.date}</TableCell>
                  <TableCell>
                    <div className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Published
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/posts/edit/${post.id}`}>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(post.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default BlogManagementPage;
