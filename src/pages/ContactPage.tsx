import { useState, useRef } from "react";
import PageHeader from "@/components/PageHeader";
import { Mail, MapPin, Phone, Send, Shield } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ReCAPTCHA from "react-google-recaptcha";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import MetaData from '@/components/MetaData';

// Declare grecaptcha type
declare global {
  interface Window {
    grecaptcha: {
      reset: () => void;
    };
  }
}

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  
  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
    if (value) {
      setCaptchaError(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Verify captcha
    if (!captchaValue) {
      setCaptchaError(true);
      toast({
        title: "Please complete the captcha",
        description: "Verify that you are not a robot before submitting the form.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Submitting form data:", values);
      
      // Insert data into Supabase
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: values.name,
            email: values.email,
            message: values.message
          }
        ])
        .select();
      
      if (error) {
        console.error("Supabase error:", error);
        console.error("Error details:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        // Check for specific error types
        if (error.code === '23505') {
          toast({
            title: "Duplicate Submission",
            description: "You have already submitted this message. Please wait before submitting again.",
            variant: "destructive",
          });
        } else if (error.code === '42501') {
          toast({
            title: "Permission Error",
            description: "You don't have permission to submit this form. Please contact support.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }
      
      console.log("Form submission successful:", data);
      
      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form
      form.reset();
      setCaptchaValue(null);
      // Reset reCAPTCHA using the ref
      recaptchaRef.current?.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <MetaData 
        title="Contact Us"
        description="Get in touch with the finance90 team. We're here to help with your financial questions and feedback."
        keywords="contact finance90, financial advice, customer support, financial help, money questions"
      />
      <div>
        <PageHeader 
          title="Contact Us"
          description="We'd love to hear from you! Get in touch with any questions or feedback."
        />

        <section className="py-16">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold my-6">Get In Touch</h2>
                <p className="text-gray-700 mb-8">
                  Have a question about personal finance? Looking for specific advice or resources? 
                  Or maybe you just want to say hello? We'd love to hear from you! 
                  Fill out the form and we'll get back to you as soon as possible.
                </p>
                
                <div className="space-y-16 mt-20">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">Email Us</h3>
                      <p className="text-gray-600">contact@finance90.com</p>
                      <p className="text-gray-500 text-sm mt-1">We aim to respond within 24-48 hours on business days.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">Call Us</h3>
                      <p className="text-gray-600">(555) 123-4567</p>
                      <p className="text-gray-500 text-sm mt-1">Monday to Friday, 9am to 5pm EST</p>
                    </div>
                  </div>
                  
          
                </div>
                
 
              </div>

              <div>
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} disabled={isSubmitting} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john.doe@example.com" {...field} disabled={isSubmitting} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us how we can help you..." 
                                rows={5} 
                                {...field} 
                                disabled={isSubmitting} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-2">
                        <div className="flex items-center mb-1">
                          <Shield className="h-4 w-4 mr-2 text-primary" />
                          <span className="text-sm font-medium">Security Verification</span>
                        </div>
                        <div className="flex justify-center sm:justify-start">
                          <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                            onChange={handleCaptchaChange}
                          />
                        </div>
                        {captchaError && (
                          <p className="text-sm font-medium text-destructive">
                            Please complete the captcha verification
                          </p>
                        )}
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-md transition-colors duration-300 flex items-center justify-center"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                        <Send className="ml-2 h-5 w-5" />
                      </button>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">How soon can I expect a response?</h3>
                  <p className="text-gray-700">
                    We aim to respond to all inquiries within 24-48 hours during business days. 
                    For urgent matters, please indicate this in your message subject.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">Do you offer personalized financial advice?</h3>
                  <p className="text-gray-700">
                    While we provide educational content and general guidance, we do not offer personalized financial advice.
                    Please see our disclaimer page for more details.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">Can I guest post on Finance 90?</h3>
                  <p className="text-gray-700">
                    We selectively accept guest contributions from finance experts and experienced writers.
                    Please contact us with your background and proposed topic for consideration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactPage;
