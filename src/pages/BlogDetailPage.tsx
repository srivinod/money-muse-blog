import React from 'react';
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import AdSense from "@/components/AdSense";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogPostBySlug, fetchRelatedPosts, BlogPost } from "@/services/blogService";

const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  
  const { data: post, isLoading: isPostLoading, error: postError } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => fetchBlogPostBySlug(slug as string),
    meta: {
      onError: (error: any) => {
        toast({
          title: "Post not found",
          description: "Sorry, we couldn't find the article you're looking for.",
          variant: "destructive"
        });
      }
    },
    // Disable caching to always fetch fresh data from Supabase
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  });
  
  const { data: relatedPosts = [], isLoading: isRelatedLoading } = useQuery({
    queryKey: ['related-posts', slug, post?.category],
    queryFn: () => fetchRelatedPosts(slug as string, post?.category as string),
    enabled: !!post?.category,
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    // Log the post data to help debug content issues
    if (post) {
      console.log("Post data loaded:", post);
      console.log("Post content:", post.content);
    }
  }, [post]);

  if (isPostLoading) {
    return (
      <div className="container-custom py-16">
        <div className="text-center">
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  if (postError || !post) {
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
        <div className="mb-3">
          <Link to={`/blog/category/${post.category.toLowerCase().replace(/\s+/g, '-')}`} className="inline-flex items-center text-primary hover:underline mb-4">
            <ArrowLeft size={16} className="mr-1" />
            Back to {post.category}
          </Link>
        </div>
        
        <Card className="overflow-hidden border-none shadow-md">
          {post.imageUrl && (
            <img 
              src={post.imageUrl} 
              alt={post.title}
              className="w-full h-[400px] object-cover"
            />
          )}
          
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
              {post.excerpt && (
                <p className="text-lg text-gray-700 mb-4">
                  {post.excerpt}
                </p>
              )}
              
              {/* Render the content from Supabase */}
              {post.content ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: post.content }} 
                  className="mt-6"
                />
              ) : (
                <p className="text-gray-500 italic">No content available for this article.</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Related posts section */}
        {relatedPosts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl md:text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related, index) => (
                <div key={index} className="border rounded-lg overflow-hidden shadow-md flex flex-col h-full">
                  <div className="p-4 flex-grow">
                    <h3 className="text-lg font-semibold mb-2">{related.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{related.excerpt}</p>
                  </div>
                  <div className="p-4 pt-0 border-t border-gray-100">
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
