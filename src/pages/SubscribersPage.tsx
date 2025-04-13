
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const SubscribersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchSubscribers = async ({ page = 1 }) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // First, get the total count
    const { count } = await supabase
      .from("newsletter_subscriptions")
      .select("*", { count: "exact", head: true });
    
    // Then get the data for the current page
    const { data, error } = await supabase
      .from("newsletter_subscriptions")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      throw new Error(error.message);
    }

    return {
      subscribers: data || [],
      totalCount: count || 0,
      totalPages: Math.ceil((count || 0) / pageSize)
    };
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["subscribers", currentPage],
    queryFn: () => fetchSubscribers({ page: currentPage }),
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
        <div className="mb-6 flex items-center">
          <Link to="/admin/dashboard">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
          <h2 className="text-xl font-bold">Total Subscribers: {data?.totalCount || 0}</h2>
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
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-4">
                        No subscribers found
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
