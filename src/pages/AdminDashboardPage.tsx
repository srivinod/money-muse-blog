
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mailbox, Users, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const AdminDashboardPage = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [contactSubmissions, setContactSubmissions] = useState<any[]>([]);
  const [newsletterSubscriptions, setNewsletterSubscriptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate("/login");
    } else {
      fetchData();
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching contact submissions...");
      // Fetch contact submissions with detailed logging
      const { data: contactData, error: contactError } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (contactError) {
        console.error("Error fetching contact submissions:", contactError);
        setError(`Failed to fetch contact submissions: ${contactError.message}`);
        throw contactError;
      }
      
      console.log("Contact submissions retrieved:", contactData);
      setContactSubmissions(contactData || []);

      console.log("Fetching newsletter subscriptions...");
      // Fetch newsletter subscriptions
      const { data: newsletterData, error: newsletterError } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (newsletterError) {
        console.error("Error fetching newsletter subscriptions:", newsletterError);
        setError(`Failed to fetch newsletter subscriptions: ${newsletterError.message}`);
        throw newsletterError;
      }
      
      console.log("Newsletter subscriptions retrieved:", newsletterData);
      setNewsletterSubscriptions(newsletterData || []);
      
      toast({
        title: "Data refreshed",
        description: `Retrieved ${contactData?.length || 0} contact submissions and ${newsletterData?.length || 0} newsletter subscriptions.`,
      });
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: `Failed to load dashboard data: ${error.message}`,
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
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
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
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">Error loading data</h4>
                <p className="text-red-700 text-sm">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 text-red-700 border-red-300 hover:bg-red-50"
                  onClick={handleRefresh}
                >
                  Try again
                </Button>
              </div>
            </div>
          )}
          
          <Tabs defaultValue="contact">
            <TabsList className="mb-6">
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <Mailbox className="h-4 w-4" />
                Contact Submissions
                {contactSubmissions.length > 0 && (
                  <span className="bg-primary/10 text-primary text-xs rounded-full px-2 py-0.5 ml-1">
                    {contactSubmissions.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="newsletter" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Newsletter Subscribers
                {newsletterSubscriptions.length > 0 && (
                  <span className="bg-primary/10 text-primary text-xs rounded-full px-2 py-0.5 ml-1">
                    {newsletterSubscriptions.length}
                  </span>
                )}
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
                                <TooltipContent className="max-w-sm p-4 bg-white">
                                  <p className="whitespace-normal">{submission.message}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell>{formatDate(submission.created_at)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {contactSubmissions.length > 5 && (
                    <div className="mt-4 text-right">
                      <Button variant="outline" size="sm">
                        View All ({contactSubmissions.length}) Submissions
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-md">
                  <Mailbox className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500 mb-1">No contact submissions yet.</p>
                  <p className="text-gray-400 text-sm">When users submit the contact form, their messages will appear here.</p>
                </div>
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
                  {newsletterSubscriptions.length > 5 && (
                    <div className="mt-4 text-right">
                      <Button variant="outline" size="sm">
                        View All ({newsletterSubscriptions.length}) Subscribers
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-md">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500 mb-1">No newsletter subscriptions yet.</p>
                  <p className="text-gray-400 text-sm">When users subscribe to your newsletter, they will appear here.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
