
import React from "react";
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
  FileCheck,
  CreditCard,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  TicketCheck,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
  const navigate = useNavigate();

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

const Sidebar: React.FC<SidebarProps> = ({ open, onOpenChange }) => {
  const location = useLocation();
  const isMobile = useIsMobile();

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
            href="/demo/dashboard"
            active={location.pathname === "/demo/dashboard"}
          />
          <SidebarItem
            icon={<Package size={20} />}
            label="Inventory"
            href="/demo/inventory"
            active={location.pathname === "/demo/inventory"}
          />
          <SidebarItem
            icon={<Stethoscope size={20} />}
            label="Devices"
            href="/demo/devices"
            active={location.pathname === "/demo/devices"}
          />
          <SidebarItem
            icon={<Truck size={20} />}
            label="Suppliers"
            href="/demo/suppliers"
            active={location.pathname === "/demo/suppliers"}
          />
          <SidebarItem
            icon={<TicketCheck size={20} />}
            label="Ticketing"
            href="/demo/ticket"
            active={location.pathname === "/demo/ticket"}
          />
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          <SidebarItem
            icon={<FileCheck size={20} />}
            label="Compliance"
            href="/demo/compliance"
            active={location.pathname === "/demo/compliance"}
          />
          <SidebarItem
            icon={<CreditCard size={20} />}
            label="Billing"
            href="/demo/billing"
            active={location.pathname === "/demo/billing"}
          />
          <SidebarItem
            icon={<Users size={20} />}
            label="Patients"
            href="/demo/patients"
            active={location.pathname === "/demo/patients"}
          />
          <SidebarItem
            icon={<BarChart3 size={20} />}
            label="Analytics"
            href="/demo/analytics"
            active={location.pathname === "/demo/analytics"}
          />
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          <SidebarItem
            icon={<Settings size={20} />}
            label="Settings"
            href="/demo/settings"
            active={location.pathname === "/demo/settings"}
          />
          <SidebarItem
            icon={<HelpCircle size={20} />}
            label="Help & Support"
            href="/demo/support"
            active={location.pathname === "/demo/support"}
          />
        </div>
      </ScrollArea>

      <div className="mt-auto p-4">
        <div className={cn(
          "rounded-lg bg-medical-50 dark:bg-slate-800 p-4 transition-all",
          !open && "md:hidden"
        )}>
          <p className="text-sm font-medium text-medical-900 dark:text-medical-100">
            Pro Trial Active
          </p>
          <p className="text-xs text-medical-700 dark:text-medical-200 mt-1">
            23 days remaining
          </p>
          <Button 
            className="w-full mt-3 bg-medical-500 hover:bg-medical-600 text-white" 
            size="sm"
          >
            Upgrade
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
