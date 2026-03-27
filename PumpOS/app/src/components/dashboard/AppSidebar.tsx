import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  Users,
  UserCheck,
  Calendar,
  DollarSign,
  Target,
  MessageSquare,
  Users2,
  Settings,
  ChevronDown,
  Activity,
  CreditCard,
  Phone,
  Mail
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const mainNavItems = [
  { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
  { title: "Members", url: "/members", icon: Users },
  { title: "Attendance", url: "/attendance", icon: UserCheck },
  { title: "Bookings", url: "/bookings", icon: Calendar },
];

const businessNavItems = [
  { title: "Sales & Billing", url: "/sales", icon: DollarSign },
  { title: "CRM & Leads", url: "/leads", icon: Target },
  { title: "Marketing", url: "/marketing", icon: MessageSquare },
];

const managementNavItems = [
  { title: "Staff", url: "/staff", icon: Users2 },
  { title: "Settings", url: "/settings", icon: Settings },
];

const marketingSubItems = [
  { title: "Campaigns", url: "/marketing/campaigns", icon: Mail },
  { title: "SMS", url: "/marketing/sms", icon: Phone },
  { title: "Referrals", url: "/marketing/referrals", icon: Users },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMarketingOpen, setIsMarketingOpen] = useState(false);
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" : "hover:bg-muted/50";

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-card border-r">
        {/* Logo Section */}
        <div className="p-4 border-b">
          {!collapsed ? (
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">FitnessCRM</span>
            </div>
          ) : (
            <Activity className="h-8 w-8 text-primary mx-auto" />
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Business Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Business
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {businessNavItems.map((item) => {
                if (item.title === "Marketing" && !collapsed) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <Collapsible open={isMarketingOpen} onOpenChange={setIsMarketingOpen}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="w-full justify-between">
                            <div className="flex items-center">
                              <item.icon className="h-5 w-5 mr-3" />
                              <span>{item.title}</span>
                            </div>
                            <ChevronDown className={`h-4 w-4 transition-transform ${isMarketingOpen ? 'rotate-180' : ''}`} />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="ml-6 mt-1 space-y-1">
                          {marketingSubItems.map((subItem) => (
                            <SidebarMenuButton key={subItem.title} asChild size="sm">
                              <NavLink to={subItem.url} className={getNavCls}>
                                <subItem.icon className="h-4 w-4" />
                                <span>{subItem.title}</span>
                              </NavLink>
                            </SidebarMenuButton>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    </SidebarMenuItem>
                  );
                }
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavCls}>
                        <item.icon className="h-5 w-5" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}