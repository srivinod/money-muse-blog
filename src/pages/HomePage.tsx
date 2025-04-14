import React from 'react';  // Ensure React is imported at the top
import { PiggyBank, LineChart, DollarSign, ShoppingBag, Landmark, Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import BlogPostCard from "@/components/BlogPostCard";
import CategoryCard from "@/components/CategoryCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import AdSense from "@/components/AdSense";
import { categories } from "@/data/blogData";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchFeaturedPosts, fetchLatestPosts } from "@/services/blogService";

const HomePage = () => {
  // Fetch featured posts from Supabase
  const { 
    data: featuredPosts = [], 
    isLoading: isFeaturedLoading,
    error: featuredError
  } = useQuery({
    queryKey: ['featured-posts'],
    queryFn: fetchFeaturedPosts
  });

  // Fetch latest posts from Supabase
  const { 
    data: latestPosts = [], 
    isLoading: isLatestLoading,
    error: latestError
  } = useQuery({
    queryKey: ['latest-posts'],
    queryFn: fetchLatestPosts
  });

  // Check if we have posts to display
  const hasFeaturedPosts = featuredPosts.length > 0;
  const hasLatestPosts = latestPosts.length > 0;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-white py-20 md:py-15 text-center">
        <div className="absolute inset-0 bg-grid-white/10 bg-[length:20px_20px] z-0"></div>
        
        {/* Decorative Money Shapes */}
        <div className="absolute inset-0 overflow-hidden z-0">
          {/* Diamond Shape */}
          <div className="absolute top-20 left-10 w-16 h-16 opacity-10">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-primary">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          
          {/* Credit Card */}
          <div className="absolute top-40 right-20 w-12 h-12 opacity-10">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-primary">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M3 9H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M7 12H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M7 15H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          
          {/* Simple Circle */}
          <div className="absolute bottom-20 left-1/4 w-14 h-14 opacity-10">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-primary">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          
          {/* Plus Shape */}
          <div className="absolute bottom-40 right-1/3 w-10 h-10 opacity-10">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-primary">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>

          {/* Additional Credit Card */}
          <div className="absolute top-60 left-1/3 w-10 h-10 opacity-10">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-primary">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M3 9H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M7 12H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Simple Circle */}
          <div className="absolute bottom-60 right-1/4 w-12 h-12 opacity-10">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-primary">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>

          {/* Simple Circle */}
          <div className="absolute top-80 left-1/4 w-10 h-10 opacity-10">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-primary">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center text-gray-900">
            <h1 className="text-4xl md:text-5xl font-bold mb-5 animate-fade-in">
              Master Your Money, <br />
              One Step at a Time
            </h1>
            <p className="text-xl md:text-xl mb-8 text-gray-700">
              Practical financial advice and strategies to help you save more, spend wisely, and build the future you deserve.
            </p>
            <Link to="/category/all" className="group inline-flex items-center gap-2 bg-primary text-white hover:bg-primary-dark font-semibold px-6 py-3 rounded-md transition-all duration-300">
              Learn How
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-left mb-6">
            <h2 className="text-3xl md:text-3xl font-bold mb-4">Featured Articles</h2> 
          </div>
          
          {isFeaturedLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading featured articles...</p>
            </div>
          ) : featuredError ? (
            <div className="text-center py-12">
              <p className="text-red-500">Error loading featured articles. Please try again later.</p>
            </div>
          ) : !hasFeaturedPosts ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No featured articles available at the moment.</p>
            </div>
          ) : (
            <>
              {/* Featured Layout - Main featured post with one card beside it */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">
                {/* Main Featured Post - takes 8 columns on md screens */}
                <div className="md:col-span-8">
                  <Card className="overflow-hidden h-full shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="relative">
                      <img
                        src={featuredPosts[0]?.imageUrl || "/placeholder.svg"}
                        alt={featuredPosts[0]?.title || "Featured post"}
                        className="w-full h-56 object-cover"
                      />
                      {featuredPosts[0]?.category && (
                        <Link 
                          to={`/category/${featuredPosts[0].category.toLowerCase().replace(/\s+/g, '-')}`}
                          className="absolute top-4 left-4 bg-primary/90 text-white text-xs font-medium px-3 py-1 rounded-full"
                        >
                          {featuredPosts[0].category}
                        </Link>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <Link to={`/blog/${featuredPosts[0]?.slug || "#"}`}>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 hover:text-primary transition-colors mb-4">
                          {featuredPosts[0]?.title || "Featured post"}
                        </h3>
                      </Link>
                      <p className="text-gray-600 mb-6 text-lg">
                        {featuredPosts[0]?.excerpt || "No excerpt available"}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} className="mr-1" />
                          <span>{featuredPosts[0]?.date || "No date"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User size={14} className="mr-1" />
                          <span>{featuredPosts[0]?.author || "Unknown author"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Second Featured Post - takes 4 columns on md screens */}
                {featuredPosts.length > 1 && (
                  <div className="md:col-span-4">
                    <BlogPostCard 
                      title={featuredPosts[1].title}
                      excerpt={featuredPosts[1].excerpt}
                      category={featuredPosts[1].category}
                      date={featuredPosts[1].date}
                      author={featuredPosts[1].author}
                      imageUrl={featuredPosts[1].imageUrl}
                      slug={featuredPosts[1].slug}
                      featured={true}
                    />
                  </div>
                )}
              </div>
              
              {/* Second AdSense placement - between featured sections */}
              <AdSense slot="7890123456" />
              
              {/* Additional Featured Posts in smaller cards */}
              {featuredPosts.length > 2 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {featuredPosts.slice(2, 5).map((post, index) => (
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
              )}
            </>
          )}

          <div className="text-center mt-8">
            <Link to="/category/all" className="btn-outline">
              View All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Categories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dive into our specialized topics to find exactly what you're looking for
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <CategoryCard 
                key={index}
                title={category.title}
                description={category.description}
                icon={category.icon}
                slug={category.slug}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Third AdSense placement - before newsletter */}
      <div className="container-custom">
        <AdSense slot="5678901234" format="rectangle" />
      </div>

      {/* Newsletter Section */}
      <NewsletterSignup />

      {/* Latest Posts Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Articles</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fresh insights and advice to keep you informed
            </p>
          </div>
          
          {isLatestLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading latest articles...</p>
            </div>
          ) : latestError ? (
            <div className="text-center py-12">
              <p className="text-red-500">Error loading latest articles. Please try again later.</p>
            </div>
          ) : !hasLatestPosts ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No latest articles available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.slice(0, 6).map((post, index) => (
                <React.Fragment key={post.id}>
                  <BlogPostCard 
                    title={post.title}
                    excerpt={post.excerpt}
                    category={post.category}
                    date={post.date}
                    author={post.author}
                    imageUrl={post.imageUrl}
                    slug={post.slug}
                  />
                  {index === 2 && (
                    <div className="col-span-full my-6">
                      <AdSense slot="9012345678" format="horizontal" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/category/all" className="btn-outline">
              View All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container-custom text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Finances?</h2>
            <p className="text-xl mb-8">
              Start your journey to financial freedom with our practical guides and tools.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/resources" className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-6 py-3 rounded-md transition-colors duration-300">
                Explore Resources
              </Link>
              <Link to="/category/budgeting" className="bg-transparent hover:bg-white/10 text-white border border-white font-semibold px-6 py-3 rounded-md transition-colors duration-300">
                Start Budgeting
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
