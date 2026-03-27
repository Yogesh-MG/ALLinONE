
import React, { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer-demo';
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
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Truck,
  Search,
  Filter,
  Plus,
  Download,
  ArrowUpDown,
  Eye,
  Edit,
  Trash2,
  SlidersHorizontal,
  ShoppingCart,
  Package,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Sample suppliers data
const supplierItems = [
  {
    id: 'SUP001',
    name: 'MediSource Inc.',
    contactName: 'Robert Johnson',
    contactEmail: 'robert@medisource.com',
    contactPhone: '+1 (555) 123-4567',
    address: '123 Medical Lane, New York, NY 10001',
    categories: ['Pharmaceuticals', 'Disposables'],
    reliabilityScore: 98,
    status: 'Active',
    lastOrder: '2023-06-01',
  },
  {
    id: 'SUP002',
    name: 'Global Healthcare Supplies',
    contactName: 'Emily Chen',
    contactEmail: 'emily@globalhealthcare.com',
    contactPhone: '+1 (555) 987-6543',
    address: '456 Health Avenue, Boston, MA 02108',
    categories: ['Medical Devices', 'Equipment'],
    reliabilityScore: 92,
    status: 'Active',
    lastOrder: '2023-05-28',
  },
  {
    id: 'SUP003',
    name: 'PrecisionMed Labs',
    contactName: 'David Wilson',
    contactEmail: 'david@precisionmedlabs.com',
    contactPhone: '+1 (555) 456-7890',
    address: '789 Laboratory Road, San Francisco, CA 94107',
    categories: ['Laboratory', 'Reagents'],
    reliabilityScore: 95,
    status: 'Active',
    lastOrder: '2023-06-05',
  },
  {
    id: 'SUP004',
    name: 'SurgicalTech Solutions',
    contactName: 'Sarah Miller',
    contactEmail: 'sarah@surgicaltech.com',
    contactPhone: '+1 (555) 234-5678',
    address: '101 Surgical Drive, Chicago, IL 60601',
    categories: ['Surgical Equipment', 'Disposables'],
    reliabilityScore: 90,
    status: 'Active',
    lastOrder: '2023-05-15',
  },
  {
    id: 'SUP005',
    name: 'PharmaCare Distributors',
    contactName: 'James Thompson',
    contactEmail: 'james@pharmacare.com',
    contactPhone: '+1 (555) 345-6789',
    address: '202 Pharma Plaza, Seattle, WA 98101',
    categories: ['Pharmaceuticals', 'OTC Medications'],
    reliabilityScore: 88,
    status: 'On Hold',
    lastOrder: '2023-04-30',
  },
  {
    id: 'SUP006',
    name: 'MedTech Innovations',
    contactName: 'Michael Brown',
    contactEmail: 'michael@medtechinnovations.com',
    contactPhone: '+1 (555) 567-8901',
    address: '303 Innovation Way, Austin, TX 78701',
    categories: ['Medical Devices', 'Technology'],
    reliabilityScore: 94,
    status: 'Active',
    lastOrder: '2023-06-03',
  },
  {
    id: 'SUP007',
    name: 'Healthcare Essentials',
    contactName: 'Jennifer Lopez',
    contactEmail: 'jennifer@healthessentials.com',
    contactPhone: '+1 (555) 678-9012',
    address: '404 Essential Road, Miami, FL 33101',
    categories: ['Disposables', 'Infection Control'],
    reliabilityScore: 91,
    status: 'Active',
    lastOrder: '2023-05-22',
  },
  {
    id: 'SUP008',
    name: 'Advanced Medical Supply Co.',
    contactName: 'Thomas Wright',
    contactEmail: 'thomas@advancedmedicalsupply.com',
    contactPhone: '+1 (555) 789-0123',
    address: '505 Advanced Blvd, Denver, CO 80201',
    categories: ['Equipment', 'Specialty Items'],
    reliabilityScore: 86,
    status: 'Inactive',
    lastOrder: '2023-03-15',
  },
];

// Sample orders data
const recentOrders = [
  {
    id: 'ORD1234',
    supplierId: 'SUP001',
    supplierName: 'MediSource Inc.',
    date: '2023-06-01',
    items: 12,
    total: 4350.75,
    status: 'Delivered',
    estimatedDelivery: '2023-06-08',
    actualDelivery: '2023-06-07',
  },
  {
    id: 'ORD1235',
    supplierId: 'SUP003',
    supplierName: 'PrecisionMed Labs',
    date: '2023-06-05',
    items: 8,
    total: 2785.50,
    status: 'In Transit',
    estimatedDelivery: '2023-06-12',
    actualDelivery: null,
  },
  {
    id: 'ORD1236',
    supplierId: 'SUP006',
    supplierName: 'MedTech Innovations',
    date: '2023-06-03',
    items: 5,
    total: 8900.25,
    status: 'Processing',
    estimatedDelivery: '2023-06-15',
    actualDelivery: null,
  },
  {
    id: 'ORD1237',
    supplierId: 'SUP002',
    supplierName: 'Global Healthcare Supplies',
    date: '2023-05-28',
    items: 15,
    total: 3670.00,
    status: 'Delivered',
    estimatedDelivery: '2023-06-04',
    actualDelivery: '2023-06-03',
  },
  {
    id: 'ORD1238',
    supplierId: 'SUP007',
    supplierName: 'Healthcare Essentials',
    date: '2023-05-22',
    items: 20,
    total: 1850.75,
    status: 'Delivered',
    estimatedDelivery: '2023-05-29',
    actualDelivery: '2023-05-30',
  },
];

const Suppliersdemo = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSuppliers, setFilteredSuppliers] = useState(supplierItems);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false); // State for modal

  // Handle search (unchanged)
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredSuppliers(supplierItems);
    } else {
      const filtered = supplierItems.filter(
        supplier => 
          supplier.name.toLowerCase().includes(query) || 
          supplier.id.toLowerCase().includes(query) ||
          supplier.contactName.toLowerCase().includes(query) ||
          supplier.categories.some(cat => cat.toLowerCase().includes(query))
      );
      setFilteredSuppliers(filtered);
    }
  };

  // Handle new order submission
  const handleNewOrderSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const orderName = formData.get('orderName') as string;
    const supplierId = formData.get('supplier') as string;
    const items = formData.get('items') as string;
    const total = formData.get('total') as string;

    // Log the form data (replace with API call or state update)
    console.log('New Order Submitted:', {
      orderName,
      supplierId,
      items: Number(items),
      total: Number(total),
    });

    setIsNewOrderOpen(false); // Close modal after submission
  };
   // Handle export functionality
   const handleExport = () => {
    // Convert supplierItems to CSV format
    const headers = [
      'ID',
      'Name',
      'Contact Name',
      'Contact Email',
      'Contact Phone',
      'Address',
      'Categories',
      'Reliability Score',
      'Status',
      'Last Order',
    ];

    const rows = supplierItems.map(supplier => [
      supplier.id,
      supplier.name,
      supplier.contactName,
      supplier.contactEmail,
      supplier.contactPhone,
      `"${supplier.address}"`, // Wrap address in quotes to handle commas
      supplier.categories.join(';'), // Join categories with semicolon
      supplier.reliabilityScore,
      supplier.status,
      supplier.lastOrder,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `suppliers_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up
  };


  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Supplier Management</h1>
          <p className="text-muted-foreground">Manage suppliers and track orders</p>
        </div>
        <div className="flex gap-3">
        <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ShoppingCart className="h-4 w-4 mr-2" />
                New Order
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Order</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleNewOrderSubmit} className="space-y-4">
                <div>
                  <label htmlFor="orderName" className="text-sm font-medium">Order Name</label>
                  <Input 
                    id="orderName" 
                    name="orderName" 
                    type="text" 
                    placeholder="Enter order name" 
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="supplier" className="text-sm font-medium">Supplier</label>
                  <select 
                    id="supplier" 
                    name="supplier" 
                    className="w-full p-2 border rounded" 
                    required
                  >
                    <option value="">Select a supplier</option>
                    {supplierItems.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="items" className="text-sm font-medium">Number of Items</label>
                  <Input 
                    id="items" 
                    name="items" 
                    type="number" 
                    placeholder="Enter number of items" 
                    min="1" 
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="total" className="text-sm font-medium">Total Amount</label>
                  <Input 
                    id="total" 
                    name="total" 
                    type="number" 
                    placeholder="Enter total amount" 
                    step="0.01" 
                    min="0" 
                    required 
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsNewOrderOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit Order</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <a href='suppliers/add'>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DashboardCard
          title="Total Suppliers"
          className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-100 dark:border-blue-800/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">42</div>
              <p className="text-sm text-muted-foreground">Active suppliers</p>
            </div>
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Truck size={24} />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Pending Orders"
          className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-100 dark:border-amber-800/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">8</div>
              <p className="text-sm text-muted-foreground">Orders in transit</p>
            </div>
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <Package size={24} />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Recent Orders"
          className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-800/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">$32,450</div>
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
          <DashboardCard
            title="Supplier Directory"
          >
            <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2">
                  {filteredSuppliers.length} suppliers
                </Badge>
                
                <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400 mr-2">
                  {filteredSuppliers.filter(s => s.status === 'Active').length} active
                </Badge>
                
                <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400 mr-2">
                  {filteredSuppliers.filter(s => s.status === 'On Hold').length} on hold
                </Badge>
                
                <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-400">
                  {filteredSuppliers.filter(s => s.status === 'Inactive').length} inactive
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search suppliers..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
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
                    <TableHead>
                      <div className="flex items-center">
                        Reliability
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 bg-blue-100 text-blue-700">
                            <AvatarImage src="" alt={supplier.name} />
                            <AvatarFallback>{supplier.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{supplier.name}</div>
                            <div className="text-sm text-muted-foreground">{supplier.contactName}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {supplier.categories.map((category, index) => (
                            <Badge key={index} variant="outline" className="bg-slate-100 dark:bg-slate-800">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={supplier.reliabilityScore} 
                            className="h-2 w-16" 
                            indicatorColor={
                              supplier.reliabilityScore >= 95 ? "bg-green-500" :
                              supplier.reliabilityScore >= 90 ? "bg-blue-500" :
                              supplier.reliabilityScore >= 80 ? "bg-amber-500" :
                              "bg-red-500"
                            }
                          />
                          <span className="text-sm">{supplier.reliabilityScore}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            supplier.status === 'Active' 
                              ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400' 
                              : supplier.status === 'On Hold'
                              ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
                              : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-400'
                          }
                        >
                          {supplier.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{supplier.lastOrder}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
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
          <DashboardCard
            title="Recent Purchase Orders"
          >
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
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.supplierName}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell className="text-right">{order.items}</TableCell>
                      <TableCell className="text-right">${order.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            order.status === 'Delivered' 
                              ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400' 
                              : order.status === 'In Transit'
                              ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-400'
                              : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {order.status === 'Delivered' ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{order.actualDelivery}</span>
                            </>
                          ) : (
                            <>
                              <Clock className="h-4 w-4 text-amber-500" />
                              <span className="text-sm">Est: {order.estimatedDelivery}</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {order.status !== 'Delivered' && (
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon">
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
        <DashboardCard
          title="Top Suppliers"
          className="lg:col-span-2"
        >
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {supplierItems
              .filter(s => s.status === 'Active')
              .sort((a, b) => b.reliabilityScore - a.reliabilityScore)
              .slice(0, 4)
              .map((supplier) => (
                <div key={supplier.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 bg-blue-100 text-blue-700">
                        <AvatarImage src="" alt={supplier.name} />
                        <AvatarFallback>{supplier.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{supplier.name}</div>
                        <div className="text-sm text-muted-foreground">{supplier.categories.join(', ')}</div>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400"
                    >
                      {supplier.reliabilityScore}% reliable
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{supplier.contactPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{supplier.contactEmail}</span>
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

        <DashboardCard
          title="Order Statistics"
        >
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Order Fulfillment Rate</span>
                <span className="text-sm font-medium">96%</span>
              </div>
              <Progress value={96} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">On-Time Delivery</span>
                <span className="text-sm font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2 bg-blue-100 dark:bg-blue-900/20" indicatorColor="bg-blue-500" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Quality Compliance</span>
                <span className="text-sm font-medium">98%</span>
              </div>
              <Progress value={98} className="h-2 bg-green-100 dark:bg-green-900/20" indicatorColor="bg-green-500" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Average Lead Time</span>
                <span className="text-sm font-medium">4.2 days</span>
              </div>
              <Progress value={70} className="h-2 bg-amber-100 dark:bg-amber-900/20" indicatorColor="bg-amber-500" />
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                  <div className="text-sm text-muted-foreground">Total Orders</div>
                  <div className="text-2xl font-bold">1,246</div>
                  <div className="text-xs text-muted-foreground">Year to date</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                  <div className="text-sm text-muted-foreground">Avg. Order Value</div>
                  <div className="text-2xl font-bold">$3,872</div>
                  <div className="text-xs text-muted-foreground">Year to date</div>
                </div>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>
    </PageContainer>
  );
};

export default Suppliersdemo;