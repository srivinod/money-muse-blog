
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/PageHeader";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBlogPosts, deleteBlogPost, updateBlogPost, BlogPost } from "@/services/blogService";

const ITEMS_PER_PAGE = 5;

const BlogManagementPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  
  // Fetch posts from Supabase
  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: fetchBlogPosts,
  });
  
  // Mutation for deleting posts
  const deleteMutation = useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast({
        title: "Post deleted",
        description: "The blog post has been deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "There was a problem deleting the post. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Mutation for updating post featured status
  const updateFeaturedMutation = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) => 
      updateBlogPost(id, { featured }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast({
        title: "Post updated",
        description: "The featured status has been updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating featured status:", error);
      toast({
        title: "Error",
        description: "There was a problem updating the post. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Filter posts based on search term
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate("/login");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deleteMutation.mutate(id);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFeaturedToggle = (id: string, currentFeatured: boolean) => {
    updateFeaturedMutation.mutate({ id, featured: !currentFeatured });
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="container py-12 text-center">
        <p>Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12 text-center">
        <p className="text-red-500">Error loading posts. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Blog Posts Management" 
        description="Create, edit, and delete blog posts"
      />
      
      <div className="container py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <Link to="/admin/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-8 w-full"
            />
          </div>
          
          <Link to="/admin/posts/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPosts.length > 0 ? (
                currentPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>{post.date}</TableCell>
                    <TableCell>
                      <div className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Published
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Switch 
                          checked={post.featured || false}
                          onCheckedChange={() => handleFeaturedToggle(post.id, post.featured || false)}
                          disabled={updateFeaturedMutation.isPending}
                        />
                        {post.featured && <Star className="h-4 w-4 text-yellow-500 ml-2" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/posts/edit/${post.id}`}>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDelete(post.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    {searchTerm ? "No posts found matching your search." : "No posts available."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    isActive={currentPage === index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className="cursor-pointer"
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default BlogManagementPage;
