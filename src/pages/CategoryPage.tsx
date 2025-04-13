
import { useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import BlogPostCard from "@/components/BlogPostCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import AdSense from "@/components/AdSense";
import { categories, latestPosts, featuredPosts } from "@/data/blogData";
import { Button } from "@/components/ui/button";

const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryName || "all");
  
  // Find the current category
  const currentCategory = categories.find(
    (category) => category.slug === categoryName
  );
  
  // If category not found, show all posts based on URL param
  const isAllCategory = categoryName === "all" || !currentCategory;
  
  // Combine all posts
  const allPosts = [...featuredPosts, ...latestPosts];
  
  // Filter posts based on selected category
  const getFilteredPosts = () => {
    // If we're on the "all" page and a specific category is selected
    if (isAllCategory && selectedCategory !== "all") {
      return allPosts.filter(
        post => post.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory
      );
    }
    
    // If we're on a specific category page, only show that category
    if (!isAllCategory) {
      return allPosts.filter(
        (post) => post.category.toLowerCase().replace(/\s+/g, '-') === categoryName
      );
    }
    
    // Otherwise show all posts
    return allPosts;
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

      {/* First AdSense placement - after page header */}
      <div className="container-custom">
        <AdSense slot="1234567890" format="horizontal" />
      </div>

      <section className="py-8">
        <div className="container-custom">
          {/* Show category filter buttons only on All Articles page */}
          {isAllCategory && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Filter by Category</h2>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("all")}
                  className="mb-2"
                >
                  All Categories
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.slug}
                    variant={selectedCategory === category.slug ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.slug)}
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
              Showing {filteredPosts.length} article{filteredPosts.length !== 1 && 's'}
            </p>
          </div>

          {filteredPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, index) => (
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
                    {/* Insert AdSense after every 3 posts */}
                    {(index + 1) % 3 === 0 && index < filteredPosts.length - 1 && (
                      <div className="col-span-full my-6">
                        <AdSense slot="4567890123" format="horizontal" />
                      </div>
                    )}
                  </>
                ))}
              </div>
              
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
                onClick={() => setSelectedCategory("all")}
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
