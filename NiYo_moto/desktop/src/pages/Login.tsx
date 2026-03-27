import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/utils/api"; // Import the Axios instance

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [is3DVisible, setIs3DVisible] = useState<boolean>(false);
  const [showLoginCard, setShowLoginCard] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  useEffect(() => {
    // Show 3D motor after 1 second
    const motorTimer = setTimeout(() => setIs3DVisible(true), 1000);
    
    // Show login card after 5 seconds total
    const cardTimer = setTimeout(() => setShowLoginCard(true), 5000);
    
    return () => {
      clearTimeout(motorTimer);
      clearTimeout(cardTimer);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast.error("Please enter username and password");
      return;
    }

    setIsLoggingIn(true);
    try {
      // API call to login endpoint - assumes /api/token/ returns { access, refresh }
      const response = await api.post<{ access: string; refresh: string }>('/api/token/', {
        username,
        password,
      });

      const { access, refresh } = response.data;

      // Store tokens - use sessionStorage if not rememberMe, else localStorage
      const tokenStorage = rememberMe ? localStorage : sessionStorage;
      localStorage.setItem("token", access);
      localStorage.setItem("refreshToken", refresh); // Note: Matches interceptor key

      // Optional: Store username for auto-fill if rememberMe
      if (rememberMe) {
        localStorage.setItem("rememberedUsername", username);
      }

      toast.success("Login successful!");
      
      // Fetch user profile or hospital context if needed, then navigate
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error);
      const errorMessage = error.response?.data?.detail || "Login failed. Please check your credentials.";
      toast.error(errorMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Load remembered username on mount
  useEffect(() => {
    const remembered = localStorage.getItem("rememberedUsername");
    if (remembered) {
      setUsername(remembered);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background p-4 relative overflow-hidden">
      {/* Subtle Background Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-primary/10 rounded-full"
          style={{
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: Math.random() * 3,
          }}
        />
      ))}

      {/* Initial Logo Animation - Full Screen for 5s */}
      {!showLoginCard && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full h-full flex flex-col items-center justify-center space-y-8 z-10"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="h-32 w-32 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-4"
          >
            <motion.span 
              className="text-primary-foreground font-bold text-6xl"
              animate={{ 
                rotate: [0, 360], 
                scale: [1, 1.05, 1] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "linear",
                rotate: { duration: 10, repeat: Infinity }
              }}
            >
              N
            </motion.span>
          </motion.div>

          {/* 3D Motor Viewer - Larger for full-screen view */}
          <AnimatePresence>
            {is3DVisible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <model-viewer
                  src="https://modelviewer.dev/shared-assets/models/Astronaut.glb" // Placeholder: Replace with actual 3-phase motor GLB URL, e.g., from Sketchfab or custom asset
                  alt="3-Phase Motor"
                  auto-rotate
                  camera-controls
                  ar
                  loading="eager"
                  style={{ width: "300px", height: "300px" }}
                  className="rounded-lg shadow-md"
                >
                  <span slot="progress-bar" className="bg-primary/20"></span>
                </model-viewer>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="text-center space-y-2"
          >
            <h1 className="text-5xl font-bold text-foreground">NiYo Invoicing</h1>
            <p className="text-muted-foreground text-xl">Powering your motor rewinding business</p>
          </motion.div>
        </motion.div>
      )}

      {/* Login Card - Appears after 5s with Cool Transition */}
      <AnimatePresence>
        {showLoginCard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100, rotateX: 90 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0, 
              rotateX: 0,
              transition: {
                duration: 1.2,
                ease: [0.25, 0.46, 0.45, 0.94], // Back ease for bouncy feel
                type: "spring",
                stiffness: 100,
                damping: 12
              }
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-20"
          >
            <Card className="w-full max-w-md shadow-xl border-0 backdrop-blur-sm bg-background/90">
              <CardHeader className="space-y-3 text-center">
                <div className="mx-auto relative">
                  {/* Scaled-down Logo for Card */}
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-2"
                  >
                    <motion.span 
                      className="text-primary-foreground font-bold text-3xl"
                      animate={{ 
                        rotate: [0, 360], 
                        scale: [1, 1.05, 1] 
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: "linear",
                        rotate: { duration: 10, repeat: Infinity }
                      }}
                    >
                      N
                    </motion.span>
                  </motion.div>

                  {/* Scaled-down 3D Motor for Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                    className="mt-2"
                  >
                    <model-viewer
                      src="https://modelviewer.dev/shared-assets/models/Astronaut.glb" // Placeholder: Replace with actual 3-phase motor GLB URL
                      alt="3-Phase Motor"
                      auto-rotate
                      camera-controls
                      ar
                      loading="eager"
                      style={{ width: "120px", height: "120px" }}
                      className="rounded-lg shadow-md"
                    >
                      <span slot="progress-bar" className="bg-primary/20"></span>
                    </model-viewer>
                  </motion.div>
                </div>
                <CardTitle className="text-3xl font-bold">NiYo Invoicing</CardTitle>
                <CardDescription>Sign in to manage your motor rewinding business</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="h-11"
                      disabled={isLoggingIn}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11"
                      disabled={isLoggingIn}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        disabled={isLoggingIn}
                      />
                      <Label htmlFor="remember" className="text-sm cursor-pointer">
                        Remember me
                      </Label>
                    </div>
                    <Button 
                      type="button" 
                      variant="link" 
                      className="px-0 text-accent hover:text-accent/80"
                      disabled={isLoggingIn}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-11 text-base font-medium" 
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                      <span className="flex items-center justify-center">
                        Signing In...
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;