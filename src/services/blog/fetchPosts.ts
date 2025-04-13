
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, transformDbPostToBlogPost } from "./types";
import { categories } from "@/data/blogData";

// Fetch all blog posts
export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching blog posts:", error);
    throw error;
  }

  return data.map(transformDbPostToBlogPost);
};

// Fetch featured blog posts
export const fetchFeaturedPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("featured", true)
    .order("date", { ascending: false })
    .limit(6);

  if (error) {
    console.error("Error fetching featured posts:", error);
    throw error;
  }

  return data.map(transformDbPostToBlogPost);
};

// Fetch latest blog posts
export const fetchLatestPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("date", { ascending: false })
    .limit(6);

  if (error) {
    console.error("Error fetching latest posts:", error);
    throw error;
  }

  return data.map(transformDbPostToBlogPost);
};

// Fetch a single blog post by slug
export const fetchBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  console.log(`Fetching blog post with slug ${slug}`);
  
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned error code
      console.log(`No blog post found with slug ${slug}`);
      return null;
    }
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    throw error;
  }

  console.log(`Successfully fetched blog post: ${data.title}`);
  
  return transformDbPostToBlogPost(data);
};

// Fetch a single blog post by ID
export const fetchBlogPostById = async (id: string): Promise<BlogPost | null> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned error code
      return null;
    }
    console.error(`Error fetching blog post with ID ${id}:`, error);
    throw error;
  }

  return transformDbPostToBlogPost(data);
};

// Fetch blog posts by category
export const fetchBlogPostsByCategory = async (categorySlug: string): Promise<BlogPost[]> => {
  // Find the category title from the slug
  const category = categories.find(c => c.slug === categorySlug);
  
  if (!category && categorySlug !== "all") {
    return [];
  }
  
  const query = supabase
    .from("blog_posts")
    .select("*")
    .order("date", { ascending: false });
    
  if (categorySlug !== "all") {
    query.eq("category", category?.title);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching posts by category:", error);
    throw error;
  }

  return data.map(transformDbPostToBlogPost);
};

// Fetch related blog posts (same category, excluding current post)
export const fetchRelatedPosts = async (slug: string, category: string): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("category", category)
    .neq("slug", slug)
    .order("date", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error fetching related posts:", error);
    throw error;
  }

  return data.map(transformDbPostToBlogPost);
};
