# Supabase Migrations

This directory contains SQL migrations for the Supabase database.

## Adding Meta Tags Fields to Blog Posts

To add meta tags fields to the blog posts table, follow these steps:

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Create a new query
4. Copy and paste the contents of `migrations/add_meta_tags_fields.sql` into the editor
5. Run the query

This will create a function called `add_meta_tags_fields` that adds the `meta_title` and `meta_description` columns to the `blog_posts` table if they don't already exist.

## Alternative Method

If you prefer to run the migration directly without creating a function, you can run the following SQL:

```sql
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
  END IF;
END $$;
```

## Verifying the Migration

After running the migration, you can verify that the columns were added by running:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'blog_posts'
AND column_name IN ('meta_title', 'meta_description');
```

This should return the two new columns if the migration was successful. 