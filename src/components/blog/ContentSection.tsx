
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/RichTextEditor";

interface ContentSectionProps {
  content: string;
  setContent: (value: string) => void;
}

const ContentSection = ({ content, setContent }: ContentSectionProps) => {
  return (
    <div className="space-y-2 mb-6">
      <Label htmlFor="content">Post Content</Label>
      <RichTextEditor value={content} onChange={setContent} />
    </div>
  );
};

export default ContentSection;
