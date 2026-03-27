import { useState, useEffect } from "react";
import { Bell, Search, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import api from "@/utils/api"; // Import the configured Axios instance
import { useNavigate } from "react-router-dom";
import { baseUrl } from "@/utils/apiconfig";
import { AxiosError } from "axios";

// Define the shape of the user data
interface UserProfile {
  email: string;
  first_name: string;
  last_name: string;
}

export function TopNavbar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user profile data on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`${baseUrl}/api/profile/`,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(response.data);
      } catch (error: unknown) {

        if (error instanceof AxiosError) {
          console.error("Error fetching user profile:", error.response?.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch user profile.",
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if token exists
    if (localStorage.getItem("token")) {
      fetchUserProfile();
    } else {
      navigate("/login");
    }
  }, [navigate, toast]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  return (
    <header className="h-16 border-b bg-gradient-to-r from-primary/10 via-background to-secondary/10 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
      <div className="flex h-16 items-center px-6 gap-6">
        {/* Sidebar Toggle */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="mr-2 transition-transform duration-200 hover:scale-110" />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hover:bg-primary/20 transition-all duration-300 rounded-full"
          >
            {collapsed ? (
              <Menu className="h-5 w-5 text-primary animate-pulse" />
            ) : (
              <X className="h-5 w-5 text-primary animate-pulse" />
            )}
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
          <Input
            type="search"
            placeholder="Search members, classes, bookings..."
            className="pl-10 pr-4 py-2 rounded-full bg-background/80 border border-muted/50 focus:border-primary/50 transition-all duration-300 hover:shadow-md"
          />
        </div>

        {/* Right Section: Notifications and Profile */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-primary/20 rounded-full transition-all duration-300"
              >
                <Bell className="h-5 w-5 text-primary animate-pulse" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-destructive animate-bounce">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-background/95 backdrop-blur-sm border border-primary/20 shadow-xl rounded-lg">
              <DropdownMenuLabel className="text-primary font-semibold">
                Notifications
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-primary/10" />
              <DropdownMenuItem className="hover:bg-primary/10 transition-colors duration-200">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">New member registration</p>
                  <p className="text-xs text-muted-foreground">
                    Sarah Johnson joined Premium membership
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-primary/10 transition-colors duration-200">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Payment received</p>
                  <p className="text-xs text-muted-foreground">
                    Monthly subscription from Mike Davis
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-primary/10 transition-colors duration-200">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Class fully booked</p>
                  <p className="text-xs text-muted-foreground">
                    Yoga class at 6 PM has reached capacity
                  </p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full hover:bg-primary/20 transition-all duration-300"
                disabled={isLoading}
              >
                <Avatar className="h-10 w-10 ring-2 ring-primary/20 hover:ring-primary/50 transition-all duration-300">
                  <AvatarImage src="/placeholder.svg" alt="@admin" />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {user ? `${user.first_name[0]}${user.last_name[0]}` : "AD"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-64 bg-background/95 backdrop-blur-sm border border-primary/20 shadow-xl rounded-lg"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2 p-2">
                  <p className="text-sm font-semibold text-primary leading-none">
                    {user ? `${user.first_name} ${user.last_name}` : "Admin User"}
                  </p>
                  <p className="text-xs text-muted-foreground leading-none">
                    {user ? user.email : "admin@fitnesscrm.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-primary/10" />
              <DropdownMenuItem className="hover:bg-primary/10 transition-colors duration-200">
                <User className="mr-2 h-4 w-4 text-primary" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-primary/10 transition-colors duration-200">
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-primary/10" />
              <DropdownMenuItem
                className="hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors duration-200"
                onClick={handleLogout}
              >
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}