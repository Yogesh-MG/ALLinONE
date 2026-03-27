import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { baseUrl } from '@/utils/apiconfig';
import { X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface CategoryErrorResponse {
  name?: string[];
}

interface SupplierErrorResponse {
  detail?: string;
}

const schema = z.object({
  name: z.string().min(1, 'Company name is required'),
  supplier_type: z.string().optional(),
  tax_id: z.string().optional(),
  website: z.string().url({ message: 'Invalid URL' }).optional().or(z.literal('')),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  contact_name: z.string().optional(),
  contact_title: z.string().optional(),
  contact_email: z.string().email({ message: 'Invalid email' }).max(100).optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  alt_phone: z.string().optional(),
  fax: z.string().optional(),
  primary_supply_category: z.string().array().optional(),
  approved: z.boolean().default(true),
  payment_terms: z.string().optional(),
  currency: z.string().optional(),
  status: z.enum(['Active', 'OnHold', 'Inactive']).default('Active'),
}).refine(
  (data) => !data.contact_email || data.contact_name,
  { message: 'Contact name is required when email is provided', path: ['contact_name'] }
);

type FormData = z.infer<typeof schema>;

const supplierTypes = ['Manufacturer', 'Distributor', 'Wholesaler', 'Retailer', 'Other'];
const countries = ['US', 'CA', 'UK', 'AU', 'IN', 'Other'];

interface SwitchableSelectInputProps {
  name: keyof FormData;
  label: string;
  options: string[];
  value: string | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  allowCustom?: boolean;
}

const SwitchableSelectInput: React.FC<SwitchableSelectInputProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  disabled,
  error,
  allowCustom,
}) => {
  const [isCustomInput, setIsCustomInput] = React.useState(
    value === 'Other' || (value && allowCustom && !options.includes(value))
  );

  const handleSelectChange = (val: string) => {
    console.log(`${name} Select Change:`, val);
    if (allowCustom && val === 'Other') {
      setIsCustomInput(true);
      onChange('');
    } else {
      setIsCustomInput(false);
      onChange(val);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log(`${name} Input Change:`, newValue);
    onChange(newValue);
  };

  const handleClearInput = () => {
    console.log(`${name} Clear Input`);
    setIsCustomInput(false);
    onChange('');
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      {allowCustom && isCustomInput ? (
        <div className="flex items-center gap-2">
          <Input
            id={name}
            value={value || ''}
            onChange={handleInputChange}
            placeholder={`Enter ${label.toLowerCase()}`}
            disabled={disabled}
            className="transition-all duration-200"
            autoFocus
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearInput}
            disabled={disabled}
          >
            <X size={16} />
          </Button>
        </div>
      ) : (
        <Select
          value={value || undefined}
          onValueChange={handleSelectChange}
          disabled={disabled}
        >
          <SelectTrigger id={name} className="transition-all duration-200">
            <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
};

const SupplierAdd = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const hospitalId = localStorage.getItem('hospital_id') || '201';
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    control,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      supplier_type: '',
      tax_id: '',
      website: '',
      description: '',
      address: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
      contact_name: '',
      contact_title: '',
      contact_email: '',
      contact_phone: '',
      alt_phone: '',
      fax: '',
      primary_supply_category: [],
      approved: true,
      payment_terms: '',
      currency: 'USD',
      status: 'Active',
    },
    mode: 'onBlur',
  });

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


  useEffect(() => {
    console.log('Categories updated:', categories);
    setSelectedCategories((prev) =>
      prev.filter((id) => categories.some((cat) => String(cat.id) === String(id)))
    );
  }, [categories]);

  useEffect(() => {
    if (categoriesError) {
      toast({ title: 'Error', description: 'Failed to load categories', variant: 'destructive' });
    }
  }, [categoriesError, toast]);

  useEffect(() => {
    console.log('Syncing selectedCategories:', selectedCategories);
    setValue('primary_supply_category', selectedCategories);
  }, [selectedCategories, setValue]);

  const createCategoryMutation = useMutation({
    mutationFn: (name: string) =>
      axios.post(`${baseUrl}/api/${hospitalId}/categories/`, { name }, { headers }).then((res) => res.data),
    onSuccess: (newCategory: Category) => {
      queryClient.setQueryData(['categories', hospitalId], (old: Category[] | undefined) => [
        ...(old || []),
        newCategory,
      ]);
      setSelectedCategories((prev) => {
        const id = String(newCategory.id);
        if (prev.includes(id)) {
          console.log('Category already selected:', id);
          return prev;
        }
        const newCategories = [...prev, id];
        console.log('After adding new category:', newCategories);
        return newCategories;
      });
      setCategoryModalOpen(false);
      setNewCategoryName('');
      toast({ title: 'Success', description: `Category "${newCategory.name}" created` });
    },
    onError: (error: AxiosError<CategoryErrorResponse>) => {
      console.log('Category Mutation Error:', error.response?.data);
      toast({
        title: 'Error',
        description: error.response?.data?.name?.[0] || 'Failed to create category',
        variant: 'destructive',
      });
    },
  });

  const addSupplierMutation = useMutation({
    mutationFn: (data: FormData) => {
      const payload = {
        name: data.name,
        contact_name: data.contact_name || '',
        contact_email: data.contact_email || '',
        contact_phone: data.contact_phone || '',
        address: data.address || '',
        category_ids: (data.primary_supply_category || []).map(String),
        status: data.status,
        tax_id: data.tax_id || '',
        website: data.website || '',
        supplier_type: data.supplier_type || '',
        payment_terms: data.payment_terms || '',
        currency: data.currency || 'USD',
        approved: data.approved,
        country: data.country || '',
      };
      console.log('Add Supplier Payload:', payload);
      return axios.post(`${baseUrl}/api/${hospitalId}/suppliers/`, payload, { headers }).then((res) => res.data);
    },
    onSuccess: () => {
      console.log('Supplier Added Successfully');
      toast({ title: 'Success', description: 'Supplier added successfully' });
      navigate('/suppliers');
    },
    onError: (error: AxiosError<SupplierErrorResponse>) => {
      console.log('Supplier Mutation Error:', error.response?.data);
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to add supplier',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    if (!token) {
      toast({ title: 'Unauthorized', description: 'Please log in to continue', variant: 'destructive' });
      navigate('/login');
    }
  }, [token, navigate, toast]);

  if (!token) return null;

  const onSubmit = (data: FormData) => {
    console.log('Form Submitted:', data);
    console.log('Form Errors:', errors);
    console.log('isSubmitting:', isSubmitting);
    addSupplierMutation.mutate(data);
  };

  const handleCategorySave = () => {
    if (!newCategoryName.trim()) {
      toast({ title: 'Error', description: 'Category name is required', variant: 'destructive' });
      return;
    }
    createCategoryMutation.mutate(newCategoryName);
  };

  const handleCategorySelect = (categoryId: string) => {
    console.log('Category Selected:', categoryId);
    if (categoryId === 'Other') {
      setCategoryModalOpen(true);
    } else {
      const id = String(categoryId);
      if (!selectedCategories.includes(id)) {
        setSelectedCategories((prev) => {
          const newCategories = [...new Set([...prev, id])]; // Ensure no duplicates
          console.log('Updated selectedCategories:', newCategories);
          return newCategories;
        });
      } else {
        console.log('Category already selected:', id);
      }
    }
  };

  const handleCategoryRemove = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const newCategories = prev.filter((id) => id !== categoryId);
      console.log('After removing category:', newCategories);
      return newCategories;
    });
  };

  // Log form state for debugging
  const formData = watch();
  console.log('Current Form Data:', formData);

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-medical-800 dark:text-medical-100">Add Supplier</h1>
            <p className="text-muted-foreground">Add a new supplier to the system</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/suppliers')} disabled={isSubmitting}>
            Back to Suppliers
          </Button>
        </div>

        <Card className="border-medical-100 dark:border-medical-800">
          <CardHeader>
            <CardTitle>Supplier Information</CardTitle>
            <CardDescription>Enter the details of the supplier you want to add</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                console.log('Form Submit Event Triggered');
                handleSubmit(onSubmit)(e);
              }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name</Label>
                    <Input id="name" {...register('name')} disabled={isSubmitting} />
                    {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
                  </div>
                  <Controller
                    name="supplier_type"
                    control={control}
                    render={({ field }) => (
                      <SwitchableSelectInput
                        name="supplier_type"
                        label="Supplier Type"
                        options={supplierTypes}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                        error={errors.supplier_type?.message}
                        allowCustom
                      />
                    )}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="tax_id">Tax ID / Business Number</Label>
                    <Input id="tax_id" {...register('tax_id')} disabled={isSubmitting} />
                    {errors.tax_id && <p className="text-red-600 text-sm">{errors.tax_id.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" type="url" {...register('website')} disabled={isSubmitting} />
                    {errors.website && <p className="text-red-600 text-sm">{errors.website.message}</p>}
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
                <h3 className="text-lg font-medium">Primary Address</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="col-span-1 space-y-2 md:col-span-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Textarea id="address" {...register('address')} disabled={isSubmitting} />
                    {errors.address && <p className="text-red-600 text-sm">{errors.address.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" {...register('city')} disabled={isSubmitting} />
                    {errors.city && <p className="text-red-600 text-sm">{errors.city.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input id="state" {...register('state')} disabled={isSubmitting} />
                    {errors.state && <p className="text-red-600 text-sm">{errors.state.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input id="postal_code" {...register('postal_code')} disabled={isSubmitting} />
                    {errors.postal_code && <p className="text-red-600 text-sm">{errors.postal_code.message}</p>}
                  </div>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <SwitchableSelectInput
                        name="country"
                        label="Country"
                        options={countries}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                        error={errors.country?.message}
                        allowCustom
                      />
                    )}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Contact Information</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contact_name">Primary Contact Name</Label>
                    <Input id="contact_name" {...register('contact_name')} disabled={isSubmitting} />
                    {errors.contact_name && <p className="text-red-600 text-sm">{errors.contact_name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_title">Contact Title</Label>
                    <Input id="contact_title" {...register('contact_title')} disabled={isSubmitting} />
                    {errors.contact_title && <p className="text-red-600 text-sm">{errors.contact_title.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_email">Email</Label>
                    <Input id="contact_email" type="email" {...register('contact_email')} disabled={isSubmitting} />
                    {errors.contact_email && <p className="text-red-600 text-sm">{errors.contact_email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">Phone</Label>
                    <Input id="contact_phone" {...register('contact_phone')} disabled={isSubmitting} />
                    {errors.contact_phone && <p className="text-red-600 text-sm">{errors.contact_phone.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alt_phone">Alternative Phone</Label>
                    <Input id="alt_phone" {...register('alt_phone')} disabled={isSubmitting} />
                    {errors.alt_phone && <p className="text-red-600 text-sm">{errors.alt_phone.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fax">Fax (if applicable)</Label>
                    <Input id="fax" {...register('fax')} disabled={isSubmitting} />
                    {errors.fax && <p className="text-red-600 text-sm">{errors.fax.message}</p>}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Supply Categories</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    {categoriesLoading ? (
                      <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />
                    ) : (
                      <div>
                        <Label htmlFor="primary_supply_category">Supply Categories</Label>
                        {selectedCategories.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {[...new Set(selectedCategories)].map((categoryId) => {
                              const category = categories.find((cat) => String(cat.id) === String(categoryId));
                              console.log(`Rendering chip for ID ${categoryId}:`, category);
                              if (!category) {
                                console.warn(`Category with ID ${categoryId} not found in categories:`, categories);
                                return null;
                              }
                              return (
                                <div
                                  key={`chip-${categoryId}`}
                                  className="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-sm"
                                >
                                  <span>{category.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleCategoryRemove(categoryId)}
                                    className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                    disabled={isSubmitting}
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 mb-2">No categories selected</p>
                        )}
                        <Select
                          onValueChange={handleCategorySelect}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger id="primary_supply_category">
                            <SelectValue placeholder="Select categories" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.length === 0 ? (
                              <SelectItem value="Other">No categories available, add new</SelectItem>
                            ) : (
                              categories.map((cat) => (
                                <SelectItem
                                  key={`select-${cat.id}`}
                                  value={cat.id}
                                  disabled={selectedCategories.includes(String(cat.id))}
                                >
                                  {cat.name}
                                </SelectItem>
                              ))
                            )}
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.primary_supply_category && (
                          <p className="text-red-600 text-sm">{errors.primary_supply_category.message}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 pt-8">
                    <Switch
                      id="approved"
                      checked={watch('approved')}
                      onCheckedChange={(value) => setValue('approved', value)}
                      disabled={isSubmitting}
                    />
                    <Label htmlFor="approved">Approved Supplier</Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Payment Information</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="payment_terms">Payment Terms</Label>
                    <Select
                      onValueChange={(value) => setValue('payment_terms', value)}
                      value={watch('payment_terms') || undefined}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="payment_terms">
                        <SelectValue placeholder="Select terms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Net 15">Net 15</SelectItem>
                        <SelectItem value="Net 30">Net 30</SelectItem>
                        <SelectItem value="Net 45">Net 45</SelectItem>
                        <SelectItem value="Net 60">Net 60</SelectItem>
                        <SelectItem value="Immediate Payment">Immediate Payment</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.payment_terms && <p className="text-red-600 text-sm">{errors.payment_terms.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Preferred Currency</Label>
                    <Select
                      onValueChange={(value) => setValue('currency', value)}
                      value={watch('currency') || undefined}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                        <SelectItem value="INR">INR</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.currency && <p className="text-red-600 text-sm">{errors.currency.message}</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Status</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="status">Supplier Status</Label>
                    <Select
                      onValueChange={(value) => setValue('status', value as 'Active' | 'OnHold' | 'Inactive')}
                      value={watch('status')}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="OnHold">On Hold</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.status && <p className="text-red-600 text-sm">{errors.status.message}</p>}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/suppliers')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={() => console.log('Add Supplier Button Clicked')}
                >
                  {isSubmitting ? 'Adding...' : 'Add Supplier'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Dialog open={isCategoryModalOpen} onOpenChange={setCategoryModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>Enter the name of the new category to add it to the system.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-category-name">Category Name</Label>
                <Input
                  id="new-category-name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  disabled={createCategoryMutation.isPending}
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setCategoryModalOpen(false);
                  setNewCategoryName('');
                }}
                disabled={createCategoryMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCategorySave}
                disabled={createCategoryMutation.isPending}
              >
                {createCategoryMutation.isPending ? 'Saving...' : 'Save Category'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
};

export default SupplierAdd;