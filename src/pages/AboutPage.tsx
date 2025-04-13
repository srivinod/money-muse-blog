
import PageHeader from "@/components/PageHeader";
import NewsletterSignup from "@/components/NewsletterSignup";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div>
      <PageHeader 
        title="About Money Muse"
        description="Get to know the story and mission behind our financial education platform"
      />

      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Money Muse began in 2020 as a personal project born out of necessity. After struggling with debt and financial uncertainty in my twenties, I realized that the financial education I needed wasn't easily accessible or presented in a way that connected with my real-life experiences.
              </p>
              <p className="text-gray-700 mb-4">
                What started as a small blog documenting my own journey to financial stability has grown into a comprehensive resource helping thousands of readers navigate their own money challenges.
              </p>
              <p className="text-gray-700">
                Our mission remains simple: to demystify personal finance and provide practical, actionable advice that works for real people with real financial challenges.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="About Money Muse" 
                className="rounded-lg shadow-xl w-full"
              />
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-lg shadow-lg max-w-xs">
                <p className="text-gray-700 italic">
                  "Financial freedom isn't about being rich, it's about having options."
                </p>
                <p className="text-primary font-medium mt-2">
                  — Sarah Mitchell, Founder
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Meet the Founder</h2>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex flex-col md:flex-row gap-8 items-center mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1573497161161-c3e73707e25c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="Sarah Mitchell" 
                  className="rounded-full w-40 h-40 object-cover border-4 border-primary/20"
                />
                <div>
                  <h3 className="text-2xl font-bold mb-2">Sarah Mitchell</h3>
                  <p className="text-gray-600 mb-4">Financial Educator & Certified Financial Planner</p>
                  <div className="flex space-x-4">
                    <a href="#" className="text-primary hover:text-primary-dark transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 5.5a8.83 8.83 0 0 1-2.55.7 4.45 4.45 0 0 0 1.95-2.45c-.9.53-1.88.9-2.92 1.1a4.45 4.45 0 0 0-7.57 4.05A12.65 12.65 0 0 1 2 4.3a4.45 4.45 0 0 0 1.38 5.93c-.74-.03-1.44-.23-2.05-.57v.06a4.44 4.44 0 0 0 3.57 4.35c-.68.19-1.4.2-2.05.08a4.45 4.45 0 0 0 4.16 3.09A8.92 8.92 0 0 1 2 19.5 12.6 12.6 0 0 0 8.55 21c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.37-.01-.56.84-.6 1.56-1.35 2.15-2.21z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="text-primary hover:text-primary-dark transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="text-primary hover:text-primary-dark transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                With over a decade of experience in personal finance, I've helped hundreds of individuals transform their relationship with money. My journey from $45,000 in debt to financial independence taught me that small, consistent changes can lead to remarkable results.
              </p>
              <p className="text-gray-700 mb-4">
                As a Certified Financial Planner, I combine professional expertise with real-world experience. My approach isn't about extreme frugality or get-rich-quick schemes—it's about creating sustainable financial habits that align with your values and goals.
              </p>
              <p className="text-gray-700">
                When I'm not writing about money, you'll find me hiking with my dog, experimenting with new recipes, or volunteering with financial literacy programs in underserved communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What to Expect from Money Muse</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our commitment to you as a reader
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Practical Advice</h3>
              <p className="text-gray-700">
                We focus on actionable strategies you can implement today, not theoretical concepts that sound good but don't translate to real life.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Personalized Approach</h3>
              <p className="text-gray-700">
                We recognize that everyone's financial situation is unique. Our content helps you adapt strategies to your specific circumstances and goals.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Empowering Education</h3>
              <p className="text-gray-700">
                We don't just tell you what to do—we explain why it works, empowering you to make informed decisions about your financial future.
              </p>
            </div>
          </div>
        </div>
      </section>

      <NewsletterSignup />

      <section className="py-16 bg-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Start Your Financial Journey?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/category/budgeting" className="btn-primary">
              Explore Our Articles
            </Link>
            <Link to="/resources" className="btn-outline">
              Browse Our Resources
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
