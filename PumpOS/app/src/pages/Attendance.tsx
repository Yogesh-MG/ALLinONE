import { useState, useEffect } from "react";
import { UserCheck, Clock, Calendar, TrendingUp, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/dashboard/KPICard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";

interface LiveCheckin {
  id: number;
  member: string;
  timestamp: string;
  type: 'check-in' | 'check-out';
  location: string;
  duration: string;
  confidence?: number;
  avatar?: string;
}

interface AttendanceHistory {
  date: string;
  totalVisits: number;
  peakHour: string;
  avgDuration: string;
}

interface CurrentlyInGym {
  member: string;
  checkinTime: string;
  duration: string;
  avatar?: string;
}

interface AttendanceData {
  liveCheckins: LiveCheckin[];
  attendanceHistory: AttendanceHistory[];
  currentlyInGym: CurrentlyInGym[];
  kpi: {
    todaysCheckins: number;
    currentlyInGym: number;
    peakHour: string;
    avgDuration: string;
  };
}

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState<AttendanceData>({
    liveCheckins: [],
    attendanceHistory: [],
    currentlyInGym: [],
    kpi: {
      todaysCheckins: 0,
      currentlyInGym: 0,
      peakHour: 'N/A',
      avgDuration: '0m',
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendanceData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(`/api/attendance-summary/?date=${selectedDate}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        setData({
          liveCheckins: Array.isArray(response.data.liveCheckins) ? response.data.liveCheckins : [],
          attendanceHistory: Array.isArray(response.data.attendanceHistory) ? response.data.attendanceHistory : [],
          currentlyInGym: Array.isArray(response.data.currentlyInGym) ? response.data.currentlyInGym : [],
          kpi: response.data.kpi || {
            todaysCheckins: 0,
            currentlyInGym: 0,
            peakHour: 'N/A',
            avgDuration: '0m',
          },
        });
      } catch (error: any) {
        setError('Failed to fetch attendance data.');
        toast({
          title: 'Error',
          description: 'Failed to fetch attendance data. Please try again.',
          variant: 'destructive',
        });
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttendanceData();
  }, [selectedDate, toast, navigate]);

  const getConfidenceColor = (confidence: number | undefined) => {
    if (confidence === undefined) return 'bg-muted text-muted-foreground';
    if (confidence >= 95) return 'bg-success/10 text-success';
    if (confidence >= 90) return 'bg-warning/10 text-warning';
    return 'bg-destructive/10 text-destructive';
  };

  const getTypeIcon = (type: string) => {
    return type === 'check-in' ? '→' : '←';
  };

  const getTypeBadge = (type: string) => {
    return type === 'check-in' ? (
      <Badge className="bg-success/10 text-success">Check In</Badge>
    ) : (
      <Badge className="bg-info/10 text-info">Check Out</Badge>
    );
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
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
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <KPICard
          title="Today's Check-ins"
          value={isLoading ? '...' : data.kpi.todaysCheckins.toString()}
          change={{ value: '+12', type: 'increase' }}
          icon={UserCheck}
          description="vs yesterday"
        />
        <KPICard
          title="Currently In Gym"
          value={isLoading ? '...' : data.kpi.currentlyInGym.toString()}
          icon={Clock}
          description="Live count"
        />
        <KPICard
          title="Peak Hour"
          value={isLoading ? '...' : data.kpi.peakHour}
          icon={TrendingUp}
          description="Busiest time today"
        />
        <KPICard
          title="Avg Duration"
          value={isLoading ? '...' : data.kpi.avgDuration}
          change={{ value: '+8m', type: 'increase' }}
          icon={Calendar}
          description="Per visit"
        />
      </div>

      <Tabs defaultValue="live" className="space-y-4">
        <TabsList>
          <TabsTrigger value="live" disabled={isLoading}>Live Feed</TabsTrigger>
          <TabsTrigger value="history" disabled={isLoading}>History</TabsTrigger>
          <TabsTrigger value="currently" disabled={isLoading}>Currently In Gym</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCheck className="mr-2 h-5 w-5 text-primary" />
                Live Check-ins
              </CardTitle>
              <CardDescription>
                Real-time member check-ins with face recognition confidence scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center text-muted-foreground">Loading check-ins...</div>
              ) : data.liveCheckins.length === 0 ? (
                <div className="text-center text-muted-foreground">No check-ins for {selectedDate}.</div>
              ) : (
                <div className="space-y-4">
                  {data.liveCheckins.map((checkin) => (
                    <div
                      key={checkin.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={checkin.avatar} alt={checkin.member} />
                          <AvatarFallback>
                            {checkin.member.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{checkin.member}</p>
                          <p className="text-sm text-muted-foreground">
                            <Clock className="inline mr-1 h-3 w-3" />
                            {new Date(checkin.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getTypeBadge(checkin.type)}
                        <Badge variant="secondary" className={getConfidenceColor(checkin.confidence)}>
                          {checkin.confidence ? `${checkin.confidence}% confidence` : 'N/A'}
                        </Badge>
                        <span className="text-xl font-mono">{getTypeIcon(checkin.type)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
              <CardDescription>Daily attendance summary</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center text-muted-foreground">Loading history...</div>
              ) : data.attendanceHistory.length === 0 ? (
                <div className="text-center text-muted-foreground">No attendance history available.</div>
              ) : (
                <div className="space-y-4">
                  {data.attendanceHistory.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {new Date(day.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Peak: {day.peakHour} • Avg Duration: {day.avgDuration}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{day.totalVisits}</p>
                        <p className="text-sm text-muted-foreground">total visits</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="currently" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Currently In Gym</CardTitle>
              <CardDescription>Members who have checked in but not checked out</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center text-muted-foreground">Loading members...</div>
              ) : data.currentlyInGym.length === 0 ? (
                <div className="text-center text-muted-foreground">No members currently in gym.</div>
              ) : (
                <div className="space-y-4">
                  {data.currentlyInGym.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar} alt={member.member} />
                          <AvatarFallback>
                            {member.member.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.member}</p>
                          <p className="text-sm text-muted-foreground">
                            Checked in at {member.checkinTime}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{member.duration}</Badge>
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