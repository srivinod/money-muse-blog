
import { supabase } from "@/integrations/supabase/client";
import { categories } from "@/data/blogData";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  imageUrl: string;
};

export type BlogCategory = {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description: string | null;
  icon: string;
};

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

  return data.map(post => ({
    ...post,
    imageUrl: post.imageurl // Fix the casing difference between DB and client
  }));
};

// Fetch featured blog posts
export const fetchFeaturedPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("date", { ascending: false })
    .limit(6);

  if (error) {
    console.error("Error fetching featured posts:", error);
    throw error;
  }

  return data.map(post => ({
    ...post,
    imageUrl: post.imageurl
  }));
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

  return data.map(post => ({
    ...post,
    imageUrl: post.imageurl
  }));
};

// Fetch a single blog post by slug
export const fetchBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned error code
      return null;
    }
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    throw error;
  }

  return {
    ...data,
    imageUrl: data.imageurl
  };
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

  return data.map(post => ({
    ...post,
    imageUrl: post.imageurl
  }));
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

  return data.map(post => ({
    ...post,
    imageUrl: post.imageurl
  }));
};

// Create a new blog post
export const createBlogPost = async (post: Omit<BlogPost, "id">): Promise<BlogPost> => {
  // Convert imageUrl to imageurl for the database
  const dbPost = {
    ...post,
    imageurl: post.imageUrl
  };
  
  delete (dbPost as any).imageUrl;

  const { data, error } = await supabase
    .from("blog_posts")
    .insert([dbPost])
    .select()
    .single();

  if (error) {
    console.error("Error creating blog post:", error);
    throw error;
  }

  return {
    ...data,
    imageUrl: data.imageurl
  };
};

// Update an existing blog post
export const updateBlogPost = async (id: string, post: Partial<BlogPost>): Promise<BlogPost> => {
  // Convert imageUrl to imageurl for the database if it exists
  const dbPost: any = { ...post };
  
  if (post.imageUrl) {
    dbPost.imageurl = post.imageUrl;
    delete dbPost.imageUrl;
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .update(dbPost)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating blog post with ID ${id}:`, error);
    throw error;
  }

  return {
    ...data,
    imageUrl: data.imageurl
  };
};

// Delete a blog post
export const deleteBlogPost = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("blog_posts")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting blog post with ID ${id}:`, error);
    throw error;
  }
};

// Fetch all blog categories
export const fetchBlogCategories = async (): Promise<BlogCategory[]> => {
  const { data, error } = await supabase
    .from("blog_categories")
    .select("*")
    .order("title");

  if (error) {
    console.error("Error fetching blog categories:", error);
    throw error;
  }

  return data;
};

// Migrate mock data to Supabase
export const migrateMockDataToSupabase = async () => {
  try {
    const { data: existingPosts } = await supabase.from("blog_posts").select("slug");
    
    if (existingPosts && existingPosts.length > 0) {
      console.log("Data already migrated, skipping...");
      return;
    }

    // Import from local data
    const { blogPosts } = await import("@/data/blogData");
    
    // Prepare posts for insertion
    const postsToInsert = blogPosts.map(post => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content || `<p>Sample content for ${post.title}</p>`,
      category: post.category,
      author: post.author,
      date: post.date,
      imageurl: post.imageUrl // Note the lowercase 'url'
    }));

    // Insert all posts
    const { error } = await supabase.from("blog_posts").insert(postsToInsert);
    
    if (error) {
      console.error("Error migrating posts:", error);
      throw error;
    }
    
    console.log("Successfully migrated blog posts to Supabase");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
};
