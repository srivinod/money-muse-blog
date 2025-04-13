
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface BlogFormActionsProps {
  isLoading: boolean;
  isEditMode: boolean;
}

const BlogFormActions = ({ isLoading, isEditMode }: BlogFormActionsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-end gap-4">
      <Button type="button" variant="outline" onClick={() => navigate("/admin/posts")}>
        Cancel
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : isEditMode ? "Update Post" : "Create Post"}
      </Button>
    </div>
  );
};

export default BlogFormActions;
