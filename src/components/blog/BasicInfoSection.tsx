
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface BasicInfoSectionProps {
  title: string;
  setTitle: (value: string) => void;
  slug: string;
  setSlug: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  author: string;
  setAuthor: (value: string) => void;
  featured: boolean;
  setFeatured: (value: boolean) => void;
  categories: Array<{ title: string }>;
  isEditMode: boolean;
  setMetaTitle: (value: string) => void;
  metaTitle: string;
}

const BasicInfoSection = ({
  title,
  setTitle,
  slug,
  setSlug,
  category,
  setCategory,
  author,
  setAuthor,
  featured,
  setFeatured,
  categories,
  isEditMode,
  setMetaTitle,
  metaTitle
}: BasicInfoSectionProps) => {
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // Auto-generate slug from title if in create mode and slug is empty
    if (!isEditMode && !slug) {
      setSlug(newTitle.toLowerCase().replace(/[^\w\s]/gi, "").replace(/\s+/g, "-"));
    }

    // Auto-generate meta title if it's empty
    if (!metaTitle) {
      setMetaTitle(newTitle);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Post Title</Label>
        <Input
          id="title"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter post title"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="slug">Post Slug</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Enter post slug"
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          The slug is used in the URL of your post
        </p>
      </div>
      
      <div>
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.title} value={cat.title}>
              {cat.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="author">Author</Label>
        <Input
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Enter author name"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="featured" 
          checked={featured} 
          onCheckedChange={(checked) => setFeatured(checked as boolean)}
        />
        <Label 
          htmlFor="featured" 
          className="text-sm font-medium leading-none cursor-pointer"
        >
          Featured Post
        </Label>
      </div>
    </div>
  );
};

export default BasicInfoSection;
