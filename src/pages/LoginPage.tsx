
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import PageHeader from "@/components/PageHeader";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // This is a simple mock authentication
    // In a real app, you would connect to an auth service
    if (username === "admin" && password === "password") {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", "admin");
      toast({
        title: "Login successful",
        description: "Welcome back, admin!",
      });
      navigate("/admin/dashboard");
    } else {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div>
      <PageHeader 
        title="Admin Login" 
        description="Sign in to access the blog management dashboard"
      />
      
      <div className="container py-16 max-w-md mx-auto">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          
          <div className="text-center text-sm text-gray-500 mt-4">
            <p>For demo purposes:</p>
            <p>Username: admin</p>
            <p>Password: password</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
