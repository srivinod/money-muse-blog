import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { 
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link as LinkIcon, Heading1, Heading2, Heading3, 
  Image as ImageIcon, Undo, Redo, Strikethrough, Quote,
  IndentDecrease, IndentIncrease, Code
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'break-words',
          },
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary hover:underline break-all',
        },
      }),
      Placeholder.configure({
        placeholder: 'Write your blog post content here...',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm md:prose-lg max-w-none focus:outline-none break-words',
      },
    },
  });

  React.useEffect(() => {
    console.log("RichTextEditor value:", value);
    if (editor && value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Enter the URL of the image:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter the URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const formattingOptions = [
    {
      category: "Text Style",
      items: [
        { icon: <Bold className="h-4 w-4" />, action: () => editor.chain().focus().toggleBold().run(), title: "Bold", isActive: editor.isActive('bold') },
        { icon: <Italic className="h-4 w-4" />, action: () => editor.chain().focus().toggleItalic().run(), title: "Italic", isActive: editor.isActive('italic') },
        { icon: <UnderlineIcon className="h-4 w-4" />, action: () => editor.chain().focus().toggleUnderline().run(), title: "Underline", isActive: editor.isActive('underline') },
        { icon: <Strikethrough className="h-4 w-4" />, action: () => editor.chain().focus().toggleStrike().run(), title: "Strikethrough", isActive: editor.isActive('strike') }
      ]
    },
    {
      category: "Headings",
      items: [
        { icon: <Heading1 className="h-4 w-4" />, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), title: "Heading 1", isActive: editor.isActive('heading', { level: 1 }) },
        { icon: <Heading2 className="h-4 w-4" />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), title: "Heading 2", isActive: editor.isActive('heading', { level: 2 }) },
        { icon: <Heading3 className="h-4 w-4" />, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), title: "Heading 3", isActive: editor.isActive('heading', { level: 3 }) }
      ]
    },
    {
      category: "Lists",
      items: [
        { icon: <List className="h-4 w-4" />, action: () => editor.chain().focus().toggleBulletList().run(), title: "Bullet List", isActive: editor.isActive('bulletList') },
        { icon: <ListOrdered className="h-4 w-4" />, action: () => editor.chain().focus().toggleOrderedList().run(), title: "Numbered List", isActive: editor.isActive('orderedList') },
        { icon: <IndentDecrease className="h-4 w-4" />, action: () => editor.chain().focus().liftListItem('listItem').run(), title: "Decrease Indent" },
        { icon: <IndentIncrease className="h-4 w-4" />, action: () => editor.chain().focus().sinkListItem('listItem').run(), title: "Increase Indent" }
      ]
    },
    {
      category: "Alignment",
      items: [
        { icon: <AlignLeft className="h-4 w-4" />, action: () => editor.chain().focus().setTextAlign('left').run(), title: "Align Left", isActive: editor.isActive({ textAlign: 'left' }) },
        { icon: <AlignCenter className="h-4 w-4" />, action: () => editor.chain().focus().setTextAlign('center').run(), title: "Align Center", isActive: editor.isActive({ textAlign: 'center' }) },
        { icon: <AlignRight className="h-4 w-4" />, action: () => editor.chain().focus().setTextAlign('right').run(), title: "Align Right", isActive: editor.isActive({ textAlign: 'right' }) },
        { icon: <AlignJustify className="h-4 w-4" />, action: () => editor.chain().focus().setTextAlign('justify').run(), title: "Justify", isActive: editor.isActive({ textAlign: 'justify' }) }
      ]
    },
    {
      category: "Insert",
      items: [
        { icon: <LinkIcon className="h-4 w-4" />, action: addLink, title: "Insert Link" },
        { icon: <ImageIcon className="h-4 w-4" />, action: addImage, title: "Insert Image" },
        { icon: <Quote className="h-4 w-4" />, action: () => editor.chain().focus().toggleBlockquote().run(), title: "Insert Quote", isActive: editor.isActive('blockquote') },
        { icon: <Code className="h-4 w-4" />, action: () => editor.chain().focus().toggleCodeBlock().run(), title: "Insert Code", isActive: editor.isActive('codeBlock') }
      ]
    },
    {
      category: "History",
      items: [
        { icon: <Undo className="h-4 w-4" />, action: () => editor.chain().focus().undo().run(), title: "Undo" },
        { icon: <Redo className="h-4 w-4" />, action: () => editor.chain().focus().redo().run(), title: "Redo" }
      ]
    }
  ];

  return (
    <div className="border rounded-md">
      <div className="bg-gray-50 p-2 border-b overflow-x-auto">
        <div className="flex flex-wrap gap-1">
          {formattingOptions.map((category, categoryIndex) => (
            <React.Fragment key={category.category}>
              {categoryIndex > 0 && <div className="w-px h-6 bg-gray-300 mx-1 self-center" />}
              
              <div className="flex items-center">
                <TooltipProvider>
                  {category.items.map((item, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={item.action}
                          className={`h-8 w-8 p-0 ${item.isActive ? 'bg-gray-200' : ''}`}
                        >
                          {item.icon}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{item.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <div className="overflow-x-hidden">
        <EditorContent 
          editor={editor} 
          className="min-h-[300px] p-4 focus-visible:outline-none resize-y prose prose-sm md:prose-lg max-w-none break-words"
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
