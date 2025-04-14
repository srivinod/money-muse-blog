
import { useState } from "react";
import { 
  Bold, Italic, Underline, List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link as LinkIcon, Heading1, Heading2, Heading3, 
  Image, Undo, Redo, Strikethrough, Quote,
  IndentDecrease, IndentIncrease, Code
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import EditorToolbar from "./EditorToolbar";

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

  // Handler functions for different formatting operations
  const formatHandlers = {
    insertLink: () => {
      const url = prompt("Enter the URL:", "https://");
      if (url) {
        const selectedText = value.substring(selection.start, selection.end);
        const linkText = selectedText || "link text";
        insertMarkup(`<a href="${url}">`, `</a>`);
      }
    },
    
    insertImage: () => {
      const url = prompt("Enter image URL:", "https://");
      if (url) {
        const alt = prompt("Enter image description:", "Image") || "Image";
        insertMarkup(`<img src="${url}" alt="${alt}" />`);
      }
    },
    
    insertQuote: () => {
      insertMarkup('<blockquote>', '</blockquote>');
    },
    
    insertCode: () => {
      insertMarkup('<code>', '</code>');
    }
  };

  // Group formatting options by category
  const formattingOptions = [
    {
      category: "Text Style",
      items: [
        { icon: <Bold className="h-4 w-4" />, action: () => insertMarkup("<b>", "</b>"), title: "Bold" },
        { icon: <Italic className="h-4 w-4" />, action: () => insertMarkup("<i>", "</i>"), title: "Italic" },
        { icon: <Underline className="h-4 w-4" />, action: () => insertMarkup("<u>", "</u>"), title: "Underline" },
        { icon: <Strikethrough className="h-4 w-4" />, action: () => insertMarkup("<s>", "</s>"), title: "Strikethrough" }
      ]
    },
    {
      category: "Headings",
      items: [
        { icon: <Heading1 className="h-4 w-4" />, action: () => insertMarkup("<h1>", "</h1>"), title: "Heading 1" },
        { icon: <Heading2 className="h-4 w-4" />, action: () => insertMarkup("<h2>", "</h2>"), title: "Heading 2" },
        { icon: <Heading3 className="h-4 w-4" />, action: () => insertMarkup("<h3>", "</h3>"), title: "Heading 3" }
      ]
    },
    {
      category: "Lists",
      items: [
        { icon: <List className="h-4 w-4" />, action: () => insertMarkup("<ul>\n  <li>", "</li>\n</ul>"), title: "Bullet List" },
        { icon: <ListOrdered className="h-4 w-4" />, action: () => insertMarkup("<ol>\n  <li>", "</li>\n</ol>"), title: "Numbered List" },
        { icon: <IndentDecrease className="h-4 w-4" />, action: () => insertMarkup("&emsp;"), title: "Decrease Indent" },
        { icon: <IndentIncrease className="h-4 w-4" />, action: () => insertMarkup("&emsp;"), title: "Increase Indent" }
      ]
    },
    {
      category: "Alignment",
      items: [
        { icon: <AlignLeft className="h-4 w-4" />, action: () => insertMarkup('<div style="text-align: left;">', '</div>'), title: "Align Left" },
        { icon: <AlignCenter className="h-4 w-4" />, action: () => insertMarkup('<div style="text-align: center;">', '</div>'), title: "Align Center" },
        { icon: <AlignRight className="h-4 w-4" />, action: () => insertMarkup('<div style="text-align: right;">', '</div>'), title: "Align Right" },
        { icon: <AlignJustify className="h-4 w-4" />, action: () => insertMarkup('<div style="text-align: justify;">', '</div>'), title: "Justify" }
      ]
    },
    {
      category: "Insert",
      items: [
        { icon: <LinkIcon className="h-4 w-4" />, action: formatHandlers.insertLink, title: "Insert Link" },
        { icon: <Image className="h-4 w-4" />, action: formatHandlers.insertImage, title: "Insert Image" },
        { icon: <Quote className="h-4 w-4" />, action: formatHandlers.insertQuote, title: "Insert Quote" },
        { icon: <Code className="h-4 w-4" />, action: formatHandlers.insertCode, title: "Insert Code" }
      ]
    },
    {
      category: "History",
      items: [
        { icon: <Undo className="h-4 w-4" />, action: () => document.execCommand('undo'), title: "Undo" },
        { icon: <Redo className="h-4 w-4" />, action: () => document.execCommand('redo'), title: "Redo" }
      ]
    }
  ];

  return (
    <div className="border rounded-md">
      <EditorToolbar formattingOptions={formattingOptions} />
      
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
