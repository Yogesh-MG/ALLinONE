import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Hospital, ArrowRight, ShieldCheck, BarChart3, Package, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import EmployeeLogin from "@/components/hospital/EmployeeLogin";
import { motion, AnimatePresence } from "framer-motion";

const bubbleIcons = [
  { Icon: Hospital, color: 'text-blue-500', delay: 0 },
  { Icon: Stethoscope, color: 'text-blue-600', delay: 0.2 },
  { Icon: ShieldCheck, color: 'text-blue-400', delay: 0.4 },
  { Icon: BarChart3, color: 'text-blue-700', delay: 0.6 },
  { Icon: Package, color: 'text-blue-300', delay: 0.8 },
];

const Index2 = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);// Add loading state
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogin(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Simulate login with a 2-second delay
  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Navigate after loading (replace with actual login logic if needed)
      navigate("/dashboard"); // Adjust the route as needed
    }, 2000); // 2-second delay
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="min-h-screen relative overflow-hidden bg-background flex flex-col">
        {/* Animated Particle Background */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-black/10 rounded-full"
              style={{
                width: Math.random() * 4 + 2,
                height: Math.random() * 4 + 2,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -1000],
                opacity: [0.2, 0.5, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: 'loop',
                delay: Math.random() * 10,
              }}
            />
          ))}
        </div>

        {/* Animated Bubbles (Pre-Login Animation) */}
        <AnimatePresence>
          {!showLogin && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-50"
            >
              <div className="relative">
                {bubbleIcons.map(({ Icon, color, delay }, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [0, 1.3, 1],
                      opacity: [0, 0.9, 0.7],
                      x: Math.cos((index * 60) * Math.PI / 180) * (120 + index * 60),
                      y: Math.sin((index * 60) * Math.PI / 180) * (120 + index * 60),
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 1.28,
                      delay,
                      ease: 'easeInOut',
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                    className="absolute"
                  >
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 backdrop-blur-lg border border-blue-200 flex items-center justify-center ${color} shadow-lg shadow-blue-500/20`}
                    >
                      <Icon size={28} />
                    </div>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, rotate: 360 }}
                  transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                  className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/50"
                >
                  <Hospital className="w-12 h-12 text-white" />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <AnimatePresence>
          {showLogin && (
            <motion.main
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="flex-1 relative z-0"
            >
              <section className="py-20 px-6">
                <Tabs defaultValue="login">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <button 
                      onClick={() => navigate("/hospital-registration")} 
                      className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                      Register
                    </button>
                  </TabsList>
                  <TabsContent value="login" className="space-y-4">
                    <EmployeeLogin /> {/* Now handles actual login */}
                  </TabsContent>
                  <TabsContent value="info" className="space-y-4">
                  </TabsContent>
                </Tabs>
              </section>
            </motion.main>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Index2;