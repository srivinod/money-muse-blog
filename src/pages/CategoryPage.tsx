import { useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import BlogPostCard from "@/components/BlogPostCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import AdSense from "@/components/AdSense";
import { categories } from "@/data/blogData";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogPostsByCategory } from "@/services/blog/fetchPosts";

const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryName || "all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage = 6; // Number of posts to display per page
  
  // Find the current category
  const currentCategory = categories.find(
    (category) => category.slug === categoryName
  );
  
  // If category not found, show all posts based on URL param
  const isAllCategory = categoryName === "all" || !currentCategory;

  // Fetch posts from the database
  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['blog-posts', selectedCategory],
    queryFn: () => fetchBlogPostsByCategory(selectedCategory),
  });
  
  // Filter posts based on selected category
  const filteredPosts = posts;
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  
  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Create title and description
  const title = isAllCategory ? "All Articles" : currentCategory?.title || "Articles";
  const description = isAllCategory 
    ? "Browse all our articles about personal finance and money management"
    : currentCategory?.longDescription || "";

  if (isLoading) {
    return (
      <div className="container-custom py-16">
        <div className="text-center">
          <p>Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-16">
        <div className="text-center">
          <p className="text-red-500">Error loading articles. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={title} description={description} />

      {/* First AdSense placement - after page header */}
      <div className="container-custom">
        <AdSense slot="1234567890" format="horizontal" />
      </div>

      <section className="py-8">
        <div className="container-custom">
          {/* Show category filter buttons only on All Articles page */}
          {isAllCategory && (
            <div className="mb-8 flex flex-col items-center"> {/* Added flex and center alignment */}
              <h2 className="text-2xl font-semibold mb-4 text-center">Filter by Category</h2>
              <div className="flex flex-wrap gap-2 justify-center"> {/* Added justify-center */}
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  onClick={() => {
                    setSelectedCategory("all");
                    setCurrentPage(1); // Reset to first page when changing category
                  }}
                  className="mb-2"
                >
                  All Categories
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.slug}
                    variant={selectedCategory === category.slug ? "default" : "outline"}
                    onClick={() => {
                      setSelectedCategory(category.slug);
                      setCurrentPage(1); // Reset to first page when changing category
                    }}
                    className="mb-2"
                  >
                    {category.title}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Results count */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Showing {indexOfFirstPost + 1}-{Math.min(indexOfLastPost, filteredPosts.length)} of {filteredPosts.length} article{filteredPosts.length !== 1 && 's'}
            </p>
          </div>

          {filteredPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentPosts.map((post, index) => (
                  <>
                    <BlogPostCard
                      key={index}
                      title={post.title}
                      excerpt={post.excerpt}
                      category={post.category}
                      date={post.date}
                      author={post.author}
                      imageUrl={post.imageUrl}
                      slug={post.slug}
                    /> 
                  </>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination>
                    <PaginationContent>
                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                        </PaginationItem>
                      )}
                      
                      {Array.from({ length: totalPages }).map((_, index) => {
                        const pageNumber = index + 1;
                        // Show first, last, and current page with its neighbors
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                isActive={pageNumber === currentPage}
                                onClick={() => handlePageChange(pageNumber)}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                        return null;
                      })}
                      
                      {currentPage < totalPages && (
                        <PaginationItem>
                          <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
              
              {/* Additional AdSense after posts */}
              {filteredPosts.length > 3 && (
                <div className="my-12">
                  <AdSense slot="8901234567" format="rectangle" />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">No articles found</h3>
              <p className="text-gray-600 mb-6">
                Try selecting a different category to find more articles.
              </p>
              <Button 
                onClick={() => {
                  setSelectedCategory("all");
                  setCurrentPage(1);
                }}
              >
                Show All Articles
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* AdSense before Newsletter */}
      <div className="container-custom mb-8">
        <AdSense slot="6789012345" format="horizontal" />
      </div>

      <NewsletterSignup />

      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Explore Other Categories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover more financial topics that might interest you
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories
              .filter((category) => category.slug !== categoryName)
              .map((category, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-primary/10 rounded-full mb-4">
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <a
                      href={`/category/${category.slug}`}
                      className="text-primary hover:text-primary-dark font-medium inline-flex items-center transition-colors"
                    >
                      View Articles
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
          </div>
          
          {/* Final AdSense at bottom of the page */}
          <div className="mt-12">
            <AdSense slot="9012345678" format="horizontal" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
