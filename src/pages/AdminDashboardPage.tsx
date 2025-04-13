
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mailbox, Users, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const AdminDashboardPage = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [contactSubmissions, setContactSubmissions] = useState<any[]>([]);
  const [newsletterSubscriptions, setNewsletterSubscriptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate("/login");
    } else {
      fetchData();
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching contact submissions...");
      // Fetch contact submissions
      const { data: contactData, error: contactError } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (contactError) {
        console.error("Error fetching contact submissions:", contactError);
        throw contactError;
      }
      
      console.log("Contact submissions retrieved:", contactData);
      setContactSubmissions(contactData || []);

      console.log("Fetching newsletter subscriptions...");
      // Fetch newsletter subscriptions
      const { data: newsletterData, error: newsletterError } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (newsletterError) {
        console.error("Error fetching newsletter subscriptions:", newsletterError);
        throw newsletterError;
      }
      
      console.log("Newsletter subscriptions retrieved:", newsletterData);
      setNewsletterSubscriptions(newsletterData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return "Invalid date";
    }
  };

  return (
    <div>
      <PageHeader 
        title="Admin Dashboard" 
        description="Manage your blog content"
      />
      
      <div className="container py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Welcome, Admin</h2>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Blog Posts</h3>
            <p className="text-gray-600 mb-4">Create, edit, and manage your blog posts</p>
            <Link to="/admin/posts">
              <Button>Manage Posts</Button>
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Categories</h3>
            <p className="text-gray-600 mb-4">Organize your content with categories</p>
            <Link to="/admin/categories">
              <Button variant="outline">Manage Categories</Button>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Recent Activity</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh} 
              disabled={isLoading || refreshing}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>
          
          <Tabs defaultValue="contact">
            <TabsList className="mb-6">
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <Mailbox className="h-4 w-4" />
                Contact Submissions
              </TabsTrigger>
              <TabsTrigger value="newsletter" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Newsletter Subscribers
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="contact">
              {isLoading ? (
                <p className="text-center py-4">Loading submissions...</p>
              ) : contactSubmissions.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contactSubmissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell className="font-medium">{submission.name}</TableCell>
                          <TableCell>{submission.email}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help">{submission.message}</span>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-sm">
                                  <p>{submission.message}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell>{formatDate(submission.created_at)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-4 text-right">
                    <Button variant="outline" size="sm">
                      View All Submissions
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-center py-4 text-gray-500">No contact submissions yet.</p>
              )}
            </TabsContent>
            
            <TabsContent value="newsletter">
              {isLoading ? (
                <p className="text-center py-4">Loading subscribers...</p>
              ) : newsletterSubscriptions.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Date Subscribed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {newsletterSubscriptions.map((subscription) => (
                        <TableRow key={subscription.id}>
                          <TableCell className="font-medium">{subscription.email}</TableCell>
                          <TableCell>{formatDate(subscription.created_at)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-4 text-right">
                    <Button variant="outline" size="sm">
                      View All Subscribers
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-center py-4 text-gray-500">No newsletter subscriptions yet.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
