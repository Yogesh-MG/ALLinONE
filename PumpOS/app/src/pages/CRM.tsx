import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Target, TrendingUp, Phone, Mail, Calendar, Search, Filter, Plus, Eye, Edit, MessageSquare } from "lucide-react";

const CRM = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const kpiData = [
    { title: "Total Leads", value: "847", change: "+15.3%", icon: UserPlus, trend: "up" },
    { title: "Conversion Rate", value: "24.5%", change: "+3.2%", icon: Target, trend: "up" },
    { title: "Lead Quality Score", value: "8.2/10", change: "+0.5", icon: TrendingUp, trend: "up" },
    { title: "Response Time", value: "2.3h", change: "-0.8h", icon: Phone, trend: "up" },
  ];

  const leads = [
    { 
      id: "LEAD-001", 
      name: "Alex Rodriguez", 
      email: "alex@email.com", 
      phone: "(555) 123-4567",
      source: "Website", 
      status: "new", 
      score: 85, 
      lastContact: "2024-01-20",
      interest: "Personal Training"
    },
    { 
      id: "LEAD-002", 
      name: "Jessica Chen", 
      email: "jessica@email.com", 
      phone: "(555) 234-5678",
      source: "Referral", 
      status: "qualified", 
      score: 92, 
      lastContact: "2024-01-19",
      interest: "Group Classes"
    },
    { 
      id: "LEAD-003", 
      name: "Michael Thompson", 
      email: "mike@email.com", 
      phone: "(555) 345-6789",
      source: "Facebook Ad", 
      status: "contacted", 
      score: 78, 
      lastContact: "2024-01-18",
      interest: "Membership"
    },
    { 
      id: "LEAD-004", 
      name: "Sarah Williams", 
      email: "sarah@email.com", 
      phone: "(555) 456-7890",
      source: "Google Ad", 
      status: "converted", 
      score: 95, 
      lastContact: "2024-01-17",
      interest: "Yoga Classes"
    },
  ];

  const campaigns = [
    { name: "Summer Fitness Challenge", status: "active", leads: 156, conversions: 34, cost: "$1,250", roi: "285%" },
    { name: "New Year Membership Drive", status: "completed", leads: 289, conversions: 87, cost: "$2,100", roi: "425%" },
    { name: "Referral Rewards Program", status: "active", leads: 92, conversions: 28, cost: "$450", roi: "320%" },
    { name: "Local Community Outreach", status: "paused", leads: 67, conversions: 12, cost: "$850", roi: "180%" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-info text-info-foreground";
      case "qualified": return "bg-success text-success-foreground";
      case "contacted": return "bg-warning text-warning-foreground";
      case "converted": return "bg-primary text-primary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getCampaignStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success text-success-foreground";
      case "completed": return "bg-muted text-muted-foreground";
      case "paused": return "bg-warning text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="space-y-8 p-6">
      {/* Enhanced Header */}
      <div className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-background rounded-xl border border-border/50 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CRM & Leads
            </h1>
            <p className="text-muted-foreground text-lg">Manage leads, track conversions, and nurture prospects</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="shadow-sm hover:shadow-md transition-all">
              <Target className="h-4 w-4 mr-2" />
              Lead Scoring
            </Button>
            <Button className="shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-primary to-accent">
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </div>
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

      <Tabs defaultValue="leads" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="leads">Lead Management</TabsTrigger>
          <TabsTrigger value="pipeline">Sales Pipeline</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Lead Database</CardTitle>
                  <CardDescription>Manage and track all your leads</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search leads..." className="pl-8" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-32">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lead ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Interest</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Last Contact</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.id}</TableCell>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1" />
                            {lead.email}
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1" />
                            {lead.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{lead.source}</TableCell>
                      <TableCell>{lead.interest}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold ${getScoreColor(lead.score)}`}>
                          {lead.score}
                        </span>
                      </TableCell>
                      <TableCell>{lead.lastContact}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4" />
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

        <TabsContent value="pipeline" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">New Leads</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl font-bold">127</div>
                <div className="space-y-2">
                  <div className="p-2 bg-muted rounded text-sm">Alex Rodriguez - Personal Training</div>
                  <div className="p-2 bg-muted rounded text-sm">Maria Santos - Yoga Classes</div>
                  <div className="p-2 bg-muted rounded text-sm">Tom Wilson - Membership</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Qualified</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl font-bold">84</div>
                <div className="space-y-2">
                  <div className="p-2 bg-muted rounded text-sm">Jessica Chen - Group Classes</div>
                  <div className="p-2 bg-muted rounded text-sm">David Kim - Premium Plan</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">In Negotiation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl font-bold">32</div>
                <div className="space-y-2">
                  <div className="p-2 bg-muted rounded text-sm">Corporate Deal - $5K</div>
                  <div className="p-2 bg-muted rounded text-sm">Family Package - $800</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Closed Won</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl font-bold">156</div>
                <div className="space-y-2">
                  <div className="p-2 bg-success/10 rounded text-sm">Sarah Williams - Converted</div>
                  <div className="p-2 bg-success/10 rounded text-sm">Mike Thompson - VIP Member</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Marketing Campaigns</CardTitle>
                  <CardDescription>Track campaign performance and ROI</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Campaign
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Leads Generated</TableHead>
                    <TableHead>Conversions</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>ROI</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>
                        <Badge className={getCampaignStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{campaign.leads}</TableCell>
                      <TableCell>{campaign.conversions}</TableCell>
                      <TableCell>{campaign.cost}</TableCell>
                      <TableCell className="font-semibold text-success">{campaign.roi}</TableCell>
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
      </Tabs>
    </div>
  );
};

export default CRM;