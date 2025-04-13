-- Create a function to add meta tags fields to the blog_posts table
CREATE OR REPLACE FUNCTION add_meta_tags_fields()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if meta_title column exists
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'blog_posts'
    AND column_name = 'meta_title'
  ) THEN
    -- Add meta_title column
    ALTER TABLE blog_posts ADD COLUMN meta_title TEXT;
    -- Update existing rows to use title as meta_title
    UPDATE blog_posts SET meta_title = title WHERE meta_title IS NULL;
  END IF;

  -- Check if meta_description column exists
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'blog_posts'
    AND column_name = 'meta_description'
  ) THEN
    -- Add meta_description column
    ALTER TABLE blog_posts ADD COLUMN meta_description TEXT;
    -- Update existing rows to use excerpt as meta_description
    UPDATE blog_posts SET meta_description = excerpt WHERE meta_description IS NULL;
  END IF;
END;
$$; 