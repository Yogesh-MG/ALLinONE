import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios, {AxiosError} from 'axios';
import { baseUrl } from '@/utils/apiconfig';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface InventoryItem {
  id: string;
  name: string;
  category: { id: string; name: string } | null;
  quantity: number;
  unit: { id: string; name: string } | null;
  reorder_level: number | null;
  expiry_date: string | null;
  location: string | null;
  sku: string;
  barcode: string | null;
  cost: number;
  tax: number | null;
  supplier: { id: string; name: string } | null;
  batch: string | null;
  description: string | null;
}

interface Category {
  id: string;
  name: string;
}

interface Unit {
  id: string;
  name: string;
}


interface ItemErrorResponse {
  details?: string;
}

interface Supplier {
  id: string;
  name: string;
}

const schema = z.object({
  name: z.string().min(1, 'Item name is required'),
  category_id: z.string().optional(),
  quantity: z.number().min(0, 'Quantity cannot be negative'),
  unit_id: z.string().optional(),
  reorder_level: z.number().min(0, 'Reorder level cannot be negative').optional(),
  expiry_date: z.string().optional().refine(
    (val) => !val || new Date(val) >= new Date(new Date().setHours(0, 0, 0, 0)),
    { message: 'Expiry date must be today or in the future' }
  ),
  location: z.string().optional(),
  sku: z.string().min(1, 'SKU is required'),
  barcode: z.string().optional(),
  cost: z.number().min(0, 'Cost cannot be negative'),
  tax: z.number().min(0, 'Tax rate cannot be negative').optional(),
  supplier_id: z.string().optional(),
  batch: z.string().optional(),
  description: z.string().optional(),
}).superRefine(async (data, ctx) => {
  if (!data.sku) return;
  const hospitalId = localStorage.getItem('hospital_id') || '201';
  try {
    const response = await axios.get(`${baseUrl}/api/${hospitalId}/inventory/check/`, {
      params: { sku: data.sku },
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (response.data.exists) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'SKU already exists',
        path: ['sku'],
      });
    }
  } catch {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Failed to check SKU uniqueness',
      path: ['sku'],
    });
  }
});

type FormData = z.infer<typeof schema>;

interface SwitchableSelectInputProps {
  name: keyof FormData;
  label: string;
  options: string[];
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  displayOptions?: { value: string; label: string }[];
  openUnitModal: () => void;
}

const SwitchableSelectInput: React.FC<SwitchableSelectInputProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  disabled,
  error,
  displayOptions,
  openUnitModal,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Select
        value={value || undefined}
        onValueChange={(val) => {
          console.log('Unit selected:', val);
          if (val === 'Other') {
            openUnitModal();
            onChange('');
          } else {
            onChange(val);
          }
        }}
        disabled={disabled}
      >
        <SelectTrigger id={name} className="transition-all duration-200">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {displayOptions
            ? displayOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))
            : options.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
        </SelectContent>
      </Select>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
};

const InventoryAdd = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const hospitalId = localStorage.getItem('hospital_id') || '201';
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const [isUnitModalOpen, setUnitModalOpen] = useState(false);
  const [newUnitName, setNewUnitName] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      quantity: 0,
      reorder_level: 0,
      cost: 0,
      tax: 0,
    },
    mode: 'onBlur',
  });

  // Fetch categories
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery<Category[], Error>({
    queryKey: ['categories', hospitalId],
    queryFn: () => axios.get(`${baseUrl}/api/${hospitalId}/categories/`, { headers }).then(res => res.data),
    enabled: !!hospitalId && !!token,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch units
  const {
    data: units = [],
    isLoading: unitsLoading,
    error: unitsError,
  } = useQuery<Unit[], Error>({
    queryKey: ['units', hospitalId],
    queryFn: () => axios.get(`${baseUrl}/api/${hospitalId}/units/`, { headers }).then(res => res.data),
    enabled: !!hospitalId && !!token,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch suppliers
  const {
    data: suppliers = [],
    isLoading: suppliersLoading,
    error: suppliersError,
  } = useQuery<Supplier[], Error>({
    queryKey: ['suppliers', hospitalId],
    queryFn: () => axios.get(`${baseUrl}/api/${hospitalId}/suppliers/`, { headers }).then(res => res.data),
    enabled: !!hospitalId && !!token,
    staleTime: 5 * 60 * 1000,
  });

  // Create new unit
  const createUnitMutation = useMutation({
    mutationFn: (name: string) =>
      axios.post(`${baseUrl}/api/${hospitalId}/units/`, { name }, { headers }).then(res => res.data),
    onSuccess: (newUnit: Unit) => {
      queryClient.setQueryData(['units', hospitalId], (old: Unit[] | undefined) => [
        ...(old || []),
        newUnit,
      ]);
      setValue('unit_id', newUnit.id);
      setUnitModalOpen(false);
      setNewUnitName('');
      toast({ title: 'Success', description: `Unit "${newUnit.name}" created` });
      console.log('Created unit:', newUnit);
    },
    onError: (error: AxiosError) => {
      console.error('Unit creation error:', error.response?.data);
      toast({ title: 'Error', description: 'Failed to create unit', variant: 'destructive' });
    },
  });

  // Mutation for adding item
  const addItemMutation = useMutation({
    mutationFn: (data: FormData) => {
      const payload = {
        ...data,
        unit_id: data.unit_id || null,
        cost: Number(data.cost),
        tax: data.tax != null ? Number(data.tax) : null,
        quantity: Number(data.quantity),
        reorder_level: data.reorder_level != null ? Number(data.reorder_level) : null,
      };
      console.log('Submitting payload:', payload);
      return axios.post(`${baseUrl}/api/${hospitalId}/inventory/`, payload, { headers }).then(res => {
        console.log('Backend response:', res.data);
        return res.data;
      });
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Item added to inventory' });
      navigate('/inventory');
    },
    onError: (error: AxiosError<ItemErrorResponse>) => {
      console.error('Add item error:', error.response?.data);
      toast({
        title: 'Error',
        description: error.response?.data?.details || 'Failed to add item',
        variant: 'destructive',
      });
    },
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!token) {
      console.log('No token found, redirecting to login');
      toast({ title: 'Unauthorized', description: 'Please log in to continue', variant: 'destructive' });
      navigate('/login');
    }
  }, [token, navigate, toast]);

  // Handle query errors
  useEffect(() => {
    if (categoriesError || unitsError || suppliersError) {
      console.error('Query error:', { categoriesError, unitsError, suppliersError });
      toast({
        title: 'Error',
        description: 'Failed to load form data. Please try again.',
        variant: 'destructive',
      });
    }
  }, [categoriesError, unitsError, suppliersError, toast]);

  if (!token) return null;

  // Render error state if queries fail
  if (categoriesError || unitsError || suppliersError) {
    return (
      <PageContainer>
        <Card className="border-medical-100 dark:border-medical-800">
          <CardHeader>
            <CardTitle>Unable to Load Form</CardTitle>
            <CardDescription>
              An unexpected issue occurred. Please try again or return to the inventory list.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/inventory')}>Back to Inventory</Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  const onSubmit = (data: FormData) => {
    console.log('Form data before submission:', data);
    // Only handle existing units or null; custom units handled via modal
    addItemMutation.mutate(data);
  };

  const handleCreateUnit = () => {
    if (!newUnitName.trim()) {
      toast({ title: 'Error', description: 'Unit name is required', variant: 'destructive' });
      return;
    }
    console.log('Creating unit:', newUnitName);
    createUnitMutation.mutate(newUnitName);
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-medical-800 dark:text-medical-100">
              Add Inventory Item
            </h1>
            <p className="text-muted-foreground">Add a new item to your medical inventory</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/inventory')} disabled={isSubmitting}>
            Back to Inventory
          </Button>
        </div>

        <Card className="border-medical-100 dark:border-medical-800">
          <CardHeader>
            <CardTitle>Item Information</CardTitle>
            <CardDescription>Enter the details of the item you want to add to your inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">General Information</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Item Name</Label>
                    <Input id="name" {...register('name')} disabled={isSubmitting} />
                    {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category_id">Category</Label>
                    {categoriesLoading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Select
                        onValueChange={value => setValue('category_id', value)}
                        value={watch('category_id') || undefined}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger id="category_id">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none" disabled>
                            {categories.length ? 'Select a category' : 'No categories available'}
                          </SelectItem>
                          {categories.map((cat: Category) => (
                            <SelectItem key={cat.id} value={String(cat.id)}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {errors.category_id && <p className="text-red-600 text-sm">{errors.category_id.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU/Item Code</Label>
                    <Input id="sku" {...register('sku')} disabled={isSubmitting} />
                    {errors.sku && <p className="text-red-600 text-sm">{errors.sku.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barcode">Barcode</Label>
                    <Input id="barcode" {...register('barcode')} disabled={isSubmitting} />
                    {errors.barcode && <p className="text-red-600 text-sm">{errors.barcode.message}</p>}
                  </div>
                  <div className="col-span-1 space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      {...register('description')}
                      className="min-h-[100px]"
                      disabled={isSubmitting}
                    />
                    {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Pricing Information</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost Price</Label>
                    <Input
                      id="cost"
                      type="number"
                      {...register('cost', { valueAsNumber: true })}
                      disabled={isSubmitting}
                    />
                    {errors.cost && <p className="text-red-600 text-sm">{errors.cost.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax">Tax Rate (%)</Label>
                    <Input
                      id="tax"
                      type="number"
                      {...register('tax', { valueAsNumber: true })}
                      disabled={isSubmitting}
                    />
                    {errors.tax && <p className="text-red-600 text-sm">{errors.tax.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier_id">Preferred Supplier</Label>
                    {suppliersLoading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Select
                        onValueChange={value => setValue('supplier_id', value)}
                        value={watch('supplier_id') || undefined}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger id="supplier_id">
                          <SelectValue placeholder="Select supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none" disabled>
                            {suppliers.length ? 'Select a supplier' : 'No suppliers available'}
                          </SelectItem>
                          {suppliers.map((sup: Supplier) => (
                            <SelectItem key={sup.id} value={String(sup.id)}>
                              {sup.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {errors.supplier_id && <p className="text-red-600 text-sm">{errors.supplier_id.message}</p>}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Inventory Details</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Initial Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      {...register('quantity', { valueAsNumber: true })}
                      disabled={isSubmitting}
                    />
                    {errors.quantity && <p className="text-red-600 text-sm">{errors.quantity.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reorder_level">Reorder Level</Label>
                    <Input
                      id="reorder_level"
                      type="number"
                      {...register('reorder_level', { valueAsNumber: true })}
                      disabled={isSubmitting}
                    />
                    {errors.reorder_level && <p className="text-red-600 text-sm">{errors.reorder_level.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Storage Location</Label>
                    <Input id="location" {...register('location')} disabled={isSubmitting} />
                    {errors.location && <p className="text-red-600 text-sm">{errors.location.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry_date">Expiry Date</Label>
                    <Input
                      id="expiry_date"
                      type="date"
                      {...register('expiry_date')}
                      disabled={isSubmitting}
                    />
                    {errors.expiry_date && <p className="text-red-600 text-sm">{errors.expiry_date.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batch">Batch Number</Label>
                    <Input id="batch" {...register('batch')} disabled={isSubmitting} />
                    {errors.batch && <p className="text-red-600 text-sm">{errors.batch.message}</p>}
                  </div>
                  <div className="space-y-2">
                    {unitsLoading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Controller
                        name="unit_id"
                        control={control}
                        render={({ field }) => (
                          <SwitchableSelectInput
                            name="unit_id"
                            label="Unit of Measure"
                            options={[...(units.map(unit => String(unit.id)) || []), 'Other']}
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isSubmitting}
                            error={errors.unit_id?.message}
                            displayOptions={[
                              ...(units.map(unit => ({ value: String(unit.id), label: unit.name })) || []),
                              { value: 'Other', label: 'Other' },
                            ]}
                            openUnitModal={() => setUnitModalOpen(true)}
                          />
                        )}
                      />
                    )}
                    {errors.unit_id && <p className="text-red-600 text-sm">{errors.unit_id.message}</p>}
                  </div>
                </div>
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
                <Button type="submit" disabled={isSubmitting || createUnitMutation.isPending}>
                  {isSubmitting ? 'Adding...' : 'Add Item'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isUnitModalOpen} onOpenChange={setUnitModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Unit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="new-unit-name">Unit Name</Label>
            <Input
              id="new-unit-name"
              value={newUnitName}
              onChange={(e) => {
                setNewUnitName(e.target.value);
                console.log('New unit name input:', e.target.value);
              }}
              placeholder="Enter unit name (e.g., Box)"
              disabled={createUnitMutation.isPending}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setUnitModalOpen(false);
                setNewUnitName('');
                setValue('unit_id', '');
              }}
              disabled={createUnitMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateUnit}
              disabled={createUnitMutation.isPending}
            >
              {createUnitMutation.isPending ? 'Saving...' : 'Save Unit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default InventoryAdd;