
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
          <div className="max-w-3xl mx-auto text-center">
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
