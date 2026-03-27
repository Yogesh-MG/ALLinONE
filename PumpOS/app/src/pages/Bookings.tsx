import { useState, useEffect } from "react";
import { Calendar, Clock, Users, Plus, Filter, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { NewClassDialog } from "@/components/bookings/NewClassDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/utils/api";

interface ClassInstance {
  id: number;
  name: string;
  schedule: string; // ISO format
  duration: string; // Duration in seconds
  instructor: string;
  room: string;
  capacity: number;
  booked: number;
  waitlist: number;
  status: 'upcoming' | 'in-progress' | 'full' | 'completed';
}

interface Booking {
  id: number;
  member: string; // Full name
  class_instance: ClassInstance;
  status: 'confirmed' | 'waitlist' | 'cancelled';
  booked_at: string;
  avatar: string;
}

interface WeeklySchedule {
  day: string;
  classes: number;
}

export default function Bookings() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [classes, setClasses] = useState<ClassInstance[]>([]);
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [classesRes, bookingsRes, scheduleRes] = await Promise.all([
          api.get(`/api/bookings/classes/?date=${selectedDate}`),
          api.get(`/api/bookings/bookings/?date=${selectedDate}`),
          api.get('/api/bookings/weekly-schedule/'),
        ]);
        setClasses(Array.isArray(classesRes.data) ? classesRes.data : []);
        setRecentBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
        setWeeklySchedule(Array.isArray(scheduleRes.data) ? scheduleRes.data : []);
      } catch (error: any) {
        setError('Failed to fetch booking data.');
        toast({
          title: 'Error',
          description: 'Failed to fetch booking data. Please try again.',
          variant: 'destructive',
        });
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedDate, toast, navigate]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-info/10 text-info">Upcoming</Badge>;
      case 'in-progress':
        return <Badge className="bg-success/10 text-success">In Progress</Badge>;
      case 'full':
        return <Badge className="bg-warning/10 text-warning">Full</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getBookingStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-success/10 text-success">Confirmed</Badge>;
      case 'waitlist':
        return <Badge className="bg-warning/10 text-warning">Waitlist</Badge>;
      case 'cancelled':
        return <Badge className="bg-destructive/10 text-destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCapacityColor = (booked: number, capacity: number) => {
    const percentage = (booked / capacity) * 100;
    if (percentage >= 100) return 'text-warning';
    if (percentage >= 80) return 'text-info';
    return 'text-muted-foreground';
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bookings & Scheduling</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" disabled={isLoading}>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border rounded-md"
            disabled={isLoading}
          />
          <NewClassDialog />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
          {error}
        </div>
      )}

      <Tabs defaultValue="classes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="classes" disabled={isLoading}>Today's Classes</TabsTrigger>
          <TabsTrigger value="schedule" disabled={isLoading}>Weekly Schedule</TabsTrigger>
          <TabsTrigger value="bookings" disabled={isLoading}>Recent Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="classes" className="space-y-4">
          <div className="grid gap-4 animate-fade-in">
            {isLoading ? (
              <div className="text-center text-muted-foreground">Loading classes...</div>
            ) : classes.length === 0 ? (
              <div className="text-center text-muted-foreground">No classes for {selectedDate}.</div>
            ) : (
              classes.map((classItem, index) => (
                <Card
                  key={classItem.id}
                  className="hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{classItem.name}</h3>
                          {getStatusBadge(classItem.status)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center animate-fade-in" style={{ animationDelay: `${index * 0.1 + 0.2}s` }}>
                            <Clock className="mr-2 h-4 w-4" />
                            {new Date(classItem.schedule).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })} - {new Date(new Date(classItem.schedule).getTime() + parseInt(classItem.duration) * 1000).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                          <div className="flex items-center animate-fade-in" style={{ animationDelay: `${index * 0.1 + 0.3}s` }}>
                            <Users className="mr-2 h-4 w-4" />
                            {classItem.instructor}
                          </div>
                          <div className="flex items-center animate-fade-in" style={{ animationDelay: `${index * 0.1 + 0.4}s` }}>
                            <MapPin className="mr-2 h-4 w-4" />
                            {classItem.room}
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="space-y-1">
                          <p className={`text-sm font-medium ${getCapacityColor(classItem.booked, classItem.capacity)}`}>
                            {classItem.booked}/{classItem.capacity} booked
                          </p>
                          {classItem.waitlist > 0 && (
                            <p className="text-xs text-warning animate-pulse">
                              {classItem.waitlist} on waitlist
                            </p>
                          )}
                        </div>
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              classItem.booked >= classItem.capacity
                                ? 'bg-warning'
                                : classItem.booked >= classItem.capacity * 0.8
                                ? 'bg-info'
                                : 'bg-success'
                            }`}
                            style={{
                              width: `${Math.min((classItem.booked / classItem.capacity) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Class Schedule</CardTitle>
              <CardDescription>Overview of classes scheduled for this week</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center text-muted-foreground">Loading schedule...</div>
              ) : weeklySchedule.length === 0 ? (
                <div className="text-center text-muted-foreground">No classes scheduled this week.</div>
              ) : (
                <div className="grid gap-4 md:grid-cols-7">
                  {weeklySchedule.map((day, index) => (
                    <div
                      key={day.day}
                      className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-all duration-300 cursor-pointer hover:scale-105 animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <h3 className="font-medium text-sm mb-2">{day.day}</h3>
                      <p className="text-2xl font-bold text-primary animate-pulse" style={{ animationDelay: `${index * 0.1 + 0.2}s` }}>
                        {day.classes}
                      </p>
                      <p className="text-xs text-muted-foreground">classes</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Schedule Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 md:grid-cols-3">
              <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-all duration-300 hover:scale-105 animate-fade-in">
                <h3 className="font-medium">Add Recurring Class</h3>
                <p className="text-sm text-muted-foreground">Set up weekly sessions</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <h3 className="font-medium">Block Time Slot</h3>
                <p className="text-sm text-muted-foreground">Reserve room/equipment</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <h3 className="font-medium">Copy Schedule</h3>
                <p className="text-sm text-muted-foreground">Duplicate to next week</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest class bookings and reservations</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center text-muted-foreground">Loading bookings...</div>
              ) : recentBookings.length === 0 ? (
                <div className="text-center text-muted-foreground">No recent bookings.</div>
              ) : (
                <div className="space-y-4">
                  {recentBookings.map((booking, index) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-all duration-300 hover:scale-[1.02] animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10 animate-pulse" style={{ animationDelay: `${index * 0.1 + 0.2}s` }}>
                          <AvatarImage src={booking.avatar} alt={booking.member} />
                          <AvatarFallback>
                            {booking.member.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{booking.member}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.class_instance.name} •{' '}
                            {new Date(booking.class_instance.schedule).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })} •{' '}
                            {new Date(booking.class_instance.schedule).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getBookingStatusBadge(booking.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}