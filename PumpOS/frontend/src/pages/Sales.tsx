import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DollarSign, TrendingUp, FileText, Calendar, CreditCard, Search, Filter, Plus, Eye, Edit, Download, Receipt, BarChart3 } from "lucide-react";
import api from "@/utils/api";

interface KPIData {
  title: string;
  value: string;
  change: string;
  icon: string; // Will map to icon components
  trend: 'up' | 'down';
}

interface Invoice {
  id: number;
  invoice_id: string;
  member: string;
  amount: string;
  status: 'paid' | 'pending' | 'overdue';
  plan: string;
  issue_date: string;
}

interface SalesDeal {
  id: number;
  deal_id: string;
  prospect: string;
  value: string;
  stage: 'prospect' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: string;
  close_date: string;
}

const Sales = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [kpiData, setKpiData] = useState<KPIData[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [salesDeals, setSalesDeals] = useState<SalesDeal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newInvoiceData, setNewInvoiceData] = useState({
    member_id: "",
    amount: "",
    plan: "",
  });
  const [members, setMembers] = useState<{ id: string; name: string }[]>([]);

  const iconMap: { [key: string]: React.ComponentType<{ className: string }> } = {
    DollarSign,
    FileText,
    CreditCard,
    TrendingUp,
  };

  useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [kpiRes, invoicesRes, dealsRes, membersRes] = await Promise.all([
        api.get('/api/sales/financial-summary/').catch((err) => {
          console.error('Financial Summary Error:', err.response?.data || err.message);
          throw new Error('Failed to fetch financial summary');
        }),
        api.get(`/api/sales/invoices/?search=${searchTerm}&status=${statusFilter}`).catch((err) => {
          console.error('Invoices Error:', err.response?.data || err.message);
          throw new Error('Failed to fetch invoices');
        }),
        api.get('/api/sales/deals/').catch((err) => {
          console.error('Deals Error:', err.response?.data || err.message);
          throw new Error('Failed to fetch deals');
        }),
        api.get('/api/members/').catch((err) => {
          console.error('Members Error:', err.response?.data || err.message);
          throw new Error('Failed to fetch members');
        }),
      ]);
      console.log('KPI Response:', kpiRes.data);
      console.log('Invoices Response:', invoicesRes.data);
      console.log('Deals Response:', dealsRes.data);
      console.log('Members Response:', membersRes.data);

      setKpiData(Array.isArray(kpiRes.data) ? kpiRes.data : []);
      setRecentInvoices(Array.isArray(invoicesRes.data.results) ? invoicesRes.data.results : []);
      setSalesDeals(Array.isArray(dealsRes.data.results) ? dealsRes.data.results : []);
      setMembers(
        Array.isArray(membersRes.data.results)
          ? membersRes.data.results.map((m: any) => ({
              id: m.id,
              name: m.first_name + " " + m.last_name,
            }))
          : []
      );
    } catch (error: any) {
      console.error('Fetch error:', error.message);
      setError(error.message || 'Failed to fetch sales data. Please try again.');
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch sales data. Please try again.',
        variant: 'destructive',
      });
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };
  fetchData();
}, [searchTerm, statusFilter, toast, navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'overdue':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'closed-won':
        return 'bg-success text-success-foreground';
      case 'proposal':
        return 'bg-info text-info-foreground';
      case 'negotiation':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleInvoiceAction = (action: string, invoice: Invoice) => {
    toast({
      title: `${action} Invoice`,
      description: `${action} action performed for invoice ${invoice.invoice_id}`,
    });
  };

  const handleCreateInvoice = async () => {
    if (!newInvoiceData.member_id || !newInvoiceData.amount || !newInvoiceData.plan) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    if (isNaN(parseFloat(newInvoiceData.amount)) || parseFloat(newInvoiceData.amount) <= 0) {
      toast({
        title: 'Error',
        description: 'Please enter a valid amount greater than 0.',
        variant: 'destructive',
      });
      return;
    }
    try {
      await api.post('/api/sales/invoices/', {
        invoice_id: `INV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        member: parseInt(newInvoiceData.member_id), // Ensure member_id is an integer
        amount: parseFloat(newInvoiceData.amount),
        plan: newInvoiceData.plan,
        issue_date: new Date().toISOString().split('T')[0],
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast({
        title: 'Invoice Created',
        description: 'New invoice has been generated successfully.',
      });
      setIsNewInvoiceOpen(false);
      setNewInvoiceData({ member_id: '', amount: '', plan: '' });
      const invoicesRes = await api.get(`/api/sales/invoices/?search=${searchTerm}&status=${statusFilter}`);
      setRecentInvoices(Array.isArray(invoicesRes.data) ? invoicesRes.data : []);
    } catch (error: any) {
      console.error('Create invoice error:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to create invoice.',
        variant: 'destructive',
      });
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Enhanced Header */}
      <div className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-background rounded-xl border border-border/50 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Sales & Billing
            </h1>
            <p className="text-muted-foreground text-lg">Manage invoices, payments, and sales pipeline</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="shadow-sm hover:shadow-md transition-all">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={isNewInvoiceOpen} onOpenChange={setIsNewInvoiceOpen}>
              <DialogTrigger asChild>
                <Button className="shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-primary to-accent">
                  <Plus className="h-4 w-4 mr-2" />
                  New Invoice
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Invoice</DialogTitle>
                  <DialogDescription>Generate a new invoice for a member</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Member</label>
                    <Select
                      value={newInvoiceData.member_id}
                      onValueChange={(value) => setNewInvoiceData({ ...newInvoiceData, member_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select member" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Amount</label>
                    <Input
                      placeholder="$0.00"
                      value={newInvoiceData.amount}
                      onChange={(e) => setNewInvoiceData({ ...newInvoiceData, amount: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Plan</label>
                    <Select
                      value={newInvoiceData.plan}
                      onValueChange={(value) => setNewInvoiceData({ ...newInvoiceData, plan: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Basic">Basic</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                        <SelectItem value="VIP">VIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewInvoiceOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateInvoice}>Create Invoice</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
          {error}
        </div>
      )}

      {/* Enhanced KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          <div className="text-center col-span-full text-muted-foreground">Loading KPIs...</div>
        ) : kpiData.map((kpi, index) => {
          const IconComponent = iconMap[kpi.icon];
          return (
            <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-foreground mb-2">{kpi.value}</div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="secondary"
                    className={`text-xs ${kpi.trend === 'up' ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}
                  >
                    {kpi.change}
                  </Badge>
                  <span className="text-xs text-muted-foreground">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="invoices" className="space-y-8">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-3 h-12 bg-card shadow-lg border">
            <TabsTrigger value="invoices" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Invoices & Billing
            </TabsTrigger>
            <TabsTrigger value="deals" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Sales Pipeline
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Financial Reports
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="invoices" className="space-y-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-card/50 to-card">
            <CardHeader className="pb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-semibold">Recent Invoices</CardTitle>
                  <CardDescription className="text-base mt-2">Track payment status and manage billing</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search invoices..."
                      className="pl-10 w-full sm:w-64 shadow-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter} disabled={isLoading}>
                    <SelectTrigger className="w-full sm:w-32 shadow-sm">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              {/* Mobile Invoice Cards */}
              <div className="block lg:hidden px-6 space-y-4">
                {isLoading ? (
                  <div className="text-center text-muted-foreground">Loading invoices...</div>
                ) : recentInvoices.length === 0 ? (
                  <div className="text-center text-muted-foreground">No invoices found.</div>
                ) : (
                  recentInvoices.map((invoice) => (
                    <Card key={invoice.id} className="shadow-md hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="font-semibold text-lg">{invoice.invoice_id}</div>
                            <div className="text-sm text-muted-foreground">{invoice.member}</div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <Badge className={getStatusColor(invoice.status)}>
                              {invoice.status}
                            </Badge>
                            <div className="font-semibold text-lg">${invoice.amount}</div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Plan:</span>
                            <Badge variant="outline" className="bg-secondary/50">{invoice.plan}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Date:</span>
                            <span>{new Date(invoice.issue_date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-end gap-1 mt-3">
                            <Button variant="ghost" size="sm" onClick={() => handleInvoiceAction("View", invoice)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleInvoiceAction("Edit", invoice)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleInvoiceAction("Download", invoice)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Desktop Invoice Table */}
              <div className="hidden lg:block">
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Invoice ID</TableHead>
                        <TableHead className="font-semibold">Member</TableHead>
                        <TableHead className="font-semibold">Plan</TableHead>
                        <TableHead className="font-semibold">Amount</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="font-semibold text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground">
                            Loading invoices...
                          </TableCell>
                        </TableRow>
                      ) : recentInvoices.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground">
                            No invoices found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        recentInvoices.map((invoice) => (
                          <TableRow key={invoice.id} className="hover:bg-muted/30 transition-colors">
                            <TableCell className="font-medium">{invoice.invoice_id}</TableCell>
                            <TableCell>{invoice.member}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-secondary/50">{invoice.plan}</Badge>
                            </TableCell>
                            <TableCell className="font-semibold">${invoice.amount}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(invoice.status)}>
                                {invoice.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(invoice.issue_date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex justify-center gap-1">
                                <Button variant="ghost" size="sm" onClick={() => handleInvoiceAction("View", invoice)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleInvoiceAction("Edit", invoice)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleInvoiceAction("Download", invoice)}>
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deals" className="space-y-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-card/50 to-card">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-semibold">Sales Pipeline</CardTitle>
                  <CardDescription className="text-base mt-2">Track deals and sales opportunities</CardDescription>
                </div>
                <Button className="shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-primary to-accent">
                  <Plus className="h-4 w-4 mr-2" />
                  New Deal
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              <div className="block lg:hidden px-6 space-y-4">
                {isLoading ? (
                  <div className="text-center text-muted-foreground">Loading deals...</div>
                ) : salesDeals.length === 0 ? (
                  <div className="text-center text-muted-foreground">No deals found.</div>
                ) : (
                  salesDeals.map((deal) => (
                    <Card key={deal.id} className="shadow-md hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="font-semibold text-lg">{deal.deal_id}</div>
                            <div className="text-sm text-muted-foreground">{deal.prospect}</div>
                          </div>
                          <Badge className={getStageColor(deal.stage)}>
                            {deal.stage}
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Value:</span>
                            <span className="font-semibold text-lg">${deal.value}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Probability:</span>
                            <Badge variant="outline" className="bg-success/10 text-success">{deal.probability}%</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Close Date:</span>
                            <span>{new Date(deal.close_date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-end gap-1 mt-3">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              <div className="hidden lg:block">
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Deal ID</TableHead>
                        <TableHead className="font-semibold">Prospect</TableHead>
                        <TableHead className="font-semibold">Value</TableHead>
                        <TableHead className="font-semibold">Stage</TableHead>
                        <TableHead className="font-semibold">Probability</TableHead>
                        <TableHead className="font-semibold">Close Date</TableHead>
                        <TableHead className="font-semibold text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground">
                            Loading deals...
                          </TableCell>
                        </TableRow>
                      ) : salesDeals.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground">
                            No deals found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        salesDeals.map((deal) => (
                          <TableRow key={deal.id} className="hover:bg-muted/30 transition-colors">
                            <TableCell className="font-medium">{deal.deal_id}</TableCell>
                            <TableCell>{deal.prospect}</TableCell>
                            <TableCell className="font-semibold">${deal.value}</TableCell>
                            <TableCell>
                              <Badge className={getStageColor(deal.stage)}>
                                {deal.stage}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-success/10 text-success">{deal.probability}%</Badge>
                            </TableCell>
                            <TableCell>{new Date(deal.close_date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex justify-center gap-1">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-card/50 to-card">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Revenue Summary</CardTitle>
                    <CardDescription>Monthly revenue breakdown</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-center py-8">
                <div className="space-y-4">
                  <div className="text-4xl font-bold text-primary">{kpiData[0]?.value || '$0'}</div>
                  <div className="text-sm text-muted-foreground">Total revenue this quarter</div>
                  <Button variant="outline" className="hover:bg-primary/10">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Detailed Report
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-0 bg-gradient-to-br from-card/50 to-card">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <CreditCard className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Payment distribution</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Credit Cards</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-muted rounded-full">
                        <div className="w-12 h-2 bg-primary rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">75%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bank Transfer</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-muted rounded-full">
                        <div className="w-4 h-2 bg-accent rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cash</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-muted rounded-full">
                        <div className="w-1 h-2 bg-success rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sales;