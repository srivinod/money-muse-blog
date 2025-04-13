
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Mail, MessageSquare, FileText, ClipboardList } from "lucide-react";

const AdminDashboardCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
          <CardDescription>Create, edit, and manage your blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/admin/posts">
                  <Button>Manage Posts</Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add, edit, or delete blog posts</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Organize your content with categories</CardDescription>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/admin/categories">
                  <Button variant="outline">Manage Categories</Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add, edit, or delete categories</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Newsletter Subscribers
          </CardTitle>
          <CardDescription>View all newsletter subscribers</CardDescription>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/admin/subscribers">
                  <Button variant="outline">View Subscribers</Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>View all newsletter subscribers</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
             Contact Forms
          </CardTitle>
          <CardDescription>Review contact form submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/admin/contacts">
                  <Button variant="outline">View Submissions</Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Review contact form submissions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardCards;
