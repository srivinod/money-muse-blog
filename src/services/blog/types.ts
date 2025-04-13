
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

// Helper function to transform database record to BlogPost
export const transformDbPostToBlogPost = (data: any): BlogPost => {
  return {
    ...data,
    imageUrl: data.imageurl, // Fix the casing difference between DB and client
    featured: Boolean(data.featured), // Ensure featured is a boolean
    metaTitle: data.meta_title || data.title, // Use DB meta_title or fallback to title
    metaDescription: data.meta_description || data.excerpt // Use DB meta_description or fallback to excerpt
  };
};

// Function to transform BlogPost to DB format for insert/update
export const transformBlogPostToDb = (post: Partial<BlogPost>) => {
  // Initialize an empty object for DB fields
  const dbPost: Record<string, any> = {};
  
  // Map client field names to DB field names
  if (post.slug !== undefined) dbPost.slug = post.slug;
  if (post.title !== undefined) dbPost.title = post.title;
  if (post.excerpt !== undefined) dbPost.excerpt = post.excerpt;
  if (post.content !== undefined) dbPost.content = post.content;
  if (post.category !== undefined) dbPost.category = post.category;
  if (post.author !== undefined) dbPost.author = post.author;
  if (post.date !== undefined) dbPost.date = post.date;
  if (post.featured !== undefined) dbPost.featured = post.featured;
  if (post.imageUrl !== undefined) dbPost.imageurl = post.imageUrl;
  if (post.metaTitle !== undefined) dbPost.meta_title = post.metaTitle;
  if (post.metaDescription !== undefined) dbPost.meta_description = post.metaDescription;
  
  return dbPost;
};
