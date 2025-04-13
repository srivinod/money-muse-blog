
import { supabase } from "@/integrations/supabase/client";
import { BlogCategory } from "./types";

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
