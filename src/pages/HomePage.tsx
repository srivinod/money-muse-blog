
import { PiggyBank, LineChart, DollarSign, ShoppingBag, Landmark } from "lucide-react";
import { Link } from "react-router-dom";
import BlogPostCard from "@/components/BlogPostCard";
import CategoryCard from "@/components/CategoryCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import { categories, featuredPosts, latestPosts } from "@/data/blogData";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-secondary py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-white/10 bg-[length:20px_20px] z-0"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Master Your Money, <br />
              One Step at a Time
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Practical financial advice and strategies to help you save more, spend wisely, and build the future you deserve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/category/saving" className="bg-white text-primary hover:bg-gray-100 font-semibold px-6 py-3 rounded-md transition-colors duration-300">
                Start Saving
              </Link>
              <Link to="/about" className="bg-transparent hover:bg-white/10 text-white border border-white font-semibold px-6 py-3 rounded-md transition-colors duration-300">
                About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Welcome to Money Muse</h2>
            <p className="text-xl text-gray-700 mb-8">
              Money Muse is your trusted companion on the journey to financial literacy and freedom. 
              We believe that managing money doesn't have to be complicated or stressful. 
              Through straightforward advice, practical strategies, and real-life success stories, 
              we're here to help you take control of your finances with confidence.
            </p>
            <div className="flex justify-center">
              <Link to="/about" className="btn-primary">
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Articles</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our most popular insights to help you navigate your financial journey
            </p>
          </div>
          
          {/* New Featured Layout - Grid with spotlight */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Featured Post - Takes up 2 columns */}
            <div className="lg:col-span-2 lg:row-span-2">
              <Card className="overflow-hidden h-full shadow-md hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <img
                    src={featuredPosts[0].imageUrl}
                    alt={featuredPosts[0].title}
                    className="w-full h-72 object-cover"
                  />
                  <Link 
                    to={`/category/${featuredPosts[0].category.toLowerCase().replace(/\s+/g, '-')}`}
                    className="absolute top-4 left-4 bg-primary/90 text-white text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {featuredPosts[0].category}
                  </Link>
                </div>
                <CardContent className="p-6">
                  <Link to={`/blog/${featuredPosts[0].slug}`}>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 hover:text-primary transition-colors mb-4">
                      {featuredPosts[0].title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 mb-6 text-lg">
                    {featuredPosts[0].excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="mr-1" />
                      <span>{featuredPosts[0].date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User size={14} className="mr-1" />
                      <span>{featuredPosts[0].author}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Secondary Featured Posts - Side grid */}
            {featuredPosts.slice(1, 5).map((post, index) => (
              <Card key={index} className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-40 object-cover"
                  />
                  <Link 
                    to={`/category/${post.category.toLowerCase().replace(/\s+/g, '-')}`}
                    className="absolute top-4 left-4 bg-primary/90 text-white text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {post.category}
                  </Link>
                </div>
                <CardContent className="p-4">
                  <Link to={`/blog/${post.slug}`}>
                    <h3 className="text-lg font-bold text-gray-900 hover:text-primary transition-colors mb-2">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User size={12} />
                      <span>{post.author}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Remaining Featured Posts Carousel */}
          {featuredPosts.length > 5 && (
            <div className="mt-12">
              <h3 className="text-xl font-bold mb-6">More Featured Stories</h3>
              <Carousel className="w-full">
                <CarouselContent>
                  {featuredPosts.slice(5).map((post, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <BlogPostCard 
                        title={post.title}
                        excerpt={post.excerpt}
                        category={post.category}
                        date={post.date}
                        author={post.author}
                        imageUrl={post.imageUrl}
                        slug={post.slug}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center mt-6">
                  <CarouselPrevious className="relative static left-0 translate-y-0 mr-2" />
                  <CarouselNext className="relative static right-0 translate-y-0 ml-2" />
                </div>
              </Carousel>
            </div>
          )}

          <div className="text-center mt-12">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPosts.slice(0, 6).map((post, index) => (
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
