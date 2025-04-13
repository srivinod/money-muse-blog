
import { useParams } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import BlogPostCard from "@/components/BlogPostCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import { categories, latestPosts, featuredPosts } from "@/data/blogData";

const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  
  // Find the current category
  const currentCategory = categories.find(
    (category) => category.slug === categoryName
  );
  
  // If category not found, show all posts
  const isAllCategory = categoryName === "all" || !currentCategory;
  
  // Filter posts by category (or show all)
  const allPosts = [...featuredPosts, ...latestPosts];
  const filteredPosts = isAllCategory
    ? allPosts
    : allPosts.filter(
        (post) => post.category.toLowerCase().replace(/\s+/g, '-') === categoryName
      );

  // Create title and description
  const title = isAllCategory ? "All Articles" : currentCategory?.title || "Articles";
  const description = isAllCategory 
    ? "Browse all our articles about personal finance and money management"
    : currentCategory?.longDescription || "";

  return (
    <div>
      <PageHeader title={title} description={description} />

      <section className="py-16">
        <div className="container-custom">
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
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold mb-4">No articles found</h3>
              <p className="text-gray-600">
                We're working on adding content to this category. Check back soon!
              </p>
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
