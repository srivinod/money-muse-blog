import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ResourcesPage from "./pages/ResourcesPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import DisclaimerPage from "./pages/DisclaimerPage";
import CategoryPage from "./pages/CategoryPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import BlogManagementPage from "./pages/BlogManagementPage";
import BlogEditorPage from "./pages/BlogEditorPage";
import CategoriesManagementPage from "./pages/CategoriesManagementPage";
import SubscribersPage from "./pages/SubscribersPage";
import ContactsPage from "./pages/ContactsPage";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { TooltipProvider } from "@/components/ui/tooltip";
import { migrateMockDataToSupabase } from "@/services/blogService";
import { setupBlogStorage } from '@/services/blog';
import { categories } from "@/data/blogData";

// Create QueryClient outside of component
const queryClient = new QueryClient();

// Create a pattern that matches only the existing category slugs
const categoryPattern = categories.map(cat => cat.slug).join('|');

const App = () => {
  // Use useState inside the component function
  const [isMigrationComplete, setIsMigrationComplete] = useState(false);
  const [isStorageSetup, setIsStorageSetup] = useState(false);
  
  // Run migration when the app loads
  useEffect(() => {
    const migrateData = async () => {
      try {
        await migrateMockDataToSupabase();
        setIsMigrationComplete(true);
        console.log("Migration completed successfully");
      } catch (error) {
        console.error("Migration failed:", error);
        // Even if migration fails, we still set this to true to prevent infinite retries
        setIsMigrationComplete(true);
      }
    };
    
    migrateData();
  }, []);

  useEffect(() => {
    const initializeStorage = async () => {
      try {
        console.log("Initializing blog storage...");
        await setupBlogStorage();
        setIsStorageSetup(true);
        console.log("Blog storage initialized successfully");
      } catch (error) {
        console.error("Failed to initialize blog storage:", error);
        // Don't set isStorageSetup to true on error
      }
    };

    initializeStorage();
  }, []);

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <ScrollToTop />
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="resources" element={<ResourcesPage />} />
                <Route path="privacy" element={<PrivacyPage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="disclaimer" element={<DisclaimerPage />} />
                <Route path="blog" element={<BlogPage />} />
                <Route path="blog/category/:categoryName" element={<CategoryPage />} />
                <Route path="blog/:slug" element={<BlogDetailPage />} />
                <Route path="login" element={<LoginPage />} />
                
         
                {/* Admin Routes */}
                <Route 
                  path="admin/dashboard" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="admin/posts" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <BlogManagementPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="admin/categories" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <CategoriesManagementPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="admin/posts/new" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <BlogEditorPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="admin/posts/edit/:id" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <BlogEditorPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="admin/subscribers" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <SubscribersPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="admin/contacts" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <ContactsPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
