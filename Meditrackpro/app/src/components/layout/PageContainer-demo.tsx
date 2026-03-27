
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header-demo";
import Sidebar from "@/components/layout/Sidebar-demo";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  hideSidebar?: boolean;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className, hideSidebar = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Handle clicking outside the sidebar to close it on mobile
  const handleContentClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (window.innerWidth < 768 && sidebarOpen && !target.closest('aside')) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      {!hideSidebar && (
        <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      )}
      
      <div 
        className={cn(
          "flex flex-col transition-all duration-300",
          !hideSidebar && (sidebarOpen ? "md:pl-64" : "md:pl-20")
        )}
        onClick={!hideSidebar ? handleContentClick : undefined}
      >
        <Header 
          toggleSidebar={!hideSidebar ? () => setSidebarOpen(!sidebarOpen) : undefined} 
          sidebarOpen={sidebarOpen} 
        />
        
        <main className={cn(
          "flex-1 px-4 py-6 md:px-6 lg:px-8 animate-fade-in",
          className
        )}>
          {children}
        </main>
        
        <footer className="py-4 px-4 md:px-6 lg:px-8 border-t border-slate-200/80 dark:border-slate-800/80 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MediTrack Pro. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default PageContainer;
