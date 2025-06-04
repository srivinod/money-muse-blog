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
  Palette, Save, Pilcrow, Type, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave?: () => void;
}

const RichTextEditor = ({ value, onChange, onSave }: RichTextEditorProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const { toast } = useToast();
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'break-words mb-4 last:mb-0 leading-normal',
          },
        },
        heading: {
          HTMLAttributes: {
            class: '[&.h1]:font-playfair [&.h2]:font-inter [&.h2]:text-lg md:text-xl [&.h3]:font-inter [&.h3]:text-lg md:text-xl mb-4 last:mb-0 leading-normal',
          },
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto my-4',
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
        class: 'prose prose-sm md:prose-lg max-w-none focus:outline-none break-words [&_h1]:font-playfair [&_h2]:font-inter [&_h2]:text-lg md:text-xl [&_h3]:font-inter [&_h3]:text-lg md:text-xl [&_p]:mb-4 [&_p:last-child]:mb-0 [&_h1]:mb-4 [&_h1:last-child]:mb-0 [&_h2]:mb-4 [&_h2:last-child]:mb-0 [&_h3]:mb-4 [&_h3:last-child]:mb-0',
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

  const handleUpdate = () => {
    if (editor) {
      const html = editor.getHTML();
      onChange(html);
      if (onSave) {
        onSave();
      }
      toast({
        title: "Content Updated",
        description: "Your changes have been saved successfully.",
      });
    }
  };

  const humanizeContent = async () => {
    if (!editor) return;

    // Get the current content with formatting
    const content = editor.getHTML();
    
    try {
      // Create a temporary div to parse the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;

      // Process each text node while preserving formatting
      const processNode = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent || '';
          if (text.trim()) {
            // Humanize the text while preserving formatting
            const humanizedText = humanizeText(text);
            node.textContent = humanizedText;
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // Process child nodes
          Array.from(node.childNodes).forEach(processNode);
        }
      };

      // Process all nodes
      processNode(tempDiv);

      // Update the editor content while preserving formatting
      editor.commands.setContent(tempDiv.innerHTML);
      
      toast({
        title: "Content Humanized",
        description: "The content has been made more natural and human-like",
        duration: 2000
      });
    } catch (error) {
      console.error("Error humanizing content:", error);
      toast({
        title: "Error",
        description: "Failed to humanize content. Please try again.",
        variant: "destructive",
        duration: 2000
      });
    }
  };

  // Helper function to humanize text
  const humanizeText = (text: string): string => {
    // Enhanced content analysis with more sophisticated metrics
    const analyzeContent = (text: string) => {
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const words = text.toLowerCase().split(/\s+/);
      const uniqueWords = new Set(words);
      const wordFrequency = words.reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Analyze sentence structure with more detail
      const sentenceStructures = sentences.map(sentence => {
        const words = sentence.trim().split(/\s+/);
        const punctuation = sentence.match(/[.!?]+$/)?.[0] || '';
        return {
          length: words.length,
          startsWith: words[0]?.toLowerCase() || '',
          endsWith: words[words.length - 1]?.toLowerCase() || '',
          hasQuestion: sentence.includes('?'),
          hasExclamation: sentence.includes('!'),
          punctuation: punctuation,
          hasContractions: sentence.match(/\b\w+'[a-z]+\b/) !== null,
          hasIdioms: sentence.match(/\b(kick the bucket|piece of cake|break a leg)\b/i) !== null
        };
      });

      // Analyze paragraph structure with more detail
      const paragraphs = text.split('\n\n');
      const paragraphLengths = paragraphs.map(p => p.split(/\s+/).length);
      const paragraphVariety = paragraphs.map(p => {
        const sentences = p.split(/[.!?]+/).filter(s => s.trim().length > 0);
        return {
          sentenceCount: sentences.length,
          averageLength: sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length,
          hasQuestions: sentences.some(s => s.includes('?')),
          hasExclamations: sentences.some(s => s.includes('!'))
        };
      });

      return {
        sentenceCount: sentences.length,
        wordCount: words.length,
        uniqueWordCount: uniqueWords.size,
        mostCommonWords: Object.entries(wordFrequency)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 15)
          .map(([word]) => word),
        averageSentenceLength: words.length / sentences.length,
        sentenceStructures,
        paragraphLengths,
        paragraphVariety,
        hasQuestions: sentenceStructures.some(s => s.hasQuestion),
        hasExclamations: sentenceStructures.some(s => s.hasExclamation),
        hasContractions: sentenceStructures.some(s => s.hasContractions),
        hasIdioms: sentenceStructures.some(s => s.hasIdioms)
      };
    };

    // Get enhanced content analysis
    const analysis = analyzeContent(text);

    // Transform the text with more natural variations
    return text
      // Replace common patterns with more natural expressions
      .replace(/\b(in this|in the|as we)\b/gi, (match) => {
        const naturalPhrases = [
          'as we explore this further',
          'while we dig deeper into',
          'throughout our journey into',
          'as we navigate through',
          'while we uncover more about',
          'as we peel back the layers of',
          'throughout our deep dive into',
          'while we examine the nuances of',
          'as we explore the intricacies of',
          'while we investigate the details of',
          'throughout our exploration of',
          'as we journey through the landscape of',
          'while we traverse the terrain of',
          'as we navigate the complexities of',
          'while we explore the depths of'
        ];
        return naturalPhrases[Math.floor(Math.random() * naturalPhrases.length)];
      })
      // Add more natural transitions
      .replace(/\b(moreover|furthermore|additionally)\b/gi, (match) => {
        const naturalTransitions = [
          'what\'s really interesting is',
          'here\'s something that caught my attention',
          'here\'s where things get fascinating',
          'prepare to be surprised by this',
          'here\'s a twist you might not expect',
          'here\'s something that stood out to me',
          'what\'s particularly noteworthy is',
          'here\'s an interesting development I noticed',
          'here\'s where things take an interesting turn',
          'prepare for an intriguing insight I discovered',
          'here\'s something that really made me think',
          'what\'s fascinating about this is',
          'here\'s a perspective that might surprise you',
          'here\'s where things get really interesting',
          'prepare for an unexpected twist'
        ];
        return naturalTransitions[Math.floor(Math.random() * naturalTransitions.length)];
      })
      // Add more natural emphasis
      .replace(/\b(important|crucial|essential)\b/gi, (match) => {
        const naturalEmphasis = {
          'important': ['pivotal', 'game-changing', 'make-or-break', 'mission-critical', 'paramount', 'indispensable', 'vital', 'critical', 'fundamental', 'essential', 'key', 'central', 'core', 'primary', 'principal'],
          'crucial': ['indispensable', 'non-negotiable', 'make-or-break', 'mission-critical', 'paramount', 'pivotal', 'vital', 'critical', 'fundamental', 'essential', 'key', 'central', 'core', 'primary', 'principal'],
          'essential': ['fundamental', 'cornerstone', 'bedrock', 'linchpin', 'paramount', 'indispensable', 'vital', 'critical', 'pivotal', 'mission-critical', 'key', 'central', 'core', 'primary', 'principal']
        };
        return naturalEmphasis[match.toLowerCase() as keyof typeof naturalEmphasis][
          Math.floor(Math.random() * naturalEmphasis[match.toLowerCase() as keyof typeof naturalEmphasis].length)
        ];
      })
      // Add more natural comparisons
      .replace(/\b(similar to|like|such as)\b/gi, (match) => {
        const naturalComparisons = {
          'similar to': ['akin to', 'in the same vein as', 'echoing', 'mirroring', 'paralleling', 'resembling', 'comparable to', 'analogous to', 'corresponding to', 'equivalent to', 'along the lines of', 'in the same ballpark as', 'in a similar category to', 'sharing characteristics with', 'bearing resemblance to'],
          'like': ['resembling', 'paralleling', 'echoing', 'mirroring', 'akin to', 'similar to', 'comparable to', 'analogous to', 'corresponding to', 'equivalent to', 'along the lines of', 'in the same ballpark as', 'in a similar category to', 'sharing characteristics with', 'bearing resemblance to'],
          'such as': ['including', 'encompassing', 'embracing', 'incorporating', 'comprising', 'containing', 'involving', 'featuring', 'consisting of', 'composed of', 'made up of', 'built from', 'formed by', 'constructed with', 'assembled from']
        };
        return naturalComparisons[match.toLowerCase() as keyof typeof naturalComparisons][
          Math.floor(Math.random() * naturalComparisons[match.toLowerCase() as keyof typeof naturalComparisons].length)
        ];
      })
      // Add more natural qualifiers
      .replace(/\b(always|never|every)\b/gi, (match) => {
        const naturalQualifiers = {
          'always': ['invariably', 'without fail', 'consistently', 'reliably', 'unfailingly', 'perpetually', 'incessantly', 'continually', 'persistently', 'unremittingly', 'steadily', 'regularly', 'habitually', 'customarily', 'typically'],
          'never': ['rarely if ever', 'seldom if at all', 'hardly ever', 'scarcely', 'almost never', 'virtually never', 'practically never', 'barely ever', 'infrequently', 'sporadically', 'occasionally', 'sometimes', 'now and then', 'from time to time', 'once in a while'],
          'every': ['virtually all', 'the vast majority of', 'nearly every', 'almost all', 'practically all', 'the overwhelming majority of', 'the lion\'s share of', 'the bulk of', 'the greater part of', 'the preponderance of', 'most of', 'the majority of', 'a large portion of', 'a significant number of', 'a substantial amount of']
        };
        return naturalQualifiers[match.toLowerCase() as keyof typeof naturalQualifiers][
          Math.floor(Math.random() * naturalQualifiers[match.toLowerCase() as keyof typeof naturalQualifiers].length)
        ];
      })
      // Add more natural connectors
      .replace(/\b(therefore|thus|hence)\b/gi, (match) => {
        const naturalConnectors = [
          'consequently',
          'as a direct result',
          'which naturally leads to',
          'this inevitably means',
          'this logically follows',
          'this consequently results in',
          'this naturally leads to',
          'this inevitably brings us to',
          'this logically points to',
          'this consequently guides us to',
          'this naturally follows that',
          'this inevitably leads to',
          'this logically suggests',
          'this consequently indicates',
          'this naturally implies'
        ];
        return naturalConnectors[Math.floor(Math.random() * naturalConnectors.length)];
      })
      // Add more natural examples
      .replace(/\b(for example|for instance)\b/gi, (match) => {
        const naturalExamples = [
          'consider this scenario',
          'picture this situation',
          'imagine this case',
          'take this instance',
          'look at this case',
          'examine this example',
          'observe this situation',
          'analyze this scenario',
          'investigate this case',
          'explore this instance',
          'study this example',
          'review this situation',
          'examine this case',
          'analyze this instance',
          'investigate this scenario'
        ];
        return naturalExamples[Math.floor(Math.random() * naturalExamples.length)];
      })
      // Add more natural conclusions
      .replace(/\b(in conclusion|to conclude)\b/gi, (match) => {
        const naturalConclusions = [
          'when we piece it all together',
          'after connecting all the dots',
          'when we step back and look at the big picture',
          'after examining all the evidence',
          'when we consider everything we\'ve uncovered',
          'after synthesizing all the information',
          'when we integrate all the insights',
          'after analyzing all the data',
          'when we consolidate all the findings',
          'after evaluating all the evidence',
          'when we put all the pieces together',
          'after considering all the factors',
          'when we look at the complete picture',
          'after reviewing all the information',
          'when we take everything into account'
        ];
        return naturalConclusions[Math.floor(Math.random() * naturalConclusions.length)];
      })
      // Add more natural questions based on content analysis
      .replace(/\.\s*([A-Z])/g, (match, p1) => {
        if (Math.random() > 0.7) {
          const naturalQuestions = [
            ' But have you considered the implications?',
            ' What does this reveal about the bigger picture?',
            ' How does this change our understanding?',
            ' What new possibilities does this open up?',
            ' Where does this lead us next?',
            ' What deeper insights can we draw from this?',
            ' How does this reshape our perspective?',
            ' What broader implications does this have?',
            ' How does this influence our approach?',
            ' What new avenues does this suggest?',
            ' What does this tell us about the situation?',
            ' How does this affect our understanding?',
            ' What does this mean for the future?',
            ' How does this impact our perspective?',
            ' What does this reveal about the context?'
          ];
          return '.' + naturalQuestions[Math.floor(Math.random() * naturalQuestions.length)] + ' ' + p1;
        }
        return match;
      })
      // Add more natural interjections
      .replace(/\b(actually|basically|literally)\b/gi, (match) => {
        const naturalInterjections = {
          'actually': ['in reality', 'truth be told', 'as it turns out', 'in fact', 'in actuality', 'in practice', 'in essence', 'in truth', 'in effect', 'in substance', 'in reality', 'in actual fact', 'in point of fact', 'in truth', 'in actual practice'],
          'basically': ['at its core', 'fundamentally', 'essentially', 'primarily', 'principally', 'chiefly', 'mainly', 'predominantly', 'largely', 'mostly', 'in essence', 'at heart', 'in the main', 'for the most part', 'in general'],
          'literally': ['genuinely', 'truly', 'authentically', 'veritably', 'actually', 'really', 'indeed', 'certainly', 'undoubtedly', 'unquestionably', 'absolutely', 'positively', 'definitely', 'surely', 'assuredly']
        };
        return naturalInterjections[match.toLowerCase() as keyof typeof naturalInterjections][
          Math.floor(Math.random() * naturalInterjections[match.toLowerCase() as keyof typeof naturalInterjections].length)
        ];
      })
      // Add more natural perspective shifts
      .replace(/\b(we|you|they)\b/gi, (match) => {
        const naturalPerspectives = {
          'we': ['our team', 'our community', 'our collective', 'our group', 'our organization', 'our network', 'our circle', 'our alliance', 'our partnership', 'our collaboration', 'our team of experts', 'our community of professionals', 'our collective of specialists', 'our group of practitioners', 'our organization of professionals'],
          'you': ['yourself', 'one', 'anyone', 'an individual', 'a person', 'someone', 'anybody', 'a participant', 'a member', 'a contributor', 'a professional', 'a practitioner', 'an expert', 'a specialist', 'a professional'],
          'they': ['those involved', 'the participants', 'the individuals', 'the members', 'the contributors', 'the stakeholders', 'the parties', 'the participants', 'the actors', 'the players', 'the professionals', 'the practitioners', 'the experts', 'the specialists', 'the professionals']
        };
        return naturalPerspectives[match.toLowerCase() as keyof typeof naturalPerspectives][
          Math.floor(Math.random() * naturalPerspectives[match.toLowerCase() as keyof typeof naturalPerspectives].length)
        ];
      })
      // Add more natural emphasis markers
      .replace(/\b(very|really|quite|extremely)\b/gi, (match) => {
        const naturalEmphasis = {
          'very': ['exceptionally', 'remarkably', 'significantly', 'substantially', 'considerably', 'notably', 'particularly', 'especially', 'extraordinarily', 'immensely', 'tremendously', 'enormously', 'vastly', 'greatly', 'hugely'],
          'really': ['genuinely', 'truly', 'authentically', 'sincerely', 'honestly', 'actually', 'indeed', 'certainly', 'undoubtedly', 'unquestionably', 'absolutely', 'positively', 'definitely', 'surely', 'assuredly'],
          'quite': ['rather', 'fairly', 'relatively', 'moderately', 'somewhat', 'reasonably', 'comparatively', 'proportionately', 'adequately', 'sufficiently', 'acceptably', 'tolerably', 'passably', 'satisfactorily', 'adequately'],
          'extremely': ['exceptionally', 'remarkably', 'significantly', 'substantially', 'considerably', 'notably', 'particularly', 'especially', 'extraordinarily', 'immensely', 'tremendously', 'enormously', 'vastly', 'greatly', 'hugely']
        };
        return naturalEmphasis[match.toLowerCase() as keyof typeof naturalEmphasis][
          Math.floor(Math.random() * naturalEmphasis[match.toLowerCase() as keyof typeof naturalEmphasis].length)
        ];
      })
      // Add more natural sentence starters
      .replace(/^(\s*)([A-Z])/gm, (match, whitespace, firstChar) => {
        if (Math.random() > 0.7) {
          const naturalStarters = [
            'Interestingly, ',
            'Remarkably, ',
            'Notably, ',
            'Significantly, ',
            'Importantly, ',
            'Crucially, ',
            'Essentially, ',
            'Fundamentally, ',
            'Particularly, ',
            'Specifically, ',
            'Notably, ',
            'Importantly, ',
            'Crucially, ',
            'Essentially, ',
            'Fundamentally, '
          ];
          return whitespace + naturalStarters[Math.floor(Math.random() * naturalStarters.length)] + firstChar;
        }
        return match;
      })
      // Add more natural sentence enders
      .replace(/([.!?])\s*([A-Z])/g, (match, punctuation, nextChar) => {
        if (Math.random() > 0.7) {
          const naturalEnders = [
            ' This insight reveals... ',
            ' This understanding leads us to... ',
            ' This perspective suggests... ',
            ' This realization points to... ',
            ' This observation indicates... ',
            ' This finding demonstrates... ',
            ' This analysis shows... ',
            ' This evidence suggests... ',
            ' This pattern reveals... ',
            ' This trend indicates... ',
            ' This discovery points to... ',
            ' This understanding suggests... ',
            ' This perspective indicates... ',
            ' This realization demonstrates... ',
            ' This observation reveals... '
          ];
          return punctuation + naturalEnders[Math.floor(Math.random() * naturalEnders.length)] + nextChar;
        }
        return match;
      })
      // Add natural contractions
      .replace(/\b(it is|they are|we are|you are|he is|she is|that is)\b/gi, (match) => {
        const naturalContractions = {
          'it is': ['it\'s', 'it happens to be', 'it turns out to be', 'it appears to be', 'it seems to be'],
          'they are': ['they\'re', 'they happen to be', 'they turn out to be', 'they appear to be', 'they seem to be'],
          'we are': ['we\'re', 'we happen to be', 'we turn out to be', 'we appear to be', 'we seem to be'],
          'you are': ['you\'re', 'you happen to be', 'you turn out to be', 'you appear to be', 'you seem to be'],
          'he is': ['he\'s', 'he happens to be', 'he turns out to be', 'he appears to be', 'he seems to be'],
          'she is': ['she\'s', 'she happens to be', 'she turns out to be', 'she appears to be', 'she seems to be'],
          'that is': ['that\'s', 'that happens to be', 'that turns out to be', 'that appears to be', 'that seems to be']
        };
        return naturalContractions[match.toLowerCase() as keyof typeof naturalContractions][
          Math.floor(Math.random() * naturalContractions[match.toLowerCase() as keyof typeof naturalContractions].length)
        ];
      })
      // Add natural idioms
      .replace(/\b(in the end|at the end of the day|in the long run)\b/gi, (match) => {
        const naturalIdioms = [
          'when all is said and done',
          'at the end of the day',
          'in the final analysis',
          'when the dust settles',
          'when push comes to shove',
          'when the chips are down',
          'when the rubber meets the road',
          'when the going gets tough',
          'when the tide turns',
          'when the tables turn'
        ];
        return naturalIdioms[Math.floor(Math.random() * naturalIdioms.length)];
      });
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
      category: "Paragraph",
      items: [
        { 
          icon: <Pilcrow className="h-4 w-4" />, 
          action: () => {
            const { from, to } = editor.state.selection;
            editor.chain().focus().setParagraph().run();
            editor.commands.setTextSelection({ from, to });
          }, 
          title: "Paragraph", 
          isActive: editor.isActive('paragraph') 
        },
        { 
          icon: <Type className="h-4 w-4" />, 
          action: () => {
            const { from, to } = editor.state.selection;
            const currentElement = editor.view.domAtPos(from).node as HTMLElement;
            if (currentElement) {
              const currentLineHeight = window.getComputedStyle(currentElement).lineHeight;
              const newLineHeight = currentLineHeight === 'normal' ? '1.5' : 'normal';
              currentElement.style.lineHeight = newLineHeight;
            }
            editor.commands.setTextSelection({ from, to });
          }, 
          title: "Line Height", 
          isActive: false 
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
    },
    {
      category: "Tools",
      items: [
        { 
          icon: <Sparkles className="h-4 w-4" />, 
          action: humanizeContent, 
          title: "Humanize Content" 
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
          <div className="ml-auto flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleUpdate}
                    className="h-8 w-8 p-0"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Update Content</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
          className={`min-h-[300px] p-4 focus-visible:outline-none resize-y prose prose-sm md:prose-lg max-w-none break-words [&_h1]:font-playfair [&_h2]:font-inter [&_h2]:text-lg md:text-xl [&_h3]:font-inter [&_h3]:text-lg md:text-xl [&_p]:mb-4 [&_p:last-child]:mb-0 [&_h1]:mb-4 [&_h1:last-child]:mb-0 [&_h2]:mb-4 [&_h2:last-child]:mb-0 [&_h3]:mb-4 [&_h3:last-child]:mb-0 ${isFullscreen ? 'h-[calc(100vh-3rem)] overflow-y-auto' : ''}`}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
