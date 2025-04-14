import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktopCategoriesOpen, setIsDesktopCategoriesOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const desktopCategoriesRef = useRef<HTMLDivElement>(null);
  const mobileCategoriesRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDesktopCategories = () => {
    setIsDesktopCategoriesOpen(!isDesktopCategoriesOpen);
  };

  const toggleMobileCategories = () => {
    setIsMobileCategoriesOpen(!isMobileCategoriesOpen);
  };

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (desktopCategoriesRef.current && !desktopCategoriesRef.current.contains(event.target as Node)) {
        setIsDesktopCategoriesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mobileMenu = document.querySelector('.mobile-menu');
      if (mobileMenu && !mobileMenu.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center">
            <span className="font-playfair text-2xl font-bold">
              <span className="text-black">Finance</span>
              <span className="text-green-600"> 90</span>
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary font-medium transition-colors">
              About
            </Link>
            <div className="relative" ref={desktopCategoriesRef}>
              <button 
                className="text-gray-700 hover:text-primary font-medium transition-colors flex items-center"
                onClick={toggleDesktopCategories}
              >
                Categories
                <svg className={`ml-1 w-4 h-4 transition-transform ${isDesktopCategoriesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isDesktopCategoriesOpen && (
                <div 
                  className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10"
                >
                  <Link 
                    to="/blog/category/saving" 
                    className="block px-4 py-2 text-gray-700 hover:bg-primary hover:text-white"
                    onClick={() => setIsDesktopCategoriesOpen(false)}
                  >
                    Saving Money
                  </Link>
                  <Link 
                    to="/blog/category/budgeting" 
                    className="block px-4 py-2 text-gray-700 hover:bg-primary hover:text-white"
                    onClick={() => setIsDesktopCategoriesOpen(false)}
                  >
                    Budgeting
                  </Link>
                  <Link 
                    to="/blog/category/investing" 
                    className="block px-4 py-2 text-gray-700 hover:bg-primary hover:text-white"
                    onClick={() => setIsDesktopCategoriesOpen(false)}
                  >
                    Investing
                  </Link>
                  <Link 
                    to="/blog/category/frugal-living" 
                    className="block px-4 py-2 text-gray-700 hover:bg-primary hover:text-white"
                    onClick={() => setIsDesktopCategoriesOpen(false)}
                  >
                    Frugal Living
                  </Link>
                  <Link 
                    to="/blog/category/financial-planning" 
                    className="block px-4 py-2 text-gray-700 hover:bg-primary hover:text-white"
                    onClick={() => setIsDesktopCategoriesOpen(false)}
                  >
                    Financial Planning
                  </Link>
                </div>
              )}
            </div>
            <Link to="/resources" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Resources
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Contact
            </Link>
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center">
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
          <div className="absolute top-16 left-0 right-0 w-full bg-white shadow-md z-40 md:hidden">
            <nav className="container py-4 mobile-menu">
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
                <div className="dropdown" ref={mobileCategoriesRef}>
                  <button 
                    className="text-gray-700 hover:text-primary font-medium transition-colors flex items-center"
                    onClick={toggleMobileCategories}
                  >
                    Categories
                    <svg className={`ml-1 w-4 h-4 transition-transform ${isMobileCategoriesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isMobileCategoriesOpen && (
                    <div className="flex flex-col pl-4 mt-2 space-y-2">
                      <Link 
                        to="/blog/category/saving" 
                        className="text-gray-600 hover:text-primary"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsMobileCategoriesOpen(false);
                        }}
                      >
                        Saving Money
                      </Link>
                      <Link 
                        to="/blog/category/budgeting" 
                        className="text-gray-600 hover:text-primary"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsMobileCategoriesOpen(false);
                        }}
                      >
                        Budgeting
                      </Link>
                      <Link 
                        to="/blog/category/investing" 
                        className="text-gray-600 hover:text-primary"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsMobileCategoriesOpen(false);
                        }}
                      >
                        Investing
                      </Link>
                      <Link 
                        to="/blog/category/frugal-living" 
                        className="text-gray-600 hover:text-primary"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsMobileCategoriesOpen(false);
                        }}
                      >
                        Frugal Living
                      </Link>
                      <Link 
                        to="/blog/category/financial-planning" 
                        className="text-gray-600 hover:text-primary"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsMobileCategoriesOpen(false);
                        }}
                      >
                        Financial Planning
                      </Link>
                    </div>
                  )}
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
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-2 pt-2">
                    <Link to="/admin/dashboard">
                      <Button variant="ghost" size="sm" className="w-full flex items-center gap-2">
                        <User size={16} />
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={logout} className="w-full">
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link to="/login">
                    <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                      <User size={16} />
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
