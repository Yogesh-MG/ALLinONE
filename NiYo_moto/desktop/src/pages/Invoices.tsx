import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Printer, Mail, Eye, Edit, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/utils/api";
import { useNavigate } from "react-router-dom";

// Interfaces mirroring backend structure
interface InvoiceItem {
  id?: number;
  sl_no: number;
  description: string;
  quantity: number;
  rate: number;
  price: number;
}

interface InvoiceDetail {
  id: number;
  invoice_id: string;
  customer: number;
  date: string;
  status: string;
  final_amount: string;
  notes: string;
  gst_applied: boolean;
  gst_rate: string;
  items: InvoiceItem[];
}

const Invoices = () => {
  const [viewInvoice, setViewInvoice] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Edit State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentInvoiceId, setCurrentInvoiceId] = useState<number | null>(null);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);

  // Form State
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [date, setDate] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("pending");
  const [gstApplied, setGstApplied] = useState(false);
  const [gstRate, setGstRate] = useState(18);

  useEffect(() => {
    fetchInvoices();
    // Fetch customers for edit dropdown
    api.get("api/customer/").then(res => setCustomers(res.data)).catch(console.error);
  }, []);

  const fetchInvoices = () => {
    setLoading(true);
    api.get("api/invoices/")
        .then(res => setInvoices(res.data))
        .catch(err => {
            console.error(err);
            toast.error("Failed to load invoices");
        })
        .finally(() => setLoading(false));
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" }> = {
      paid: { variant: "default" },
      pending: { variant: "secondary" },
      overdue: { variant: "destructive" },
    };
    return (
      <Badge variant={variants[status]?.variant || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // --- Edit Handlers ---

  const handleEditClick = async (id: number) => {
    setIsEditOpen(true);
    setCurrentInvoiceId(id);
    setIsFetchingDetail(true);

    try {
      const res = await api.get(`/api/invoices/${id}/`);
      const data: InvoiceDetail = res.data;

      setInvoiceId(data.invoice_id);
      setSelectedCustomerId(data.customer.toString());
      setDate(data.date);
      setStatus(data.status);
      setNotes(data.notes || "");
      setGstApplied(data.gst_applied);
      setGstRate(parseFloat(data.gst_rate) || 18);

      // Populate items
      if (data.items && data.items.length > 0) {
        setItems(data.items.map(item => ({
          id: item.id,
          sl_no: item.sl_no,
          description: item.description,
          quantity: item.quantity,
          rate: Number(item.rate),
          price: Number(item.price)
        })));
      } else {
        setItems([]);
      }

    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch invoice details");
      setIsEditOpen(false);
    } finally {
      setIsFetchingDetail(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInvoiceId) return;

    setIsSubmitting(true);

    const subtotal = items.reduce((sum, item) => sum + (item.price || 0), 0);
    const gstAmount = gstApplied ? (subtotal * gstRate) / 100 : 0;
    const total = subtotal + gstAmount;

    const payload = {
      invoice_id: invoiceId,
      customer: selectedCustomerId,
      date: date,
      status: status,
      notes: notes,
      gst_applied: gstApplied,
      gst_rate: gstApplied ? gstRate : 0,
      final_amount: total,
      items: items
    };

    try {
      await api.put(`/api/invoices/${currentInvoiceId}/`, payload);
      toast.success("Invoice updated successfully!");
      setIsEditOpen(false);
      fetchInvoices();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Item Management ---

  const addItem = () => {
    setItems([...items, { sl_no: items.length + 1, description: "", quantity: 1, rate: 0, price: 0 }]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems.map((item, i) => ({ ...item, sl_no: i + 1 })));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    const item = { ...newItems[index], [field]: value };

    if (field === "quantity" || field === "rate") {
        const qty = field === "quantity" ? parseFloat(value) || 0 : item.quantity;
        const rate = field === "rate" ? parseFloat(value) || 0 : item.rate;
        item.price = qty * rate;
    }

    newItems[index] = item;
    setItems(newItems);
  };

  // Calculations for Edit Modal
  const editSubtotal = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const editGstAmount = gstApplied ? (editSubtotal * gstRate) / 100 : 0;
  const editTotal = editSubtotal + editGstAmount;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
            <p className="text-muted-foreground mt-1">Manage and track your invoices</p>
          </div>
          <Button className="gap-2" onClick={() => navigate("/invoices/create")}><Plus className="h-4 w-4" /> New Invoice</Button>
        </div>

        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice No.</TableHead>
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
              ) : invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoice_id}</TableCell>
                  <TableCell>{invoice.customer_name}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell className="font-semibold">₹{invoice.final_amount}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => navigate(`/invoices/${invoice.id}`)}>
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(invoice.id)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* --- EDIT INVOICE DIALOG --- */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Invoice</DialogTitle>
                    <DialogDescription>Update invoice details, items, and status.</DialogDescription>
                </DialogHeader>

                {isFetchingDetail ? (
                    <div className="flex justify-center py-8"><Loader2 className="animate-spin" /></div>
                ) : (
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Invoice ID</Label>
                                <Input value={invoiceId} onChange={e => setInvoiceId(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="paid">Paid</SelectItem>
                                        <SelectItem value="overdue">Overdue</SelectItem>
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

                        {/* Items Editor */}
                        <div className="border rounded-md p-4 bg-slate-50 dark:bg-slate-900/50">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-semibold text-sm">Items</h4>
                                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                                    <Plus className="h-3 w-3 mr-1"/> Add Item
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {items.map((item, index) => (
                                    <div key={index} className="flex gap-2 items-end">
                                        <div className="flex-1">
                                            <Label className="text-xs">Description</Label>
                                            <Input 
                                                value={item.description} 
                                                onChange={e => updateItem(index, "description", e.target.value)} 
                                                className="h-8"
                                            />
                                        </div>
                                        <div className="w-20">
                                            <Label className="text-xs">Qty</Label>
                                            <Input 
                                                type="number" 
                                                value={item.quantity} 
                                                onChange={e => updateItem(index, "quantity", e.target.value)} 
                                                className="h-8"
                                            />
                                        </div>
                                        <div className="w-24">
                                            <Label className="text-xs">Rate</Label>
                                            <Input 
                                                type="number" 
                                                value={item.rate} 
                                                onChange={e => updateItem(index, "rate", e.target.value)} 
                                                className="h-8"
                                            />
                                        </div>
                                        <div className="w-28">
                                            <Label className="text-xs">Amount</Label>
                                            <Input 
                                                type="number" 
                                                value={item.price} 
                                                readOnly
                                                className="h-8 bg-muted"
                                            />
                                        </div>
                                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 mt-4 text-destructive" onClick={() => removeItem(index)}>
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
                                <div className="text-right text-sm space-y-1">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>₹{editSubtotal.toFixed(2)}</span>
                                    </div>
                                    {gstApplied && (
                                        <div className="flex justify-between">
                                            <span>GST ({gstRate}%):</span>
                                            <span>₹{editGstAmount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-bold text-lg border-t pt-1">
                                        <span>Total:</span>
                                        <span>₹{editTotal.toFixed(2)}</span>
                                    </div>
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
                                {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : "Update Invoice"}
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

export default Invoices;