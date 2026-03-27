
import React from "react";
import { BarChart3, CalendarDays, Download, LineChart, PieChart, Printer, Share2 } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer-demo";
import DashboardCard from "@/components/dashboard/DashboardCard";
import StatChart from "@/components/dashboard/StatChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample data for charts
const inventoryData = [
  { name: "Jan", value: 580 },
  { name: "Feb", value: 450 },
  { name: "Mar", value: 620 },
  { name: "Apr", value: 530 },
  { name: "May", value: 710 },
  { name: "Jun", value: 680 },
];

const deviceUsageData = [
  { name: "Ventilators", value: 65 },
  { name: "MRI Scanners", value: 85 },
  { name: "CT Scanners", value: 78 },
  { name: "X-Ray", value: 92 },
  { name: "Ultrasound", value: 55 },
  { name: "Infusion Pumps", value: 70 },
];

const Analyticsdemo = () => {
  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Data insights and performance metrics
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select defaultValue="thisMonth">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thisWeek">This Week</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="lastQuarter">Last Quarter</SelectItem>
                <SelectItem value="thisYear">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex gap-2">
              <Download size={16} />
              Export
            </Button>
            <Button variant="outline" className="flex gap-2">
              <Printer size={16} />
              Print
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DashboardCard 
            title="Inventory Turnover" 
            description="Items used per month"
            footer={
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarDays size={14} className="mr-1" />
                Last updated: Today
              </div>
            }
          >
            <div className="h-[180px]">
              <StatChart
                data={inventoryData}
                dataKey="value"
                nameKey="name"
                chartType="bar"
                chartColor="#4f46e5"
              />
            </div>
          </DashboardCard>
          
          <DashboardCard 
            title="Device Usage" 
            description="Utilization percentage"
            footer={
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarDays size={14} className="mr-1" />
                Last updated: Yesterday
              </div>
            }
          >
            <div className="h-[180px]">
              <StatChart
                data={deviceUsageData}
                dataKey="value"
                nameKey="name"
                chartType="bar"
                chartColor="#06b6d4"
              />
            </div>
          </DashboardCard>
          
          <DashboardCard 
            title="Compliance Rate" 
            description="Regulatory standards met"
            footer={
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarDays size={14} className="mr-1" />
                Last updated: 3 days ago
              </div>
            }
          >
            <div className="h-[180px]">
              <StatChart
                data={[
                  { name: "FDA", value: 100 },
                  { name: "ISO", value: 85 },
                  { name: "WHO", value: 68 },
                  { name: "HIPAA", value: 100 },
                ]}
                dataKey="value"
                nameKey="name"
                chartType="bar"
                chartColor="#10b981"
              />
            </div>
          </DashboardCard>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview" className="flex gap-2 items-center">
              <BarChart3 size={16} />
              Overview
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex gap-2 items-center">
              <LineChart size={16} />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex gap-2 items-center">
              <PieChart size={16} />
              Devices
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <DashboardCard 
                    title="Annual Revenue Trend" 
                    description="Financial performance"
                  >
                    <div className="h-[300px]">
                      <StatChart
                        data={[
                          { name: "2020", value: 320000 },
                          { name: "2021", value: 380000 },
                          { name: "2022", value: 420000 },
                          { name: "2023", value: 490000 },
                          { name: "2024", value: 210000, projected: true },
                        ]}
                        dataKey="value"
                        nameKey="name"
                        chartType="line"
                        chartColor="#4f46e5"
                      />
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-muted-foreground">2024 Projection: $580,000</span>
                      <Badge className="bg-green-50 text-green-700 border-green-200">+18.4% YoY</Badge>
                    </div>
                  </DashboardCard>
                  
                  <DashboardCard 
                    title="Operational Metrics" 
                    description="Key performance indicators"
                  >
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <div className="text-sm text-muted-foreground mb-1">Inventory Accuracy</div>
                          <div className="text-2xl font-bold">98.7%</div>
                          <Badge className="mt-1 bg-green-50 text-green-700 border-green-200">+1.2%</Badge>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <div className="text-sm text-muted-foreground mb-1">Device Uptime</div>
                          <div className="text-2xl font-bold">96.3%</div>
                          <Badge className="mt-1 bg-green-50 text-green-700 border-green-200">+0.8%</Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <div className="text-sm text-muted-foreground mb-1">Maintenance Compliance</div>
                          <div className="text-2xl font-bold">94.5%</div>
                          <Badge className="mt-1 bg-yellow-50 text-yellow-700 border-yellow-200">-0.3%</Badge>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <div className="text-sm text-muted-foreground mb-1">Order Fill Rate</div>
                          <div className="text-2xl font-bold">99.2%</div>
                          <Badge className="mt-1 bg-green-50 text-green-700 border-green-200">+0.7%</Badge>
                        </div>
                      </div>
                    </div>
                  </DashboardCard>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inventory">
            <DashboardCard title="Inventory Analytics">
              <p className="text-muted-foreground py-8 text-center">
                Detailed inventory analytics will be connected to the Django backend.
              </p>
            </DashboardCard>
          </TabsContent>
          
          <TabsContent value="devices">
            <DashboardCard title="Device Analytics">
              <p className="text-muted-foreground py-8 text-center">
                Detailed device analytics will be connected to the Django backend.
              </p>
            </DashboardCard>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default Analyticsdemo;
