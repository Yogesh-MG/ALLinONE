
import React from 'react';
import PageContainer from '@/components/layout/PageContainer-demo';
import DashboardCard from '@/components/dashboard/DashboardCard';
import MetricCard from '@/components/dashboard/MetricCard';
import StatChart from '@/components/dashboard/StatChart';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Package,
  Stethoscope,
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  Calendar,
  Clock,
  Tag,
  Truck,
  Users,
  AlertTriangle,
  ChevronRight,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

// Sample data for charts
const inventoryData = [
  { name: 'Jan', value: 120 },
  { name: 'Feb', value: 150 },
  { name: 'Mar', value: 180 },
  { name: 'Apr', value: 170 },
  { name: 'May', value: 200 },
  { name: 'Jun', value: 220 },
  { name: 'Jul', value: 230 },
];

const deviceMaintenanceData = [
  { name: 'Jan', value: 25 },
  { name: 'Feb', value: 28 },
  { name: 'Mar', value: 32 },
  { name: 'Apr', value: 29 },
  { name: 'May', value: 35 },
  { name: 'Jun', value: 38 },
  { name: 'Jul', value: 40 },
];

const alerts = [
  {
    id: 1,
    type: 'inventory',
    title: 'Low stock alert',
    description: 'Surgical masks are running low (15% remaining)',
    time: '10 minutes ago',
    priority: 'high',
  },
  {
    id: 2,
    type: 'device',
    title: 'Calibration due',
    description: 'MRI Scanner #3 requires recalibration',
    time: '2 hours ago',
    priority: 'medium',
  },
  {
    id: 3,
    type: 'inventory',
    title: 'Expiry warning',
    description: 'Batch #LT-5789 of Antibiotics expires in 30 days',
    time: '5 hours ago',
    priority: 'medium',
  },
  {
    id: 4,
    type: 'supplier',
    title: 'Order received',
    description: 'Order #67890 from MedSupplier has been delivered',
    time: '1 day ago',
    priority: 'low',
  },
];

const recentActivities = [
  {
    id: 1,
    user: 'Dr. Sarah Chen',
    action: 'checked out',
    item: '5 Infusion Pumps',
    time: '45 minutes ago',
  },
  {
    id: 2,
    user: 'John Williams',
    action: 'completed maintenance on',
    item: 'CT Scanner #2',
    time: '3 hours ago',
  },
  {
    id: 3,
    user: 'Michael Johnson',
    action: 'updated inventory for',
    item: 'Surgical Gloves',
    time: '5 hours ago',
  },
  {
    id: 4,
    user: 'Dr. Emily Rodriguez',
    action: 'approved order for',
    item: 'Laboratory Reagents',
    time: '1 day ago',
  },
];

const upcomingMaintenances = [
  {
    id: 1,
    device: 'MRI Scanner #1',
    type: 'Recalibration',
    date: '06/15/2023',
    status: 'scheduled',
  },
  {
    id: 2,
    device: 'Ventilator B-35',
    type: 'Regular Maintenance',
    date: '06/18/2023',
    status: 'scheduled',
  },
  {
    id: 3,
    device: 'X-Ray Machine #4',
    type: 'Quality Check',
    date: '06/20/2023',
    status: 'scheduled',
  },
];

const Dashboarddemo = () => {
  return (
    <motion.div
  initial={{ opacity: 0, scale: 0.8 }} // Start smaller and invisible
  animate={{ opacity: 1, scale: 1 }}   // Grow to full size
  transition={{ duration: 0.5, ease: "easeInOut" }}
>
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your medical inventory and device management</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Jun 12, 2023
          </Button>
          <a href="/demo/reports"><Button>
            <ArrowUpRight className="h-4 w-4 mr-2" />
            View Reports
          </Button>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <MetricCard
          title="Total Inventory Items"
          value="2,458"
          icon={<Package className="h-5 w-5 text-primary" />}
          change={8.2}
          trend="up"
          trendText="increased since last month"
        />
        <MetricCard
          title="Devices Under Maintenance"
          value="37"
          icon={<Stethoscope className="h-5 w-5 text-primary" />}
          change={3.1}
          trend="down"
          trendText="decreased since last month"
        />
        <MetricCard
          title="Low Stock Alerts"
          value="12"
          icon={<AlertCircle className="h-5 w-5 text-primary" />}
          change={15.4}
          trend="up"
          trendText="increased since last month"
        />
        <MetricCard
          title="Active Suppliers"
          value="42"
          icon={<Truck className="h-5 w-5 text-primary" />}
          trendText="unchanged since last month"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <DashboardCard
          title="Inventory Overview"
          className="lg:col-span-2"
        >
          <StatChart
            data={inventoryData}
            dataKey="value"
            height={250}
            xAxisDataKey="name"
            tooltipLabel="Items"
            tooltipFormatter={(value) => `${value.toLocaleString()}`}
          />
        </DashboardCard>

        <DashboardCard
          title="Alerts & Notifications"
          contentClassName="p-0"
        >
          <div className="divide-y divide-slate-200 dark:divide-slate-800 max-h-[250px] overflow-auto">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 flex items-start gap-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full 
                  ${alert.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                    alert.priority === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 
                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}
                >
                  {alert.type === 'inventory' ? <Package size={18} /> : 
                   alert.type === 'device' ? <Stethoscope size={18} /> : 
                   <Truck size={18} />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium">{alert.title}</h4>
                    <Badge variant="outline" className={`
                      ${alert.priority === 'high' ? 'border-red-200 text-red-700 dark:border-red-800 dark:text-red-400' : 
                        alert.priority === 'medium' ? 'border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-400' : 
                        'border-green-200 text-green-700 dark:border-green-800 dark:text-green-400'}`}
                    >
                      {alert.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                  <span className="text-xs text-muted-foreground">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="ghost" className="w-full justify-between" size="sm">
              View all alerts
              <ChevronRight size={16} />
            </Button>
          </div>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <DashboardCard
          title="Device Maintenance"
          className="lg:col-span-2"
        >
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-0">
              <StatChart
                data={deviceMaintenanceData}
                dataKey="value"
                height={250}
                xAxisDataKey="name"
                tooltipLabel="Maintenances"
                tooltipFormatter={(value) => `${value}`}
                gradientColor="#8B5CF6"
                strokeColor="#8B5CF6"
              />
            </TabsContent>
            <TabsContent value="upcoming" className="mt-0">
              <div className="rounded-md border divide-y">
                {upcomingMaintenances.map((maintenance) => (
                  <div
                    key={maintenance.id}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 flex items-center justify-center rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                        <Stethoscope size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{maintenance.device}</h4>
                        <p className="text-sm text-muted-foreground">{maintenance.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-sm">{maintenance.date}</span>
                        <Badge variant="outline" className="ml-2">
                          {maintenance.status}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="icon">
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4" size="sm">
                View all scheduled maintenance
              </Button>
            </TabsContent>
            <TabsContent value="history" className="mt-0">
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                Maintenance history will be displayed here
              </div>
            </TabsContent>
          </Tabs>
        </DashboardCard>

        <DashboardCard
          title="Recent Activity"
          contentClassName="p-0"
        >
          <div className="divide-y divide-slate-200 dark:divide-slate-800 max-h-[344px] overflow-auto">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="p-4 flex items-start gap-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={activity.user} />
                  <AvatarFallback className="text-xs">{activity.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{' '}
                    <span className="text-muted-foreground">{activity.action}</span>{' '}
                    <span className="font-medium">{activity.item}</span>
                  </p>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="ghost" className="w-full justify-between" size="sm">
              View all activity
              <ChevronRight size={16} />
            </Button>
          </div>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DashboardCard
            title="Inventory Categories"
            description="Distribution of inventory across categories"
          >
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-medical-500"></div>
                    <span className="text-sm font-medium">Medical Devices</span>
                  </div>
                  <span className="text-sm font-medium">40%</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    <span className="text-sm font-medium">Pharmaceuticals</span>
                  </div>
                  <span className="text-sm font-medium">30%</span>
                </div>
                <Progress value={30} className="h-2 bg-purple-100 dark:bg-purple-900/20" indicatorColor="bg-purple-500" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">Disposables</span>
                  </div>
                  <span className="text-sm font-medium">20%</span>
                </div>
                <Progress value={20} className="h-2 bg-green-100 dark:bg-green-900/20" indicatorColor="bg-green-500" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm font-medium">Laboratory</span>
                  </div>
                  <span className="text-sm font-medium">10%</span>
                </div>
                <Progress value={10} className="h-2 bg-amber-100 dark:bg-amber-900/20" indicatorColor="bg-amber-500" />
              </div>
            </div>
          </DashboardCard>
        </div>

        <DashboardCard
          title="Quick Actions"
          footer={
            <Button variant="ghost" className="w-full justify-between" size="sm">
              View more actions
              <ArrowRight size={16} />
            </Button>
          }
        >
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="h-auto flex-col items-start p-4 text-left justify-start">
            <a href="/demo/inventory/add"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-medical-100 text-medical-700 dark:bg-medical-900/30 dark:text-medical-400 mb-2">
                <Package size={16} />
              </div></a>
              <a href="/demo/inventory/add">
              <span className="text-sm font-medium">Add Inventory</span>
              </a>
            </Button>
            <Button variant="outline" className="h-auto flex-col items-start p-4 text-left justify-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 mb-2">
                <Stethoscope size={16} />
              </div>
              <span className="text-sm font-medium">Add Device</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col items-start p-4 text-left justify-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 mb-2">
                <Truck size={16} />
              </div>
              <span className="text-sm font-medium">New Order</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col items-start p-4 text-left justify-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 mb-2">
                <BarChart3 size={16} />
              </div>
              <span className="text-sm font-medium">Reports</span>
            </Button>
          </div>
        </DashboardCard>
      </div>
    </PageContainer>
    </motion.div>
  );
};

export default Dashboarddemo;
