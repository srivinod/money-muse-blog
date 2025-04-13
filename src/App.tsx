
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ResourcesPage from "./pages/ResourcesPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import DisclaimerPage from "./pages/DisclaimerPage";
import CategoryPage from "./pages/CategoryPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import BlogManagementPage from "./pages/BlogManagementPage";
import BlogEditorPage from "./pages/BlogEditorPage";
import CategoriesManagementPage from "./pages/CategoriesManagementPage";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="resources" element={<ResourcesPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="disclaimer" element={<DisclaimerPage />} />
              <Route path="category/:categoryName" element={<CategoryPage />} />
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
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
