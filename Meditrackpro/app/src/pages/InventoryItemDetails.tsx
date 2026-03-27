import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer'; // Added import
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios, {AxiosError} from 'axios';
import { baseUrl } from '@/utils/apiconfig';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PoErrorResponse {
  details?: string;
}

interface InventoryItem {
  id: string;
  name: string;
  category: { id: string; name: string } | null;
  quantity: number;
  unit: { id: string; name: string } | null;
  supplier: { id: string; name: string } | null;
  sku: string;
}

interface Supplier {
  id: string;
  name: string;
}

interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier: { id: string; name: string } | null;
  status: 'DRAFT' | 'SUBMITTED' | 'RECEIVED' | 'CANCELLED';
  order_date: string;
  expected_delivery?: string;
  total_cost: number;
  items: { id: string; inventory_item: string; quantity: number; unit_price: number; received_quantity?: number }[];
}

type Status = 'DRAFT' | 'SUBMITTED' | 'RECEIVED' | 'CANCELLED';

const poSchema = z.object({
  supplier_id: z.string().optional(),
  status: z.enum(['DRAFT', 'SUBMITTED', 'RECEIVED', 'CANCELLED']).optional(),
  expected_delivery: z.string().optional(),
  items: z
    .array(
      z.object({
        inventory_item: z
          .string()
          .min(1, 'Item is required')
          .or(z.number().transform((val) => String(val))),
        quantity: z.number().min(1, 'Quantity must be at least 1').optional(),
        unit_price: z.number().min(0, 'Unit price cannot be negative').optional(),
        received_quantity: z.number().min(0, 'Received quantity cannot be negative').optional(),
      })
    )
    .min(1, 'At least one item is required'),
});

type POFormData = z.infer<typeof poSchema>;

const InventoryItemDetails = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { inventoryItemId } = useParams<{ inventoryItemId: string }>();
  const queryClient = useQueryClient();
  const hospitalId = localStorage.getItem('hospital_id') || '201';
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const [editPO, setEditPO] = useState<PurchaseOrder | null>(null);

  // Fetch inventory item
  const { data: item, isLoading: itemLoading } = useQuery<InventoryItem>({
    queryKey: ['inventoryItem', hospitalId, inventoryItemId],
    queryFn: () => axios.get(`${baseUrl}/api/${hospitalId}/inventory/${inventoryItemId}/`, { headers }).then((res) => res.data),
    enabled: !!hospitalId && !!token && !!inventoryItemId,
  });

  // Fetch purchase history
  const { data: purchaseHistory, isLoading: historyLoading } = useQuery<PurchaseOrder[]>({
    queryKey: ['purchaseHistory', hospitalId, inventoryItemId],
    queryFn: () => axios.get(`${baseUrl}/api/${hospitalId}/inventory/${inventoryItemId}/purchase-history/`, { headers }).then((res) => res.data),
    enabled: !!hospitalId && !!token && !!inventoryItemId,
  });

  // Fetch suppliers
  const { data: suppliers, isLoading: suppliersLoading } = useQuery<Supplier[]>({
    queryKey: ['suppliers', hospitalId],
    queryFn: () => axios.get(`${baseUrl}/api/${hospitalId}/suppliers/`, { headers }).then((res) => res.data),
    enabled: !!hospitalId && !!token,
  });

  // Fetch status choices
  const { data: statusChoices } = useQuery<Record<string, string>>({
    queryKey: ['statusChoices', hospitalId],
    queryFn: () => axios.get(`${baseUrl}/api/${hospitalId}/purchase-orders/status_choices/`, { headers }).then((res) => res.data),
    enabled: !!hospitalId && !!token,
  });

  // Create PO Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    setValue,
    watch,
  } = useForm<POFormData>({
    resolver: zodResolver(poSchema),
    defaultValues: {
      status: 'DRAFT',
      items: [{ inventory_item: inventoryItemId || '', quantity: 1, unit_price: 0, received_quantity: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  // Edit PO Form
  const {
    register: editRegister,
    handleSubmit: editHandleSubmit,
    formState: { errors: editErrors, isSubmitting: isEditSubmitting },
    control: editControl,
    setValue: editSetValue,
    watch: editWatch,
    reset: editReset,
  } = useForm<POFormData>({
    resolver: zodResolver(poSchema),
    defaultValues: {
      supplier_id: '',
      status: 'DRAFT',
      expected_delivery: undefined,
      items: [{ inventory_item: inventoryItemId || '', quantity: 1, unit_price: 0, received_quantity: 0 }],
    },
  });

  const { fields: editFields, append: editAppend, remove: editRemove } = useFieldArray({
    control: editControl,
    name: 'items',
  });

  // Pre-fill create form supplier
  useEffect(() => {
    if (item?.supplier?.id) {
      setValue('supplier_id', item.supplier.id);
    }
    if (inventoryItemId) {
      setValue('items.0.inventory_item', inventoryItemId);
    }
  }, [item, inventoryItemId, setValue]);

  // Pre-fill edit form when editPO changes
  useEffect(() => {
    if (editPO) {
      console.log('Pre-filling edit form with:', editPO);
      editReset({
        supplier_id: editPO.supplier?.id || '',
        status: editPO.status,
        expected_delivery: editPO.expected_delivery || undefined,
        items: editPO.items.map((item) => ({
          inventory_item: String(item.inventory_item),
          quantity: item.quantity,
          unit_price: item.unit_price,
          received_quantity: item.received_quantity ?? 0,
        })),
      });
    }
  }, [editPO, editReset]);

  // Create PO mutation
  const createPOMutation = useMutation({
    mutationFn: (data: POFormData) => {
      console.log('Creating PO with:', data);
      return axios.post(`${baseUrl}/api/${hospitalId}/purchase-orders/`, { ...data, hospital_id: hospitalId }, { headers });
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Purchase order created' });
      navigate('/inventory');
    },
    onError: (error: AxiosError<PoErrorResponse>) => {
      toast({
        title: 'Error',
        description: error.response?.data?.details || 'Failed to create purchase order',
        variant: 'destructive',
      });
    },
  });

  // Edit PO mutation
  const editPOMutation = useMutation({
    mutationFn: (data: POFormData) => {
      const payload = {
        ...data,
        items: data.items.map((item) => ({
          ...item,
          inventory_item: String(item.inventory_item),
        })),
      };
      console.log('Sending PATCH with data:', { id: editPO?.id, ...payload });
      return axios.patch(`${baseUrl}/api/${hospitalId}/purchase-orders/${editPO?.id}/`, payload, { headers });
    },
    onSuccess: () => {
      console.log('PATCH successful');
      toast({ title: 'Success', description: 'Purchase order updated' });
      queryClient.invalidateQueries({ queryKey: ['purchaseHistory', hospitalId, inventoryItemId] });
      setEditPO(null);
      editReset();
    },
    onError: (error: AxiosError<PoErrorResponse>) => {
      console.error('PATCH error:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: error.response?.data?.details || JSON.stringify(error.response?.data) || 'Failed to update purchase order',
        variant: 'destructive',
      });
    },
  });

  // Authentication check
  useEffect(() => {
    if (!token) {
      toast({ title: 'Unauthorized', description: 'Please log in to continue', variant: 'destructive' });
      navigate('/login');
    }
  }, [token, navigate, toast]);

  if (!token || !inventoryItemId) return null;

  const onSubmit = (data: POFormData) => {
    console.log('Creating PO with:', data);
    createPOMutation.mutate(data);
  };

  const onEditSubmit = (data: POFormData) => {
    console.log('Submitting edit form with:', data);
    if (!editPO?.id) {
      console.error('No PO ID for edit');
      toast({ title: 'Error', description: 'No purchase order selected', variant: 'destructive' });
      return;
    }
    editPOMutation.mutate(data);
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-medical-800 dark:text-medical-100">
              Inventory Item: {item?.name || 'Loading...'}
            </h1>
            <p className="text-muted-foreground">View purchase history and create new purchase orders</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/inventory')} disabled={isSubmitting || isEditSubmitting}>
            Back to Inventory
          </Button>
        </div>

        <Card className="border-medical-100 dark:border-medical-800">
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
            <CardDescription>Summary of the inventory item</CardDescription>
          </CardHeader>
          <CardContent>
            {itemLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-6 w-1/4" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Name</Label>
                  <p>{item?.name}</p>
                </div>
                <div>
                  <Label className="font-medium">SKU</Label>
                  <p>{item?.sku}</p>
                </div>
                <div>
                  <Label className="font-medium">Category</Label>
                  <p>{item?.category?.name || 'N/A'}</p>
                </div>
                <div>
                  <Label className="font-medium">Supplier</Label>
                  <p>{item?.supplier?.name || 'N/A'}</p>
                </div>
                <div>
                  <Label className="font-medium">Quantity</Label>
                  <p>{item?.quantity} {item?.unit?.name || ''}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-medical-100 dark:border-medical-800">
          <CardHeader>
            <CardTitle>Purchase History</CardTitle>
            <CardDescription>Past purchase orders for this item</CardDescription>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : !purchaseHistory?.length ? (
              <p className="text-muted-foreground">No purchase orders found for this item.</p>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PO Number</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total Cost</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseHistory.map((po) => {
                      const item = po.items.find((i) => i.inventory_item === inventoryItemId);
                      return (
                        <TableRow key={po.id}>
                          <TableCell>{po.po_number}</TableCell>
                          <TableCell>{po.supplier?.name || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                po.status === 'RECEIVED'
                                  ? 'border-green-200 bg-green-50 text-green-700'
                                  : po.status === 'SUBMITTED'
                                  ? 'border-blue-200 bg-blue-50 text-blue-700'
                                  : po.status === 'DRAFT'
                                  ? 'border-gray-200 bg-gray-50 text-gray-700'
                                  : 'border-red-200 bg-red-50 text-red-700'
                              }
                            >
                              {po.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(po.order_date).toLocaleDateString()}</TableCell>
                          <TableCell>{item?.quantity || 0}</TableCell>
                          <TableCell>${po.total_cost}</TableCell>
                          <TableCell className="text-right">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setEditPO(po)}
                                    disabled={po.status === 'RECEIVED'}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit purchase order</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit PO Modal */}
        <Dialog open={!!editPO} onOpenChange={() => setEditPO(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Purchase Order: {editPO?.po_number}</DialogTitle>
              <DialogDescription>Update the details of this purchase order.</DialogDescription>
            </DialogHeader>
            <form onSubmit={editHandleSubmit(onEditSubmit)} className="space-y-6">
              {Object.keys(editErrors).length > 0 && (
                <div className="text-red-600 text-sm">
                  <p>Please fix the following errors:</p>
                  <ul className="list-disc pl-4">
                    {Object.entries(editErrors).map(([field, error]) => (
                      <li key={field}>{field}: {error?.message || JSON.stringify(error)}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit_supplier_id">Supplier</Label>
                  {suppliersLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Select
                      onValueChange={(value: Status) => {
                      console.log('Setting status:', value);
                      editSetValue('status', value);
                      }}
                      value={editWatch('supplier_id') || ''}
                      disabled={isEditSubmitting}
                    >
                      <SelectTrigger id="edit_supplier_id">
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers?.length ? (
                          suppliers.map((sup: Supplier) => (
                            <SelectItem key={sup.id} value={sup.id}>
                              {sup.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-suppliers" disabled>
                            No suppliers available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                  {editErrors.supplier_id && <p className="text-red-600 text-sm">{editErrors.supplier_id.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_status">Status</Label>
                  <Select
                      onValueChange={(value: Status) => {
                      console.log('Setting status:', value);
                      editSetValue('status', value);
                    }}
                    value={editWatch('status') || ''}
                    disabled={isEditSubmitting}
                  >
                    <SelectTrigger id="edit_status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusChoices ? (
                        Object.entries(statusChoices).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {editErrors.status && <p className="text-red-600 text-sm">{editErrors.status.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_expected_delivery">Expected Delivery</Label>
                  <Input
                    id="edit_expected_delivery"
                    type="date"
                    {...editRegister('expected_delivery')}
                    disabled={isEditSubmitting}
                    onChange={(e) => {
                      console.log('Setting expected_delivery:', e.target.value);
                      editSetValue('expected_delivery', e.target.value);
                    }}
                  />
                  {editErrors.expected_delivery && (
                    <p className="text-red-600 text-sm">{editErrors.expected_delivery.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Items</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      console.log('Appending new item');
                      editAppend({ inventory_item: inventoryItemId || '', quantity: 1, unit_price: 0, received_quantity: 0 });
                    }}
                    disabled={isEditSubmitting}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                {editErrors.items && <p className="text-red-600 text-sm">{editErrors.items.message}</p>}
                {editFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="space-y-2">
                      <Label htmlFor={`edit_items.${index}.inventory_item`}>Item</Label>
                      <Input
                        id={`edit_items.${index}.inventory_item`}
                        value={item?.name || 'Loading...'}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`edit_items.${index}.quantity`}>Quantity</Label>
                      <Input
                        id={`edit_items.${index}.quantity`}
                        type="number"
                        {...editRegister(`items.${index}.quantity`, { valueAsNumber: true })}
                        disabled={isEditSubmitting}
                      />
                      {editErrors.items?.[index]?.quantity && (
                        <p className="text-red-600 text-sm">{editErrors.items[index]?.quantity?.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`edit_items.${index}.unit_price`}>Unit Price</Label>
                      <Input
                        id={`edit_items.${index}.unit_price`}
                        type="number"
                        step="0.01"
                        {...editRegister(`items.${index}.unit_price`, { valueAsNumber: true })}
                        disabled={isEditSubmitting}
                      />
                      {editErrors.items?.[index]?.unit_price && (
                        <p className="text-red-600 text-sm">{editErrors.items[index]?.unit_price?.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`edit_items.${index}.received_quantity`}>Received Quantity</Label>
                      <Input
                        id={`edit_items.${index}.received_quantity`}
                        type="number"
                        {...editRegister(`items.${index}.received_quantity`, { valueAsNumber: true })}
                        disabled={isEditSubmitting}
                      />
                      {editErrors.items?.[index]?.received_quantity && (
                        <p className="text-red-600 text-sm">{editErrors.items[index]?.received_quantity?.message}</p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        console.log('Removing item at index:', index);
                        editRemove(index);
                      }}
                      disabled={isEditSubmitting || editFields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    console.log('Closing modal');
                    setEditPO(null);
                  }}
                  disabled={isEditSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isEditSubmitting}
                  onClick={() => console.log('Update button clicked')}
                >
                  {isEditSubmitting ? 'Updating...' : 'Update Purchase Order'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Card className="border-medical-100 dark:border-medical-800">
          <CardHeader>
            <CardTitle>Create New Purchase Order</CardTitle>
            <CardDescription>Order more stock for this item</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="supplier_id">Supplier</Label>
                  {suppliersLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Select
                      onValueChange={(value) => setValue('supplier_id', value)}
                      value={watch('supplier_id') || undefined}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="supplier_id">
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers?.length ? (
                          suppliers.map((sup: Supplier) => (
                            <SelectItem key={sup.id} value={sup.name}>
                              {sup.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-suppliers" disabled>
                            No suppliers available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                  {errors.supplier_id && <p className="text-red-600 text-sm">{errors.supplier_id.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_status">Status</Label>
                  <Select
                    onValueChange={(value: Status) => {
                      console.log('Setting status:', value);
                      editSetValue('status', value);
                    }}
                    value={editWatch('status') || ''}
                    disabled={isEditSubmitting}
                  >
                    <SelectTrigger id="edit_status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusChoices ? (
                        Object.entries(statusChoices).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {editErrors.status && <p className="text-red-600 text-sm">{editErrors.status.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expected_delivery">Expected Delivery</Label>
                  <Input
                    id="expected_delivery"
                    type="date"
                    {...register('expected_delivery')}
                    disabled={isSubmitting}
                  />
                  {errors.expected_delivery && (
                    <p className="text-red-600 text-sm">{errors.expected_delivery.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Items</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({ inventory_item: inventoryItemId || '', quantity: 1, unit_price: 0, received_quantity: 0 })
                    }
                    disabled={isSubmitting}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                {errors.items && <p className="text-red-600 text-sm">{errors.items.message}</p>}
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                      <Label htmlFor={`items.${index}.inventory_item`}>Item</Label>
                      <Input
                        id={`items.${index}.inventory_item`}
                        value={item?.name || 'Loading...'}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`items.${index}.quantity`}>Quantity</Label>
                      <Input
                        id={`items.${index}.quantity`}
                        type="number"
                        {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                        disabled={isSubmitting}
                      />
                      {errors.items?.[index]?.quantity && (
                        <p className="text-red-600 text-sm">{errors.items[index]?.quantity?.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`items.${index}.unit_price`}>Unit Price</Label>
                      <Input
                        id={`items.${index}.unit_price`}
                        type="number"
                        step="0.01"
                        {...register(`items.${index}.unit_price`, { valueAsNumber: true })}
                        disabled={isSubmitting}
                      />
                      {errors.items?.[index]?.unit_price && (
                        <p className="text-red-600 text-sm">{errors.items[index]?.unit_price?.message}</p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={isSubmitting || fields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/inventory')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Purchase Order'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default InventoryItemDetails;