import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send, Mail, Phone, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface MessageMemberDialogProps {
  member: Member;
  trigger?: React.ReactNode;
}

export const MessageMemberDialog = ({ member, trigger }: MessageMemberDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageType, setMessageType] = useState("email");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message before sending.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/api/messages/", {
        member: member.id,
        message_type: messageType,
        subject: messageType === "email" ? subject : null,
        content: message,
      }, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const messageMethod = messageType === "email" ? "Email" : messageType === "sms" ? "SMS" : "Push Notification";
      toast({
        title: `${messageMethod} Sent!`,
        description: `Your message has been sent to ${member.name} via ${messageMethod.toLowerCase()}.`,
      });
      setMessage("");
      setSubject("");
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to send message.",
        variant: "destructive",
      });
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMessageTypeIcon = () => {
    switch (messageType) {
      case "email": return <Mail className="h-4 w-4" />;
      case "sms": return <Phone className="h-4 w-4" />;
      case "push": return <Zap className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const getCharacterLimit = () => {
    switch (messageType) {
      case "sms": return 160;
      case "push": return 100;
      default: return 500;
    }
  };

  const characterLimit = getCharacterLimit();
  const remainingChars = characterLimit - message.length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10 transition-all duration-200">
            <MessageSquare className="h-4 w-4" />
            Send Message
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl animate-fade-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MessageSquare className="h-5 w-5 text-primary" />
            Send Message
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border">
          <Avatar className="h-12 w-12">
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {member.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{member.name}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {member.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {member.phone}
              </span>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="messageType">Message Type</Label>
            <Select value={messageType} onValueChange={setMessageType} disabled={isSubmitting}>
              <SelectTrigger className="transition-all duration-200 focus:scale-[1.02]">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {getMessageTypeIcon()}
                    <span className="capitalize">{messageType}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </div>
                </SelectItem>
                <SelectItem value="sms">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>SMS</span>
                  </div>
                </SelectItem>
                <SelectItem value="push">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>Push Notification</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {messageType === "email" && (
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject..."
                className="w-full px-3 py-2 border border-input rounded-md transition-all duration-200 focus:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-ring"
                required={messageType === "email"}
                disabled={isSubmitting}
              />
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="message">
                Message {messageType === "sms" && "(SMS)"} {messageType === "push" && "(Push Notification)"}
              </Label>
              <div className="flex items-center gap-2">
                <Badge variant={remainingChars < 0 ? "destructive" : remainingChars < 20 ? "secondary" : "outline"}>
                  {remainingChars} characters remaining
                </Badge>
              </div>
            </div>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                messageType === "email" ? "Type your email message..." :
                messageType === "sms" ? "Type your SMS message (160 characters max)..." :
                "Type your push notification (100 characters max)..."
              }
              className={`min-h-32 transition-all duration-200 focus:scale-[1.02] ${
                remainingChars < 0 ? 'border-destructive' : ''
              }`}
              maxLength={characterLimit}
              required
              disabled={isSubmitting}
            />
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {getMessageTypeIcon()}
              <span>
                {messageType === "email" && `Will be sent to ${member.email}`}
                {messageType === "sms" && `Will be sent to ${member.phone}`}
                {messageType === "push" && "Will be sent as push notification to member's app"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Quick Templates</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMessage("Hi! Just a friendly reminder about your upcoming class booking.")}
                className="text-left justify-start hover:scale-105 transition-all duration-200"
                disabled={isSubmitting}
              >
                Class Reminder
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMessage("Your membership is expiring soon. Please renew to continue enjoying our services.")}
                className="text-left justify-start hover:scale-105 transition-all duration-200"
                disabled={isSubmitting}
              >
                Membership Renewal
              </Button>
              <Button                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMessage("Great job on your recent workout! Keep up the momentum!")}
                className="text-left justify-start hover:scale-105 transition-all duration-200"
                disabled={isSubmitting}
              >
                Workout Motivation
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMessage("We have a new class schedule available. Check it out on our app!")}
                className="text-left justify-start hover:scale-105 transition-all duration-200"
                disabled={isSubmitting}
              >
                New Schedule
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
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
              disabled={isSubmitting || remainingChars < 0}
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};