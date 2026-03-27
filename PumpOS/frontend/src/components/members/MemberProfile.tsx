import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Edit, 
  MessageSquare, 
  UserX,
  Activity,
  CreditCard
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";
import { EditMemberDialog } from "./EditMemberDialog";
import { MessageMemberDialog } from "./MessageMemberDialog";

interface Activity {
  id: number;
  type: string;
  title: string;
  timestamp: string;
  duration: string;
}

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  membership: string;
  join_date: string;
  status: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  date_of_birth?: string;
  gender?: string;
  activities?: Activity[];
  avatar?: string;
}

interface MemberProfileProps {
  member: Member | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MemberProfile = ({ member, open, onOpenChange }: MemberProfileProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [fullMemberData, setFullMemberData] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && member) {
      const fetchMemberData = async () => {
        setIsLoading(true);
        try {
          const response = await api.get(`/api/members/${member.id}/`, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
            }
          });
          setFullMemberData({
            ...response.data,
            activities: response.data.activities || []
          });
        } catch (error: any) {
          toast({
            title: "Error",
            description: "Failed to fetch member details.",
            variant: "destructive",
          });
          if (error.response?.status === 401) {
            navigate("/login");
          }
        } finally {
          setIsLoading(false);
        }
      };
      fetchMemberData();
    }
  }, [open, member, toast, navigate]);

  const handleDeactivate = async () => {
    try {
      await api.put(`/api/members/${fullMemberData?.id}/`, { status: "Suspended" }, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast({
        title: "Member Deactivated",
        description: `${fullMemberData?.name} has been deactivated.`,
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to deactivate member.",
        variant: "destructive",
      });
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  if (!fullMemberData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Member Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={fullMemberData.avatar} />
              <AvatarFallback className="text-lg">
                {fullMemberData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h3 className="text-2xl font-bold">{fullMemberData.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={fullMemberData.status === 'Active' ? 'default' : 'secondary'}>
                  {fullMemberData.status}
                </Badge>
                <Badge variant="outline">{fullMemberData.membership}</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {fullMemberData.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {fullMemberData.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Joined {new Date(fullMemberData.join_date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {fullMemberData.address || 'N/A'}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <EditMemberDialog 
                member={fullMemberData}
                trigger={
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                }
              />
              <MessageMemberDialog
                member={fullMemberData}
                trigger={
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                }
              />
              <Button size="sm" variant="destructive" onClick={handleDeactivate}>
                <UserX className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center text-muted-foreground">Loading activities...</div>
                  ) : fullMemberData.activities.length === 0 ? (
                    <div className="text-center text-muted-foreground">No activities found.</div>
                  ) : (
                    <div className="space-y-3">
                      {fullMemberData.activities.map((item) => (
                        <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{new Date(item.timestamp).toLocaleDateString()}</p>
                          </div>
                          <Badge variant="outline">{new Date(item.timestamp).toLocaleTimeString()}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="billing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Billing Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Current Plan:</span>
                      <Badge>{fullMemberData.membership || 'None'}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Fee:</span>
                      <span className="font-semibold">N/A</span> {/* Fetch from backend if available */}
                    </div>
                    <div className="flex justify-between">
                      <span>Next Billing:</span>
                      <span>N/A</span> {/* Fetch from backend if available */}
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span>N/A</span> {/* Fetch from backend if available */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Date of Birth</Label>
                      <p>{fullMemberData.date_of_birth ? new Date(fullMemberData.date_of_birth).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <Label>Gender</Label>
                      <p>{fullMemberData.gender || 'N/A'}</p>
                    </div>
                    <div>
                      <Label>Emergency Contact</Label>
                      <p>{fullMemberData.emergency_contact || 'N/A'}</p>
                    </div>
                    <div>
                      <Label>Emergency Phone</Label>
                      <p>{fullMemberData.emergency_phone || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <Label>Address</Label>
                      <p>{fullMemberData.address || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};