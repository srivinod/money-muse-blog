
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface MediaSectionProps {
  imageUrl: string;
  setImageUrl: (value: string) => void;
  excerpt: string;
  setExcerpt: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
  metaDescription: string;
  setMetaDescription: (value: string) => void;
}

const MediaSection = ({
  imageUrl,
  setImageUrl,
  excerpt,
  setExcerpt,
  date,
  setDate,
  metaDescription,
  setMetaDescription
}: MediaSectionProps) => {
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a server or storage service
      // For this demo, we'll use a fake URL
      const fakeUrl = URL.createObjectURL(file);
      setImageUrl(fakeUrl);
      toast({
        title: "Image uploaded",
        description: "Image has been uploaded successfully",
      });
    }
  };

  const handleExcerptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newExcerpt = e.target.value;
    setExcerpt(newExcerpt);
    
    // Auto-generate meta description if it's empty
    if (!metaDescription) {
      setMetaDescription(newExcerpt);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="featuredImage">Featured Image</Label>
        <div className="mt-1 flex items-center gap-4">
          {imageUrl && (
            <div className="w-24 h-24 relative">
              <img
                src={imageUrl}
                alt="Featured"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          )}
          <label className="cursor-pointer">
            <Button type="button" variant="outline">
              {imageUrl ? "Change Image" : "Upload Image"}
            </Button>
            <Input
              id="featuredImage"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>
      
      <div>
        <Label htmlFor="excerpt">Post Excerpt</Label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={handleExcerptChange}
          placeholder="Enter a short summary of your post"
          className="h-24 resize-none"
          required
        />
      </div>

      <div>
        <Label htmlFor="date">Publication Date</Label>
        <Input
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="e.g., April 15, 2025"
          required
        />
      </div>
    </div>
  );
};

export default MediaSection;
