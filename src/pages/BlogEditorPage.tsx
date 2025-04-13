
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
import { fetchBlogPostById, createBlogPost, updateBlogPost, BlogPost } from "@/services/blogService";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [featured, setFeatured] = useState(false); // Add featured state
  const [metaTitle, setMetaTitle] = useState(""); // Meta title for SEO
  const [metaDescription, setMetaDescription] = useState(""); // Meta description for SEO
  const [date, setDate] = useState(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('en-US', options);
  });

  // Fetch post data if in edit mode
  const { data: postData, isLoading: isPostLoading } = useQuery({
    queryKey: ['blog-post', id],
    queryFn: () => fetchBlogPostById(id as string),
    enabled: isEditMode,
    // Disable caching to always fetch fresh data
    gcTime: 0,
    staleTime: 0,
  });

  // Update form fields when post data is loaded
  useEffect(() => {
    if (postData) {
      console.log("Post data loaded:", postData);
      setTitle(postData.title || "");
      setSlug(postData.slug || "");
      setCategory(postData.category || "");
      setExcerpt(postData.excerpt || "");
      setContent(postData.content || "");
      setImageUrl(postData.imageUrl || "");
      setAuthor(postData.author || "Admin");
      setDate(postData.date || "");
      setFeatured(postData.featured || false);
      setMetaTitle(postData.metaTitle || "");
      setMetaDescription(postData.metaDescription || "");
    }
  }, [postData]);

  // Create post mutation
  const createMutation = useMutation({
    mutationFn: createBlogPost,
    onSuccess: () => {
      // Invalidate all blog posts queries to ensure fresh data
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
    onSuccess: (data) => {
      // Invalidate all queries that might use this post data
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-post', id] });
      
      // Also invalidate by slug to ensure the detail page gets updated
      if (data && data.slug) {
        queryClient.invalidateQueries({ queryKey: ['blog-post', data.slug] });
      }
      
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

    // Auto-generate meta title if it's empty
    if (!metaTitle) {
      setMetaTitle(newTitle);
    }
  };

  const handleExcerptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newExcerpt = e.target.value;
    setExcerpt(newExcerpt);
    
    // Auto-generate meta description if it's empty
    if (!metaDescription) {
      setMetaDescription(newExcerpt);
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
      date,
      featured,
      metaTitle: metaTitle || title, // Use regular title as fallback
      metaDescription: metaDescription || excerpt // Use excerpt as fallback
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
          <Tabs defaultValue="content" className="mb-6">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
              <TabsTrigger value="seo" className="flex-1">SEO & Meta Tags</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content">
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

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="featured" 
                      checked={featured} 
                      onCheckedChange={(checked) => setFeatured(checked as boolean)}
                    />
                    <Label 
                      htmlFor="featured" 
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      Featured Post
                    </Label>
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
                      onChange={handleExcerptChange}
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
            </TabsContent>
            
            <TabsContent value="seo">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="metaTitle">Meta Title (for SEO)</Label>
                  <Input
                    id="metaTitle"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Enter meta title for search engines"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    If left empty, the post title will be used instead. 
                    Recommended length: 50-60 characters.
                  </p>
                  {metaTitle && (
                    <div className="mt-2">
                      <div className="text-sm font-medium text-blue-600 mb-1">Preview:</div>
                      <div className="p-3 border rounded-md bg-gray-50">
                        <div className="text-xl text-blue-700 mb-1 truncate">{metaTitle}</div>
                        <div className="text-green-700 text-sm mb-1 truncate">
                          moneymuse.com/blog/{slug}
                        </div>
                        <div className="text-sm text-gray-700 truncate">
                          {metaDescription || excerpt || "No description provided."}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Enter meta description for search engines"
                    className="h-24 resize-none"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    If left empty, the post excerpt will be used. 
                    Recommended length: 150-160 characters.
                  </p>
                  <div className="mt-2 text-sm text-gray-500">
                    <span className={metaDescription.length > 160 ? "text-red-500 font-medium" : ""}>
                      Character count: {metaDescription.length}/160
                    </span>
                    {metaDescription.length > 160 && (
                      <span className="ml-2 text-red-500">
                        (Exceeds recommended length)
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-md">
                  <h3 className="font-semibold text-blue-800 mb-2">SEO Best Practices</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                    <li>Use relevant keywords in your title and description</li>
                    <li>Keep meta titles under 60 characters</li>
                    <li>Keep meta descriptions under 160 characters</li>
                    <li>Make your description compelling to increase click-through rates</li>
                    <li>Include your main keyword early in both title and description</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
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
