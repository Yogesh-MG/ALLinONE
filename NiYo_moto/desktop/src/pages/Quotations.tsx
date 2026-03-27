import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Loader2, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/utils/api";
import { toast } from "sonner";

// Interfaces
interface QuotationItem {
  id?: number; // Optional because new items won't have an ID yet
  sl_no: number;
  description: string;
  price: number;
}

interface QuotationDetail {
  id: number;
  quotation_id: string;
  customer: number; // ID of customer
  date: string;
  gst_applied: boolean;
  gst_rate: number;
  notes: string;
  status: string;
  items: QuotationItem[];
}

const Quotations = () => {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentQuoteId, setCurrentQuoteId] = useState<number | null>(null);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);

  // Form State
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [date, setDate] = useState("");
  const [quotationId, setQuotationId] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("pending");
  const [gstApplied, setGstApplied] = useState(false);
  const [gstRate, setGstRate] = useState(18);

  // Load Initial List
  useEffect(() => {
    fetchQuotations();
    // Fetch customers once for the edit dropdown
    api.get("/api/customer/").then(res => setCustomers(res.data)).catch(console.error);
  }, []);

  const fetchQuotations = () => {
    setLoading(true);
    api.get("/api/quotations/")
      .then(res => setQuotations(res.data))
      .catch(err => {
        console.error(err);
        toast.error("Failed to load quotations");
      })
      .finally(() => setLoading(false));
  };

  // --- Edit Handlers ---

  const handleEditClick = async (id: number) => {
    setIsEditOpen(true);
    setCurrentQuoteId(id);
    setIsFetchingDetail(true);

    try {
      // Fetch full details including items
      const res = await api.get(`/api/quotations/${id}/`);
      const data: QuotationDetail = res.data;

      // Populate Form
      setQuotationId(data.quotation_id);
      setSelectedCustomerId(data.customer.toString());
      setDate(data.date);
      setGstApplied(data.gst_applied);
      setGstRate(data.gst_rate);
      setNotes(data.notes || "");
      setStatus(data.status);
      
      // Map items to ensure they have correct structure
      setItems(data.items.map(item => ({
        id: item.id,
        sl_no: item.sl_no,
        description: item.description,
        price: Number(item.price)
      })));

    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch quotation details");
      setIsEditOpen(false);
    } finally {
      setIsFetchingDetail(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuoteId) return;

    setIsSubmitting(true);

    const payload = {
      quotation_id: quotationId,
      customer: selectedCustomerId,
      date: date,
      gst_applied: gstApplied,
      gst_rate: gstApplied ? gstRate : 0,
      notes: notes,
      status: status,
      items: items
    };

    try {
      await api.put(`/api/quotations/${currentQuoteId}/`, payload);
      toast.success("Quotation updated successfully!");
      setIsEditOpen(false);
      fetchQuotations(); // Refresh list
    } catch (error) {
      console.error(error);
      toast.error("Failed to update quotation");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Item Management (Same as Create) ---

  const addItem = () => {
    setItems([...items, { sl_no: items.length + 1, description: "", price: 0 }]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems.map((item, i) => ({ ...item, sl_no: i + 1 })));
  };

  const updateItem = (index: number, field: keyof QuotationItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const gstAmount = gstApplied ? (subtotal * gstRate) / 100 : 0;
  const total = subtotal + gstAmount;


  // --- UI Helpers ---

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive", className: string }> = {
      pending: { variant: "secondary", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" },
      accepted: { variant: "default", className: "bg-green-100 text-green-800 hover:bg-green-200" },
      rejected: { variant: "destructive", className: "" },
    };
    
    return (
      <Badge variant={variants[status]?.variant || "outline"} className={variants[status]?.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Quotations</h1>
            <p className="text-muted-foreground mt-1">Create and manage price quotations</p>
          </div>
          <Button className="gap-2" onClick={() => navigate("/quotations/create")}>
            <Plus className="h-4 w-4" /> New Quotation
          </Button>
        </div>

        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quote No.</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center">Loading...</TableCell></TableRow>
              ) : quotations.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center">No quotations found.</TableCell></TableRow>
              ) : (
                quotations.map((quote) => (
                    <TableRow key={quote.id}>
                    <TableCell className="font-medium">{quote.quotation_id}</TableCell>
                    <TableCell>{quote.customer_name}</TableCell>
                    <TableCell>{quote.date}</TableCell>
                    <TableCell className="font-semibold">₹{quote.total_amount}</TableCell>
                    <TableCell>{getStatusBadge(quote.status)}</TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => navigate(`/quotations/${quote.id}`)}>
                                <span className="sr-only">View</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(quote.id)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                        </div>
                    </TableCell>
                    </TableRow> 
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* --- EDIT DIALOG --- */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Quotation</DialogTitle>
              <DialogDescription>Update quotation details, status, and items.</DialogDescription>
            </DialogHeader>

            {isFetchingDetail ? (
                <div className="flex justify-center py-8"><Loader2 className="animate-spin" /></div>
            ) : (
                <form onSubmit={handleUpdate} className="space-y-4">
                    {/* Header Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Quotation ID</Label>
                            <Input value={quotationId} onChange={e => setQuotationId(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="accepted">Accepted</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Customer</Label>
                            <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                                <SelectTrigger><SelectValue placeholder="Select Customer" /></SelectTrigger>
                                <SelectContent>
                                    {customers.map(c => (
                                        <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                        </div>
                    </div>

                    {/* Items Section */}
                    <div className="border rounded-md p-4 bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-sm">Items</h4>
                            <Button type="button" variant="outline" size="sm" onClick={addItem}><Plus className="h-3 w-3 mr-1"/> Add</Button>
                        </div>
                        <div className="space-y-3">
                            {items.map((item, index) => (
                                <div key={index} className="flex gap-2 items-end">
                                    <div className="w-12">
                                        <Input value={item.sl_no} disabled className="h-8 text-xs" />
                                    </div>
                                    <div className="flex-1">
                                        <Input 
                                            value={item.description} 
                                            onChange={e => updateItem(index, "description", e.target.value)} 
                                            placeholder="Description" 
                                            className="h-8"
                                            required
                                        />
                                    </div>
                                    <div className="w-24">
                                        <Input 
                                            type="number" 
                                            value={item.price} 
                                            onChange={e => updateItem(index, "price", parseFloat(e.target.value) || 0)} 
                                            className="h-8"
                                            required
                                        />
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeItem(index)}>
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Totals & GST */}
                    <Card>
                        <CardContent className="pt-4 space-y-2">
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={gstApplied} onChange={e => setGstApplied(e.target.checked)} id="edit-gst" />
                                <Label htmlFor="edit-gst">Apply GST</Label>
                                {gstApplied && (
                                    <Input type="number" value={gstRate} onChange={e => setGstRate(parseFloat(e.target.value))} className="w-20 h-8" />
                                )}
                            </div>
                            <div className="text-right text-sm">
                                <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
                                {gstApplied && <p>GST: ₹{gstAmount.toFixed(2)}</p>}
                                <p className="font-bold text-lg">Total: ₹{total.toFixed(2)}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : "Update Quotation"}
                        </Button>
                    </div>
                </form>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
};

export default Quotations;