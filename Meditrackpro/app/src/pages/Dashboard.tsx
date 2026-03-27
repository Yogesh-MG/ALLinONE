// 1. Import axios and useNavigate
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Added
import axios from 'axios'; // Added
import PageContainer from '@/components/layout/PageContainer';
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
  User,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { baseUrl } from '@/utils/apiconfig'; // 3. Added
// 2. REMOVED: import { api } from '@/lib/api';

// 3. ACTION REQUIRED: Set your API's base URL here

// Data structure for the dashboard (same as before)
interface DashboardData {
  metrics: {
    total_inventory_items: number;
    devices_under_maintenance: number;
    low_stock_alerts: number;
    active_suppliers: number;
    trends: {
      low_stock_change: number;
    };
  };
  alerts: {
    id: string;
    type: string;
    priority: string;
    title: string;
    description: string;
    time: string;
  }[];
  upcoming_maintenance: {
    id: string;
    device: string;
    type: string;
    date: string;
    status: string;
  }[];
  inventory_categories: { name: string; percentage: number }[];
  charts: {
    inventory_overview: { name: string; value: number }[];
    maintenance_overview: { name: string; value: number }[];
  };
  recent_activity: {
    id: string;
    user: string;
    action: string;
    item: string;
    time: string;
  }[];
}

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate(); // Added

  // 4. Get auth details, just like in DeviceDetail
  const hospitalId = localStorage.getItem('hospitalid');
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    // 5. Add auth check, just like in DeviceDetail
    if (!token || !hospitalId) {
      toast({
        title: 'Unauthorized',
        description: 'You must be logged in to view the dashboard.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        // 6. Use axios.get with the full URL and headers
        const response = await axios.get<DashboardData>(
          `${baseUrl}/api/dashboard/hospitals/${hospitalId}/dashboard/`,
          { headers } // Pass the headers
        );
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error.response?.data);
        toast({
          title: 'Error',
          // 7. Use the detailed error message
          description:
            error.response?.data?.detail || 'Could not load dashboard data.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    // 8. Add dependencies
  }, [hospitalId, token, navigate, toast]);

  // Helper function for alert icons (same as before)
  const getAlertIcon = (type: string, priority: string) => {
    if (priority === 'High') {
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
    switch (type) {
      case 'low_stock':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'maintenance':
        return <Stethoscope className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  // Helper function for activity icons (same as before)
  const getActivityIcon = (action: string) => {
    if (action.includes('Added')) {
      return <Package className="h-4 w-4 text-green-500" />;
    }
    if (action.includes('Updated') || action.includes('Scheduled')) {
      return <Activity className="h-4 w-4 text-blue-500" />;
    }
    if (action.includes('Removed')) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    return <User className="h-4 w-4 text-gray-500" />;
  };

  // Loading State (same as before)
  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center h-64">
          <p>Loading Dashboard...</p>
        </div>
      </PageContainer>
    );
  }

  // Error State (same as before)
  if (!data) {
    return (
      <PageContainer>
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-red-500">Error loading data.</p>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </PageContainer>
    );
  }

  // Success State (data is loaded)
  const displayData = data;
  console.log('Dashboard data:', displayData); // Debug log

  return (
    <PageContainer>
      {/* Header (same as before) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your hospital's inventory and maintenance.
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Select Date Range</span>
          </Button>
          <Button>Generate Report</Button>
        </div>
      </div>

      {/* Top Metric Cards (same as before) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <MetricCard
          title="Total Inventory Items"
          value={displayData.metrics.total_inventory_items.toLocaleString()}
          icon={<Package className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="Devices Under Maintenance"
          value={displayData.metrics.devices_under_maintenance.toLocaleString()}
          icon={<Stethoscope className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="Low Stock Alerts"
          value={displayData.metrics.low_stock_alerts.toLocaleString()}
          icon={<AlertCircle className="h-5 w-5 text-primary" />}
          change={displayData.metrics.trends.low_stock_change}
          trend={
            displayData.metrics.trends.low_stock_change > 0
              ? 'up'
              : displayData.metrics.trends.low_stock_change < 0
              ? 'down'
              : undefined
          }
          trendText={
            displayData.metrics.trends.low_stock_change > 0
              ? 'increased since last month'
              : displayData.metrics.trends.low_stock_change < 0
              ? 'decreased since last month'
              : 'no change'
          }
        />
        <MetricCard
          title="Active Suppliers"
          value={displayData.metrics.active_suppliers.toLocaleString()}
          icon={<Truck className="h-5 w-5 text-primary" />}
          trendText="unchanged since last month"
        />
      </div>

      {/* Main Grid: Row 1 (Chart & Alerts) (same as before) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <DashboardCard title="Inventory Overview" className="lg:col-span-2">
          <StatChart
            data={displayData.charts.inventory_overview}
            dataKey="value"
            height={250}
            xAxisDataKey="name"
            tooltipLabel="Items"
            tooltipFormatter={(value) => `${value.toLocaleString()}`}
          />
        </DashboardCard>

        <DashboardCard title="Alerts & Notifications" contentClassName="p-0">
          <div className="divide-y divide-slate-200 dark:divide-slate-800 max-h-[250px] overflow-auto">
            {displayData.alerts.length > 0 ? (
              displayData.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div className="flex-shrink-0 pt-0.5">
                    {getAlertIcon(alert.type, alert.priority)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className="text-sm font-medium">{alert.title}</h4>
                      <Badge
                        variant={
                          alert.priority === 'High' ? 'destructive' : 'outline'
                        }
                        className="capitalize"
                      >
                        {alert.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {alert.description}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(alert.time).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-4 text-sm text-center text-muted-foreground">
                No new alerts.
              </p>
            )}
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" size="sm" className="w-full">
              View All Alerts <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </DashboardCard>
      </div>

      {/* Main Grid: Row 2 (Categories & Maintenance) (same as before) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <DashboardCard
          title="Inventory Categories"
          description="Distribution of inventory across categories"
          className="lg:col-span-1"
        >
          <div className="space-y-4">
            {displayData.inventory_categories.map((cat, index) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'][index % 5]
                      }`}
                    ></div>
                    <span className="text-sm font-medium">{cat.name}</span>
                  </div>
                  <span className="text-sm font-medium">{cat.percentage}%</span>
                </div>
                <Progress value={cat.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Upcoming Maintenance" contentClassName="p-0" className="lg:col-span-2">
          <div className="divide-y divide-slate-200 dark:divide-slate-800 max-h-[300px] overflow-auto">
            {displayData.upcoming_maintenance.length > 0 ? (
              displayData.upcoming_maintenance.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                      <Stethoscope className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.device}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                    <Badge
                      variant={
                        item.status === 'Scheduled' ? 'secondary' : 'default'
                      }
                      className="capitalize"
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-4 text-sm text-center text-muted-foreground">
                No upcoming maintenance.
              </p>
            )}
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" size="sm" className="w-full">
              View Maintenance Schedule <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </DashboardCard>
      </div>
      
      {/* Main Grid: Row 3 (Maintenance Chart & Recent Activity) (same as before) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <DashboardCard title="Maintenance Overview" className="lg:col-span-1">
          <StatChart
            data={displayData.charts.maintenance_overview}
            dataKey="value"
            height={250}
            xAxisDataKey="name"
            tooltipLabel="Items"
            tooltipFormatter={(value) => `${value.toLocaleString()}`}
          />
        </DashboardCard>
        
        <DashboardCard title="Recent Activity" contentClassName="p-0" className="lg:col-span-2">
           <div className="divide-y divide-slate-200 dark:divide-slate-800 max-h-[300px] overflow-auto">
            {displayData.recent_activity.length > 0 ? (
              displayData.recent_activity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                       {getActivityIcon(activity.action)}
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>{' '}
                        {activity.action.toLowerCase()}{' '}
                        <span className="font-medium">{activity.item}</span>.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.time).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
               <p className="p-4 text-sm text-center text-muted-foreground">
                No recent activity.
              </p>
            )}
           </div>
           <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" size="sm" className="w-full">
              View Full Activity Log <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </DashboardCard>
      </div>

    </PageContainer>
  );
};

export default Dashboard;