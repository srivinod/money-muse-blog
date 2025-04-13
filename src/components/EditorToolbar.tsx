
import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

interface ToolbarItem {
  icon: React.ReactNode;
  action: () => void;
  title: string;
}

interface ToolbarCategory {
  category: string;
  items: ToolbarItem[];
}

interface EditorToolbarProps {
  formattingOptions: ToolbarCategory[];
}

const EditorToolbar = ({ formattingOptions }: EditorToolbarProps) => {
  const [expandedCategories, setExpandedCategories] = React.useState<Record<string, boolean>>({});

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
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
                        className="h-8 w-8 p-0"
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
  );
};

export default EditorToolbar;
