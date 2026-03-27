import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import PageContainer from '@/components/layout/PageContainer';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import {
  Truck,
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  Edit,
  ShoppingCart,
  Package,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { baseUrl } from '@/utils/apiconfig';

// Define interfaces
interface Supplier {
  id: number;
  name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  categories: { id: string; name: string }[];
  reliability_score: number;
  status: 'Active' | 'OnHold' | 'Inactive';
  created_at: string;
}

interface PurchaseOrder {
  id: number;
  order_id: string;
  supplier: number;
  supplier_name: string;
  date: string;
  items_count: number | string; // Allow string from backend
  total_cost: number | null; // Allow string or null from backend
  status: 'DRAFT' | 'SUBMITTED' | 'RECEIVED';
  estimated_delivery: string;
  actual_delivery: string | null;
}

interface Stats {
  total: number;
  active: number;
  on_hold: number;
  inactive: number;
}

const Suppliers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const hospitalId = parseInt(localStorage.getItem('hospitalid'));
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // Fetch suppliers
  const {
    data: suppliers = [],
    isLoading: suppliersLoading,
    error: suppliersError,
  } = useQuery<Supplier[], AxiosError<{ detail?: string }>>({
    queryKey: ['suppliers', hospitalId],
    queryFn: () =>
      axios
        .get(`${baseUrl}/api/${hospitalId}/suppliers/`, { headers })
        .then((res) => res.data),
    enabled: !!token,
  });

  // Fetch orders
  const {
    data: orders = [],
    isLoading: ordersLoading,
    error: ordersError,
  } = useQuery<PurchaseOrder[], AxiosError<{ detail?: string }>>({
    queryKey: ['orders', hospitalId],
    queryFn: () =>
      axios
        .get(`${baseUrl}/api/${hospitalId}/purchase-orders/`, { headers })
        .then((res) => res.data),
    enabled: !!token,
  });

  // Fetch stats
  const {
    data: stats = { total: 0, active: 0, on_hold: 0, inactive: 0 },
    error: statsError,
  } = useQuery<Stats, AxiosError<{ detail?: string }>>({
    queryKey: ['supplier_stats', hospitalId],
    queryFn: () =>
      axios
        .get(`${baseUrl}/api/${hospitalId}/suppliers/stats/`, { headers })
        .then((res) => res.data),
    enabled: !!token,
  });

  // Handle errors with useEffect
  useEffect(() => {
    if (suppliersError) {
      const errorMessage =
        suppliersError.response?.data?.detail || 'Failed to load suppliers';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [suppliersError, toast]);

  useEffect(() => {
    if (ordersError) {
      const errorMessage =
        ordersError.response?.data?.detail || 'Failed to load orders';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [ordersError, toast]);

  useEffect(() => {
    if (statsError) {
      const errorMessage =
        statsError.response?.data?.detail || 'Failed to load stats';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [statsError, toast]);

  // Search logic
  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.id.toString().includes(searchQuery.toLowerCase()) ||
      supplier.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.categories.some((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  // Redirect to login if no token
  if (!token) {
    navigate('/login');
    return null;
  }

  // Helper to format total
  const formatTotal = (total_cost: number | string | null): string => {
    if (total_cost == null) return 'N/A';
    const num = typeof total_cost === 'string' ? parseFloat(total_cost) : total_cost;
    return isNaN(num)
      ? 'N/A'
      : `₹${num.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  // Helper to parse items_count
  const parseItemsCount = (count: number | string): number => {
    return typeof count === 'string' ? parseInt(count, 10) || 0 : count;
  };

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-medical-800 dark:text-medical-100">
            Supplier Management
          </h1>
          <p className="text-muted-foreground">Manage suppliers and track orders</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" disabled>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => navigate('/suppliers/add')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DashboardCard
          title="total"
          className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-100 dark:border-blue-800/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total suppliers</p>
            </div>
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Truck size={24} />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Pending"
          className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-100 dark:border-amber-800/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">
                {orders.filter((o) => o.status !== 'RECEIVED').length}
              </div>
              <p className="text-sm text-muted-foreground">Pending orders</p>
            </div>
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <Package size={24} />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="last"
          className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-800/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">
                {formatTotal(
                  orders.length
                  ? orders.reduce((sum, o) => sum + (o.total_cost || 0), 0) / orders.length
                  : 0
                )}
              </div>
              <p className="text-sm text-muted-foreground">Last 30 days</p>
            </div>
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <ShoppingCart size={24} />
            </div>
          </div>
        </DashboardCard>
      </div>

      <Tabs defaultValue="suppliers" className="w-full mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers" className="m-0">
          <DashboardCard title="Supplier Directory">
            <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
              <div className="flex items-center">
                {suppliersLoading ? (
                  <Skeleton className="h-6 w-24" />
                ) : (
                  <>
                    <Badge variant="outline" className="mr-2">
                      {filteredSuppliers.length} suppliers
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400 mr-2"
                    >
                      {stats.active} active
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400 mr-2"
                    >
                      {stats.on_hold} on hold
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-400"
                    >
                      {stats.inactive} inactive
                    </Badge>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search suppliers..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" disabled>
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" disabled>
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Categories</TableHead>
                    <TableHead>Reliability</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliersLoading
                    ? Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <Skeleton className="h-6 w-16" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-32" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-20" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-16" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-20" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-24" />
                            </TableCell>
                          </TableRow>
                        ))
                    : filteredSuppliers.map((supplier) => (
                        <TableRow key={supplier.id}>
                          <TableCell className="font-medium">{supplier.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 bg-blue-100 text-blue-700">
                                <AvatarFallback>
                                  {supplier.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{supplier.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {supplier.contact_name}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {supplier.categories.map((cat) => (
                                <Badge
                                  key={cat.id}
                                  variant="outline"
                                  className="bg-slate-100 dark:bg-slate-800"
                                >
                                  {cat.name}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={supplier.reliability_score}
                                className="h-2 w-16"
                                indicatorColor={
                                  supplier.reliability_score >= 95
                                    ? 'bg-green-500'
                                    : supplier.reliability_score >= 90
                                    ? 'bg-blue-500'
                                    : supplier.reliability_score >= 80
                                    ? 'bg-amber-500'
                                    : 'bg-red-500'
                                }
                              />
                              <span className="text-sm">{supplier.reliability_score}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                supplier.status === 'Active'
                                  ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400'
                                  : supplier.status === 'OnHold'
                                  ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
                                  : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-400'
                              }
                            >
                              {supplier.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(supplier.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => navigate(`/suppliers/edit/${supplier.id}`)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" disabled>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" disabled>
                                <ShoppingCart className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </div>
          </DashboardCard>
        </TabsContent>

        <TabsContent value="orders" className="m-0">
          <DashboardCard title="Recent Purchase Orders">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Order ID</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Items</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Delivery</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordersLoading
                    ? Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <Skeleton className="h-6 w-16" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-32" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-20" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-16" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-20" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-24" />
                            </TableCell>
                          </TableRow>
                        ))
                    : orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.order_id}</TableCell>
                          <TableCell>{order.supplier_name}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell className="text-right">{parseItemsCount(order.items_count)}</TableCell>
                          <TableCell className="text-right">{formatTotal(order.total_cost)}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                order.status === 'RECEIVED'
                                  ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400'
                                  : order.status === 'SUBMITTED'
                                  ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-400'
                                  : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
                              }
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {order.status === 'RECEIVED' && order.actual_delivery ? (
                                <>
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-sm">{order.actual_delivery}</span>
                                </>
                              ) : (
                                <>
                                  <Clock className="h-4 w-4 text-amber-500" />
                                  <span className="text-sm">Est: {order.estimated_delivery}</span>
                                </>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" disabled>
                                <Eye className="h-4 w-4" />
                              </Button>
                              {order.status !== 'RECEIVED' && (
                                <Button variant="ghost" size="icon" disabled>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                              <Button variant="ghost" size="icon" disabled>
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </div>
          </DashboardCard>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard title="Top Suppliers" className="lg:col-span-2">
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {suppliersLoading
              ? Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="py-4">
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))
              : filteredSuppliers
                  .filter((s) => s.status === 'Active')
                  .sort((a, b) => b.reliability_score - a.reliability_score)
                  .slice(0, 4)
                  .map((supplier) => (
                    <div key={supplier.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 bg-blue-100 text-blue-700">
                            <AvatarFallback>
                              {supplier.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{supplier.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {supplier.categories.map((c) => c.name).join(', ')}
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400"
                        >
                          {supplier.reliability_score}% reliable
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{supplier.contact_phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{supplier.contact_email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm truncate">{supplier.address}</span>
                        </div>
                      </div>
                    </div>
                  ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Order Statistics">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Order Fulfillment Rate</span>
                <span className="text-sm font-medium">
                  {orders.length
                    ? Math.round(
                        (orders.filter((o) => o.status === 'RECEIVED').length /
                          orders.length) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
              <Progress
                value={
                  orders.length
                    ? Math.round(
                        (orders.filter((o) => o.status === 'RECEIVED').length /
                          orders.length) *
                          100
                      )
                    : 0
                }
                className={`h-2 ${
                  orders.length &&
                  Math.round(
                    (orders.filter((o) => o.status === 'RECEIVED').length / orders.length) * 100
                  ) === 100
                    ? 'bg-blue-500'
                    : 'bg-gray-200'
                }`}
              />
            </div>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                  <div className="text-sm text-muted-foreground">Total Orders</div>
                  <div className="text-2xl font-bold">{orders.length}</div>
                  <div className="text-xs text-muted-foreground">All time</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                  <div className="text-sm text-muted-foreground">
                    Avg. Order Value
                  </div>
                  <div className="text-2xl font-bold">
                  {formatTotal(
                  orders.length
                  ? orders.reduce((sum, o) => sum + (o.total_cost || 0), 0) / orders.length
                  : 0
                )}
                  </div>
                  <div className="text-xs text-muted-foreground">All time</div>
                </div>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>
    </PageContainer>
  );
};

export default Suppliers;