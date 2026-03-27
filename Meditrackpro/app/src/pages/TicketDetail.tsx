import React, { useState, useEffect,useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  ListTodo,
  MapPin,
  MessageCircle,
  Paperclip,
  Send,
  User,
  UserCircle2,
} from "lucide-react";
import axios from "axios";
import { formatDistanceToNow, format } from "date-fns";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { baseUrl } from "@/utils/apiconfig";

interface Ticket {
  ticket_id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  location: string;
  created_at: string;
  updated_at: string;
  created_by: { name:string } | null;
  assigned_to: { employee_id: string; name: string} | null;
  device: { device_id: string; device_type: string; model: string; manufacturer: string } | null;
  comments: Array<{
    id: number;
    content: string;
    author: { name:string, role: string } | null;
    created_at: string;
    file: string | null;
  }>;
}

interface Engineer {
  employee_id: string;
  name: string;
}

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

const TicketDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState<string>("unassigned"); // Default to "unassigned"
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hospitalId, setHospitalId] = useState<string | null>(null);
  const [currentEmployeeId, setCurrentEmployeeId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<UserData | null>(null);
  const [file, setfile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfileAndHospital = async () => {
      try {
        const hospitalIdFromStorage = localStorage.getItem("hospitalid");
        if (!hospitalIdFromStorage) {
          throw new Error("Hospital ID not found in localStorage.");
        }
        if (!token) {
          throw new Error("No authentication token found.");
        }
        setHospitalId(hospitalIdFromStorage);

        const response = await axios.get(`${baseUrl}/api/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData(response.data);
        console.log("User Profile Response:", response.data); // Debug log
        if (!response.data.employee_id) {
          throw new Error("Employee ID not found in profile.");
        }
        setCurrentEmployeeId(response.data.employee_id);
      } catch (err) {
        console.error("Profile Fetch Error:", err);
        const errorMessage = err.message || "Failed to load user profile.";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    fetchProfileAndHospital();
  }, [token]);

  useEffect(() => {
    if (!hospitalId || !currentEmployeeId || !id) return;

    const fetchTicket = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/api/${hospitalId}/tickets/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Ticket API Response:", response.data); // Debug log
        setTicket(response.data);
        setStatus(response.data.status);
        setAssignedTo(response.data.assigned_to?.employee_id || "unassigned"); // Use "unassigned" instead of ""
        setError(null);
      } catch (err) {
        console.error("Fetch Ticket Error:", err);
        const errorMessage = err.response?.data?.detail || "Failed to fetch ticket.";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchEngineers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/hospitals/${hospitalId}/employees/`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { role: "engineer"},
        });
        console.log("Engineers API Response:", response.data); // Debug log
        const engineerData = Array.isArray(response.data) ? response.data : response.data.results || [];
        setEngineers(engineerData.map((e) => ({
          employee_id: e.employee_id || e.id,
          name: e.name
        })));
        console.log("mapped engineer", engineerData)
      } catch (err) {
        console.error("Fetch Engineers Error:", err);
        toast({
          title: "Error",
          description: "Failed to load engineers.",
          variant: "destructive",
        });
      }
    };

    fetchTicket();
    fetchEngineers();
  }, [hospitalId, currentEmployeeId, id, token]);

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("content", comment);
      formData.append("author_id", currentEmployeeId!);
      if (file) formData.append("file", file);
      const response = await axios.post(
        `${baseUrl}/api/${hospitalId}/tickets/${id}/comments/`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );
      setTicket({ ...ticket!, comments: [...ticket!.comments, response.data], updated_at: new Date().toISOString() });
      setComment("");
      setfile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast({ title: "Success", description: "Comment added successfully." });
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.detail || "Failed to add comment.",
        variant: "destructive",
      });
    }finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await axios.patch(
        `${baseUrl}/api/${hospitalId}/tickets/${id}/`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Status Update API Response:", response.data); // Debug log
      setStatus(newStatus);
      setTicket({ ...ticket!, status: newStatus});
      toast({
        title: "Success",
        description: `Ticket status updated to ${newStatus.replace("_", " ")}.`,
      });
    } catch (err) {
      console.error("Status Update Error:", err);
      toast({
        title: "Error",
        description: err.response?.data?.detail || "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const handleAssigneeChange = async (newAssigneeId: string) => {
    try {
      const isUnassigned = newAssigneeId === "unassigned";
      const response = await axios.patch(
        `${baseUrl}/api/${hospitalId}/tickets/${id}/`,
        { assigned_to_id: isUnassigned ? null : newAssigneeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Assignee Update API Response:", response.data); // Debug log
      const newAssignee = isUnassigned ? null : engineers.find((e) => e.employee_id === newAssigneeId);
      setAssignedTo(newAssigneeId);
      setTicket({
        ...ticket!,
        assigned_to: newAssignee || null,
        updated_at: new Date().toISOString(),
      });
      toast({
        title: "Success",
        description: `Ticket assigned to ${newAssignee ? `${newAssignee.name}` : "nobody"}.`,
      });
    } catch (err) {
      console.error("Assignee Update Error:", err);
      toast({
        title: "Error",
        description: err.response?.data?.detail || "Failed to update assignee.",
        variant: "destructive",
      });
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Open</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status || "Unknown"}</Badge>;
    }
  };

  const renderPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Badge className="bg-red-500">Critical</Badge>;
      case "high":
        return <Badge className="bg-orange-500">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case "low":
        return <Badge className="bg-blue-500">Low</Badge>;
      default:
        return <Badge>{priority || "Unknown"}</Badge>;
    }
  };

  const getInitials = (name: string | undefined, ) => {
    if (!name) return "NA";
    return `${name?.[0] || ""}${name?.[name.length-1]}`.toUpperCase();
  };

  if (loading) {
    return <PageContainer><div className="container mx-auto py-4 sm:py-6 px-4">Loading ticket...</div></PageContainer>;
  }

  if (!hospitalId || !token) {
    toast({ title: "Error", description: "Please log in to view tickets.", variant: "destructive" });
    navigate("/login");
    return null;
  }

  if (error || !ticket) {
    return (
      <PageContainer>
        <div className="container mx-auto py-4 sm:py-6 px-4">
          <div className="flex items-center mb-6">
            <Button variant="outline" size="sm" className="mr-4" onClick={() => navigate("/ticket")}>
              <ArrowLeft size={16} />
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Ticket Not Found</h1>
          </div>
          <p className="text-sm sm:text-base">{error || "The requested ticket could not be found."}</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="container mx-auto py-4 sm:py-6 px-4 max-w-full sm:max-w-6xl animate-fade-in">
        <div className="flex items-center mb-4 sm:mb-6">
          <Button variant="outline" size="sm" className="mr-2 sm:mr-4" onClick={() => navigate("/ticket")}>
            <ArrowLeft size={16} className="mr-2" />
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">{ticket.title}</h1>
              <span className="text-muted-foreground text-xs sm:text-sm">#{ticket.ticket_id}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground flex-wrap">
              <span>Created {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}</span>
              <span>•</span>
              <span>Updated {formatDistanceToNow(new Date(ticket.updated_at), { addSuffix: true })}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl">Ticket Details</CardTitle>
                <CardDescription className="text-xs sm:text-sm">All information about this support request</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-3 sm:p-4">
                <div className="border rounded-md p-3 sm:p-4 bg-muted/20">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="text-xs">
                        {getInitials(ticket.created_by?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">
                        {ticket.created_by
                          ? `${ticket.created_by.name}`
                          : "Unknown User"}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {format(new Date(ticket.created_at), "PPP 'at' p")}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base mb-4 leading-relaxed">{ticket.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-muted-foreground mt-4">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span className="truncate">{ticket.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{format(new Date(ticket.created_at), "PPP")}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-medium">Comments and Updates</h3>

                  {ticket.comments.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No comments yet.</p>
                  ) : (
                    ticket.comments.map((comment) => (
                      <div key={comment.id} className="border rounded-md p-3 sm:p-4 bg-white">
                        <div className="flex items-start gap-3 mb-2">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback className="text-xs">
                              {getInitials(comment.author?.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium truncate">
                                {comment.author
                                  ? `${comment.author.name}`
                                  : "Unknown User"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {comment.author?.role || "Unknown Role"}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                        <p className="ml-11 text-sm leading-relaxed">{comment.content}</p>
                        {comment.file && (
                          <div className="ml-11 mt-2">
                            <a href={comment.file} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-xs sm:text-sm">
                              View Attachment
                            </a>
                          </div>
                        )}
                      </div>
                    ))
                  )}

                  <div className="border rounded-md p-3 sm:p-4 bg-white">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="text-xs">
                          {getInitials(
                            profileData
                              ? `${profileData.first_name} ${profileData.last_name}`
                              : undefined
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="w-full min-w-0">
                        <Textarea
                          placeholder="Add a comment or update..."
                          className="min-h-[80px] sm:min-h-[100px] mb-3 text-sm"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                        <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-2 sm:gap-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex gap-1 min-w-[80px] justify-center"
                              onClick={() => fileInputRef.current?.click()} // Trigger file input
                            >
                              <Paperclip size={14} />
                              <span className="hidden sm:inline">Attach</span>
                            </Button>
                            <input
                              type="file"
                              ref={fileInputRef}
                              className="hidden"
                              id="file-upload"
                              accept="image/*,.pdf,.doc,.docx" // Restrict file types
                              onChange={(e) => setfile(e.target.files?.[0] || null)}
                            />
                            {file && (
                              <span className="text-xs sm:text-sm text-muted-foreground truncate max-w-[150px] sm:max-w-none">
                                {file.name}
                              </span>
                            )}
                          </div>
                          <Button
                            size="sm"
                            className="flex gap-1 w-full sm:w-auto justify-center min-w-[100px]"
                            onClick={handleCommentSubmit}
                            disabled={isSubmitting}
                          >
                            <Send size={14} 
                            className={isSubmitting ? "animate-spin": ""}/>
                            <span className="hidden sm:inline">{isSubmitting ? "Sending..." : "Send"}</span>
                            <span className="sm:hidden">{isSubmitting ? "..." : "Send"}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl">Status and Assignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-3 sm:p-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium block mb-2">Status</label>
                  <Select value={status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium block mb-2">Assigned Engineer</label>
                  <Select value={assignedTo} onValueChange={handleAssigneeChange}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Assign to engineer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem> {/* ✅ Fixed: Non-empty value */}
                      {engineers.map((engineer) => (
                        <SelectItem key={engineer.employee_id} value={engineer.employee_id}>
                          {engineer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="border-t pt-3 sm:pt-4">
                  <label className="text-xs sm:text-sm font-medium block mb-2">Current Status</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {renderStatusBadge(ticket.status)}
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      Updated {formatDistanceToNow(new Date(ticket.updated_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium block mb-2">Priority</label>
                  <div className="flex items-center gap-2">
                    {renderPriorityBadge(ticket.priority)}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t flex-col items-stretch p-3 sm:p-4 pt-3 sm:pt-4 gap-2">
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  size="sm"
                  onClick={() => handleStatusChange("resolved")}
                >
                  <CheckCircle2 size={16} className="mr-2" />
                  <span className="hidden sm:inline">Mark as Resolved</span>
                  <span className="sm:hidden">Resolve</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  size="sm"
                  onClick={() => navigate(`/tickets/edit/${ticket.ticket_id}`)}
                >
                  <Edit2 size={16} className="mr-2" />
                  <span className="hidden sm:inline">Edit Ticket</span>
                  <span className="sm:hidden">Edit</span>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl">Device Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4">
                {ticket.device ? (
                  <>
                    <div>
                      <label className="text-xs sm:text-sm font-medium block mb-1">Device ID</label>
                      <p className="text-sm truncate">{ticket.device.device_id}</p>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium block mb-1">Device Type</label>
                      <p className="text-sm">{ticket.device.device_type || "Unknown"}</p>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium block mb-1">Model</label>
                      <p className="text-sm">{ticket.device.model || "Unknown"}</p>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium block mb-1">Manufacturer</label>
                      <p className="text-sm">{ticket.device.manufacturer || "Unknown"}</p>
                    </div>
                    <div className="pt-2 sm:pt-3">
                      <Button
                        variant="outline"
                        className="w-full justify-center"
                        size="sm"
                        onClick={() => navigate(`/devices/${ticket.device.device_id}`)}
                      >
                        <span className="hidden sm:inline">View Device Details</span>
                        <span className="sm:hidden">View Details</span>
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-sm">No device information available for this ticket.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl">Related Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium block mb-1">Reported By</label>
                  <div className="flex items-center gap-2">
                    <UserCircle2 size={16} />
                    <span className="text-sm truncate">
                      {ticket.created_by
                        ? `${ticket.created_by.name}`
                        : "Unknown User"}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium block mb-1">Location</label>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span className="text-sm truncate">{ticket.location}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium block mb-1">Category</label>
                  <div className="flex items-center gap-2">
                    <ListTodo size={16} />
                    <span className="text-sm capitalize">
                      {ticket.category.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default TicketDetail;