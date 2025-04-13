
import { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This would connect to your newsletter service in a real app
    toast({
      title: "Success!",
      description: "You've been subscribed to our newsletter.",
    });
    
    setEmail("");
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
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md transition-colors duration-300 whitespace-nowrap"
            >
              Subscribe
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
