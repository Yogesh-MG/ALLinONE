
import React, { useState } from "react";
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
  MoreHorizontal, 
  Paperclip, 
  Send, 
  User, 
  UserCircle2 
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import PageContainer from "@/components/layout/PageContainer-demo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

// Mock data for a ticket
const mockTicket = {
  id: "TICK-1001",
  title: "Ventilator not powering on",
  deviceId: "VEN-056",
  category: "hardware",
  priority: "critical",
  status: "open",
  location: "ICU Room 103",
  createdBy: "Dr. Sharma",
  createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
  updatedAt: new Date(Date.now() - 50 * 60 * 1000), // 50 minutes ago
  assignedTo: "Engineer Patel",
  description: "The ventilator in ICU Room 103 is not powering on. The power light comes on briefly and then turns off. We've tried different power outlets but the issue persists. This is urgent as we need all ventilators to be operational.",
  comments: [
    {
      id: "comment-1",
      author: "Engineer Patel",
      authorRole: "Biomedical Engineer",
      content: "I'll check this right away. Have you tried holding the power button for 10 seconds to reset?",
      timestamp: new Date(Date.now() - 55 * 60 * 1000), // 55 minutes ago
    },
    {
      id: "comment-2",
      author: "Dr. Sharma",
      authorRole: "Physician",
      content: "Yes, we tried that but it didn't work. The device makes a clicking sound when we try to turn it on.",
      timestamp: new Date(Date.now() - 52 * 60 * 1000), // 52 minutes ago
    },
  ],
};

const TicketDetaildemo = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState(mockTicket);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState(ticket.status);
  const [assignedTo, setAssignedTo] = useState(ticket.assignedTo || "");

  const handleCommentSubmit = () => {
    if (!comment.trim()) return;

    const newComment = {
      id: `comment-${ticket.comments.length + 1}`,
      author: "Engineer Patel", // In a real app, this would be the current user
      authorRole: "Biomedical Engineer",
      content: comment,
      timestamp: new Date(),
    };

    setTicket({
      ...ticket,
      comments: [...ticket.comments, newComment],
      updatedAt: new Date(),
    });

    setComment("");

    toast({
      title: "Comment Added",
      description: "Your comment has been added to the ticket.",
    });
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setTicket({
      ...ticket,
      status: newStatus,
      updatedAt: new Date(),
    });

    toast({
      title: "Status Updated",
      description: `Ticket status has been updated to ${newStatus.replace('_', ' ')}.`,
    });
  };

  const handleAssigneeChange = (newAssignee: string) => {
    setAssignedTo(newAssignee);
    setTicket({
      ...ticket,
      assignedTo: newAssignee,
      updatedAt: new Date(),
    });

    toast({
      title: "Assignee Updated",
      description: `Ticket has been assigned to ${newAssignee}.`,
    });
  };

  // Function to render status badge with appropriate colors
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
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Function to render priority badge with appropriate colors
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
        return <Badge>{priority}</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (!ticket) {
    return (
      <PageContainer>
        <div className="container mx-auto py-6">
          <div className="flex items-center mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              className="mr-4"
              onClick={() => navigate("/tickets")}
            >
              <ArrowLeft size={16} />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Ticket Not Found</h1>
          </div>
          <p>The requested ticket could not be found.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="container mx-auto py-6 max-w-6xl animate-fade-in">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="mr-4"
            onClick={() => navigate("/demo/tickets")}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Tickets
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{ticket.title}</h1>
              <span className="text-muted-foreground">#{ticket.id}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Created {formatDistanceToNow(ticket.createdAt, { addSuffix: true })}</span>
              <span>•</span>
              <span>Updated {formatDistanceToNow(ticket.updatedAt, { addSuffix: true })}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Details</CardTitle>
                <CardDescription>
                  All information about this support request
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-md p-4 bg-muted/20">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar>
                      <AvatarFallback>{getInitials(ticket.createdBy)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{ticket.createdBy}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(ticket.createdAt, "PPP 'at' p")}
                      </div>
                    </div>
                  </div>
                  <p className="text-base mb-4">{ticket.description}</p>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mt-4">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>{ticket.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{format(ticket.createdAt, "PPP")}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Comments and Updates</h3>
                  
                  {ticket.comments.map((comment) => (
                    <div 
                      key={comment.id} 
                      className="border rounded-md p-4 bg-white"
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{getInitials(comment.author)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">{comment.authorRole}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                      <p className="ml-11 text-sm">{comment.content}</p>
                    </div>
                  ))}

                  {/* Add comment form */}
                  <div className="border rounded-md p-4 bg-white">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">EP</AvatarFallback>
                      </Avatar>
                      <div className="w-full">
                        <Textarea 
                          placeholder="Add a comment or update..."
                          className="min-h-[100px] mb-3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                        <div className="flex justify-between items-center">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex gap-1"
                          >
                            <Paperclip size={14} />
                            Attach
                          </Button>
                          <Button 
                            size="sm"
                            className="flex gap-1"
                            onClick={handleCommentSubmit}
                            disabled={!comment.trim()}
                          >
                            <Send size={14} />
                            Send
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status and Assignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Status</label>
                  <Select 
                    value={status} 
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger>
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
                  <label className="text-sm font-medium block mb-2">Assigned Engineer</label>
                  <Select 
                    value={assignedTo} 
                    onValueChange={handleAssigneeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Assign to engineer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineer Patel">Engineer Patel</SelectItem>
                      <SelectItem value="Engineer Khan">Engineer Khan</SelectItem>
                      <SelectItem value="Engineer Kapoor">Engineer Kapoor</SelectItem>
                      <SelectItem value="Engineer Singh">Engineer Singh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="border-t pt-4">
                  <label className="text-sm font-medium block mb-2">Current Status</label>
                  <div className="flex items-center gap-2">
                    {renderStatusBadge(ticket.status)}
                    <span className="text-sm text-muted-foreground">
                      Updated {formatDistanceToNow(ticket.updatedAt, { addSuffix: true })}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">Priority</label>
                  <div className="flex items-center gap-2">
                    {renderPriorityBadge(ticket.priority)}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t flex-col items-start pt-4">
                <Button 
                  variant="outline" 
                  className="w-full mb-2"
                  onClick={() => {
                    handleStatusChange("resolved");
                    toast({
                      title: "Ticket Resolved",
                      description: "The ticket has been marked as resolved.",
                    });
                  }}
                >
                  <CheckCircle2 size={16} className="mr-2" />
                  Mark as Resolved
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/tickets/edit/${ticket.id}`)}
                >
                  <Edit2 size={16} className="mr-2" />
                  Edit Ticket
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Device Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ticket.deviceId ? (
                  <>
                    <div>
                      <label className="text-sm font-medium block mb-1">Device ID</label>
                      <p>{ticket.deviceId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Device Type</label>
                      <p>Ventilator</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Model</label>
                      <p>Servo-u</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Manufacturer</label>
                      <p>Getinge</p>
                    </div>
                    <div className="pt-3">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate(`/devices/${ticket.deviceId?.split('-')[1]}`)}
                      >
                        View Device Details
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">No device information available for this ticket.</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Related Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Reported By</label>
                  <div className="flex items-center gap-2">
                    <UserCircle2 size={16} />
                    <span>{ticket.createdBy}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Location</label>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{ticket.location}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Category</label>
                  <div className="flex items-center gap-2">
                    <ListTodo size={16} />
                    <span className="capitalize">{ticket.category}</span>
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

export default TicketDetaildemo;
