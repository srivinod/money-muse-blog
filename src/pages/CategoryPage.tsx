
import { useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import BlogPostCard from "@/components/BlogPostCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import { categories, latestPosts, featuredPosts } from "@/data/blogData";
import { Filter, SlidersHorizontal } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Find the current category
  const currentCategory = categories.find(
    (category) => category.slug === categoryName
  );
  
  // If category not found, show all posts based on URL param
  const isAllCategory = categoryName === "all" || !currentCategory;
  
  // Combine all posts
  const allPosts = [...featuredPosts, ...latestPosts];
  
  // Get unique months from post dates
  const getUniqueDates = () => {
    const dates = allPosts.map(post => {
      const date = new Date(post.date);
      return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    });
    return ["all", ...Array.from(new Set(dates))];
  };
  
  const uniqueDates = getUniqueDates();
  
  // Filter posts based on selected filters and URL param
  const getFilteredPosts = () => {
    // Start with the base filter from URL
    let filtered = isAllCategory
      ? allPosts
      : allPosts.filter(
          (post) => post.category.toLowerCase().replace(/\s+/g, '-') === categoryName
        );
    
    // Apply selected category filter if not "all" and if we're on the all posts page
    if (isAllCategory && selectedCategory !== "all") {
      filtered = filtered.filter(
        post => post.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory
      );
    }
    
    // Apply date filter if not "all"
    if (selectedDate !== "all") {
      filtered = filtered.filter(post => {
        const postDate = new Date(post.date);
        const formattedDate = `${postDate.toLocaleString('default', { month: 'long' })} ${postDate.getFullYear()}`;
        return formattedDate === selectedDate;
      });
    }
    
    return filtered;
  };
  
  const filteredPosts = getFilteredPosts();

  // Create title and description
  const title = isAllCategory ? "All Articles" : currentCategory?.title || "Articles";
  const description = isAllCategory 
    ? "Browse all our articles about personal finance and money management"
    : currentCategory?.longDescription || "";

  return (
    <div>
      <PageHeader title={title} description={description} />

      <section className="py-8">
        <div className="container-custom">
          {/* Filter controls */}
          <div className="mb-8">
            <Collapsible 
              open={isFilterOpen}
              onOpenChange={setIsFilterOpen}
              className="w-full space-y-4"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filter Articles
                </h2>
                <CollapsibleTrigger asChild>
                  <button className="flex items-center gap-1 text-sm text-primary font-medium hover:text-primary/80 transition-colors">
                    <SlidersHorizontal className="h-4 w-4" />
                    {isFilterOpen ? "Hide Filters" : "Show Filters"}
                  </button>
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {isAllCategory && (
                    <div>
                      <label htmlFor="category-filter" className="block text-sm font-medium mb-2">
                        Category
                      </label>
                      <Select 
                        value={selectedCategory} 
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger id="category-filter" className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.slug} value={category.slug}>
                              {category.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="date-filter" className="block text-sm font-medium mb-2">
                      Date
                    </label>
                    <Select 
                      value={selectedDate} 
                      onValueChange={setSelectedDate}
                    >
                      <SelectTrigger id="date-filter" className="w-full">
                        <SelectValue placeholder="Select a date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Dates</SelectItem>
                        {uniqueDates.filter(date => date !== "all").map((date) => (
                          <SelectItem key={date} value={date}>
                            {date}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {(selectedCategory !== "all" || selectedDate !== "all") && (
                  <div className="flex justify-end">
                    <button 
                      onClick={() => {
                        setSelectedCategory("all");
                        setSelectedDate("all");
                      }}
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
          
          {/* Results count */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Showing {filteredPosts.length} article{filteredPosts.length !== 1 && 's'}
            </p>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
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
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">No articles found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters to find more articles.
              </p>
              <button 
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedDate("all");
                }}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

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
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
