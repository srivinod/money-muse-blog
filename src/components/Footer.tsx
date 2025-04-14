import { Link } from "react-router-dom";
import { Mail, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 py-12 mt-16">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center">
            <span className="font-playfair text-2xl font-bold">
              <span className="text-black">Finance</span>
              <span className="text-green-600"> 90</span>
            </span>
          </div>
            </Link>
            <p className="mt-4 text-gray-600">
              Helping you master your money, one step at a time.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/blog/category/saving" className="text-gray-600 hover:text-primary transition-colors">
                  Saving Money
                </Link>
              </li>
              <li>
                <Link to="/blog/category/budgeting" className="text-gray-600 hover:text-primary transition-colors">
                  Budgeting
                </Link>
              </li>
              <li>
                <Link to="/blog/category/investing" className="text-gray-600 hover:text-primary transition-colors">
                  Investing
                </Link>
              </li>
              <li>
                <Link to="/blog/category/frugal-living" className="text-gray-600 hover:text-primary transition-colors">
                  Frugal Living
                </Link>
              </li>
              <li>
                <Link to="/blog/category/financial-planning" className="text-gray-600 hover:text-primary transition-colors">
                  Financial Planning
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-600 hover:text-primary transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-gray-600 hover:text-primary transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Newsletter</h3>
            <p className="text-gray-600 mb-4">
              Subscribe to get the latest tips and advice.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
              <button
                type="submit"
                className="w-full btn-primary"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            &copy; {currentYear} finance90. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="mailto:contact@finance90.com" className="text-gray-600 hover:text-primary text-sm flex items-center">
              <Mail size={16} className="mr-1" /> contact@finance90.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
