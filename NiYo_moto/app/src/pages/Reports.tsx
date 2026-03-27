import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Users, Package } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Reports = () => {
  const metrics = [
    { title: "Total Revenue", value: "₹8,45,000", change: "+15.3%", icon: DollarSign },
    { title: "Sales Growth", value: "23.5%", change: "+4.2%", icon: TrendingUp },
    { title: "Active Customers", value: "89", change: "+12", icon: Users },
    { title: "Stock Value", value: "₹2,15,000", change: "+8.4%", icon: Package },
  ];

  const salesByMonth = [
    { month: "Jan", sales: 45000 },
    { month: "Feb", sales: 52000 },
    { month: "Mar", sales: 48000 },
    { month: "Apr", sales: 61000 },
    { month: "May", sales: 55000 },
    { month: "Jun", sales: 67000 },
    { month: "Jul", sales: 72000 },
    { month: "Aug", sales: 68000 },
    { month: "Sep", sales: 75000 },
    { month: "Oct", sales: 82000 },
    { month: "Nov", sales: 78000 },
    { month: "Dec", sales: 84500 },
  ];

  const outstandingInvoices = [
    { customer: "ABC Motors", amount: 15000 },
    { customer: "XYZ Industries", amount: 28500 },
    { customer: "Tech Solutions", amount: 19800 },
    { customer: "Global Motors", amount: 31200 },
    { customer: "Modern Engineering", amount: 25000 },
  ];

  const stockLevels = [
    { name: "Copper Wire", value: 45000, fill: "hsl(var(--chart-1))" },
    { name: "Bearings", value: 35000, fill: "hsl(var(--chart-2))" },
    { name: "Insulation", value: 28000, fill: "hsl(var(--chart-3))" },
    { name: "Rotors", value: 52000, fill: "hsl(var(--chart-4))" },
    { name: "Others", value: 55000, fill: "hsl(var(--chart-5))" },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-1">Analytics and business insights</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <metric.icon className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                <p className="text-xs text-success mt-1">
                  {metric.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Month</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name="Sales (₹)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Outstanding Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={outstandingInvoices}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="customer" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="hsl(var(--warning))" name="Amount (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Stock Value Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stockLevels}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stockLevels.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
