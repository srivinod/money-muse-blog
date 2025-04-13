
import PageHeader from "@/components/PageHeader";
import { FileDown, ExternalLink } from "lucide-react";
import { resources } from "@/data/blogData";

const ResourcesPage = () => {
  return (
    <div>
      <PageHeader 
        title="Financial Resources"
        description="We've created tools & resources to help you implement the strategies we discuss in our articles. Each tool is designed to be practical, straightforward, and immediately useful."
      />

      <section className="py-16">
        <div className="container-custom"> 

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="p-3 bg-primary/10 rounded-full inline-block mb-4">
                  {resource.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-6">{resource.description}</p>
                <a 
                  href={resource.link} 
                  className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
                >
                  <FileDown className="mr-2 h-5 w-5" />
                  Download Template
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Recommended Books</h2>
            <p className="text-gray-700">
              These books have profoundly influenced our financial philosophy.
              Each offers valuable insights for different aspects of personal finance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <img 
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Book cover" 
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-bold mb-1">The Psychology of Money</h3>
              <p className="text-gray-500 mb-3">Morgan Housel</p>
              <p className="text-gray-600 text-sm mb-4">
                Timeless lessons on wealth, greed, and happiness through the unique lens of human behavior.
              </p>
              <a 
                href="#" 
                className="inline-flex items-center text-primary hover:text-primary-dark font-medium text-sm"
              >
                View Recommendation
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <img 
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Book cover" 
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-bold mb-1">Your Money or Your Life</h3>
              <p className="text-gray-500 mb-3">Vicki Robin</p>
              <p className="text-gray-600 text-sm mb-4">
                A transformative guide to changing your relationship with money and achieving financial independence.
              </p>
              <a 
                href="#" 
                className="inline-flex items-center text-primary hover:text-primary-dark font-medium text-sm"
              >
                View Recommendation
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <img 
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Book cover" 
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-bold mb-1">I Will Teach You To Be Rich</h3>
              <p className="text-gray-500 mb-3">Ramit Sethi</p>
              <p className="text-gray-600 text-sm mb-4">
                A practical approach to personal finance with actionable steps for young professionals.
              </p>
              <a 
                href="#" 
                className="inline-flex items-center text-primary hover:text-primary-dark font-medium text-sm"
              >
                View Recommendation
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <img 
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Book cover" 
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-bold mb-1">The Simple Path to Wealth</h3>
              <p className="text-gray-500 mb-3">JL Collins</p>
              <p className="text-gray-600 text-sm mb-4">
                A straightforward guide to financial independence through smart investing and simple principles.
              </p>
              <a 
                href="#" 
                className="inline-flex items-center text-primary hover:text-primary-dark font-medium text-sm"
              >
                View Recommendation
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Online Courses</h2>
            <p className="text-gray-700">
              These carefully selected courses offer structured learning for different financial topics.
              (Note: Some links may include affiliate partnerships)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-2">Beginner's Guide to Investing</h3>
              <div className="flex items-center mb-4">
                <div className="bg-primary/20 text-primary text-sm font-medium px-3 py-1 rounded-full">
                  Free Course
                </div>
                <div className="ml-2 text-gray-500 text-sm">6 Modules</div>
              </div>
              <p className="text-gray-600 mb-4">
                Learn the fundamentals of investing with a focus on long-term strategies for beginners.
              </p>
              <a 
                href="#" 
                className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
              >
                View Course
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-2">Master Your Budget</h3>
              <div className="flex items-center mb-4">
                <div className="bg-accent/20 text-accent text-sm font-medium px-3 py-1 rounded-full">
                  Premium
                </div>
                <div className="ml-2 text-gray-500 text-sm">8 Modules</div>
              </div>
              <p className="text-gray-600 mb-4">
                A comprehensive course on creating and maintaining a budget that works with your lifestyle.
              </p>
              <a 
                href="#" 
                className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
              >
                View Course
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-2">Real Estate Investing 101</h3>
              <div className="flex items-center mb-4">
                <div className="bg-accent/20 text-accent text-sm font-medium px-3 py-1 rounded-full">
                  Premium
                </div>
                <div className="ml-2 text-gray-500 text-sm">10 Modules</div>
              </div>
              <p className="text-gray-600 mb-4">
                Learn how to analyze properties, secure financing, and build a real estate portfolio.
              </p>
              <a 
                href="#" 
                className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
              >
                View Course
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary/5">
        <div className="container-custom text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Need a Custom Resource?</h2>
            <p className="text-xl text-gray-700 mb-8">
              We're constantly developing new tools and resources.
              Let us know what would help you on your financial journey.
            </p>
            <a 
              href="/contact" 
              className="btn-primary inline-flex items-center"
            >
              Request a Resource
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResourcesPage;
