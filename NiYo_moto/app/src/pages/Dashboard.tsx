import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Receipt, Users, AlertCircle, Package, Zap } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Dashboard = () => {
  const stats = [
    { title: "Total Invoices", value: "156", icon: Receipt, change: "+12%" },
    { title: "Pending Payments", value: "₹2,45,000", icon: AlertCircle, change: "+8%" },
    { title: "Total Customers", value: "89", icon: Users, change: "+5%" },
    { title: "Incoming Goods", value: "23", icon: Package, change: "+3%" },
    { title: "Motor Library", value: "56", icon: Zap, change: "+8 new" },
  ];

  const recentInvoices = [
    { id: "INV-001", customer: "ABC Motors", date: "2024-01-15", amount: "₹15,000", status: "paid" },
    { id: "INV-002", customer: "XYZ Industries", date: "2024-01-14", amount: "₹28,500", status: "pending" },
    { id: "INV-003", customer: "Modern Engineering", date: "2024-01-13", amount: "₹42,000", status: "paid" },
    { id: "INV-004", customer: "Tech Solutions", date: "2024-01-12", amount: "₹19,800", status: "overdue" },
    { id: "INV-005", customer: "Global Motors", date: "2024-01-11", amount: "₹31,200", status: "pending" },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", className: string }> = {
      paid: { variant: "default", className: "bg-success hover:bg-success/90" },
      pending: { variant: "secondary", className: "bg-warning hover:bg-warning/90" },
      overdue: { variant: "destructive", className: "" },
    };
    
    return (
      <Badge variant={variants[status].variant} className={variants[status].className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your business overview.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-success mt-1">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

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
                {recentInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell className="font-semibold">{invoice.amount}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
