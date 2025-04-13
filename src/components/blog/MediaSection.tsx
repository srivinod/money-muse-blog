import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { uploadImage } from "@/services/blog/uploadImage";
import { useState, useRef } from "react";

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadError(null);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        const errorMsg = "Please upload an image file";
        setUploadError(errorMsg);
        toast({
          title: "Invalid file type",
          description: errorMsg,
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        const errorMsg = "Please upload an image smaller than 5MB";
        setUploadError(errorMsg);
        toast({
          title: "File too large",
          description: errorMsg,
          variant: "destructive",
        });
        return;
      }

      // Upload the image
      const uploadedUrl = await uploadImage(file);
      setImageUrl(uploadedUrl);
      
      toast({
        title: "Image uploaded",
        description: "Image has been uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setUploadError(errorMessage);
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
        <div className="mt-1 flex flex-col gap-2">
          <div className="flex items-center gap-4">
            {imageUrl && (
              <div className="w-24 h-24 relative">
                <img
                  src={imageUrl}
                  alt="Featured"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            )}
            <Button 
              type="button" 
              variant="outline" 
              disabled={isUploading}
              onClick={handleButtonClick}
            >
              {isUploading ? "Uploading..." : (imageUrl ? "Change Image" : "Upload Image")}
            </Button>
            <Input
              ref={fileInputRef}
              id="featuredImage"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isUploading}
            />
          </div>
          {uploadError && (
            <p className="text-sm text-red-500">{uploadError}</p>
          )}
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
