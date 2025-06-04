import { useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogPostById } from "@/services/blogService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { categories } from "@/data/blogData";
import { useNavigate } from "react-router-dom";

// Import our new components
import BasicInfoSection from "@/components/blog/BasicInfoSection";
import MediaSection from "@/components/blog/MediaSection";
import ContentSection from "@/components/blog/ContentSection";
import SeoSection from "@/components/blog/SeoSection";
import BlogFormActions from "@/components/blog/BlogFormActions";
import useBlogForm from "@/hooks/useBlogForm";

const BlogEditorPage = () => {
  const { isAuthenticated, isAdmin, isLoading: isAuthLoading } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = id && id !== "new";

  // Fetch post data if in edit mode
  const { data: postData, isLoading: isPostLoading } = useQuery({
    queryKey: ['blog-post', id],
    queryFn: () => fetchBlogPostById(id as string),
    enabled: isEditMode && !isAuthLoading && isAuthenticated && isAdmin,
    // Disable caching to always fetch fresh data
    gcTime: 0,
    staleTime: 0,
  });

  // Use our custom hook to manage form state and submit actions
  const { 
    formState, 
    isEditMode: isEdit, 
    isLoading: isFormLoading, 
    handleSubmit 
  } = useBlogForm(postData, id);

  // Destructure all form state
  const {
    title, setTitle,
    slug, setSlug,
    category, setCategory,
    excerpt, setExcerpt,
    content, setContent,
    imageUrl, setImageUrl,
    author, setAuthor,
    date, setDate,
    featured, setFeatured,
    metaTitle, setMetaTitle,
    metaDescription, setMetaDescription
  } = formState;

  useEffect(() => {
    // Only redirect if auth state is loaded and user is not authenticated/admin
    if (!isAuthLoading && (!isAuthenticated || !isAdmin)) {
      // Store the current URL to redirect back after login
      const returnTo = location.pathname + location.search;
      navigate(`/login?returnTo=${encodeURIComponent(returnTo)}`, { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate, isAuthLoading, location]);

  // Add debug logging
  useEffect(() => {
    if (postData) {
      console.log("Post data in BlogEditorPage:", postData);
    }
  }, [postData]);

  const handleSave = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  // Show loading state while auth is being checked or post is being loaded
  if (isAuthLoading || (isEditMode && isPostLoading)) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated or not admin
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
        
        <form onSubmit={handleSave} className="bg-white rounded-lg shadow-md p-6">
          <Tabs defaultValue="content" className="mb-6">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
              <TabsTrigger value="seo" className="flex-1">SEO & Meta Tags</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <BasicInfoSection
                  title={title}
                  setTitle={setTitle}
                  slug={slug}
                  setSlug={setSlug}
                  category={category}
                  setCategory={setCategory}
                  author={author}
                  setAuthor={setAuthor}
                  featured={featured}
                  setFeatured={setFeatured}
                  categories={categories}
                  isEditMode={isEdit}
                  metaTitle={metaTitle}
                  setMetaTitle={setMetaTitle}
                />
                
                <MediaSection
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                  excerpt={excerpt}
                  setExcerpt={setExcerpt}
                  date={date}
                  setDate={setDate}
                  metaDescription={metaDescription}
                  setMetaDescription={setMetaDescription}
                />
              </div>
              
              <ContentSection 
                content={content}
                setContent={setContent}
                onSave={handleSave}
              />
            </TabsContent>
            
            <TabsContent value="seo">
              <SeoSection
                metaTitle={metaTitle}
                setMetaTitle={setMetaTitle}
                metaDescription={metaDescription}
                setMetaDescription={setMetaDescription}
                slug={slug}
                excerpt={excerpt}
              />
            </TabsContent>
          </Tabs>
          
          <BlogFormActions 
            isLoading={isFormLoading}
            isEditMode={isEdit}
          />
        </form>
      </div>
    </div>
  );
};

export default BlogEditorPage;
