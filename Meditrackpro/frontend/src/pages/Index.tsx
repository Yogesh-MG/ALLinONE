
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Package, 
  Stethoscope, 
  Truck, 
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";


const Index = () => {
  const navigate = useNavigate();

  return (
    <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0 }}
            >
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-blue-50 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-6 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm bg-white/70 dark:bg-slate-900/70">
        <div className="flex items-center">
          <span className="text-xl font-medium tracking-tight">
            Medi<span className="text-medical-500">Track</span>Pro
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/login")}
          >
            Sign up
          </Button>
          <Button 
            onClick={() => navigate("/hospital-registration")}
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero section */}
      <section className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 py-12 md:py-20 max-w-7xl mx-auto">
        <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0 animate-fade-in">
          <div className="inline-block mb-4 px-3 py-1 bg-medical-100 dark:bg-medical-900/30 text-medical-700 dark:text-medical-300 rounded-full text-sm font-medium">
            Medical Inventory Management System
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Streamline Your <span className="text-medical-500">Medical Inventory</span> Management
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-xl">
            Comprehensive solution for hospitals, clinics, and laboratories to track inventory, manage devices, and automate healthcare operations.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Button 
              size="lg" 
              className="bg-medical-500 hover:bg-medical-600 text-white py-6 px-8"
              onClick={() => navigate("/demo/dashboard")}
            >
              Explore Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="py-6 px-8"
              onClick={() => navigate("/dashboard")}
            >
              Watch Demo
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 relative animate-fade-in">
          <div className="relative rounded-xl overflow-hidden shadow-soft-lg bg-white dark:bg-slate-900 p-2 border border-slate-200 dark:border-slate-800">
            <div className="aspect-[16/9] rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src="https://drive.google.com/u/0/drive-viewer/AKGpiha6QWHdLEvjER6hLAXITLYM9NYbbjI-l3YslvHSZzb6XOfCU3GWCx63Oc_f4hh4J9Om1_FgwWPQusWfCmb6QKFGRPm55zJWCuU=s1600-rw-v1"
                alt="Medical Dashboard"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="absolute -top-3 -right-3 bg-white dark:bg-slate-900 rounded-lg shadow-soft-lg p-2 border border-slate-200 dark:border-slate-800 animate-float">
            <div className="flex items-center gap-2 p-2">
              <div className="h-4 w-4 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium">Stock Levels Optimal</span>
            </div>
          </div>
          <div className="absolute -bottom-3 -left-3 bg-white dark:bg-slate-900 rounded-lg shadow-soft-lg p-2 border border-slate-200 dark:border-slate-800 animate-float" style={{ animationDelay: "1s" }}>
            <div className="flex items-center gap-2 p-2">
              <div className="h-4 w-4 rounded-full bg-amber-500"></div>
              <span className="text-sm font-medium">3 Devices Need Calibration</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 px-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Comprehensive solution designed for healthcare facilities of all sizes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 transition-all duration-300 hover:shadow-soft hover:-translate-y-1 border border-slate-200/70 dark:border-slate-700/30">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-medical-100 dark:bg-medical-900/30 text-medical-600 dark:text-medical-400 mb-4">
                <Package size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Inventory Management</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Real-time tracking of medicines, equipment, and consumables with batch and expiry date management.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 transition-all duration-300 hover:shadow-soft hover:-translate-y-1 border border-slate-200/70 dark:border-slate-700/30">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-medical-100 dark:bg-medical-900/30 text-medical-600 dark:text-medical-400 mb-4">
                <Stethoscope size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Device Management</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Maintenance history tracking and recalibration logs for critical medical devices.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 transition-all duration-300 hover:shadow-soft hover:-translate-y-1 border border-slate-200/70 dark:border-slate-700/30">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-medical-100 dark:bg-medical-900/30 text-medical-600 dark:text-medical-400 mb-4">
                <Truck size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Supplier Automation</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Automated purchase orders, price comparison, and integration with distributor networks.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 transition-all duration-300 hover:shadow-soft hover:-translate-y-1 border border-slate-200/70 dark:border-slate-700/30">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-medical-100 dark:bg-medical-900/30 text-medical-600 dark:text-medical-400 mb-4">
                <LayoutDashboard size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Smart Dashboard</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Centralized dashboard for managing multiple facilities with role-based access control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 px-6 bg-medical-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Medical Operations?</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare facilities already using MediTrackPro to streamline their inventory and device management.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/login"><Button 
              size="lg" 
              className="bg-medical-500 hover:bg-medical-600 text-white"
            >
              Get Started Now
            </Button></a>

            <a href="https://wa.me/+918431204137">
            <Button 
              variant="outline" 
              size="lg" 
            >
              Schedule a Demo
            </Button>
            </a>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span>Free 30-day trial</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="text-xl font-medium tracking-tight">
              Medi<span className="text-medical-500">Track</span>Pro
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            © {new Date().getFullYear()} MediTrackPro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
    </motion.div>
  );
};

export default Index;
