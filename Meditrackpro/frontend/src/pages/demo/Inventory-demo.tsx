
import React, { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer-demo';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Package,
  Search,
  Filter,
  Plus,
  BarChart,
  Download,
  ArrowUpDown,
  Eye,
  Edit,
  Trash2,
  SlidersHorizontal,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

// Sample inventory data
const inventoryItems = [
  {
    id: 'INV001',
    name: 'Surgical Masks',
    category: 'Disposables',
    quantity: 2350,
    unit: 'pieces',
    status: 'In Stock',
    stockLevel: 'High',
    lastUpdated: '2023-06-01',
    expiryDate: '2024-06-01',
    location: 'Main Storage A3',
  },
  {
    id: 'INV002',
    name: 'Nitrile Gloves (S)',
    category: 'Disposables',
    quantity: 1200,
    unit: 'pairs',
    status: 'In Stock',
    stockLevel: 'Medium',
    lastUpdated: '2023-06-03',
    expiryDate: '2024-03-15',
    location: 'Main Storage A4',
  },
  {
    id: 'INV003',
    name: 'Ibuprofen 400mg',
    category: 'Pharmaceuticals',
    quantity: 520,
    unit: 'tablets',
    status: 'Low Stock',
    stockLevel: 'Low',
    lastUpdated: '2023-06-05',
    expiryDate: '2023-12-20',
    location: 'Pharmacy Storage B2',
  },
  {
    id: 'INV004',
    name: 'Blood Pressure Monitor',
    category: 'Devices',
    quantity: 45,
    unit: 'units',
    status: 'In Stock',
    stockLevel: 'Medium',
    lastUpdated: '2023-05-28',
    expiryDate: 'N/A',
    location: 'Equipment Room C1',
  },
  {
    id: 'INV005',
    name: 'Disposable Syringes',
    category: 'Disposables',
    quantity: 3000,
    unit: 'pieces',
    status: 'In Stock',
    stockLevel: 'High',
    lastUpdated: '2023-06-02',
    expiryDate: '2025-01-10',
    location: 'Main Storage A5',
  },
  {
    id: 'INV006',
    name: 'Gauze Bandages',
    category: 'Wound Care',
    quantity: 850,
    unit: 'packs',
    status: 'In Stock',
    stockLevel: 'Medium',
    lastUpdated: '2023-06-04',
    expiryDate: '2024-08-15',
    location: 'Main Storage A2',
  },
  {
    id: 'INV007',
    name: 'Oxygen Cannula',
    category: 'Respiratory',
    quantity: 120,
    unit: 'pieces',
    status: 'Low Stock',
    stockLevel: 'Low',
    lastUpdated: '2023-06-06',
    expiryDate: '2024-05-20',
    location: 'Equipment Room C3',
  },
  {
    id: 'INV008',
    name: 'Amoxicillin 500mg',
    category: 'Pharmaceuticals',
    quantity: 230,
    unit: 'capsules',
    status: 'Low Stock',
    stockLevel: 'Low',
    lastUpdated: '2023-05-29',
    expiryDate: '2023-11-15',
    location: 'Pharmacy Storage B1',
  },
];

const Inventorydemo = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(inventoryItems);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredItems(inventoryItems);
    } else {
      const filtered = inventoryItems.filter(
        item => 
          item.name.toLowerCase().includes(query) || 
          item.id.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query)
      );
      setFilteredItems(filtered);
    }
  };

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">Manage and track your medical inventory</p>
        </div>
        <div className="flex gap-3">
          <a href="reports"><Button variant="outline">
            <BarChart className="h-4 w-4 mr-2" />
            Reports
          </Button>
          </a>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <a href="inventory/add"><Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button></a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DashboardCard
          title="Total Items"
          className="bg-gradient-to-br from-medical-50 to-blue-50 dark:from-medical-900/20 dark:to-blue-900/20 border-medical-100 dark:border-medical-800/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">5,826</div>
              <p className="text-sm text-muted-foreground">Items in inventory</p>
            </div>
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-medical-100 dark:bg-medical-900/30 text-medical-600 dark:text-medical-400">
              <Package size={24} />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Low Stock Items"
          className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-100 dark:border-amber-800/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">24</div>
              <p className="text-sm text-muted-foreground">Items below threshold</p>
            </div>
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <AlertCircle size={24} />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Last Restocked"
          className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-800/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">Today</div>
              <p className="text-sm text-muted-foreground">06/12/2023 at 09:45 AM</p>
            </div>
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </DashboardCard>
      </div>

      <DashboardCard
        title="Inventory Items"
        className="mb-6"
      >
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
            <TabsList>
              <TabsTrigger value="all">All Items</TabsTrigger>
              <TabsTrigger value="low">Low Stock</TabsTrigger>
              <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search items..."
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

          <TabsContent value="all" className="m-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Status
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right">{item.quantity.toLocaleString()} {item.unit}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            item.stockLevel === 'Low' 
                              ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400' 
                              : item.stockLevel === 'Medium'
                              ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
                              : 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400'
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="low" className="m-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems
                    .filter(item => item.stockLevel === 'Low')
                    .map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-right">{item.quantity.toLocaleString()} {item.unit}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className="border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400"
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="expiring" className="m-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems
                    .filter(item => 
                      item.expiryDate !== 'N/A' && 
                      new Date(item.expiryDate) < new Date(new Date().setMonth(new Date().getMonth() + 3))
                    )
                    .map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-right">{item.quantity.toLocaleString()} {item.unit}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400"
                          >
                            {item.expiryDate}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </DashboardCard>

      <div className="text-center text-sm text-muted-foreground">
        Showing {filteredItems.length} of {inventoryItems.length} items
      </div>
    </PageContainer>
  );
};

export default Inventorydemo;
