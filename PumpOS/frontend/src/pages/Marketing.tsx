import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MessageSquare, Mail, Users, Gift, TrendingUp, Send, Calendar, Search, Filter, Plus, Eye, Edit, Share } from "lucide-react";

const Marketing = () => {
  const { toast } = useToast();
  const [smsMessage, setSmsMessage] = useState("");
  const [selectedAudience, setSelectedAudience] = useState("");
  const kpiData = [
    { title: "SMS Campaigns", value: "24", change: "+6", icon: MessageSquare, trend: "up" },
    { title: "Email Open Rate", value: "32.5%", change: "+4.2%", icon: Mail, trend: "up" },
    { title: "Active Referrals", value: "156", change: "+23", icon: Users, trend: "up" },
    { title: "Reward Points Issued", value: "12,450", change: "+1,200", icon: Gift, trend: "up" },
  ];

  const smsMessages = [
    { id: "SMS-001", campaign: "Weekly Class Reminder", recipients: 1250, sent: "2024-01-20", status: "sent", openRate: "89%" },
    { id: "SMS-002", campaign: "New Member Welcome", recipients: 45, sent: "2024-01-19", status: "scheduled", openRate: "-" },
    { id: "SMS-003", campaign: "Membership Renewal", recipients: 320, sent: "2024-01-18", status: "sent", openRate: "76%" },
    { id: "SMS-004", campaign: "Special Offer Alert", recipients: 890, sent: "2024-01-17", status: "sent", openRate: "82%" },
  ];

  const emailCampaigns = [
    { id: "EMAIL-001", subject: "Transform Your Fitness Journey", recipients: 2500, sent: "2024-01-20", status: "sent", openRate: "28.5%", clickRate: "5.2%" },
    { id: "EMAIL-002", subject: "Member Spotlight: Success Stories", recipients: 2200, sent: "2024-01-18", status: "sent", openRate: "35.1%", clickRate: "7.8%" },
    { id: "EMAIL-003", subject: "New Group Classes Available", recipients: 1800, sent: "2024-01-15", status: "sent", openRate: "31.2%", clickRate: "6.1%" },
  ];

  const referrals = [
    { referrer: "John Smith", referee: "Mike Johnson", status: "completed", reward: "$50 Credit", date: "2024-01-20" },
    { referrer: "Sarah Davis", referee: "Emma Wilson", status: "pending", reward: "Free Month", date: "2024-01-19" },
    { referrer: "Alex Chen", referee: "Lisa Brown", status: "completed", reward: "$50 Credit", date: "2024-01-18" },
    { referrer: "Maria Santos", referee: "Tom Garcia", status: "pending", reward: "Personal Session", date: "2024-01-17" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent": return "bg-success text-success-foreground";
      case "scheduled": return "bg-info text-info-foreground";
      case "draft": return "bg-warning text-warning-foreground";
      case "completed": return "bg-success text-success-foreground";
      case "pending": return "bg-warning text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Marketing</h1>
          <p className="text-muted-foreground">Manage campaigns, referrals, and member engagement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
              <p className={`text-xs ${kpi.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                {kpi.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="sms" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sms">SMS Campaigns</TabsTrigger>
          <TabsTrigger value="email">Email Marketing</TabsTrigger>
          <TabsTrigger value="referrals">Referral Program</TabsTrigger>
          <TabsTrigger value="rewards">Rewards & Loyalty</TabsTrigger>
        </TabsList>

        <TabsContent value="sms" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>SMS Campaigns</CardTitle>
                      <CardDescription>Send targeted SMS messages to members</CardDescription>
                    </div>
                    <Button onClick={() => {
                      toast({
                        title: "SMS Campaign",
                        description: "SMS campaign creation opened!",
                      });
                    }}>
                      <Send className="h-4 w-4 mr-2" />
                      Send SMS
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Campaign</TableHead>
                        <TableHead>Recipients</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Open Rate</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {smsMessages.map((sms) => (
                        <TableRow key={sms.id}>
                          <TableCell className="font-medium">{sms.campaign}</TableCell>
                          <TableCell>{sms.recipients}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(sms.status)}>
                              {sms.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{sms.openRate}</TableCell>
                          <TableCell>{sms.sent}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Quick SMS</CardTitle>
                <CardDescription>Send instant message to members</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedAudience} onValueChange={setSelectedAudience}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Members</SelectItem>
                    <SelectItem value="active">Active Members</SelectItem>
                    <SelectItem value="new">New Members</SelectItem>
                    <SelectItem value="vip">VIP Members</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea 
                  placeholder="Type your message..." 
                  className="min-h-32" 
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                />
                <div className="text-sm text-muted-foreground">
                  Character count: {smsMessage.length}/160
                </div>
                <Button 
                  className="w-full"
                  onClick={() => {
                    if (!selectedAudience || !smsMessage) {
                      toast({
                        title: "Missing Information",
                        description: "Please select audience and enter message",
                        variant: "destructive"
                      });
                      return;
                    }
                    toast({
                      title: "SMS Sent!",
                      description: `Message sent to ${selectedAudience}`,
                    });
                    setSmsMessage("");
                    setSelectedAudience("");
                  }}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Email Campaigns</CardTitle>
                  <CardDescription>Create and manage email marketing campaigns</CardDescription>
                </div>
                <Button onClick={() => {
                  toast({
                    title: "Email Campaign",
                    description: "Email campaign creation opened!",
                  });
                }}>
                  <Mail className="h-4 w-4 mr-2" />
                  New Email
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Open Rate</TableHead>
                    <TableHead>Click Rate</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emailCampaigns.map((email) => (
                    <TableRow key={email.id}>
                      <TableCell className="font-medium">{email.subject}</TableCell>
                      <TableCell>{email.recipients}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(email.status)}>
                          {email.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{email.openRate}</TableCell>
                      <TableCell>{email.clickRate}</TableCell>
                      <TableCell>{email.sent}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Referral Tracking</CardTitle>
                      <CardDescription>Monitor member referrals and rewards</CardDescription>
                    </div>
                    <Button onClick={() => {
                      toast({
                        title: "Referral Program",
                        description: "Referral program shared successfully!",
                      });
                    }}>
                      <Share className="h-4 w-4 mr-2" />
                      Share Program
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Referrer</TableHead>
                        <TableHead>Referee</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reward</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {referrals.map((referral, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{referral.referrer}</TableCell>
                          <TableCell>{referral.referee}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(referral.status)}>
                              {referral.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{referral.reward}</TableCell>
                          <TableCell>{referral.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Referral Settings</CardTitle>
                <CardDescription>Configure referral program</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Referrer Reward</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reward" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit">$50 Credit</SelectItem>
                      <SelectItem value="month">Free Month</SelectItem>
                      <SelectItem value="session">Personal Session</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Referee Benefit</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select benefit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="discount">20% Discount</SelectItem>
                      <SelectItem value="trial">Free Trial Week</SelectItem>
                      <SelectItem value="waive">Waive Join Fee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "Settings Updated",
                      description: "Referral program settings have been updated",
                    });
                  }}
                >
                  Update Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Points Program</CardTitle>
                <CardDescription>Member loyalty points system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">12,450</div>
                  <p className="text-sm text-muted-foreground">Total points issued this month</p>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "Points Issued",
                      description: "Loyalty points have been issued to members",
                    });
                  }}
                >
                  <Gift className="h-4 w-4 mr-2" />
                  Issue Points
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Loyalty Tiers</CardTitle>
                <CardDescription>Member tier distribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Bronze (0-999 pts)</span>
                  <span className="font-medium">342 members</span>
                </div>
                <div className="flex justify-between">
                  <span>Silver (1000-2999 pts)</span>
                  <span className="font-medium">178 members</span>
                </div>
                <div className="flex justify-between">
                  <span>Gold (3000+ pts)</span>
                  <span className="font-medium">89 members</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Reward Catalog</CardTitle>
                <CardDescription>Available member rewards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Free Smoothie</span>
                  <span className="text-primary">100 pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Guest Pass</span>
                  <span className="text-primary">250 pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Personal Training</span>
                  <span className="text-primary">500 pts</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "Rewards Updated",
                      description: "Reward catalog has been updated",
                    });
                  }}
                >
                  Manage Rewards
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Marketing;