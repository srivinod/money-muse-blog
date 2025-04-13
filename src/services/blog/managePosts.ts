
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, transformDbPostToBlogPost, transformBlogPostToDb } from "./types";

// Create a new blog post
export const createBlogPost = async (post: Omit<BlogPost, "id">): Promise<BlogPost> => {
  // Convert client fields to match DB schema
  const dbPost = {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    author: post.author,
    date: post.date,
    imageurl: post.imageUrl, // Note: DB uses lowercase 'url'
    featured: post.featured || false,
    meta_title: post.metaTitle, // Add meta_title field
    meta_description: post.metaDescription // Add meta_description field
  };

  const { data, error } = await supabase
    .from("blog_posts")
    .insert([dbPost])
    .select()
    .single();

  if (error) {
    console.error("Error creating blog post:", error);
    throw error;
  }

  return transformDbPostToBlogPost(data);
};

// Update an existing blog post
export const updateBlogPost = async (id: string, post: Partial<BlogPost>): Promise<BlogPost> => {
  // Transform the post to DB format
  const dbPost = transformBlogPostToDb(post);

  console.log("Updating post with ID:", id, "Fields:", dbPost);

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

  return transformDbPostToBlogPost(data);
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
