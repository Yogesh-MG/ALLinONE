import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  LayoutDashboard,
  Package,
  Stethoscope,
  Truck,
  TicketCheck,
  FileCheck,
  CreditCard,
  Users,
  Brain,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Hospital,
} from "lucide-react";
import axios from "axios";
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
  hospital?: number | null;
  subscription?: {
    plan: string;
    end_date: string;
    payment_status: string;
  } | null;
  gstin?: string | null;
}

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: UserData | null;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  disabled?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  href,
  active,
  disabled,
}) => {
  const navigate = useNavigate(); // Already correct here

  const handleClick = () => {
    if (!disabled) {
      navigate(href);
    }
  };

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 font-normal transition-all duration-300",
        active && "bg-primary/10 text-primary-foreground font-medium",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={handleClick}
      disabled={disabled}
    >
      {icon}
      <span>{label}</span>
      {disabled && (
        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
          Soon
        </span>
      )}
    </Button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ open, onOpenChange, userData }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const navigate = useNavigate(); // Add this here to fix the error
  const [remainingDays, setRemainingDays] = useState<number | null>(null);
  const [profileData, setProfileData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${baseUrl}/api/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData(response.data);
        const subscription = response.data.subscription;
        if (subscription && subscription.end_date) {
          const endDate = new Date(subscription.end_date);
          const currentDate = new Date();
          const timeDiff = endDate.getTime() - currentDate.getTime();
          const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
          setRemainingDays(daysLeft > 0 ? daysLeft : 0);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setRemainingDays(23);
      }
    };

    if (userData) {
      fetchUserProfile();
    }
  }, [userData]);

  const handleUpgradeClick = () => {
    if (profileData) {
      setTimeout(() => {
        navigate(
          `/payment?hospital_id=${encodeURIComponent(profileData.hospital || "")}&hospital_name=${encodeURIComponent(profileData.hospital_name || "")}&admin_email=${encodeURIComponent(profileData.email || "")}&gstin=${encodeURIComponent(profileData.gstin || "")}`
        );
      }, 1500);
    } else {
      console.error("Profile data not available for redirect");
    }
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex w-64 flex-col bg-sidebar border-r border-slate-200/80 dark:border-slate-800/80 shadow-soft transition-all duration-300 ease-in-out",
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className={cn("flex items-center", !open && "md:hidden")}>
          <span className="flex items-center text-xl font-medium tracking-tight">
            Medi<span className="text-medical-500">Track</span>
          </span>
        </div>
        <div className={cn("hidden", !open && "md:block md:mx-auto")}>
          <span className="text-xl font-bold text-medical-500">M</span>
        </div>
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(!open)}
            className="ml-auto text-muted-foreground hover:text-foreground"
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          >
            {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            href="/dashboard"
            active={location.pathname === "/dashboard"}
          />
          {userData?.type === "admin" && ( // Admin-only link
            <SidebarItem
              icon={<Hospital size={20} />}
              label="Admin Dashboard"
              href="/hospital-dashboard"
              active={location.pathname === "//hospital-dashboard"}
            />
          )}
          <SidebarItem
            icon={<Package size={20} />}
            label="Inventory"
            href="/inventory"
            active={location.pathname === "/inventory"}
          />
          <SidebarItem
            icon={<Stethoscope size={20} />}
            label="Devices"
            href="/devices"
            active={location.pathname === "/devices"}
          />
          <SidebarItem
            icon={<Truck size={20} />}
            label="Suppliers"
            href="/suppliers"
            active={location.pathname === "/suppliers"}
          />
          <SidebarItem
            icon={<TicketCheck size={20} />}
            label="Ticketing"
            href="/ticket"
            active={location.pathname === "/ticket"}
          />
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          <SidebarItem
            icon={<FileCheck size={20} />}
            label="Compliance"
            href="/compliance"
            active={location.pathname === "/compliance"}
          />
          <SidebarItem
            icon={<CreditCard size={20} />}
            label="Billing"
            href="/billing"
            active={location.pathname === "/billing"}
          />
          <SidebarItem
            icon={<Users size={20} />}
            label="Patients"
            href="/patients"
            active={location.pathname === "/patients"}
          />
          <SidebarItem
            icon={<Brain size={20} />}
            label="AI Test Lab"
            href="/ai-test-lab"
            active={location.pathname === "/ai-test-lab"}
          />
          <SidebarItem
            icon={<BarChart3 size={20} />}
            label="Analytics"
            href="/analytics"
            active={location.pathname === "/analytics"}
          />
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          <SidebarItem
            icon={<Settings size={20} />}
            label="Settings"
            href="/settings"
            active={location.pathname === "/settings"}
          />
          <SidebarItem
            icon={<HelpCircle size={20} />}
            label="Help & Support"
            href="/support"
            active={location.pathname === "/support"}
          />
        </div>
      </ScrollArea>

      <div className="mt-auto p-4">
        <div
          className={cn(
            "rounded-lg bg-medical-50 dark:bg-slate-800 p-4 transition-all",
            !open && "md:hidden"
          )}
        >
          <p className="text-sm font-medium text-medical-900 dark:text-medical-100">
            {userData?.subscription?.plan
              ? `${userData.subscription.plan.charAt(0).toUpperCase() + userData.subscription.plan.slice(1)} Active`
              : "Pro Trial Active"}
          </p>
          <p className="text-xs text-medical-700 dark:text-medical-200 mt-1">
            {remainingDays !== null ? `${remainingDays} days remaining` : "Loading..."}
          </p>
          {remainingDays !== null && remainingDays <= 5 && (
          <Button
            className="w-full mt-3 bg-medical-500 hover:bg-medical-600 text-white"
            size="sm"
            onClick={handleUpgradeClick}
          >
            Upgrade
          </Button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;