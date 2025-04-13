
import { supabase } from "@/integrations/supabase/client";

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
