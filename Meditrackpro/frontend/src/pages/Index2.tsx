import React, {useState} from "react";
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
import { motion} from "framer-motion"

const Index2 = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);// Add loading state

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
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <a href="/"><div className="flex items-center gap-2">
            <Hospital className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">MediTrack Pro</span>
          </div></a>
          
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/features" className={navigationMenuTriggerStyle()}>
                  Features
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/solutions" className={navigationMenuTriggerStyle()}>
                  Solutions
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/pricing" className={navigationMenuTriggerStyle()}>
                  Pricing
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/about" className={navigationMenuTriggerStyle()}>
                  About
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate("/demo/dashboard")}
              className="hidden sm:flex"
            >
              Dashboard
            </Button>
            <Button onClick={() => navigate("/hospital-registration")}>Register Hospital</Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 px-6">
          <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Medical Inventory & Device Management Platform
              </h1>
              <p className="text-xl text-muted-foreground">
                Streamline your hospital's inventory, track medical devices, and ensure compliance with our comprehensive healthcare management system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => navigate("/hospital-registration")}>
                  Register Your Hospital 
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/features")}>
                  Explore Features
                </Button>
              </div>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-6">
              <Tabs defaultValue="login">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger> {/* Changed to "Login" */}
                  <TabsTrigger value="info">About MediTrack</TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="space-y-4">
                  <EmployeeLogin /> {/* Now handles actual login */}
                </TabsContent>
                <TabsContent value="info" className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Welcome to MediTrack Pro</h3>
                    <p>
                      MediTrack Pro is a comprehensive healthcare management system designed for modern hospitals and clinics.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
                        <span>Secure and compliant with healthcare regulations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <BarChart3 className="h-5 w-5 text-primary mt-0.5" />
                        <span>Advanced analytics and reporting capabilities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Package className="h-5 w-5 text-primary mt-0.5" />
                        <span>Complete inventory management system</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Stethoscope className="h-5 w-5 text-primary mt-0.5" />
                        <span>Medical device tracking and maintenance</span>
                      </li>
                    </ul>
                    <Button variant="outline" className="w-full" onClick={() => navigate("/hospital-registration")}>
                      Register Your Hospital
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Rest of the file remains unchanged */}
        <section id="features" className="py-20 px-6 bg-muted/30">
          <div className="container mx-auto space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold">Comprehensive Healthcare Management</h2>
              <p className="text-muted-foreground text-lg">
                MediTrack Pro offers a complete solution for healthcare providers to manage their operations efficiently
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 p-2 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Inventory Management</h3>
                  <p className="text-muted-foreground">
                    Track medicines, equipment, and consumables with real-time updates and automated reordering.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 p-2 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Stethoscope className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Device Management</h3>
                  <p className="text-muted-foreground">
                    Maintain and track medical devices, schedule calibrations, and ensure optimal performance.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 p-2 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Compliance Tracking</h3>
                  <p className="text-muted-foreground">
                    Stay compliant with healthcare regulations and maintain complete audit logs for inspections.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/features")}
              >
                Explore All Features
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-20 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Trusted by Healthcare Providers Across India</h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                From small clinics to large hospital networks, MediTrack Pro serves healthcare facilities of all sizes
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div className="flex items-center justify-center p-4 h-24 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="text-center">
                  <p className="font-bold">Apollo Hospitals</p>
                </div>
              </div>
              <div className="flex items-center justify-center p-4 h-24 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="text-center">
                  <p className="font-bold">Fortis Healthcare</p>
                </div>
              </div>
              <div className="flex items-center justify-center p-4 h-24 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="text-center">
                  <p className="font-bold">Max Healthcare</p>
                </div>
              </div>
              <div className="flex items-center justify-center p-4 h-24 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="text-center">
                  <p className="font-bold">Narayana Health</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={() => navigate("/about")}
                variant="outline"
              >
                Learn More About Us
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-20 px-6 bg-primary/5">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Healthcare Operations?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Join 800+ healthcare facilities across India that trust MediTrack Pro for their inventory and device management
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate("/hospital-registration")}
              >
                Register Your Hospital
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/pricing")}
              >
                View Pricing
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-border py-12 px-6 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Hospital className="h-5 w-5 text-primary" />
                <span className="font-semibold">MediTrack Pro</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive healthcare inventory and device management for the Indian market.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                <li><a href="/solutions" className="text-muted-foreground hover:text-foreground transition-colors">Solutions</a></li>
                <li><a href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="/support" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MediTrack Pro. All rights reserved.
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </motion.div>
  );
};

export default Index2;