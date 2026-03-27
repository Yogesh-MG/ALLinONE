import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import api from "@/utils/api"; // Import the configured Axios instance
import { AxiosError } from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setParticles(newParticles);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Make API call to Django Simple JWT token endpoint
      const response = await api.post("/api/token/", {
        username: email,
        password,
      });

      // Store tokens in localStorage
      localStorage.setItem("token", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      // Show success toast
      toast({
        title: "Login Successful",
        description: "Welcome to GymPro Dashboard!",
      });

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      const axiosError = error as AxiosError<{ detail?: string; non_field_errors?: string[] }>;

      // Safely extract backend error messages
      const errorMessage =
        axiosError.response?.data?.detail ||
        axiosError.response?.data?.non_field_errors?.[0] ||
        "Please enter valid credentials.";

      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/10 to-primary/5 p-4 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-primary/20 rounded-full animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${3 + particle.delay}s`,
            }}
          />
        ))}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/5 rounded-full blur-2xl animate-bounce"></div>
      </div>

      <Card className="w-full max-w-md animate-fade-in backdrop-blur-sm bg-card/95 border-2 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
        <CardHeader className="text-center space-y-4">
          <div className="relative">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                <span>GymPro</span>
                <Sparkles className="w-8 h-8 text-secondary animate-pulse" style={{ animationDelay: "0.5s" }} />
              </div>
            </CardTitle>
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-secondary/20 blur-lg animate-pulse rounded-lg"></div>
          </div>
          <CardDescription className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            Sign in to your fitness management dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative group">
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@gympro.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="transition-all duration-300 focus:scale-[1.02] focus:shadow-lg group-hover:shadow-md"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 to-secondary/10 blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 rounded-md"></div>
              </div>
            </div>

            <div className="space-y-2 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative group">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg group-hover:shadow-md"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 to-secondary/10 blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 rounded-md"></div>
              </div>
            </div>

            <div className="flex items-center space-x-2 animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <Checkbox id="remember" className="transition-transform duration-200 hover:scale-110" />
              <Label htmlFor="remember" className="text-sm cursor-pointer hover:text-primary transition-colors duration-200">
                Remember me
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full relative overflow-hidden group transition-all duration-300 hover:shadow-lg animate-fade-in"
              style={{ animationDelay: "0.7s" }}
              disabled={isLoading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center space-x-2">
                {isLoading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>}
                <span>{isLoading ? "Signing in..." : "Sign In"}</span>
                {!isLoading && <Sparkles className="w-4 h-4 animate-pulse" />}
              </span>
            </Button>

            <div
              className="text-center text-sm text-muted-foreground animate-fade-in bg-gradient-to-r from-primary/10 to-secondary/10 p-3 rounded-lg border"
              style={{ animationDelay: "0.8s" }}
            >
              <div className="flex items-center justify-center space-x-1">
                <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                <span>Demo credentials: admin@gympro.com / password</span>
                <Sparkles className="w-3 h-3 text-secondary animate-pulse" />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;