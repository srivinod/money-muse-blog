
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/PageHeader";
import RichTextEditor from "@/components/RichTextEditor";
import { blogPosts } from "@/data/blogData";

const categories = [
  "Budgeting", 
  "Investing", 
  "Debt Management", 
  "Retirement Planning", 
  "Saving",
  "Financial Planning",
  "Real Estate"
];

const BlogEditorPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = id && id !== "new";
  
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate("/login");
      return;
    }

    if (isEditMode) {
      // Find the post to edit
      const postToEdit = blogPosts.find(post => post.id === id);
      if (postToEdit) {
        setTitle(postToEdit.title);
        setSlug(postToEdit.slug);
        setCategory(postToEdit.category);
        setExcerpt(postToEdit.excerpt);
        setContent(postToEdit.content || "");
        setImageUrl(postToEdit.imageUrl);
      } else {
        toast({
          title: "Post not found",
          description: "The blog post you're trying to edit doesn't exist",
          variant: "destructive",
        });
        navigate("/admin/posts");
      }
    }
  }, [id, isAuthenticated, isAdmin, isEditMode, navigate, toast]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // Auto-generate slug from title if in create mode
    if (!isEditMode) {
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
    setIsLoading(true);
    
    // Validate form
    if (!title || !slug || !category || !excerpt || !content) {
      toast({
        title: "Validation error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // In a real app, you would save to a database
    setTimeout(() => {
      toast({
        title: isEditMode ? "Post updated" : "Post created",
        description: isEditMode 
          ? "The blog post has been updated successfully" 
          : "The blog post has been created successfully",
      });
      setIsLoading(false);
      navigate("/admin/posts");
    }, 1000);
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

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
                  disabled={isEditMode}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {isEditMode 
                    ? "Slug cannot be changed after creation"
                    : "The slug is used in the URL of your post"}
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
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
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
