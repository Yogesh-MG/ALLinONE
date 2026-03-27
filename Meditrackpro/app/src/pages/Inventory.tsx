import React, { useEffect, useState, Component, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Package, Search, Filter, Plus, BarChart, Download, ArrowUpDown, Eye, Edit, Trash2,
  AlertCircle, CheckCircle2, QrCode, Printer
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { baseUrl } from '../utils/apiconfig';
import { useToast } from '@/components/ui/use-toast';

interface InventoryItem {
  id: string;
  name: string;
  category: { id: string; name: string } | null;
  quantity: number;
  unit: { id: string; name: string } | null;
  stock_level: 'High' | 'Medium' | 'Low';
  expiry_date: string | null;
  expiry_status: 'Critical' | 'Warning' | 'Safe' | 'N/A';
  location: string;
  sku: string;
  qr_code: string | null;
}

interface Category {
  id: string;
  name: string;
}

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: string | null }> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-600 p-4">
          Error: {this.state.error || 'Check console for details.'}
        </div>
      );
    }
    return this.props.children;
  }
}

const Inventory = () => {
  // Hooks at the top
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    stock_level: '',
    expiry_soon: '',
    location: ''
  });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'id', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [qrModalItem, setQrModalItem] = useState<InventoryItem | null>(null);

  const hospitalId = localStorage.getItem('hospitalid') || '201';
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const itemsPerPage = 10;

  // Queries
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ['categories', hospitalId],
    queryFn: async () => {
      console.log('Fetching categories');
      const response = await axios.get(`${baseUrl}/api/${hospitalId}/categories/`, { headers });
      console.log('Categories response:', response.data);
      return response.data as Category[];
    },
    enabled: !!hospitalId && !!token,
  });

  const { data: inventoryData, isLoading, error: inventoryError } = useQuery({
    queryKey: ['inventory', hospitalId, currentPage, searchQuery, filters, sortConfig],
    queryFn: async () => {
      console.log('Fetching inventory');
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
        category__id: filters.category || undefined,
        stock_level: filters.stock_level || undefined,
        expiry_soon: filters.expiry_soon || undefined,
        location: filters.location || undefined,
        ordering: `${sortConfig.direction === 'desc' ? '-' : ''}${sortConfig.key}`
      };
      const response = await axios.get(`${baseUrl}/api/${hospitalId}/inventory/`, { headers, params });
      console.log('Inventory response:', response.data);
      return response.data;
    },
    enabled: !!hospitalId && !!token,
  });



  interface BulkActionData {
    item_ids: string[];
  }

  const bulkActionMutation = useMutation<
    AxiosResponse<void>,
    unknown,
    { action: string; data: BulkActionData }
  >({
    mutationFn: ({ action, data }) => {
      console.log('Bulk action:', action, data);
      return axios.patch(`${baseUrl}/api/${hospitalId}/inventory/bulk/`, data, { headers });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      setSelectedItems([]);
      toast({ title: 'Success', description: 'Bulk action completed' });
    },
    onError: (error) => {
      console.error('Bulk action error:', error);
      toast({ title: 'Error', description: 'Bulk action failed', variant: 'destructive' });
    }
  });

  const exportMutation = useMutation<AxiosResponse<Blob>, unknown, void>({
    mutationFn: () => axios.get(`${baseUrl}/api/${hospitalId}/inventory/export/`, { headers, responseType: 'blob' }),
    onSuccess: (response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `inventory_export_${hospitalId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast({ title: 'Success', description: 'Inventory exported' });
    },
    onError: (error) => {
      console.error('Export error:', error);
      toast({ title: 'Error', description: 'Export failed', variant: 'destructive' });
    }
  });

  // Handle token check with useEffect
  useEffect(() => {
    if (!token) {
      console.log('No token, redirecting to login');
      navigate('/login');
    }
  }, [token, navigate]);

  // Early rendering if no token
  if (!token) {
    return null; // Avoid rendering until redirected
  }

  // Query error handling
  if (categoriesError || inventoryError) {
    console.error('Query error:', categoriesError || inventoryError);
    toast({ title: 'Error', description: 'Failed to load data. Check console.', variant: 'destructive' });
    return (
      <PageContainer>
        <div className="text-red-600 p-4">Failed to load inventory. Check console.</div>
      </PageContainer>
    );
  }

  // Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Search query:', e.target.value);
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (key: string) => {
    console.log('Sorting by:', key);
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    setCurrentPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    console.log('Filter change:', key, value);
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSelectItem = (id: string) => {
    console.log('Select item:', id);
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    console.log('Select all:', checked);
    if (checked) {
      setSelectedItems(inventoryData?.results?.map((item: InventoryItem) => item.id) || []);
    } else {
      setSelectedItems([]);
    }
  };
  
  const handleDelete = async (itemId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`${baseUrl}/api/${hospitalId}/inventory/${itemId}/`, { headers });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({ title: "Success", description: "Item deleted successfully." });
    } catch (error) {
      console.error("Delete error:", error.response?.data);
      toast({ title: "Error", description: "Failed to delete item.", variant: "destructive" });
    }
  };

  const handleBulkAction = (action: string) => {
    if (!selectedItems.length) {
      toast({ title: 'Warning', description: 'No items selected', variant: 'destructive' });
      return;
    }
    bulkActionMutation.mutate({ action, data: { item_ids: selectedItems } });
  };

  const handleDownloadQR = (item: InventoryItem) => {
    if (item.qr_code) {
      const link = document.createElement('a');
      link.href = item.qr_code;
      link.download = `item_${item.id}_qr.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  const handlePrintQR = (item: InventoryItem) => {
    if (item.qr_code) {
      const printWindow = window.open(item.qr_code);
      printWindow?.print();
      printWindow?.close();
    }
  };

  const totalItems = inventoryData?.count || 0;
  const items = inventoryData?.results || [];
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  console.log('Render state:', { categoriesLoading, isLoading, totalItems, itemsLength: items.length });

  return (
    <ErrorBoundary>
      <PageContainer>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight dark:text-medical-100">Inventory Management</h1>
            <p className="text-muted-foreground">Track and manage medical inventory</p>
          </div>
          <div className="flex gap-3">
            <TooltipProvider>              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" onClick={() => exportMutation.mutate()}>
                    <Download className="h-4 w-4 mr-2" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export inventory as CSV</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button onClick={() => navigate('/inventory/add')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <DashboardCard title="totalItems" className="bg-gradient-to-br from-medical-50 to-blue-50 dark:from-medical-900/20 dark:to-blue-900/20 border-medical-100 dark:border-medical-800/30">
            <div className="flex items-center justify-between">
              <div>
                {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-3xl font-bold">{totalItems.toLocaleString()}</div>}
                <p className="text-sm text-muted-foreground">Total Items</p>
              </div>
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-medical-100 dark:bg-medical-900/30 text-medical-600 dark:text-medical-400">
                <Package size={24} />
              </div>
            </div>
          </DashboardCard>
          <DashboardCard title="Lowstock" className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-100 dark:border-amber-800/30">
            <div className="flex items-center justify-between">
              <div>
                {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-3xl font-bold">{items.filter((item: InventoryItem) => item.stock_level === 'Low').length}</div>}
                <p className="text-sm text-muted-foreground">Low Stock</p>
              </div>
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                <AlertCircle size={24} />
              </div>
            </div>
          </DashboardCard>
          <DashboardCard title="today" className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-800/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">Today</div>
                <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</p>
              </div>
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                <CheckCircle2 size={24} />
              </div>
            </div>
          </DashboardCard>
        </div>

        <DashboardCard title="Inventory Items" className="mb-6">
          {selectedItems.length > 0 && (
            <div className="flex gap-2 mb-4">
              <Button variant="destructive" onClick={() => handleBulkAction('delete')}>
                Delete Selected ({selectedItems.length})
              </Button>
              <Button variant="outline" onClick={() => handleBulkAction('generate_qr')}>
                Generate QR Codes
              </Button>
            </div>
          )}
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
              <TabsList>
                <TabsTrigger value="all">All Items</TabsTrigger>
                <TabsTrigger value="low">Low Stock</TabsTrigger>
                <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
              </TabsList>
              <div className="flex gap-2 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by name, SKU, or location..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                   {/* <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>*/}
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Filter Inventory</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Category</label>
                        <Select onValueChange={value => handleFilterChange('category', value)} value={filters.category}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All</SelectItem>
                            {categoriesLoading ? (
                              <SelectItem value="" disabled>Loading categories...</SelectItem>
                            ) : Array.isArray(categories) && categories.length > 0 ? (
                              categories.map((cat: Category) => (
                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                              ))
                            ) : (
                              <SelectItem value="" disabled>No categories available</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Stock Level</label>
                        <Select onValueChange={value => handleFilterChange('stock_level', value)} value={filters.stock_level}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select stock level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Expiry Soon</label>
                        <Select onValueChange={value => handleFilterChange('expiry_soon', value)} value={filters.expiry_soon}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select expiry period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All</SelectItem>
                            <SelectItem value="30">Within 30 days</SelectItem>
                            <SelectItem value="90">Within 90 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Location</label>
                        <Input
                          placeholder="Enter location"
                          value={filters.location}
                          onChange={e => handleFilterChange('location', e.target.value)}
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <TabsContent value="all" className="m-0">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={selectedItems.length === items.length && items.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="w-[100px] cursor-pointer" onClick={() => handleSort('sku')}>
                        SKU {sortConfig.key === 'sku' && <ArrowUpDown className="ml-1 h-4 w-4 inline" />}
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                        Name {sortConfig.key === 'name' && <ArrowUpDown className="ml-1 h-4 w-4 inline" />}
                      </TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right cursor-pointer" onClick={() => handleSort('quantity')}>
                        Quantity {sortConfig.key === 'quantity' && <ArrowUpDown className="ml-1 h-4 w-4 inline" />}
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('expiry_date')}>
                        Expiry {sortConfig.key === 'expiry_date' && <ArrowUpDown className="ml-1 h-4 w-4 inline" />}
                      </TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        </TableRow>
                      ))
                    ) : items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                          No items found
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item: InventoryItem) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedItems.includes(item.id)}
                              onCheckedChange={() => handleSelectItem(item.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{item.sku}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.category?.name || 'N/A'}</TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant="outline"
                              className={
                                item.stock_level === 'Low' ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400' :
                                item.stock_level === 'Medium' ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400' :
                                'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400'
                              }
                            >
                              {item.quantity.toLocaleString()} {item.unit?.name || ''}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                item.expiry_status === 'Critical' ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400' :
                                item.expiry_status === 'Warning' ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400' :
                                'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400'
                              }
                            >
                              {item.expiry_date || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.location || 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => navigate(`/inventory/${item.id}/details`)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>View details & purchase history</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => navigate(`/inventory/edit/${item.id}`)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit item</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => setQrModalItem(item)}>
                                    <QrCode className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>View QR code</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Delete item</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="low" className="m-0">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={selectedItems.length === items.filter((item: InventoryItem) => item.stock_level === 'Low').length && items.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="w-[100px]">SKU</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        </TableRow>
                      ))
                    ) : items.filter((item: InventoryItem) => item.stock_level === 'Low').length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                          No low stock items found
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.filter((item: InventoryItem) => item.stock_level === 'Low').map((item: InventoryItem) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedItems.includes(item.id)}
                              onCheckedChange={() => handleSelectItem(item.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{item.sku}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.category?.name || 'N/A'}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
                              {item.quantity.toLocaleString()} {item.unit?.name || ''}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                item.expiry_status === 'Critical' ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400' :
                                item.expiry_status === 'Warning' ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400' :
                                'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400'
                              }
                            >
                              {item.expiry_date || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.location || 'N/A'}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => navigate(`/inventory/${item.id}`)}>
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>View details</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => navigate(`/inventory/edit/${item.id}`)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Edit item</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => setQrModalItem(item)}>
                                      <QrCode className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>View QR code</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDelete(item.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Delete item</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="expiring" className="m-0">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={selectedItems.length === items.filter((item: InventoryItem) => item.expiry_status === 'Critical' || item.expiry_status === 'Warning').length && items.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="w-[100px]">SKU</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        </TableRow>
                      ))
                    ) : items.filter((item: InventoryItem) => item.expiry_status === 'Critical' || item.expiry_status === 'Warning').length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                          No expiring items found
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.filter((item: InventoryItem) => item.expiry_status === 'Critical' || item.expiry_status === 'Warning').map((item: InventoryItem) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedItems.includes(item.id)}
                              onCheckedChange={() => handleSelectItem(item.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{item.sku}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.category?.name || 'N/A'}</TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant="outline"
                              className={
                                item.stock_level === 'Low' ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400' :
                                item.stock_level === 'Medium' ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400' :
                                'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400'
                              }
                            >
                              {item.quantity.toLocaleString()} {item.unit?.name || ''}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                item.expiry_status === 'Critical' ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400' :
                                item.expiry_status === 'Warning' ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400' :
                                'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400'
                              }
                            >
                              {item.expiry_date || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.location || 'N/A'}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => navigate(`/inventory/${item.id}`)}>
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>View details</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => navigate(`/inventory/edit/${item.id}`)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Edit item</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => setQrModalItem(item)}>
                                      <QrCode className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>View QR code</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDelete(item.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Delete item</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>

          <Dialog open={!!qrModalItem} onOpenChange={() => setQrModalItem(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>QR Code for {qrModalItem?.name}</DialogTitle>
              </DialogHeader>
              {qrModalItem?.qr_code ? (
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={qrModalItem.qr_code}
                    alt={`QR Code for ${qrModalItem.name}`}
                    className="w-48 h-48 object-contain border rounded-md"
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => handleDownloadQR(qrModalItem)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download QR
                    </Button>
                    <Button onClick={() => handlePrintQR(qrModalItem)}>
                      <Printer className="h-4 w-4 mr-2" />
                      Print QR
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No QR code available. Generate one using bulk actions.</p>
              )}
            </DialogContent>
          </Dialog>
        </DashboardCard>
      </PageContainer>
    </ErrorBoundary>
  );
};

export default Inventory;