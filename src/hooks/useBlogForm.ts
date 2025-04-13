
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BlogPost, createBlogPost, updateBlogPost } from "@/services/blogService";
import { useNavigate } from "react-router-dom";

export const useBlogForm = (postData?: BlogPost | null, id?: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditMode = id && id !== "new";
  
  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [author, setAuthor] = useState("Admin"); // Default author
  const [featured, setFeatured] = useState(false);
  const [metaTitle, setMetaTitle] = useState(""); 
  const [metaDescription, setMetaDescription] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('en-US', options);
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
    
    if (isEditMode && id) {
      updateMutation.mutate({ id, post: postData });
    } else {
      createMutation.mutate(postData as any);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return {
    formState: {
      title,
      setTitle,
      slug,
      setSlug,
      category,
      setCategory,
      excerpt,
      setExcerpt,
      content,
      setContent,
      imageUrl,
      setImageUrl,
      author,
      setAuthor,
      date,
      setDate,
      featured,
      setFeatured,
      metaTitle,
      setMetaTitle,
      metaDescription,
      setMetaDescription
    },
    isEditMode,
    isLoading,
    handleSubmit
  };
};

export default useBlogForm;
