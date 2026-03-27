
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Bell, 
  Search, 
  Menu, 
  X,
  User,
  Settings,
  LogOut
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  toggleSidebar, 
  sidebarOpen, 
  className 
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const isMobile = useIsMobile();

  return (
    <header className={cn(
      "sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-background/80 backdrop-blur-sm px-4 transition-all duration-300",
      className
    )}>
      <div className="flex items-center gap-3">

        {!showSearch && !isMobile && (
          <a href="/login"><div className="hidden md:flex text-xl font-medium tracking-tight">
            MediTrack<span className="text-medical-500">Pro</span>
          </div></a>
        )}
      </div>

      
    </header>
  );
};

export default Header;
