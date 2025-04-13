
import { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Insert data into Supabase
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email }]);
      
      if (error) {
        // If it's a uniqueness violation (email already exists)
        if (error.code === '23505') {
          toast({
            title: "Already Subscribed",
            description: "This email is already subscribed to our newsletter.",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Success!",
          description: "You've been subscribed to our newsletter.",
        });
      }
      
      setEmail("");
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      toast({
        title: "Subscription Error",
        description: "There was a problem subscribing you. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary-light/50 to-secondary-light/50 py-16">
      <div className="container-custom text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-block p-3 bg-white rounded-full mb-6 shadow-md">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Financial Tips Delivered</h2>
          <p className="text-gray-700 mb-8">
            Join our newsletter for weekly insights, tips, and strategies to help you achieve financial freedom.
          </p>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md transition-colors duration-300 whitespace-nowrap disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
          <p className="text-sm text-gray-600 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignup;
