import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Users, Package, Loader2 } from "lucide-react";
import api from "@/utils/api";
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
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState([
    { title: "Total Revenue", value: "₹0", change: "0%", icon: DollarSign },
    { title: "Sales Growth", value: "0%", change: "0%", icon: TrendingUp },
    { title: "Active Customers", value: "0", change: "+0", icon: Users },
    { title: "Stock Value", value: "₹0", change: "0%", icon: Package },
  ]);
  const [salesByMonth, setSalesByMonth] = useState<any[]>([]);
  const [outstandingInvoices, setOutstandingInvoices] = useState<any[]>([]);
  const [stockLevels, setStockLevels] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [invoicesRes, customersRes, goodsRes] = await Promise.all([
          api.get("/api/invoices/"),
          api.get("/api/customer/"),
          api.get("/api/incoming-goods/")
        ]);

        const invoices = invoicesRes.data;
        const customers = customersRes.data;
        const goods = goodsRes.data;

        processMetrics(invoices, customers, goods);
        processSalesChart(invoices);
        processOutstandingChart(invoices);
        processStockChart(goods);

      } catch (error) {
        console.error("Failed to load report data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 1. Calculate Headline Metrics
  const processMetrics = (invoices: any[], customers: any[], goods: any[]) => {
    // A. Total Revenue (Paid Invoices)
    const paidInvoices = invoices.filter((i: any) => i.status === 'paid');
    const totalRevenue = paidInvoices.reduce((sum: number, i: any) => sum + parseFloat(i.final_amount), 0);

    // B. Sales Growth (Current Month vs Last Month Revenue)
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonth = lastMonthDate.getMonth();
    const lastMonthYear = lastMonthDate.getFullYear();

    const currentMonthRevenue = paidInvoices
      .filter((i: any) => {
        const d = new Date(i.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum: number, i: any) => sum + parseFloat(i.final_amount), 0);

    const lastMonthRevenue = paidInvoices
      .filter((i: any) => {
        const d = new Date(i.date);
        return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
      })
      .reduce((sum: number, i: any) => sum + parseFloat(i.final_amount), 0);

    let growthPercent = 0;
    if (lastMonthRevenue > 0) {
      growthPercent = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
    } else if (currentMonthRevenue > 0) {
      growthPercent = 100;
    }

    // C. Active Customers (New this month)
    const newCustomers = customers.filter((c: any) => {
      const d = new Date(c.created_at || new Date()); // Fallback if created_at missing
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    // D. Stock Value
    const totalStockValue = goods.reduce((sum: number, g: any) => sum + parseFloat(g.price), 0);

    setMetrics([
      { 
        title: "Total Revenue", 
        value: `₹${totalRevenue.toLocaleString('en-IN')}`, 
        change: "Paid Invoices", 
        icon: DollarSign 
      },
      { 
        title: "Sales Growth", 
        value: `${growthPercent.toFixed(1)}%`, 
        change: "vs last month", 
        icon: TrendingUp 
      },
      { 
        title: "Total Customers", 
        value: customers.length.toString(), 
        change: `+${newCustomers} new`, 
        icon: Users 
      },
      { 
        title: "Stock Value", 
        value: `₹${totalStockValue.toLocaleString('en-IN')}`, 
        change: "Inventory Asset", 
        icon: Package 
      },
    ]);
  };

  // 2. Sales by Month Chart
  const processSalesChart = (invoices: any[]) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const salesMap: { [key: string]: number } = {};

    invoices.forEach((inv: any) => {
      // Use all invoices (billed amount) for sales trends, or filter by 'paid' if strict cash flow needed
      const d = new Date(inv.date);
      const monthIndex = d.getMonth();
      const monthName = monthNames[monthIndex];
      salesMap[monthName] = (salesMap[monthName] || 0) + parseFloat(inv.final_amount);
    });

    // Create array ensuring order
    const data = monthNames.map(m => ({
      month: m,
      sales: salesMap[m] || 0
    }));
    setSalesByMonth(data);
  };

  // 3. Outstanding Invoices Chart
  const processOutstandingChart = (invoices: any[]) => {
    const unpaidMap: { [key: string]: number } = {};
    
    invoices
      .filter((i: any) => i.status === 'pending' || i.status === 'overdue')
      .forEach((inv: any) => {
        unpaidMap[inv.customer_name] = (unpaidMap[inv.customer_name] || 0) + parseFloat(inv.final_amount);
      });

    const data = Object.entries(unpaidMap)
      .map(([customer, amount]) => ({ customer, amount }))
      .sort((a, b) => b.amount - a.amount) // Sort highest debt first
      .slice(0, 5); // Top 5

    setOutstandingInvoices(data);
  };

  // 4. Stock Levels Chart
  const processStockChart = (goods: any[]) => {
    const stockMap: { [key: string]: number } = {};
    
    goods.forEach((g: any) => {
        // Group by Item Name
        stockMap[g.item_name] = (stockMap[g.item_name] || 0) + parseFloat(g.price);
    });

    // Colors for pie slices
    const COLORS = [
        "hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", 
        "hsl(var(--chart-4))", "hsl(var(--chart-5))", "#8884d8", "#82ca9d"
    ];

    const data = Object.entries(stockMap)
        .map(([name, value], index) => ({
            name, 
            value,
            fill: COLORS[index % COLORS.length]
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6); // Top 6 items

    setStockLevels(data);
  };

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
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-1">Analytics and business insights</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <metric.icon className="h-5 w-5 text-primary/70" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {metric.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Revenue by Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="sales"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        name="Revenue (₹)"
                        dot={false}
                    />
                    </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Outstanding Invoices */}
          <Card>
            <CardHeader>
              <CardTitle>Top Outstanding Balances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={outstandingInvoices} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false}/>
                        <XAxis type="number" hide />
                        <YAxis 
                            dataKey="customer" 
                            type="category" 
                            width={100} 
                            tick={{fontSize: 12}} 
                        />
                        <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
                        <Bar 
                            dataKey="amount" 
                            fill="hsl(var(--destructive))" 
                            name="Amount Due (₹)" 
                            radius={[0, 4, 4, 0]} 
                            barSize={30}
                        />
                    </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stock Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Value Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={stockLevels}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                    {stockLevels.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
                </PieChart>
                </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;