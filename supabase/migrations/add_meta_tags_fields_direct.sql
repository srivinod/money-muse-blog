-- Add meta_title column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'blog_posts'
    AND column_name = 'meta_title'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN meta_title TEXT;
    UPDATE blog_posts SET meta_title = title WHERE meta_title IS NULL;
    RAISE NOTICE 'Added meta_title column to blog_posts table';
  ELSE
    RAISE NOTICE 'meta_title column already exists in blog_posts table';
  END IF;
END $$;

-- Add meta_description column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'blog_posts'
    AND column_name = 'meta_description'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN meta_description TEXT;
    UPDATE blog_posts SET meta_description = excerpt WHERE meta_description IS NULL;
    RAISE NOTICE 'Added meta_description column to blog_posts table';
  ELSE
    RAISE NOTICE 'meta_description column already exists in blog_posts table';
  END IF;
END $$;

-- Verify the columns were added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'blog_posts'
AND column_name IN ('meta_title', 'meta_description'); 