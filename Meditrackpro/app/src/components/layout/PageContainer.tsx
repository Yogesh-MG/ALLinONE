import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useNavigate, Navigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { baseUrl } from "@/utils/apiconfig";

interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  full_name: string;
  role: string | null;
  type: "admin" | "employee" | "user" | null;
  hospital_name?: string | null;
}

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  hideSidebar?: boolean;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className, 
  title, 
  subtitle, 
  hideSidebar = false 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const instanceKey = localStorage.getItem("instance_key");
        const response = await axios.get<UserData>(`${baseUrl}/api/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    fetchUserData();
  }, [token, navigate]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const handleContentClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (window.innerWidth < 768 && sidebarOpen && !target.closest('aside')) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      {!hideSidebar && (
        <Sidebar 
          open={sidebarOpen} 
          onOpenChange={setSidebarOpen} 
          userData={userData} // Pass userData to Sidebar
        />
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
          userData={userData}
        />
        
        <main className={cn(
          "flex-1 px-4 py-6 md:px-6 lg:px-8 animate-fade-in",
          className
        )}>
          {title && <h1 className="text-2xl font-bold mb-2">{title}</h1>}
          {subtitle && <p className="text-muted-foreground mb-4">{subtitle}</p>}
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