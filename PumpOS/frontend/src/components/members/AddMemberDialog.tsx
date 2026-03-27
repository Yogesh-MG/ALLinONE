import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, User, Mail, Phone, Calendar, MapPin, CreditCard, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";

interface MembershipPlan {
  id: number;
  name: string;
}

interface AddMemberDialogProps {
  onMemberAdded?: () => void;
}

export const AddMemberDialog: React.FC<AddMemberDialogProps> = ({ onMemberAdded }) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    membershipType: "",
    joinDate: new Date().toISOString().split("T")[0],
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    dateOfBirth: "",
    gender: "",
  });

  // Camera State for Face Registration
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturingFace, setIsCapturingFace] = useState(false);
  const [faceCaptured, setFaceCaptured] = useState(false);
  const [capturedImageData, setCapturedImageData] = useState<string | null>(null); // Store image data in state

  useEffect(() => {
    const fetchMembershipPlans = async () => {
      try {
        const response = await api.get("/api/membership-plans/", {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        setMembershipPlans(response.data.results);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to fetch membership plans.",
          variant: "destructive",
        });
        if (error.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    fetchMembershipPlans();
  }, [toast, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleMembershipChange = (value: string) => {
    setFormData((prev) => ({ ...prev, membershipType: value }));
  };

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  // Start Face Capture
  const startFaceCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturingFace(true);
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Please allow camera access to register face.",
        variant: "destructive",
      });
    }
  };

  // Capture Face (store image data, don't save yet)
  const captureFace = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL("image/jpeg", 0.8);
      setCapturedImageData(imageData);
      setFaceCaptured(true);

      toast({
        title: "Face Captured!",
        description: "Face image ready for registration.",
      });

      // Stop stream
      if (videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      }
      setIsCapturingFace(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // First, create the member
      const memberResponse = await api.post("/api/members/", {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        membership_plan: formData.membershipType ? parseInt(formData.membershipType, 10) : null,
        join_date: formData.joinDate,
        address: formData.address || null,
        emergency_contact: formData.emergencyContact || null,
        emergency_phone: formData.emergencyPhone || null,
        date_of_birth: formData.dateOfBirth || null,
        gender: formData.gender || null,
        status: "Active",
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const memberId = memberResponse.data.id;

      // If face was captured, save embedding for the new member
      if (capturedImageData) {
        await api.post("/api/save-face-embedding/", {
          member_id: memberId,
          image: capturedImageData,
        }, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
      }

      toast({
        title: "Member Added",
        description: `New member ${formData.firstName} ${formData.lastName} has been added successfully!`,
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        membershipType: "",
        joinDate: new Date().toISOString().split("T")[0],
        address: "",
        emergencyContact: "",
        emergencyPhone: "",
        dateOfBirth: "",
        gender: "",
      });
      setFaceCaptured(false);
      setCapturedImageData(null);
      setOpen(false);
      if (onMemberAdded) onMemberAdded();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to add member.",
        variant: "destructive",
      });
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Plus className="h-5 w-5 text-primary" />
            Add New Member
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <User className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Personal Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  value={formData.firstName}
                  onChange={handleChange}
                  className="transition-all duration-200 focus:scale-[1.02]"
                  required 
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  value={formData.lastName}
                  onChange={handleChange}
                  className="transition-all duration-200 focus:scale-[1.02]"
                  required 
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input 
                  id="dateOfBirth" 
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="transition-all duration-200 focus:scale-[1.02]"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  value={formData.gender} 
                  onValueChange={handleGenderChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="transition-all duration-200 focus:scale-[1.02]">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Face Registration Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Camera className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Face Registration (for Automatic Check-in)</h3>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-4">Capture a clear front-facing photo for face recognition.</p>
              {!isCapturingFace ? (
                <Button onClick={startFaceCapture} variant="outline" disabled={faceCaptured || isSubmitting}>
                  {faceCaptured ? "Face Already Captured" : "Capture Face"}
                </Button>
              ) : (
                <div className="text-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    style={{ width: '100%', maxWidth: '300px', borderRadius: '8px' }}
                  />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                  <div className="flex gap-2 justify-center mt-4">
                    <Button onClick={captureFace} disabled={isSubmitting}>
                      Capture & Register
                    </Button>
                    <Button variant="outline" onClick={() => {
                      if (videoRef.current?.srcObject) {
                        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
                      }
                      setIsCapturingFace(false);
                    }} disabled={isSubmitting}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              {faceCaptured && (
                <Badge variant="default" className="bg-success text-success-foreground mt-2">
                  Face registered successfully!
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Mail className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Contact Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={handleChange}
                  className="transition-all duration-200 focus:scale-[1.02]"
                  required 
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={formData.phone}
                  onChange={handleChange}
                  className="transition-all duration-200 focus:scale-[1.02]"
                  required 
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea 
                id="address" 
                value={formData.address}
                onChange={handleChange}
                className="transition-all duration-200 focus:scale-[1.02]"
                placeholder="Enter full address" 
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Phone className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Emergency Contact</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                <Input 
                  id="emergencyContact" 
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="transition-all duration-200 focus:scale-[1.02]"
                  placeholder="Contact name" 
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                <Input 
                  id="emergencyPhone" 
                  type="tel" 
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  className="transition-all duration-200 focus:scale-[1.02]"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <CreditCard className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Membership Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="joinDate">Join Date</Label>
                <Input 
                  id="joinDate" 
                  type="date"
                  value={formData.joinDate}
                  onChange={handleChange}
                  className="transition-all duration-200 focus:scale-[1.02]"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="membershipType">Membership Type</Label>
                <Select 
                  value={formData.membershipType} 
                  onValueChange={handleMembershipChange}
                  disabled={isSubmitting || membershipPlans.length === 0}
                >
                  <SelectTrigger className="transition-all duration-200 focus:scale-[1.02]">
                    <SelectValue placeholder="Select membership" />
                  </SelectTrigger>
                  <SelectContent>
                    {membershipPlans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id.toString()}>
                        {plan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Initial Status:</span>
                <Badge className="bg-success/10 text-success">
                  Active
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="hover:scale-105 transition-all duration-200"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="hover:scale-105 transition-all duration-200 bg-gradient-to-r from-primary to-accent"
              disabled={isSubmitting}
            >
              <Plus className="h-4 w-4 mr-2" />
              {isSubmitting ? "Adding..." : "Add Member"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};