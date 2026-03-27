
import React from "react";
import { CreditCard, DollarSign, Download, FileText, Plus, RefreshCw, Search } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer-demo";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const Billingdemo = () => {
  // Sample billing data
  const invoices = [
    { 
      id: "INV-2024-001", 
      patient: "John Doe", 
      date: "2024-03-15", 
      amount: 1250.00, 
      status: "Paid", 
      insurance: "Blue Cross" 
    },
    { 
      id: "INV-2024-002", 
      patient: "Jane Smith", 
      date: "2024-03-18", 
      amount: 875.50, 
      status: "Pending", 
      insurance: "Aetna" 
    },
    { 
      id: "INV-2024-003", 
      patient: "Robert Johnson", 
      date: "2024-03-20", 
      amount: 2340.75, 
      status: "Overdue", 
      insurance: "Medicare" 
    },
    { 
      id: "INV-2024-004", 
      patient: "Emily Davis", 
      date: "2024-03-22", 
      amount: 560.25, 
      status: "Paid", 
      insurance: "United Health" 
    },
    { 
      id: "INV-2024-005", 
      patient: "Michael Wilson", 
      date: "2024-03-25", 
      amount: 1890.00, 
      status: "Pending", 
      insurance: "Cigna" 
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Paid</Badge>;
      case "Pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case "Overdue":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Billing & Invoicing</h1>
            <p className="text-muted-foreground">
              Manage invoices, payments, and financial transactions
            </p>
          </div>
          <div className="flex gap-2">
         
            <Button variant="outline" className="flex gap-2">
              <Download size={16} />
              Export
            </Button>
          <a href="/billing/invoice">
            <Button className="flex gap-2">
              <Plus size={16} />
              New Invoice
            </Button>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DashboardCard title="Revenue This Month" description="March 2024">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">$24,568.50</span>
              <Badge className="ml-2 bg-green-50 text-green-700 border-green-200">+12.3%</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Compared to $21,875.00 last month</p>
          </DashboardCard>
          
          <DashboardCard title="Pending Payments" description="Awaiting payment">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">$8,745.25</span>
              <span className="ml-2 text-sm text-muted-foreground">(12 invoices)</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Oldest invoice is 15 days overdue</p>
          </DashboardCard>
          
          <DashboardCard title="Insurance Claims" description="Submitted claims">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">28</span>
              <span className="ml-2 text-sm text-muted-foreground">Claims this month</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="text-sm">
                <span className="text-green-600 font-medium">22</span> Approved
              </div>
              <div className="text-sm">
                <span className="text-yellow-600 font-medium">6</span> Pending
              </div>
            </div>
          </DashboardCard>
        </div>

        <Tabs defaultValue="invoices" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="claims">Claims</TabsTrigger>
          </TabsList>
          
          <TabsContent value="invoices">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search invoices..." 
                      className="pl-8" 
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex gap-1">
                      <RefreshCw size={14} />
                      Refresh
                    </Button>
                    <Button variant="outline" size="sm" className="flex gap-1">
                      <FileText size={14} />
                      Report
                    </Button>
                  </div>
                </div>
                
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 px-4 py-3 bg-muted/50 text-sm font-medium">
                    <div>Invoice</div>
                    <div>Patient</div>
                    <div>Date</div>
                    <div>Amount</div>
                    <div>Insurance</div>
                    <div>Status</div>
                  </div>
                  
                  {invoices.map((invoice) => (
                    <div 
                      key={invoice.id} 
                      className="grid grid-cols-6 px-4 py-3 border-t text-sm items-center hover:bg-muted/30 transition-colors"
                    >
                      <div className="font-medium">{invoice.id}</div>
                      <div>{invoice.patient}</div>
                      <div>{invoice.date}</div>
                      <div>${invoice.amount.toFixed(2)}</div>
                      <div>{invoice.insurance}</div>
                      <div>{getStatusBadge(invoice.status)}</div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
                  <div>Showing 5 of 48 invoices</div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" disabled>Previous</Button>
                    <Button variant="outline" size="sm">Next</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payments">
            <DashboardCard title="Recent Payments">
              <p className="text-muted-foreground py-8 text-center">
                Payment history will be connected to the Django backend.
              </p>
            </DashboardCard>
          </TabsContent>
          
          <TabsContent value="claims">
            <DashboardCard title="Insurance Claims">
              <p className="text-muted-foreground py-8 text-center">
                Insurance claims data will be connected to the Django backend.
              </p>
            </DashboardCard>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default Billingdemo;
