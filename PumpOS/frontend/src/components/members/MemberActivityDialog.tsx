import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Calendar, 
  Clock, 
  MapPin, 
  TrendingUp, 
  User, 
  Dumbbell,
  Heart,
  Target,
  Award,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";

interface Member {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface Activity {
  id: number;
  type: string;
  title: string;
  timestamp: string;
  location: string;
  duration: string;
}

interface Booking {
  id: number;
  class_instance: {
    id: number;
    name: string;
    instructor: string;
    schedule: string;
    location?: string;
  };
  status: string;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  earned_date: string;
}

interface MemberActivityDialogProps {
  member: Member;
  trigger?: React.ReactNode;
}

export const MemberActivityDialog = ({ member, trigger }: MemberActivityDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [activityRes, bookingRes, achievementRes] = await Promise.all([
          api.get(`/api/activities/?member_id=${member.id}`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
          }),
          api.get(`/api/bookings/?member_id=${member.id}`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
          }),
          api.get(`/api/achievements/?member_id=${member.id}`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
          }),
        ]);
        setActivities(activityRes.data.results);
        setBookings(bookingRes.data.results);
        setAchievements(achievementRes.data.results);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to fetch member activity data.",
          variant: "destructive",
        });
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };
    if (open) {
      fetchData();
    }
  }, [open, member.id, toast, navigate]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'check-in':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'class':
        return <Dumbbell className="h-4 w-4 text-primary" />;
      case 'personal-training':
        return <User className="h-4 w-4 text-accent" />;
      default:
        return <Heart className="h-4 w-4 text-info" />;
    }
  };

  const workoutStats = [
    { label: "Total Workouts", value: activities.length.toString(), change: "", color: "text-primary" },
    { label: "Hours Trained", value: activities.reduce((sum, a) => sum + parseFloat(a.duration), 0).toFixed(1), change: "", color: "text-success" },
    { label: "Classes Attended", value: activities.filter(a => a.type === 'class').length.toString(), change: "", color: "text-accent" },
    { label: "Streak Days", value: "0", change: "", color: "text-warning" }, // Implement streak logic if needed
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10 transition-all duration-200">
            <Activity className="h-4 w-4" />
            View Activity
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto animate-fade-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Activity className="h-5 w-5 text-primary" />
            Member Activity Dashboard
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border">
          <Avatar className="h-16 w-16">
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
              {member.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-2xl font-bold">{member.name}</h3>
            <p className="text-muted-foreground">{member.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-success/10 text-success">Active Member</Badge>
              <Badge className="bg-primary/10 text-primary">Premium Plan</Badge>
            </div>
          </div>
        </div>

        <Tabs defaultValue="recent" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="bookings">Upcoming</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  {isLoading ? (
                    <div className="text-center text-muted-foreground">Loading activities...</div>
                  ) : activities.length === 0 ? (
                    <div className="text-center text-muted-foreground">No activities found.</div>
                  ) : (
                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-all duration-200">
                          <div className="p-2 rounded-lg bg-muted/50">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{activity.title}</h4>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(activity.timestamp).toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {activity.location}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span>Duration: {activity.duration}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {activity.type.replace('-', ' ')}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {workoutStats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.change}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/20">
                  <p className="text-muted-foreground">Chart visualization would go here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center text-muted-foreground">Loading bookings...</div>
                ) : bookings.length === 0 ? (
                  <div className="text-center text-muted-foreground">No upcoming bookings.</div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-all duration-200">
                        <div className="space-y-1">
                          <h4 className="font-semibold">{booking.class_instance.name}</h4>
                          <div className="text-sm text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(booking.class_instance.schedule).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(booking.class_instance.schedule).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {booking.class_instance.instructor}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {booking.class_instance.location || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-primary/10 text-primary">{booking.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Member Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center text-muted-foreground">Loading achievements...</div>
                ) : achievements.length === 0 ? (
                  <div className="text-center text-muted-foreground">No achievements earned.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievements.map((achievement) => (
                      <div key={achievement.id} className="p-4 border rounded-lg hover:shadow-md transition-all duration-300 hover:scale-105">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-muted/50">
                            <Award className="h-6 w-6 text-warning" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{achievement.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                            <p className="text-xs text-muted-foreground">
                              Earned: {new Date(achievement.earned_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};