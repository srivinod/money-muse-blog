import { supabase } from "@/integrations/supabase/client";

/**
 * This function adds meta_title and meta_description fields to the blog_posts table
 * in Supabase if they don't already exist.
 */
export const addMetaTagsFields = async () => {
  try {
    console.log("Checking if meta tags fields exist in blog_posts table...");
    
    // First, check if the fields already exist by trying to select them
    const { data, error } = await supabase
      .from("blog_posts")
      .select("meta_title, meta_description")
      .limit(1);
    
    if (error) {
      // If we get an error about the column not existing, we need to add the fields
      if (error.message.includes("column") && error.message.includes("does not exist")) {
        console.log("Meta tags fields don't exist. Adding them now...");
        
        // Execute SQL to add the columns
        const { error: alterError } = await supabase.rpc('add_meta_tags_fields');
        
        if (alterError) {
          console.error("Error adding meta tags fields:", alterError);
          throw alterError;
        }
        
        console.log("Successfully added meta_title and meta_description fields to blog_posts table");
      } else {
        // Some other error occurred
        console.error("Error checking meta tags fields:", error);
        throw error;
      }
    } else {
      console.log("Meta tags fields already exist in blog_posts table");
    }
  } catch (error) {
    console.error("Failed to add meta tags fields:", error);
    throw error;
  }
}; 