import { supabase } from "@/integrations/supabase/client";

// Migrate mock data to Supabase
export const migrateMockDataToSupabase = async () => {
  try {
    const { data: existingPosts } = await supabase.from("blog_posts").select("slug");
    
    if (existingPosts && existingPosts.length > 0) {
      console.log("Blog posts already exist, skipping migration...");
      return;
    }

    console.log("Blog table is empty. No default posts will be added.");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
};
