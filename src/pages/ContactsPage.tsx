
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const ContactsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchContacts = async ({ page = 1 }) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // First, get the total count
    const { count } = await supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true });
    
    // Then get the data for the current page
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      throw new Error(error.message);
    }

    return {
      contacts: data || [],
      totalCount: count || 0,
      totalPages: Math.ceil((count || 0) / pageSize)
    };
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["contacts", currentPage],
    queryFn: () => fetchContacts({ page: currentPage }),
  });

  if (error) {
    toast({
      title: "Error loading contact submissions",
      description: error.message,
      variant: "destructive",
    });
  }

  return (
    <div>
      <PageHeader
        title="Contact Form Submissions"
        description="Review all contact form submissions"
        center={false}
      />

      <div className="container py-8">
        <div className="mb-6 flex items-center">
          <Link to="/admin/dashboard">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
          <h2 className="text-xl font-bold">Total Submissions: {data?.totalCount || 0}</h2>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading contact submissions...</div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.contacts && data.contacts.length > 0 ? (
                    data.contacts.map((contact) => {
                      // Truncate message for table display
                      const truncatedMessage = 
                        contact.message.length > 50 
                          ? `${contact.message.substring(0, 50)}...` 
                          : contact.message;
                      
                      return (
                        <TableRow key={contact.id}>
                          <TableCell>{contact.name}</TableCell>
                          <TableCell>{contact.email}</TableCell>
                          <TableCell>
                            {format(new Date(contact.created_at), "PPP")}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {truncatedMessage}
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">View</Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>Contact from {contact.name}</DialogTitle>
                                  <DialogDescription>
                                    {format(new Date(contact.created_at), "PPP")}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 mt-2">
                                  <div>
                                    <h4 className="font-medium">Email:</h4>
                                    <p>{contact.email}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Message:</h4>
                                    <p className="whitespace-pre-wrap">{contact.message}</p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No contact submissions found
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

export default ContactsPage;
