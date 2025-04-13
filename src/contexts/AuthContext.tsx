
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

type AuthContextType = {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated on mount
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    const userRole = localStorage.getItem("userRole");
    
    setIsAuthenticated(authStatus);
    setIsAdmin(userRole === "admin");
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Mock authentication - in a real app, you would make an API call
    if (username === "admin" && password === "password") {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", "admin");
      setIsAuthenticated(true);
      setIsAdmin(true);
      toast({
        title: "Login successful",
        description: "Welcome back, admin!",
      });
      return true;
    } else {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
    setIsAdmin(false);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
