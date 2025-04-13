
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-playfair text-2xl font-bold text-primary">Money Muse</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary font-medium transition-colors">
              About
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-primary font-medium transition-colors flex items-center">
                Categories
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10 hidden group-hover:block">
                <Link to="/category/saving" className="block px-4 py-2 text-gray-700 hover:bg-primary hover:text-white">
                  Saving Money
                </Link>
                <Link to="/category/budgeting" className="block px-4 py-2 text-gray-700 hover:bg-primary hover:text-white">
                  Budgeting
                </Link>
                <Link to="/category/investing" className="block px-4 py-2 text-gray-700 hover:bg-primary hover:text-white">
                  Investing
                </Link>
                <Link to="/category/frugal-living" className="block px-4 py-2 text-gray-700 hover:bg-primary hover:text-white">
                  Frugal Living
                </Link>
                <Link to="/category/financial-planning" className="block px-4 py-2 text-gray-700 hover:bg-primary hover:text-white">
                  Financial Planning
                </Link>
              </div>
            </div>
            <Link to="/resources" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Resources
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Contact
            </Link>
            
            {/* Additional links to footer pages */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-primary font-medium transition-colors flex items-center">
                More
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10 hidden group-hover:block">
                <Link to="/privacy" className="block px-4 py-2 text-gray-700 hover:bg-primary hover:text-white">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="block px-4 py-2 text-gray-700 hover:bg-primary hover:text-white">
                  Terms of Service
                </Link>
                <Link to="/disclaimer" className="block px-4 py-2 text-gray-700 hover:bg-primary hover:text-white">
                  Disclaimer
                </Link>
              </div>
            </div>
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center ml-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/admin/dashboard">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <User size={16} />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <User size={16} />
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
          </button>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-primary font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-primary font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="dropdown">
                <button className="text-gray-700 hover:text-primary font-medium transition-colors flex items-center">
                  Categories
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="flex flex-col pl-4 mt-2 space-y-2">
                  <Link 
                    to="/category/saving" 
                    className="text-gray-600 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Saving Money
                  </Link>
                  <Link 
                    to="/category/budgeting" 
                    className="text-gray-600 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Budgeting
                  </Link>
                  <Link 
                    to="/category/investing" 
                    className="text-gray-600 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Investing
                  </Link>
                  <Link 
                    to="/category/frugal-living" 
                    className="text-gray-600 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Frugal Living
                  </Link>
                  <Link 
                    to="/category/financial-planning" 
                    className="text-gray-600 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Financial Planning
                  </Link>
                </div>
              </div>
              <Link 
                to="/resources" 
                className="text-gray-700 hover:text-primary font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Resources
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-primary font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="dropdown">
                <button className="text-gray-700 hover:text-primary font-medium transition-colors flex items-center">
                  More
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="flex flex-col pl-4 mt-2 space-y-2">
                  <Link 
                    to="/privacy" 
                    className="text-gray-600 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Privacy Policy
                  </Link>
                  <Link 
                    to="/terms" 
                    className="text-gray-600 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Terms of Service
                  </Link>
                  <Link 
                    to="/disclaimer" 
                    className="text-gray-600 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Disclaimer
                  </Link>
                </div>
              </div>
              
              {/* Auth buttons for mobile */}
              {isAuthenticated ? (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                  <Link 
                    to="/admin/dashboard"
                    className="text-gray-700 hover:text-primary font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    className="text-gray-700 hover:text-primary font-medium transition-colors text-left"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login"
                  className="text-gray-700 hover:text-primary font-medium transition-colors mt-2 pt-2 border-t border-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
