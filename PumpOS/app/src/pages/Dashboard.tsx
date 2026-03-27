import { useState } from "react";
import { Users, DollarSign, UserCheck, TrendingUp, Activity, Calendar, Target, Zap, Plus, ArrowRight, CreditCard, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { KPICard } from "@/components/dashboard/KPICard";
import { RevenueChart, AttendanceChart } from "@/components/dashboard/DashboardChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const recentActivity = [
  {
    id: 1,
    member: "Sarah Johnson",
    action: "Checked in",
    time: "2 min ago",
    avatar: "/placeholder.svg",
    confidence: 98
  },
  {
    id: 2,
    member: "Mike Davis",
    action: "Booked Yoga Class",
    time: "5 min ago",
    avatar: "/placeholder.svg",
    confidence: 95
  },
  {
    id: 3,
    member: "Emma Wilson",
    action: "Payment received",
    time: "12 min ago",
    avatar: "/placeholder.svg",
    confidence: 100
  },
  {
    id: 4,
    member: "James Brown",
    action: "Checked out",
    time: "18 min ago",
    avatar: "/placeholder.svg",
    confidence: 92
  }
];

const upcomingClasses = [
  { id: 1, name: "Morning Yoga", time: "9:00 AM", instructor: "Lisa Chen", spots: "8/12" },
  { id: 2, name: "HIIT Training", time: "10:30 AM", instructor: "Mike Torres", spots: "12/15" },
  { id: 3, name: "Pilates", time: "12:00 PM", instructor: "Sarah Williams", spots: "6/10" },
  { id: 4, name: "Spin Class", time: "2:00 PM", instructor: "David Kim", spots: "15/20" }
];

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("7d");
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="space-y-8 p-6">
      {/* Enhanced Header with Gradient */}
      <div className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-background rounded-xl border border-border/50 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground text-lg">Welcome back! Here's what's happening at your gym today.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="bg-success/10 text-success border-success/30 px-3 py-1">
              <Activity className="mr-2 h-4 w-4" />
              System Healthy
            </Badge>
            <Button className="shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-primary to-accent">
              <Plus className="h-4 w-4 mr-2" />
              Quick Action
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <KPICard
          title="Total Members"
          value="1,234"
          change={{ value: "+12%", type: "increase" }}
          icon={Users}
          description="Active memberships"
        />
        <KPICard
          title="Monthly Revenue"
          value="$47,250"
          change={{ value: "+8.2%", type: "increase" }}
          icon={DollarSign}
          description="This month"
        />
        <KPICard
          title="Today's Check-ins"
          value="89"
          change={{ value: "+15%", type: "increase" }}
          icon={UserCheck}
          description="Last updated 2 min ago"
        />
        <KPICard
          title="Conversion Rate"
          value="24.5%"
          change={{ value: "+2.1%", type: "increase" }}
          icon={TrendingUp}
          description="Leads to members"
        />
      </div>

      {/* Enhanced Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card/50 to-card">
          <RevenueChart />
        </Card>
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card/50 to-card">
          <AttendanceChart />
        </Card>
      </div>

      {/* Enhanced Activity & Classes */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card/50 to-card overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Recent Activity</CardTitle>
                  <CardDescription>Live member check-ins and activities</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <ScrollArea className="h-80 px-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src={activity.avatar} alt={activity.member} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {activity.member.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold leading-none">{activity.member}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                      {activity.confidence && (
                        <Badge className="bg-success/10 text-success border-success/30 text-xs">
                          {activity.confidence}%
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-card/50 to-card overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-xl">Upcoming Classes</CardTitle>
                  <CardDescription>Today's scheduled classes</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="hover:bg-accent/10">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <ScrollArea className="h-80 px-6">
              <div className="space-y-4">
                {upcomingClasses.map((classItem) => (
                  <div key={classItem.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold leading-none">{classItem.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center space-x-2">
                        <span>{classItem.time}</span>
                        <span>•</span>
                        <span>{classItem.instructor}</span>
                      </p>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/30">
                      {classItem.spots}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Quick Actions */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-card/50 to-card">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div 
              className="group p-6 border rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-105 bg-gradient-to-br from-background to-muted/20"
              onClick={() => {
                toast({
                  title: "Add Member",
                  description: "Redirecting to member registration...",
                });
                navigate('/members');
              }}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Add Member</h3>
              </div>
              <p className="text-sm text-muted-foreground">Register new member</p>
            </div>
            <div 
              className="group p-6 border rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-105 bg-gradient-to-br from-background to-muted/20"
              onClick={() => {
                toast({
                  title: "Check-in Member",
                  description: "Opening check-in interface...",
                });
              }}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 rounded-lg bg-success/10 group-hover:bg-success/20 transition-colors">
                  <UserCheck className="h-5 w-5 text-success" />
                </div>
                <h3 className="font-semibold">Check-in Member</h3>
              </div>
              <p className="text-sm text-muted-foreground">Manual check-in</p>
            </div>
            <div 
              className="group p-6 border rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-105 bg-gradient-to-br from-background to-muted/20"
              onClick={() => {
                toast({
                  title: "Create Class",
                  description: "Opening class creation...",
                });
                navigate('/bookings');
              }}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-semibold">Create Class</h3>
              </div>
              <p className="text-sm text-muted-foreground">Schedule new class</p>
            </div>
            <div 
              className="group p-6 border rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-105 bg-gradient-to-br from-background to-muted/20"
              onClick={() => {
                toast({
                  title: "Process Payment",
                  description: "Opening payment processing...",
                });
                navigate('/sales');
              }}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 rounded-lg bg-warning/10 group-hover:bg-warning/20 transition-colors">
                  <DollarSign className="h-5 w-5 text-warning" />
                </div>
                <h3 className="font-semibold">Process Payment</h3>
              </div>
              <p className="text-sm text-muted-foreground">Manual payment entry</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}