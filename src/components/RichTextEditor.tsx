
import { useState } from "react";
import { 
  Bold, Italic, Underline, List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, Link as LinkIcon,
  Heading1, Heading2, Heading3, Image
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  
  const handleTextAreaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setSelection({
      start: target.selectionStart,
      end: target.selectionEnd
    });
  };

  const insertMarkup = (before: string, after: string = "") => {
    const newValue = 
      value.substring(0, selection.start) + 
      before + 
      value.substring(selection.start, selection.end) + 
      after + 
      value.substring(selection.end);
    
    onChange(newValue);
  };

  const handleLinkInsert = () => {
    const url = prompt("Enter the URL:", "https://");
    if (url) {
      const selectedText = value.substring(selection.start, selection.end);
      const linkText = selectedText || "link text";
      insertMarkup(`<a href="${url}">`, `</a>`);
    }
  };

  const handleImageInsert = () => {
    const url = prompt("Enter image URL:", "https://");
    if (url) {
      insertMarkup(`<img src="${url}" alt="Image" />`);
    }
  };

  return (
    <div className="border rounded-md">
      <div className="bg-gray-50 p-2 border-b flex flex-wrap gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkup("<b>", "</b>")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkup("<i>", "</i>")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkup("<u>", "</u>")}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkup("<h1>", "</h1>")}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkup("<h2>", "</h2>")}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkup("<h3>", "</h3>")}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkup("<ul>\n  <li>", "</li>\n</ul>")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkup("<ol>\n  <li>", "</li>\n</ol>")}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkup('<div style="text-align: left;">', '</div>')}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkup('<div style="text-align: center;">', '</div>')}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkup('<div style="text-align: right;">', '</div>')}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleLinkInsert}
          title="Insert Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleImageInsert}
          title="Insert Image"
        >
          <Image className="h-4 w-4" />
        </Button>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={handleTextAreaSelect}
        className="min-h-[300px] border-0 focus-visible:ring-0 resize-y"
        placeholder="Enter your blog post content here..."
      />
    </div>
  );
};

export default RichTextEditor;
