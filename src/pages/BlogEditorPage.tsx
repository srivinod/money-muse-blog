
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/PageHeader";
import RichTextEditor from "@/components/RichTextEditor";
import { categories } from "@/data/blogData";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBlogPostBySlug, createBlogPost, updateBlogPost, BlogPost } from "@/services/blogService";

const BlogEditorPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditMode = id && id !== "new";
  
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [author, setAuthor] = useState("Admin"); // Default author
  const [date, setDate] = useState(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('en-US', options);
  });

  // Fetch post data if in edit mode
  const { isLoading: isPostLoading } = useQuery({
    queryKey: ['blog-post', id],
    queryFn: () => fetchBlogPostBySlug(id as string),
    enabled: isEditMode,
    meta: {
      onSuccess: (data: BlogPost | null) => {
        if (data) {
          setTitle(data.title);
          setSlug(data.slug);
          setCategory(data.category);
          setExcerpt(data.excerpt);
          setContent(data.content || "");
          setImageUrl(data.imageUrl);
          setAuthor(data.author);
          setDate(data.date);
        } else {
          toast({
            title: "Post not found",
            description: "The blog post you're trying to edit doesn't exist",
            variant: "destructive",
          });
          navigate("/admin/posts");
        }
      }
    },
    onError: (error) => {
      console.error("Error fetching post:", error);
      toast({
        title: "Error",
        description: "Failed to load the post. Please try again.",
        variant: "destructive",
      });
      navigate("/admin/posts");
    }
  });

  // Create post mutation
  const createMutation = useMutation({
    mutationFn: createBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast({
        title: "Post created",
        description: "The blog post has been created successfully",
      });
      navigate("/admin/posts");
    },
    onError: (error) => {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create the post. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update post mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, post }: { id: string; post: Partial<BlogPost> }) => 
      updateBlogPost(id, post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-post', id] });
      toast({
        title: "Post updated",
        description: "The blog post has been updated successfully",
      });
      navigate("/admin/posts");
    },
    onError: (error) => {
      console.error("Error updating post:", error);
      toast({
        title: "Error",
        description: "Failed to update the post. Please try again.",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate("/login");
      return;
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // Auto-generate slug from title if in create mode and slug is empty
    if (!isEditMode && !slug) {
      setSlug(newTitle.toLowerCase().replace(/[^\w\s]/gi, "").replace(/\s+/g, "-"));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a server or storage service
      // For this demo, we'll use a fake URL
      const fakeUrl = URL.createObjectURL(file);
      setImageUrl(fakeUrl);
      toast({
        title: "Image uploaded",
        description: "Image has been uploaded successfully",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title || !slug || !category || !excerpt || !content) {
      toast({
        title: "Validation error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const postData = {
      title,
      slug,
      category,
      excerpt,
      content,
      imageUrl,
      author,
      date
    };
    
    if (isEditMode) {
      updateMutation.mutate({ id: id as string, post: postData });
    } else {
      createMutation.mutate(postData as any);
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const isLoading = isPostLoading || createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <PageHeader 
        title={isEditMode ? "Edit Blog Post" : "Create New Blog Post"} 
        description={isEditMode ? "Update your blog post" : "Create a new blog post"}
      />
      
      <div className="container py-12">
        <div className="flex justify-between items-center mb-8">
          <Link to="/admin/posts">
            <Button variant="outline">Back to Posts</Button>
          </Link>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Post Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Enter post title"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="slug">Post Slug</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="Enter post slug"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  The slug is used in the URL of your post
                </p>
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.title} value={cat.title}>
                      {cat.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Enter author name"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="featuredImage">Featured Image</Label>
                <div className="mt-1 flex items-center gap-4">
                  {imageUrl && (
                    <div className="w-24 h-24 relative">
                      <img
                        src={imageUrl}
                        alt="Featured"
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  )}
                  <label className="cursor-pointer">
                    <Button type="button" variant="outline">
                      {imageUrl ? "Change Image" : "Upload Image"}
                    </Button>
                    <Input
                      id="featuredImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              
              <div>
                <Label htmlFor="excerpt">Post Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Enter a short summary of your post"
                  className="h-24 resize-none"
                  required
                />
              </div>

              <div>
                <Label htmlFor="date">Publication Date</Label>
                <Input
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="e.g., April 15, 2025"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2 mb-6">
            <Label htmlFor="content">Post Content</Label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>
          
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/posts")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : isEditMode ? "Update Post" : "Create Post"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogEditorPage;
