import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Receipt, Users, AlertCircle, Package, Zap, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/utils/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // State for stats
  const [stats, setStats] = useState({
    totalInvoices: 0,
    pendingPayments: 0,
    totalCustomers: 0,
    incomingGoodsCount: 0,
    motorCount: 56, // Static for now as Motor backend isn't connected yet
  });

  // State for recent invoices
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch all necessary data in parallel
        const [invoicesRes, customersRes, goodsRes] = await Promise.all([
          api.get("api/invoices/"),
          api.get("api/customer/"),
          api.get("api/incoming-goods/")
        ]);

        const invoices = invoicesRes.data;
        const customers = customersRes.data;
        const goods = goodsRes.data;

        // --- Calculate Stats ---
        
        // 1. Pending Payments: Sum of final_amount for invoices with status 'pending'
        const pendingTotal = invoices
          .filter((inv: any) => inv.status === 'pending' || inv.status === 'overdue')
          .reduce((sum: number, inv: any) => sum + parseFloat(inv.final_amount), 0);

        setStats({
          totalInvoices: invoices.length,
          pendingPayments: pendingTotal,
          totalCustomers: customers.length,
          incomingGoodsCount: goods.length,
          motorCount: 56 // Keep static
        });

        // --- Process Recent Invoices ---
        // Sort by id (assuming higher ID is newer) or date, take top 5
        const sortedInvoices = [...invoices].sort((a: any, b: any) => {
            return new Date(b.created_at || b.date).getTime() - new Date(a.created_at || a.date).getTime();
        }).slice(0, 5);

        setRecentInvoices(sortedInvoices);

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", className: string }> = {
      paid: { variant: "default", className: "bg-green-100 text-green-800 hover:bg-green-200" },
      pending: { variant: "secondary", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" },
      overdue: { variant: "destructive", className: "" },
    };
    
    // Default fallback
    const statusKey = status.toLowerCase();
    const config = variants[statusKey] || { variant: "outline", className: "" };

    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const statCards = [
    { 
      title: "Total Invoices", 
      value: stats.totalInvoices.toString(), 
      icon: Receipt, 
      description: "All time" 
    },
    { 
      title: "Pending Amount", 
      value: `₹${stats.pendingPayments.toLocaleString('en-IN')}`, 
      icon: AlertCircle, 
      description: "Needs attention" 
    },
    { 
      title: "Total Customers", 
      value: stats.totalCustomers.toString(), 
      icon: Users, 
      description: "Active clients" 
    },
    { 
      title: "Incoming Goods", 
      value: stats.incomingGoodsCount.toString(), 
      icon: Package, 
      description: "Total entries" 
    },
    { 
      title: "Motor Library", 
      value: stats.motorCount.toString(), 
      icon: Zap, 
      description: "Templates available" 
    },
  ];

  if (loading) {
    return (
        <DashboardLayout>
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your business overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {statCards.map((stat) => (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-5 w-5 text-primary/70" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentInvoices.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">No invoices found.</TableCell>
                    </TableRow>
                ) : (
                    recentInvoices.map((invoice) => (
                    <TableRow 
                        key={invoice.id} 
                        className="hover:bg-muted/50 cursor-pointer"
                        onClick={() => navigate(`/invoices/${invoice.id}`)}
                    >
                        <TableCell className="font-medium">{invoice.invoice_id}</TableCell>
                        <TableCell>{invoice.customer_name}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell className="font-semibold">
                            ₹{parseFloat(invoice.final_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;