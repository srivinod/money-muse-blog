import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Search, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const SubscribersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10;
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate("/login");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const fetchSubscribers = async ({ page = 1, search = "" }) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    try {
      console.log("Fetching subscribers...");
      
      // Check authentication status
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError) {
        console.error("Auth error:", authError);
        throw new Error("Authentication error");
      }

      if (!session) {
        console.error("No active session");
        throw new Error("Not authenticated");
      }

      console.log("User is authenticated:", session.user.email);
      
      // Base query
      let query = supabase
        .from("newsletter_subscriptions")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      // Add search filter if search term exists
      if (search) {
        query = query.ilike("email", `%${search}%`);
      }

      // Add pagination
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (error) {
        console.error("Error fetching subscribers:", error);
        console.error("Error details:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw new Error(error.message);
      }

      console.log("Fetched data:", data);
      console.log("Number of records fetched:", data?.length);
      console.log("Total count:", count);

      return {
        subscribers: data || [],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize)
      };
    } catch (error) {
      console.error("Error in fetchSubscribers:", error);
      throw error;
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["subscribers", currentPage, searchTerm],
    queryFn: () => fetchSubscribers({ page: currentPage, search: searchTerm }),
    retry: 1,
    enabled: isAuthenticated && isAdmin,
  });

  const deleteSubscriber = async (id: string) => {
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Invalidate all subscriber queries with the correct query key
      await queryClient.invalidateQueries({ 
        queryKey: ["subscribers", currentPage, searchTerm],
        exact: false,
        refetchType: 'all'
      });
      
      toast({
        title: "Success",
        description: "Subscriber deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      toast({
        title: "Error",
        description: "Failed to delete subscriber",
        variant: "destructive",
      });
    }
  };

  const { mutate: deleteSubscriberMutation } = useMutation({
    mutationFn: deleteSubscriber,
  });

  if (error) {
    toast({
      title: "Error loading subscribers",
      description: error.message,
      variant: "destructive",
    });
  }

  return (
    <div>
      <PageHeader
        title="Newsletter Subscribers"
        description="View all newsletter subscribers"
        center={false}
      />

      <div className="container py-8">
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <Link to="/admin/dashboard">
              <Button variant="outline" size="sm" className="mr-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
              </Button>
            </Link>
            <h2 className="text-xl font-bold">Total Subscribers: {data?.totalCount || 0}</h2>
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading subscribers...</div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Subscription Date</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.subscribers && data.subscribers.length > 0 ? (
                    data.subscribers.map((subscriber) => (
                      <TableRow key={subscriber.id}>
                        <TableCell>{subscriber.email}</TableCell>
                        <TableCell>
                          {format(new Date(subscriber.created_at), "PPP")}
                        </TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete this subscriber. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteSubscriberMutation(subscriber.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4">
                        {searchTerm ? "No matching subscribers found" : "No subscribers found"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {data?.totalPages && data.totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(currentPage - 1)} 
                        />
                      </PaginationItem>
                    )}
                    
                    {Array.from({ length: data.totalPages }).map((_, index) => {
                      const page = index + 1;
                      // Only show a few page numbers to avoid clutter
                      if (
                        page === 1 ||
                        page === data.totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              isActive={page === currentPage}
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}

                    {currentPage < data.totalPages && (
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(currentPage + 1)} 
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SubscribersPage;
