
import PageHeader from "@/components/PageHeader";
import { Link } from "react-router-dom";

const DisclaimerPage = () => {
  return (
    <div>
      <PageHeader 
        title="Disclaimer"
        description="Important information about the content on Money Muse"
        center={false}
      />

      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <p>
                <strong>Last Updated: April 13, 2023</strong>
              </p>
              
              <div className="bg-primary/10 border-l-4 border-primary p-4 my-6">
                <p className="text-lg font-semibold">
                  The information provided on Money Muse is for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
                </p>
              </div>

              <h2 className="text-2xl font-bold mt-8 mb-4">Not Financial Advice</h2>
              
              <p>
                The content on Money Muse is not intended to be a substitute for professional financial advice, diagnosis, or treatment. Always seek the advice of your financial advisor or other qualified financial professional with any questions you may have regarding your financial situation.
              </p>
              
              <p>
                Never disregard professional financial advice or delay in seeking it because of something you have read on this website. If you think you may have a financial emergency, call your financial advisor or financial professional immediately.
              </p>
              
              <p>
                Money Muse does not recommend or endorse any specific tests, financial advisors, products, procedures, opinions, or other information that may be mentioned on the website. Reliance on any information provided by Money Muse, Money Muse employees, contracted writers, or medical professionals presenting content for publication to Money Muse is solely at your own risk.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Personal Experience and Opinion</h2>
              
              <p>
                The views and opinions expressed on this website are purely those of the authors. They are based on personal experiences and research. They do not necessarily reflect the official policy or position of any other agency, organization, employer or company.
              </p>
              
              <p>
                Any product claim, statistic, quote or other representation about a product or service should be verified with the manufacturer, provider or party in question.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Affiliate Links</h2>
              
              <p>
                Some of the links on this website may be affiliate links. This means if you click on the link and purchase the item, Money Muse may receive an affiliate commission at no extra cost to you. All opinions remain our own, and we only recommend products or services that we use personally and believe will add value to our readers.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">No Guarantees</h2>
              
              <p>
                The website and its content are provided "as is". Money Muse makes no guarantees about the results you might achieve through implementing suggestions, techniques, or ideas described on this website.
              </p>
              
              <p>
                Individual results may vary. The financial success or results of individuals applying any principles or advice described or taught in our content, blog, website, or other content or coaching products may depend on a variety of factors. We do not make any guarantees about your ability to get results or earn any money with our ideas, information, tools or strategies.
              </p>
              
              <p>
                What works for one person may not work for another. Always exercise due diligence before implementing any ideas or recommendations from this website.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Consult Professionals</h2>
              
              <p>
                Before starting any new financial strategy or making significant changes to your financial approach, including investing, saving, debt repayment, or retirement planning, consult with qualified professionals who can provide personalized advice tailored to your specific situation.
              </p>
              
              <p>
                These professionals may include:
              </p>
              
              <ul className="list-disc pl-8 mb-4">
                <li>Certified Financial Planners (CFPs)</li>
                <li>Certified Public Accountants (CPAs)</li>
                <li>Tax Advisors</li>
                <li>Investment Advisors</li>
                <li>Estate Planning Attorneys</li>
                <li>Insurance Specialists</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">Use at Your Own Risk</h2>
              
              <p>
                The use of the Money Muse website and content is at your own risk. When you use our website, you acknowledge and agree that you are participating voluntarily in using this website and that you are solely and personally responsible for your choices, actions, and results.
              </p>
              
              <p>
                Money Muse and its authors, partners, and affiliates assume no responsibility or liability for any errors or omissions in the content of this site. The information contained in this site is provided on an "as is" basis with no guarantees of completeness, accuracy, usefulness or timeliness.
              </p>

              <div className="bg-gray-100 p-6 rounded-lg my-8">
                <h3 className="text-xl font-bold mb-3">Contact Information</h3>
                <p>
                  If you have any questions about this disclaimer, please contact us at:
                </p>
                <p className="font-medium mt-2">
                  Money Muse<br />
                  123 Financial Street<br />
                  New York, NY 10001<br />
                  Email: legal@finance90.com
                </p>
              </div>
              
              <p>
                By using the Money Muse website, you acknowledge that you have read and understand this disclaimer. If you do not agree with it, please do not use this website.
              </p>
              
              <p className="mt-8">
                Return to <Link to="/" className="text-primary hover:text-primary-dark">Homepage</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DisclaimerPage;
