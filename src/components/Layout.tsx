import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogPostBySlug } from "@/services/blogService";

const Layout = () => {
  const location = useLocation();
  
  // Check if we're on a blog post page
  const isBlogPost = location.pathname.startsWith('/blog/');
  const slug = isBlogPost ? location.pathname.split('/blog/')[1] : null;
  
  // Fetch blog post data if we're viewing a blog post
  const { data: blogPost } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => fetchBlogPostBySlug(slug as string),
    enabled: !!slug, // Only run query if we have a slug
  });
  
  useEffect(() => {
    // Update meta tags based on current route
    const updateMetaTags = () => {
      const path = location.pathname;
      let title = "Money Muse - Master Your Money, One Step at a Time";
      let description = "Money Muse provides practical financial advice and strategies to help you save more, spend wisely, and build the future you deserve.";
      
      // If we're on a blog post page and have post data, use its meta information
      if (isBlogPost && blogPost) {
        title = blogPost.metaTitle || blogPost.title;
        description = blogPost.metaDescription || blogPost.excerpt;
      } 
      // Otherwise set route-specific meta data
      else if (path.includes('/category/')) {
        const category = path.split('/category/')[1];
        if (category === 'all') {
          title = "All Articles - Money Muse";
          description = "Browse our complete collection of financial advice articles to help you manage your money better.";
        } else if (category === 'budgeting') {
          title = "Budgeting Tips & Strategies - Money Muse";
          description = "Learn effective budgeting strategies to take control of your finances and reach your financial goals.";
        } else if (category === 'investing') {
          title = "Investing Guides & Tips - Money Muse";
          description = "Discover smart investing strategies for beginners and experienced investors to build wealth.";
        } else if (category === 'saving') {
          title = "Saving Strategies & Tips - Money Muse";
          description = "Practical advice to help you save more money and reach your financial goals faster.";
        } else if (category === 'debt') {
          title = "Debt Management & Reduction - Money Muse";
          description = "Learn how to manage, reduce, and eliminate debt with our expert strategies and tips.";
        }
      } else if (path === '/about') {
        title = "About Us - Money Muse";
        description = "Learn about our mission to help everyone achieve financial freedom through education and practical advice.";
      } else if (path === '/contact') {
        title = "Contact Us - Money Muse";
        description = "Get in touch with our team for questions, feedback, or partnership opportunities.";
      } else if (path === '/resources') {
        title = "Financial Resources - Money Muse";
        description = "Access our collection of tools, calculators, and guides to improve your financial literacy.";
      }
      
      // Update document title and meta description
      document.title = title;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", description);
      }
      
      // Update OG and Twitter meta tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      
      if (ogTitle) ogTitle.setAttribute("content", title);
      if (ogDescription) ogDescription.setAttribute("content", description);
      if (twitterTitle) twitterTitle.setAttribute("content", title);
      if (twitterDescription) twitterDescription.setAttribute("content", description);
      
      // Update canonical URL
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute("href", `https://finance90.com${path}`);
      }
    };
    
    updateMetaTags();
  }, [location, blogPost, isBlogPost]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
