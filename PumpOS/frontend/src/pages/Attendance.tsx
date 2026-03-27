import { useState, useEffect, useRef, useCallback } from "react";
import { UserCheck, Clock, Calendar, TrendingUp, Filter, Camera, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/dashboard/KPICard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";

// --- Interfaces ---
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
  // --- Existing State ---
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState<AttendanceData>({
    liveCheckins: [],
    attendanceHistory: [],
    currentlyInGym: [],
    kpi: { todaysCheckins: 0, currentlyInGym: 0, peakHour: 'N/A', avgDuration: '0m' },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // --- New Kiosk Mode State ---
  const [isKioskMode, setIsKioskMode] = useState(false);
  const [scanStatus, setScanStatus] = useState("Waiting for member...");
  const [lastScannedMember, setLastScannedMember] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { toast } = useToast();
  const navigate = useNavigate();

  // --- 1. Fetch Dashboard Data (Existing Logic) ---
  const fetchAttendanceData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/attendance-summary/?date=${selectedDate}`);
      setData({
        liveCheckins: Array.isArray(response.data.liveCheckins) ? response.data.liveCheckins : [],
        attendanceHistory: Array.isArray(response.data.attendanceHistory) ? response.data.attendanceHistory : [],
        currentlyInGym: Array.isArray(response.data.currentlyInGym) ? response.data.currentlyInGym : [],
        kpi: response.data.kpi || { todaysCheckins: 0, currentlyInGym: 0, peakHour: 'N/A', avgDuration: '0m' },
      });
    } catch (error: any) {
      setError('Failed to fetch attendance data.');
      if (error.response?.status === 401) navigate('/login');
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, navigate]);

  useEffect(() => {
    if (!isKioskMode) {
      fetchAttendanceData();
    }
  }, [fetchAttendanceData, isKioskMode]);

  // --- 2. Kiosk/Camera Logic (New) ---

  // Start Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      toast({ title: "Camera Error", description: "Could not access webcam.", variant: "destructive" });
      setIsKioskMode(false); // Exit if camera fails
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Toggle Kiosk Mode
  useEffect(() => {
    if (isKioskMode) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera(); // Cleanup on unmount
  }, [isKioskMode]);

  // Capture & Send Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isKioskMode) {
      interval = setInterval(async () => {
        if (videoRef.current && canvasRef.current) {
          const context = canvasRef.current.getContext('2d');
          if (context) {
            // Draw video frame to hidden canvas
            context.drawImage(videoRef.current, 0, 0, 640, 480);
            const imageSrc = canvasRef.current.toDataURL('image/jpeg');

            // Send to Backend
            try {
              // NOTE: Update URL if your backend path is different
              const response = await api.post('/api/face-recognition/', { image: imageSrc });

              if (response.data.attendance_updated) {
                const memberName = response.data.member_name || "Member";
                
                // Only toast if it's a new person or some time has passed (simple debounce UI)
                if (lastScannedMember !== memberName) {
                  setScanStatus(`Welcome, ${memberName}!`);
                  setLastScannedMember(memberName);
                  toast({
                    title: "Check-in Successful",
                    description: `Welcome back, ${memberName}`,
                    className: "bg-green-100 border-green-500 text-green-900"
                  });
                  
                  // Clear "last scanned" after 5 seconds so they can scan again if needed
                  setTimeout(() => setLastScannedMember(null), 5000);
                }
              } else {
                 // Reset status if no one found
                 if (!lastScannedMember) setScanStatus("Scanning...");
              }
            } catch (err) {
              console.error("Scan error", err);
            }
          }
        }
      }, 2000); // Scan every 2 seconds
    }

    return () => clearInterval(interval);
  }, [isKioskMode, lastScannedMember, toast]);


  // --- Helper Functions (Existing) ---
  const getConfidenceColor = (confidence: number | undefined) => {
    if (confidence === undefined) return 'bg-muted text-muted-foreground';
    if (confidence >= 95) return 'bg-success/10 text-success';
    if (confidence >= 90) return 'bg-warning/10 text-warning';
    return 'bg-destructive/10 text-destructive';
  };

  const getTypeIcon = (type: string) => (type === 'check-in' ? '→' : '←');

  const getTypeBadge = (type: string) => (
    type === 'check-in' 
      ? <Badge className="bg-success/10 text-success">Check In</Badge> 
      : <Badge className="bg-info/10 text-info">Check Out</Badge>
  );

  // --- 3. Render View ---

  // KIOSK VIEW
  if (isKioskMode) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] bg-black/90 p-6 rounded-xl relative">
        <Button 
          variant="secondary" 
          className="absolute top-4 right-4 z-50"
          onClick={() => setIsKioskMode(false)}
        >
          <X className="mr-2 h-4 w-4" /> Exit Kiosk
        </Button>

        <Card className="w-full max-w-2xl border-none bg-transparent shadow-none">
          <CardHeader className="text-center text-white">
            <CardTitle className="text-4xl">Face Attendance</CardTitle>
            <CardDescription className="text-gray-400 text-lg">Please look at the camera to check in</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            <div className="relative border-4 border-primary/50 rounded-xl overflow-hidden shadow-2xl shadow-primary/20">
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                playsInline
                className="w-[640px] h-[480px] object-cover"
              />
              {/* Overlay scanning line animation could go here */}
              <div className="absolute inset-0 border-2 border-white/20 rounded-xl pointer-events-none" />
            </div>
            
            <div className="text-center space-y-2">
              <Badge variant="outline" className="text-xl px-6 py-2 bg-white/10 text-white border-none">
                {scanStatus}
              </Badge>
            </div>

            {/* Hidden Canvas for Processing */}
            <canvas ref={canvasRef} width="640" height="480" className="hidden" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // DASHBOARD VIEW (Original)
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
        <div className="flex items-center space-x-2">
          {/* New Kiosk Button */}
          <Button onClick={() => setIsKioskMode(true)} className="bg-primary hover:bg-primary/90">
            <Camera className="mr-2 h-4 w-4" />
            Kiosk Mode
          </Button>

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
                          {checkin.confidence ? `${checkin.confidence}%` : 'N/A'}
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