import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/RichTextEditor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

interface ContentSectionProps {
  content: string;
  setContent: (value: string) => void;
}

const ContentSection = ({ content, setContent }: ContentSectionProps) => {
  // Add debug logging
  useEffect(() => {
    console.log("Content in ContentSection:", content);
  }, [content]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Post Content</CardTitle>
        <CardDescription>Write your blog post content here using the rich text editor</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="content">Post Content</Label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentSection;
