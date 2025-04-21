import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { 
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link as LinkIcon, Heading1, Heading2, Heading3, 
  Image as ImageIcon, Undo, Redo, Strikethrough, Quote,
  IndentDecrease, IndentIncrease, Code, Maximize2, Minimize2,
  Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'break-words',
          },
        },
        heading: {
          HTMLAttributes: {
            class: '[&.h1]:font-playfair [&.h2]:font-inter [&.h3]:font-inter',
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
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm md:prose-lg max-w-none focus:outline-none break-words [&_.ProseMirror]:font-inter [&_.ProseMirror_h1]:font-playfair [&_.ProseMirror_h2]:font-inter [&_.ProseMirror_h3]:font-inter',
      },
      handleDOMEvents: {
        keydown: (view, event) => {
          if ((event.ctrlKey || event.metaKey) && ['b', 'i', 'u'].includes(event.key.toLowerCase())) {
            event.preventDefault();
          }
        },
      },
      handlePaste: (view, event) => {
        const { from, to } = view.state.selection;
        const clipboardData = event.clipboardData;
        if (!clipboardData) return false;

        const html = clipboardData.getData('text/html');
        if (html) {
          event.preventDefault();
          
          // Create a temporary div to parse the HTML
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = html;
          
          // Remove font-family from all elements
          const elements = tempDiv.querySelectorAll('*');
          elements.forEach(el => {
            if (el instanceof HTMLElement) {
              el.style.fontFamily = '';
            }
          });
          
          // Get the cleaned HTML
          const cleanedHtml = tempDiv.innerHTML;
          
          // Insert the cleaned content
          editor.chain()
            .focus()
            .deleteRange({ from, to })
            .insertContent(cleanedHtml)
            .run();
          
          // Restore selection
          setTimeout(() => {
            editor.commands.setTextSelection({ from, to: from + cleanedHtml.length });
          }, 0);
          
          return true;
        }
        return false;
      },
      handleDrop: (view, event) => {
        const { from, to } = view.state.selection;
        setTimeout(() => {
          editor.commands.setTextSelection({ from, to });
        }, 0);
      },
    },
  });

  React.useEffect(() => {
    if (editor && value) {
      const { from, to } = editor.state.selection;
      editor.commands.setContent(value);
      if (from >= 0 && to >= 0) {
        editor.commands.setTextSelection({ from, to });
      }
    }
  }, [value, editor]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

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

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const { from, to } = editor.state.selection;
    editor.chain().focus().setColor(color).run();
    setTimeout(() => {
      editor.commands.setTextSelection({ from, to });
    }, 0);
  };

  const formattingOptions = [
    {
      category: "Text Style",
      items: [
        { 
          icon: <Bold className="h-4 w-4" />, 
          action: () => {
            const { from, to } = editor.state.selection;
            editor.chain().focus().toggleBold().run();
            editor.commands.setTextSelection({ from, to });
          }, 
          title: "Bold", 
          isActive: editor.isActive('bold') 
        },
        { 
          icon: <Italic className="h-4 w-4" />, 
          action: () => {
            const { from, to } = editor.state.selection;
            editor.chain().focus().toggleItalic().run();
            editor.commands.setTextSelection({ from, to });
          }, 
          title: "Italic", 
          isActive: editor.isActive('italic') 
        },
        { 
          icon: <UnderlineIcon className="h-4 w-4" />, 
          action: () => {
            const { from, to } = editor.state.selection;
            editor.chain().focus().toggleUnderline().run();
            editor.commands.setTextSelection({ from, to });
          }, 
          title: "Underline", 
          isActive: editor.isActive('underline') 
        },
        { 
          icon: <Strikethrough className="h-4 w-4" />, 
          action: () => {
            const { from, to } = editor.state.selection;
            editor.chain().focus().toggleStrike().run();
            editor.commands.setTextSelection({ from, to });
          }, 
          title: "Strikethrough", 
          isActive: editor.isActive('strike') 
        },
        {
          icon: <Palette className="h-4 w-4" />,
          action: () => {},
          title: "Text Color",
          isActive: editor.isActive('textStyle', { color: selectedColor }),
          customComponent: (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 ${editor.isActive('textStyle', { color: selectedColor }) ? 'bg-gray-200' : ''}`}
                >
                  <Palette className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="h-8 w-8 p-0"
                    />
                    <Input
                      type="text"
                      value={selectedColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="h-8"
                      placeholder="#000000"
                    />
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff9900', '#9900ff', '#0099ff', '#ff0099'].map((color) => (
                      <button
                        key={color}
                        className="h-6 w-6 rounded-full border"
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorChange(color)}
                      />
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )
        }
      ]
    },
    {
      category: "Headings",
      items: [
        { 
          icon: <Heading1 className="h-4 w-4" />, 
          action: () => {
            const { from, to } = editor.state.selection;
            editor.chain().focus().toggleHeading({ level: 1 }).run();
            editor.commands.setTextSelection({ from, to });
          }, 
          title: "Heading 1", 
          isActive: editor.isActive('heading', { level: 1 }) 
        },
        { 
          icon: <Heading2 className="h-4 w-4" />, 
          action: () => {
            const { from, to } = editor.state.selection;
            editor.chain().focus().toggleHeading({ level: 2 }).run();
            editor.commands.setTextSelection({ from, to });
          }, 
          title: "Heading 2", 
          isActive: editor.isActive('heading', { level: 2 }) 
        },
        { 
          icon: <Heading3 className="h-4 w-4" />, 
          action: () => {
            const { from, to } = editor.state.selection;
            editor.chain().focus().toggleHeading({ level: 3 }).run();
            editor.commands.setTextSelection({ from, to });
          }, 
          title: "Heading 3", 
          isActive: editor.isActive('heading', { level: 3 }) 
        }
      ]
    },
    {
      category: "Lists",
      items: [
        { 
          icon: <List className="h-4 w-4" />, 
          action: () => {
            const { from, to } = editor.state.selection;
            editor.chain().focus().toggleBulletList().run();
            editor.commands.setTextSelection({ from, to });
          }, 
          title: "Bullet List", 
          isActive: editor.isActive('bulletList') 
        },
        { 
          icon: <ListOrdered className="h-4 w-4" />, 
          action: () => {
            const { from, to } = editor.state.selection;
            editor.chain().focus().toggleOrderedList().run();
            editor.commands.setTextSelection({ from, to });
          }, 
          title: "Numbered List", 
          isActive: editor.isActive('orderedList') 
        },
        { 
          icon: <IndentDecrease className="h-4 w-4" />, 
          action: () => {
            const { from, to } = editor.state.selection;
            editor.chain().focus().liftListItem('listItem').run();
            editor.commands.setTextSelection({ from, to });
          }, 
          title: "Decrease Indent" 
        },
        { 
          icon: <IndentIncrease className="h-4 w-4" />, 
          action: () => {
            const { from, to } = editor.state.selection;
            editor.chain().focus().sinkListItem('listItem').run();
            editor.commands.setTextSelection({ from, to });
          }, 
          title: "Increase Indent" 
        }
      ]
    },
    {
      category: "Alignment",
      items: [
        { 
          icon: <AlignLeft className="h-4 w-4" />, 
          action: () => {
            const { from, to } = editor.state.selection;
            editor.chain().focus().setTextAlign('left').run();
            editor.commands.setTextSelection({ from, to });
          }, 
          title: "Align Left", 
          isActive: editor.isActive({ textAlign: 'left' }) 
        },
        { 
          icon: <AlignCenter className="h-4 w-4" />, 
          action: () => {
            const { from, to } = editor.state.selection;
            editor.chain().focus().setTextAlign('center').run();
            editor.commands.setTextSelection({ from, to });
          }, 
          title: "Align Center", 
          isActive: editor.isActive({ textAlign: 'center' }) 
        },
        { 
          icon: <AlignRight className="h-4 w-4" />, 
          action: () => {
            const { from, to } = editor.state.selection;
            editor.chain().focus().setTextAlign('right').run();
            editor.commands.setTextSelection({ from, to });
          }, 
          title: "Align Right", 
          isActive: editor.isActive({ textAlign: 'right' }) 
        },
        { 
          icon: <AlignJustify className="h-4 w-4" />, 
          action: () => {
            const { from, to } = editor.state.selection;
            editor.chain().focus().setTextAlign('justify').run();
            editor.commands.setTextSelection({ from, to });
          }, 
          title: "Justify", 
          isActive: editor.isActive({ textAlign: 'justify' }) 
        }
      ]
    },
    {
      category: "Insert",
      items: [
        { icon: <LinkIcon className="h-4 w-4" />, action: addLink, title: "Insert Link" },
        { icon: <ImageIcon className="h-4 w-4" />, action: addImage, title: "Insert Image" },
        { 
          icon: <Quote className="h-4 w-4" />, 
          action: () => {
            const { from, to } = editor.state.selection;
            editor.chain().focus().toggleBlockquote().run();
            editor.commands.setTextSelection({ from, to });
          }, 
          title: "Insert Quote", 
          isActive: editor.isActive('blockquote') 
        },
        { 
          icon: <Code className="h-4 w-4" />, 
          action: () => {
            const { from, to } = editor.state.selection;
            editor.chain().focus().toggleCodeBlock().run();
            editor.commands.setTextSelection({ from, to });
          }, 
          title: "Insert Code", 
          isActive: editor.isActive('codeBlock') 
        }
      ]
    },
    {
      category: "History",
      items: [
        { 
          icon: <Undo className="h-4 w-4" />, 
          action: () => {
            const { from, to } = editor.state.selection;
            editor.chain().focus().undo().run();
            editor.commands.setTextSelection({ from, to });
          }, 
          title: "Undo" 
        },
        { 
          icon: <Redo className="h-4 w-4" />, 
          action: () => {
            const { from, to } = editor.state.selection;
            editor.chain().focus().redo().run();
            editor.commands.setTextSelection({ from, to });
          }, 
          title: "Redo" 
        }
      ]
    }
  ];

  return (
    <div className={`border rounded-md ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      <div className={`bg-gray-50 p-2 border-b overflow-x-auto ${isFullscreen ? 'sticky top-0 z-10' : ''}`}>
        <div className="flex flex-wrap gap-1">
          {formattingOptions.map((category, categoryIndex) => (
            <React.Fragment key={category.category}>
              {categoryIndex > 0 && <div className="w-px h-6 bg-gray-300 mx-1 self-center" />}
              
              <div className="flex items-center">
                <TooltipProvider>
                  {category.items.map((item, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        {item.customComponent || (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={item.action}
                            className={`h-8 w-8 p-0 ${item.isActive ? 'bg-gray-200' : ''}`}
                          >
                            {item.icon}
                          </Button>
                        )}
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
          <div className="ml-auto">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="h-8 w-8 p-0"
                  >
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-hidden">
        <EditorContent 
          editor={editor} 
          className={`min-h-[300px] p-4 focus-visible:outline-none resize-y prose prose-sm md:prose-lg max-w-none break-words [&_h1]:font-playfair [&_h2]:font-inter [&_h2]:text-lg md:text-xl [&_h3]:font-inter [&_h3]:text-lg md:text-xl ${isFullscreen ? 'h-[calc(100vh-3rem)] overflow-y-auto' : ''}`}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
