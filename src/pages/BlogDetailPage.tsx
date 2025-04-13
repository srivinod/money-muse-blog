
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { featuredPosts, latestPosts } from "@/data/blogData";
import PageHeader from "@/components/PageHeader";
import BlogPostCard from "@/components/BlogPostCard";
import AdSense from "@/components/AdSense";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

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
    <div>
      {/* Page header */}
      <PageHeader 
        title={post.title} 
        description="Practical financial advice and insights to improve your finances"
      />
      
      {/* First AdSense placement - after page header */}
      <div className="container-custom">
        <AdSense slot="2345678901" format="horizontal" />
      </div>
      
      {/* Main blog content */}
      <section className="py-8 md:py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto mb-8">
            <Link to={`/category/${post.category.toLowerCase().replace(/\s+/g, '-')}`} className="inline-flex items-center text-primary hover:underline mb-4">
              <ArrowLeft size={16} className="mr-1" />
              Back to {post.category}
            </Link>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden border-none shadow-md">
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="w-full h-[400px] object-cover"
              />
              
              <CardContent className="p-8">
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
                
                <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>
                
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg text-gray-700 mb-4">
                    {post.excerpt}
                  </p>
                  
                  {/* Simulated blog content */}
                  <p className="mb-4">
                    Financial literacy is a cornerstone of a stable and secure future. Understanding how to manage your money effectively can make the difference between living paycheck to paycheck and building long-term wealth.
                  </p>
                  
                  {/* AdSense placement within content */}
                  <div className="my-8">
                    <AdSense slot="3456789012" format="rectangle" />
                  </div>
                  
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
                  
                  {/* Second AdSense placement within content */}
                  <div className="my-8">
                    <AdSense slot="4567890123" format="horizontal" />
                  </div>
                  
                  <p className="mb-4">
                    Remember that financial wellness is a journey, not a destination. By taking small, consistent steps toward your goals, you can create a more secure and prosperous future for yourself and your loved ones.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* AdSense before related posts */}
      <div className="container-custom mb-8">
        <AdSense slot="5678901234" format="horizontal" />
      </div>
      
      {/* Related posts section */}
      {relatedPosts.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related, index) => (
                <BlogPostCard
                  key={index}
                  title={related.title}
                  excerpt={related.excerpt}
                  category={related.category}
                  date={related.date}
                  author={related.author}
                  imageUrl={related.imageUrl}
                  slug={related.slug}
                />
              ))}
            </div>
            
            {/* Final AdSense at bottom of related posts */}
            <div className="mt-12">
              <AdSense slot="6789012345" format="horizontal" />
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogDetailPage;
