
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SeoSectionProps {
  metaTitle: string;
  setMetaTitle: (value: string) => void;
  metaDescription: string;
  setMetaDescription: (value: string) => void;
  slug: string;
  excerpt: string;
}

const SeoSection = ({
  metaTitle,
  setMetaTitle,
  metaDescription,
  setMetaDescription,
  slug,
  excerpt
}: SeoSectionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="metaTitle">Meta Title (for SEO)</Label>
        <Input
          id="metaTitle"
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
          placeholder="Enter meta title for search engines"
        />
        <p className="text-sm text-gray-500 mt-1">
          If left empty, the post title will be used instead. 
          Recommended length: 50-60 characters.
        </p>
        {metaTitle && (
          <div className="mt-2">
            <div className="text-sm font-medium text-blue-600 mb-1">Preview:</div>
            <div className="p-3 border rounded-md bg-gray-50">
              <div className="text-xl text-blue-700 mb-1 truncate">{metaTitle}</div>
              <div className="text-green-700 text-sm mb-1 truncate">
                finance90.com/blog/{slug}
              </div>
              <div className="text-sm text-gray-700 truncate">
                {metaDescription || excerpt || "No description provided."}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div>
        <Label htmlFor="metaDescription">Meta Description</Label>
        <Textarea
          id="metaDescription"
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          placeholder="Enter meta description for search engines"
          className="h-24 resize-none"
        />
        <p className="text-sm text-gray-500 mt-1">
          If left empty, the post excerpt will be used. 
          Recommended length: 150-160 characters.
        </p>
        <div className="mt-2 text-sm text-gray-500">
          <span className={metaDescription.length > 160 ? "text-red-500 font-medium" : ""}>
            Character count: {metaDescription.length}/160
          </span>
          {metaDescription.length > 160 && (
            <span className="ml-2 text-red-500">
              (Exceeds recommended length)
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4 bg-blue-50 rounded-md">
        <h3 className="font-semibold text-blue-800 mb-2">SEO Best Practices</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
          <li>Use relevant keywords in your title and description</li>
          <li>Keep meta titles under 60 characters</li>
          <li>Keep meta descriptions under 160 characters</li>
          <li>Make your description compelling to increase click-through rates</li>
          <li>Include your main keyword early in both title and description</li>
        </ul>
      </div>
    </div>
  );
};

export default SeoSection;
