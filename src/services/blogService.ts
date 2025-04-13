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
  featured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
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
    imageUrl: post.imageurl, // Fix the casing difference between DB and client
    featured: Boolean(post.featured), // Ensure featured is a boolean
    metaTitle: post.meta_title || post.title, // Use DB meta_title or fallback to title
    metaDescription: post.meta_description || post.excerpt // Use DB meta_description or fallback to excerpt
  }));
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

  return data.map(post => ({
    ...post,
    imageUrl: post.imageurl,
    featured: true,
    metaTitle: post.meta_title || post.title,
    metaDescription: post.meta_description || post.excerpt
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
    imageUrl: post.imageurl,
    featured: Boolean(post.featured),
    metaTitle: post.meta_title || post.title,
    metaDescription: post.meta_description || post.excerpt
  }));
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
  
  return {
    ...data,
    imageUrl: data.imageurl,
    featured: Boolean(data.featured),
    metaTitle: data.meta_title || data.title,
    metaDescription: data.meta_description || data.excerpt
  };
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

  return {
    ...data,
    imageUrl: data.imageurl,
    featured: Boolean(data.featured),
    metaTitle: data.meta_title || data.title,
    metaDescription: data.meta_description || data.excerpt
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
    imageUrl: post.imageurl,
    featured: Boolean(post.featured),
    metaTitle: post.meta_title || post.title,
    metaDescription: post.meta_description || post.excerpt
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
    imageUrl: post.imageurl,
    featured: Boolean(post.featured),
    metaTitle: post.meta_title || post.title,
    metaDescription: post.meta_description || post.excerpt
  }));
};

// Create a new blog post
export const createBlogPost = async (post: Omit<BlogPost, "id">): Promise<BlogPost> => {
  // Convert imageUrl to imageurl for the database
  const dbPost = {
    ...post,
    imageurl: post.imageUrl,
    featured: post.featured || false,
    meta_title: post.metaTitle || post.title,
    meta_description: post.metaDescription || post.excerpt
  };
  
  // Remove fields not matching DB schema
  delete (dbPost as any).imageUrl;
  delete (dbPost as any).metaTitle;
  delete (dbPost as any).metaDescription;

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
    imageUrl: data.imageurl,
    featured: Boolean(data.featured),
    metaTitle: data.meta_title || data.title,
    metaDescription: data.meta_description || data.excerpt
  };
};

// Update an existing blog post
export const updateBlogPost = async (id: string, post: Partial<BlogPost>): Promise<BlogPost> => {
  // Convert fields to match DB schema
  const dbPost: any = { ...post };
  
  if (post.imageUrl) {
    dbPost.imageurl = post.imageUrl;
    delete dbPost.imageUrl;
  }

  if (post.metaTitle !== undefined) {
    dbPost.meta_title = post.metaTitle;
    delete dbPost.metaTitle;
  }

  if (post.metaDescription !== undefined) {
    dbPost.meta_description = post.metaDescription;
    delete dbPost.metaDescription;
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
    imageUrl: data.imageurl,
    featured: Boolean(data.featured),
    metaTitle: data.meta_title || data.title,
    metaDescription: data.meta_description || data.excerpt
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
      imageurl: post.imageUrl, // Note the lowercase 'url'
      featured: false, // Default featured to false
      meta_title: post.title, // Default meta_title to post title
      meta_description: post.excerpt // Default meta_description to post excerpt
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
