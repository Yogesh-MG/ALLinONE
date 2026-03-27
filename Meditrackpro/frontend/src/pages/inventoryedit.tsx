import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios, {AxiosError} from 'axios';
import { baseUrl } from '@/utils/apiconfig';
import { Skeleton } from '@/components/ui/skeleton';

interface unitsErrorResponse {
  name?: string;
}

interface itemErrorResponse {
  name?: string;
}




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
  cost: number ;
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

interface Supplier {
  id: string;
  name: string;
}

const schema = z.object({
  name: z.string().min(1, 'Item name is required'),
  category_id: z.string().optional(),
  quantity: z.number().min(0, 'Quantity cannot be negative'),
  unit_id: z.string().optional(),
  customUnitName: z.string().optional(),
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
  setCustomUnitName: (value: string) => void;
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
  setCustomUnitName,
}) => {
  const isOther = value === 'Other';

  console.log(`SwitchableSelectInput [${name}]:`, {
    value,
    isOther,
    options,
    displayOptions: displayOptions?.map(opt => ({ value: opt.value, label: opt.label })),
  });

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      {isOther ? (
        <Input
          id={name}
          value=""
          onChange={e => {
            console.log(`Input change [${name}]:`, e.target.value);
            setCustomUnitName(e.target.value);
            onChange('Other');
          }}
          placeholder={`Enter ${label.toLowerCase()}`}
          disabled={disabled}
          className="transition-all duration-200"
          autoFocus
        />
      ) : (
        <Select
          value={value || undefined}
          onValueChange={val => {
            console.log(`Select change [${name}]:`, val);
            onChange(val);
            setCustomUnitName('');
          }}
          disabled={disabled}
        >
          <SelectTrigger id={name} className="transition-all duration-200">
            <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {displayOptions?.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
};

const InventoryEdit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { inventoryItemId } = useParams<{ inventoryItemId: string }>();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      quantity: 0,
      reorder_level: 0,
      cost: 0,
      tax: 0,
      customUnitName: '',
    },
    mode: 'onBlur',
  });

  const hospitalId = localStorage.getItem('hospitalid') || '201';
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // Fetch item
  const {
    data: item,
    isLoading: itemLoading,
    error: itemError,
  } = useQuery<InventoryItem>({
    queryKey: ['inventoryItem', hospitalId, inventoryItemId],
    queryFn: () =>
      axios
        .get(`${baseUrl}/api/${hospitalId}/inventory/${inventoryItemId}/`, { headers })
        .then((res) => res.data),
    enabled: !!hospitalId && !!token && !!inventoryItemId,
  });

  // Fetch categories
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery<Category[]>({
    queryKey: ['categories', hospitalId],
    queryFn: () => axios.get(`${baseUrl}/api/${hospitalId}/categories/`, { headers }).then((res) => res.data),
    enabled: !!hospitalId && !!token,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch units
  const {
    data: units = [],
    isLoading: unitsLoading,
    error: unitsError,
  } = useQuery<Unit[]>({
    queryKey: ['units', hospitalId],
    queryFn: () => axios.get(`${baseUrl}/api/${hospitalId}/units/`, { headers }).then((res) => res.data),
    enabled: !!hospitalId && !!token,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch suppliers
  const {
    data: suppliers = [],
    isLoading: suppliersLoading,
    error: suppliersError,
  } = useQuery<Supplier[]>({
    queryKey: ['suppliers', hospitalId],
    queryFn: () => axios.get(`${baseUrl}/api/${hospitalId}/suppliers/`, { headers }).then((res) => res.data),
    enabled: !!hospitalId && !!token,
    staleTime: 5 * 60 * 1000,
  });

  // Create new unit
  const createUnitMutation = useMutation({
    mutationFn: (name: string) => {
      console.log('createUnitMutation: Sending', { name });
      return axios.post(`${baseUrl}/api/${hospitalId}/units/`, { name }, { headers }).then(res => {
        console.log('createUnitMutation: Response', res.data);
        return res.data;
      });
    },
    onSuccess: (newUnit: Unit) => {
      queryClient.setQueryData(['units', hospitalId], (old: Unit[] | undefined) => [
        ...(old || []),
        newUnit,
      ]);
      toast({ title: 'Success', description: `Unit "${newUnit.name}" created` });
    },
    onError: (error: AxiosError<unitsErrorResponse>) => {
      toast({ 
        title: 'Error', 
        description: 'Failed to create unit', 
        variant: 'destructive' 
      });
    },
  });

  // Mutation for updating item
  const updateItemMutation = useMutation({
    mutationFn: (data: FormData) => {
      const payload = {
        ...data,
        unit_id: data.unit_id === 'none' || !data.unit_id ? null : data.unit_id,
        category_id: data.category_id === 'none' || !data.category_id ? null : data.category_id,
        supplier_id: data.supplier_id === 'none' || !data.supplier_id ? null : data.supplier_id,
        expiry_date: data.expiry_date || null,
        reorder_level: data.reorder_level ?? null,
        tax: data.tax ?? null,
        barcode: data.barcode || null,
        batch: data.batch || null,
        location: data.location || null,
        description: data.description || null,
      };
      console.log('updateItemMutation: Sending payload', payload);
      return axios.patch(`${baseUrl}/api/${hospitalId}/inventory/${inventoryItemId}/`, payload, { headers }).then(res => {
        console.log('updateItemMutation: Response', res.data);
        return res.data;
      });
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Item updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['inventory', hospitalId] });
      navigate('/inventory');
    },
    onError: (error: AxiosError<itemErrorResponse>) => {
      toast({
        title: 'Error',
        description: error.response?.data?.name || 'Failed to update item',
        variant: 'destructive',
      });
    },
  });

  // Pre-fill form with item data
  useEffect(() => {
    if (item) {
      console.log('Pre-filling form with item:', item);
      reset({
        name: item.name,
        category_id: item.category?.id || undefined,
        quantity: item.quantity,
        unit_id: item.unit?.id || undefined,
        customUnitName: '',
        reorder_level: item.reorder_level || undefined,
        expiry_date: item.expiry_date || undefined,
        location: item.location || undefined,
        sku: item.sku,
        barcode: item.barcode || undefined,
        cost: item.cost,
        tax: item.tax || undefined,
        supplier_id: item.supplier?.id || undefined,
        batch: item.batch || undefined,
        description: item.description || undefined,
      });
    }
  }, [item, reset]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!token) {
      toast({ title: 'Unauthorized', description: 'Please log in to continue', variant: 'destructive' });
      navigate('/login');
    }
  }, [token, navigate, toast]);

  // Handle query errors
  useEffect(() => {
    if (itemError || categoriesError || unitsError || suppliersError) {
      toast({
        title: 'Error',
        description: 'Failed to load form data. Please try again.',
        variant: 'destructive',
      });
    }
  }, [itemError, categoriesError, unitsError, suppliersError, toast]);

  if (!token || !inventoryItemId) return null;

  // Render error state if queries fail
  if (itemError || categoriesError || unitsError || suppliersError) {
    return (
      <PageContainer>
        <Card className="border-medical-100 dark:border-medical-800">
          <CardHeader>
            <CardTitle>Unable to Load Item</CardTitle>
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

  const onSubmit = async (data: FormData) => {
    console.log('onSubmit: Starting submission', { data, inventoryItemId, hospitalId });

    // Check SKU uniqueness only if SKU has changed
    if (data.sku !== item?.sku) {
      try {
        console.log('onSubmit: Checking SKU', { sku: data.sku, exclude_id: inventoryItemId });
        const response = await axios.get(`${baseUrl}/api/${hospitalId}/inventory/check/`, {
          params: { sku: data.sku, exclude_id: inventoryItemId },
          headers,
        });
        console.log('onSubmit: SKU check response', response.data);
        if (response.data.exists) {
          toast({
            title: 'Validation Error',
            description: 'SKU already exists',
            variant: 'destructive',
          });
          return;
        }
      } catch (error) {
        console.log('onSubmit: SKU check error', error);
        toast({
          title: 'Error',
          description: 'Failed to check SKU uniqueness',
          variant: 'destructive',
        });
        return;
      }
    } else {
      console.log('onSubmit: SKU unchanged, skipping uniqueness check', data.sku);
    }

    // Handle unit
    let finalUnitId = data.unit_id;

    // Check if "Other" was selected and a custom unit name was provided
    if (data.unit_id === 'Other') {
      const customUnitName = data.customUnitName?.trim();
      console.log('onSubmit: Detected "Other" selection', { customUnitName });
      if (customUnitName) {
        try {
          console.log('onSubmit: Creating new unit', customUnitName);
          const newUnit = await createUnitMutation.mutateAsync(customUnitName);
          console.log('onSubmit: New unit created', newUnit);
          finalUnitId = newUnit.id;
        } catch (error) {
          console.log('onSubmit: createUnitMutation error', error);
          toast({
            title: 'Error',
            description: 'Failed to create unit',
            variant: 'destructive',
          });
          return;
        }
      } else {
        console.log('onSubmit: No custom unit name provided, setting unit_id to null');
        finalUnitId = null;
      }
    } else if (data.unit_id && !units.some(unit => unit.id === data.unit_id)) {
      // Handle invalid unit_id
      console.log('onSubmit: Invalid unit_id, setting to null', data.unit_id);
      finalUnitId = null;
    }

    // Proceed with update
    console.log('onSubmit: Updating item with unit_id', finalUnitId);
    updateItemMutation.mutate({
      ...data,
      unit_id: finalUnitId,
    });
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-medical-800 dark:text-medical-100">
              Edit Inventory Item
            </h1>
            <p className="text-muted-foreground">Update details for {item?.name || 'Loading...'}</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/inventory')} disabled={isSubmitting}>
            Back to Inventory
          </Button>
        </div>

        <Card className="border-medical-100 dark:border-medical-800">
          <CardHeader>
            <CardTitle>Item Information</CardTitle>
            <CardDescription>Update the details of the inventory item</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* General Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-medical-800 dark:text-medical-100">General Information</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Item Name</Label>
                    {itemLoading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Input id="name" {...register('name')} disabled={isSubmitting} />
                    )}
                    {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category_id">Category</Label>
                    {categoriesLoading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Select
                        onValueChange={(value) => setValue('category_id', value)}
                        value={watch('category_id') || undefined}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger id="category_id">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No category</SelectItem>
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
                    {itemLoading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Input id="sku" {...register('sku')} disabled={isSubmitting} />
                    )}
                    {errors.sku && <p className="text-red-600 text-sm">{errors.sku.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barcode">Barcode</Label>
                    {itemLoading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Input id="barcode" {...register('barcode')} disabled={isSubmitting} />
                    )}
                    {errors.barcode && <p className="text-red-600 text-sm">{errors.barcode.message}</p>}
                  </div>
                  <div className="col-span-1 space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    {itemLoading ? (
                      <Skeleton className="h-[100px] w-full" />
                    ) : (
                      <Textarea
                        id="description"
                        {...register('description')}
                        className="min-h-[100px]"
                        disabled={isSubmitting}
                      />
                    )}
                    {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
                  </div>
                </div>
              </div>

              {/* Pricing Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-medical-800 dark:text-medical-100">Pricing Details</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost Price</Label>
                    {itemLoading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Input
                        id="cost"
                        type="number"
                        step="0.01"
                        {...register('cost', { valueAsNumber: true })}
                        disabled={isSubmitting}
                      />
                    )}
                    {errors.cost && <p className="text-red-600 text-sm">{errors.cost.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax">Tax Rate (%)</Label>
                    {itemLoading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Input
                        id="tax"
                        type="number"
                        step="0.01"
                        {...register('tax', { valueAsNumber: true })}
                        disabled={isSubmitting}
                      />
                    )}
                    {errors.tax && <p className="text-red-600 text-sm">{errors.tax.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier_id">Preferred Supplier</Label>
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
                          <SelectItem value="none">No supplier</SelectItem>
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

              {/* Inventory Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-medical-800 dark:text-medical-100">Inventory Details</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    {itemLoading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Input
                        id="quantity"
                        type="number"
                        {...register('quantity', { valueAsNumber: true })}
                        disabled={isSubmitting}
                      />
                    )}
                    {errors.quantity && <p className="text-red-600 text-sm">{errors.quantity.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reorder_level">Reorder Level</Label>
                    {itemLoading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Input
                        id="reorder_level"
                        type="number"
                        {...register('reorder_level', { valueAsNumber: true })}
                        disabled={isSubmitting}
                      />
                    )}
                    {errors.reorder_level && <p className="text-red-600 text-sm">{errors.reorder_level.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Storage Location</Label>
                    {itemLoading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Input id="location" {...register('location')} disabled={isSubmitting} />
                    )}
                    {errors.location && <p className="text-red-600 text-sm">{errors.location.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry_date">Expiry Date</Label>
                    {itemLoading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Input
                        id="expiry_date"
                        type="date"
                        {...register('expiry_date')}
                        disabled={isSubmitting}
                      />
                    )}
                    {errors.expiry_date && <p className="text-red-600 text-sm">{errors.expiry_date.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batch">Batch Number</Label>
                    {itemLoading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Input id="batch" {...register('batch')} disabled={isSubmitting} />
                    )}
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
                              ...(units.map(unit => ({ value: String(unit.id), label: unit.name })) || [])
                            ]}
                            setCustomUnitName={value => setValue('customUnitName', value)}
                          />
                        )}
                      />
                    )}
                    {errors.unit_id && <p className="text-red-600 text-sm">{errors.unit_id.message}</p>}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/inventory')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || createUnitMutation.isPending}>
                  {isSubmitting ? 'Updating...' : 'Update Item'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default InventoryEdit;