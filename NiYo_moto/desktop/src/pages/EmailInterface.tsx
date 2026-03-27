import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Paperclip, X, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/utils/api";

const COMPANY_NAME = import.meta.env.VITE_COMPANY_NAME || "NiYo Motor Windings";

const EmailInterface = () => {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    message: "",
  });
  const [attachment, setAttachment] = useState<File | null>(null);

  // Fetch customers for the dropdown
  useEffect(() => {
    api.get("api/customer/")
        .then(res => setCustomers(res.data))
        .catch(err => console.error("Error fetching customers", err));
  }, []);

  // Handle dropdown selection to autofill email
  const handleClientSelect = (clientId: string) => {
      const client = customers.find(c => c.id.toString() === clientId);
      if (client) {
          setFormData(prev => ({
              ...prev,
              to: client.email || "",
              subject: `Update regarding your service - ${COMPANY_NAME}`,
              message: `Dear ${client.name},\n\nPlease find the attached document for your review.\n\nBest Regards,\n${COMPANY_NAME}`
          }));

          if (client.email) {
              toast.success(`Prefilled details for ${client.name}`);
          } else {
              toast.warning(`Client ${client.name} does not have an email address saved.`);
          }
      }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setAttachment(file);
      } else {
        toast.error("Please select a PDF file.");
      }
    }
  };

  const handleRemoveFile = () => {
    setAttachment(null);
    const fileInput = document.getElementById("file-upload") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.to || !formData.subject || !formData.message) {
        toast.error("Please fill in all required fields.");
        return;
    }

    if (!attachment) {
        toast.error("Please attach a PDF file.");
        return;
    }

    setLoading(true);

    try {
        const payload = new FormData();
        payload.append("email", formData.to);
        payload.append("subject", formData.subject);
        payload.append("message", formData.message);
        payload.append("file", attachment);

        await api.post("api/send-email/", payload);
        
        toast.success("Email sent successfully!");
        setFormData({ to: "", subject: "", message: "" });
        setAttachment(null);
    } catch (error) {
        console.error(error);
        toast.error("Failed to send email. Check backend logs.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Compose Email</h1>
          <p className="text-muted-foreground mt-1">Send custom emails with PDF attachments</p>
        </div>

        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>New Message</CardTitle>
                    <CardDescription>Enter the details below to send an email.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSend} className="space-y-4">
                        
                        {/* Client Selector Helper */}
                        <div className="space-y-2">
                            <Label>Quick Fill from Client List (Optional)</Label>
                            <Select onValueChange={handleClientSelect}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a client to autofill..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {customers.map(c => (
                                        <SelectItem key={c.id} value={c.id.toString()}>
                                            {c.name} {c.email ? `(${c.email})` : "(No Email Saved)"}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="to">To *</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    id="to" 
                                    placeholder="client@example.com" 
                                    value={formData.to}
                                    onChange={e => setFormData({...formData, to: e.target.value})}
                                    className="pl-9"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">You can type a manual email or use the dropdown above.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject (Header) *</Label>
                            <Input 
                                id="subject" 
                                placeholder="Invoice / Quotation Ref..." 
                                value={formData.subject}
                                onChange={e => setFormData({...formData, subject: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Message *</Label>
                            <Textarea 
                                id="message" 
                                placeholder="Type your message here..." 
                                rows={6} 
                                value={formData.message}
                                onChange={e => setFormData({...formData, message: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Attachment (PDF) *</Label>
                            {!attachment ? (
                                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 cursor-pointer transition-colors relative">
                                    <Paperclip className="h-8 w-8 mb-2" />
                                    <span className="text-sm">Click to upload PDF</span>
                                    <Input 
                                        id="file-upload" 
                                        type="file" 
                                        accept="application/pdf" 
                                        className="absolute inset-0 opacity-0 cursor-pointer" 
                                        onChange={handleFileChange}
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-3 border rounded-md bg-muted/20">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <div className="bg-red-100 p-2 rounded">
                                            <span className="text-xs font-bold text-red-600">PDF</span>
                                        </div>
                                        <span className="text-sm truncate">{attachment.name}</span>
                                        <span className="text-xs text-muted-foreground">({(attachment.size / 1024).toFixed(1)} KB)</span>
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" onClick={handleRemoveFile}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Send Email
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmailInterface;