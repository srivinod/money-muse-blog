
import React from 'react';
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { featuredPosts, latestPosts } from "@/data/blogData";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import AdSense from "@/components/AdSense";

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    // Find the post with the matching slug from both featured and latest posts
    const allPosts = [...featuredPosts, ...latestPosts];
    const foundPost = allPosts.find(p => p.slug === slug);
    
    if (foundPost) {
      setPost(foundPost);
      
      // Find related posts in the same category
      const related = allPosts
        .filter(p => p.category === foundPost.category && p.slug !== slug)
        .slice(0, 3);
      setRelatedPosts(related);
    } else {
      toast({
        title: "Post not found",
        description: "Sorry, we couldn't find the article you're looking for.",
        variant: "destructive"
      });
    }
  }, [slug, toast]);

  if (!post) {
    return (
      <div className="container-custom py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Article Not Found</h1>
          <p className="text-gray-600 mb-8">
            We couldn't find the article you're looking for. It might have been moved or doesn't exist.
          </p>
          <Link to="/" className="btn-primary">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      {/* Left AdSense sidebar - only visible on md screens and up */}
      <div className="hidden md:block sticky top-24 self-start" style={{ width: '160px' }}>
        <AdSense
          slot="left-sidebar"
          format="vertical"
          className="h-screen"
        />
      </div>
      
      {/* Main content with reduced width */}
      <div className="max-w-3xl mx-4 py-8 md:py-12">
        <div className="mb-8">
          <Link to={`/category/${post.category.toLowerCase().replace(/\s+/g, '-')}`} className="inline-flex items-center text-primary hover:underline mb-4">
            <ArrowLeft size={16} className="mr-1" />
            Back to {post.category}
          </Link>
        </div>
        
        <Card className="overflow-hidden border-none shadow-md">
          <img 
            src={post.imageUrl} 
            alt={post.title}
            className="w-full h-[400px] object-cover"
          />
          
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold mb-6">{post.title}</h1>
            
            <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <Link 
                to={`/category/${post.category.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium"
              >
                {post.category}
              </Link>
              <div className="flex items-center gap-1">
                <Calendar size={14} className="mr-1" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <User size={14} className="mr-1" />
                <span>{post.author}</span>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 mb-4">
                {post.excerpt}
              </p>
              
              {/* Simulated blog content */}
              <p className="mb-4">
                Financial literacy is a cornerstone of a stable and secure future. Understanding how to manage your money effectively can make the difference between living paycheck to paycheck and building long-term wealth.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Why This Matters</h2>
              <p className="mb-4">
                In today's complex financial landscape, making informed decisions about your money is more important than ever. Whether you're saving for retirement, planning a major purchase, or simply trying to make ends meet, having a solid grasp of financial principles can help you achieve your goals.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Key Takeaways</h2>
              <ul className="list-disc pl-6 mb-6">
                <li className="mb-2">Start early and be consistent with your financial planning</li>
                <li className="mb-2">Understand the power of compound interest and time in the market</li>
                <li className="mb-2">Create a budget that aligns with your values and goals</li>
                <li className="mb-2">Build an emergency fund before focusing on other financial goals</li>
                <li className="mb-2">Regularly review and adjust your financial strategies</li>
              </ul>
              
              <p className="mb-4">
                Remember that financial wellness is a journey, not a destination. By taking small, consistent steps toward your goals, you can create a more secure and prosperous future for yourself and your loved ones.
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Related posts section */}
        {relatedPosts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related, index) => (
                <div key={index} className="border rounded-lg overflow-hidden shadow-md">
                  <img 
                    src={related.imageUrl} 
                    alt={related.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{related.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{related.excerpt}</p>
                    <Link 
                      to={`/blog/${related.slug}`} 
                      className="text-primary hover:underline"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      
      {/* Right AdSense sidebar - only visible on md screens and up */}
      <div className="hidden md:block sticky top-24 self-start" style={{ width: '160px' }}>
        <AdSense
          slot="right-sidebar"
          format="vertical"
          className="h-screen"
        />
      </div>
    </div>
  );
};

export default BlogDetailPage;
