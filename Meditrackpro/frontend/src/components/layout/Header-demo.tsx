
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
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          className="text-muted-foreground hover:text-foreground"
        >
          {sidebarOpen && isMobile ? <X size={20} /> : <Menu size={20} />}
        </Button>

        {!showSearch && !isMobile && (
          <a href="/login"><div className="hidden md:flex text-xl font-medium tracking-tight">
            MediTrack<span className="text-medical-500">Pro</span>
          </div></a>
        )}
      </div>

      <div className="flex-1 flex items-center justify-end gap-3">
        {showSearch ? (
          <div className="w-full max-w-md animate-fade-in">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full bg-background pl-8 focus-visible:ring-1"
                autoFocus
                onBlur={() => setShowSearch(false)}
              />
            </div>
          </div>
        ) : (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowSearch(true)}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Search"
          >
            <Search size={20} />
          </Button>
        )}

        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-foreground relative"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-medical-500 animate-pulse"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-8 w-8 rounded-full"
              aria-label="User menu"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-medical-100 text-medical-800">JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 animate-scale-in">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Dr. Jane Doe</p>
                <p className="text-xs leading-none text-muted-foreground">jane.doe@medtrack.pro</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <a href="/demo/settings"><DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem></a>
            <DropdownMenuSeparator />
            <a href="/"><DropdownMenuItem className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem></a>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
