import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/utils/api";

interface InvoiceItem {
  sl_no: number;
  description: string;
  quantity: number;
  rate: number;
  price: number; // This acts as the Total Amount (Qty * Rate)
}

const InvoiceCreate = () => {
  const navigate = useNavigate();
  // Initialize with quantity 1 and rate 0
  const [items, setItems] = useState<InvoiceItem[]>([
    { sl_no: 1, description: "", quantity: 1, rate: 0, price: 0 },
  ]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [quotations, setQuotations] = useState<any[]>([]); // State for quotations list
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [selectedQuotationId, setSelectedQuotationId] = useState<string>(""); // State for selected quotation
  
  const [gstApplied, setGstApplied] = useState(false);
  const [gstRate, setGstRate] = useState(18);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch customers
    api.get("/api/customer/")
        .then(res => setCustomers(res.data))
        .catch(err => console.error("Error fetching customers", err));

    // Fetch quotations for the "Copy from" dropdown
    api.get("/api/quotations/")
        .then(res => setQuotations(res.data))
        .catch(err => console.error("Error fetching quotations", err));
  }, []);

  const handleQuotationSelect = async (quoteId: string) => {
    setSelectedQuotationId(quoteId);
    if (!quoteId) return;

    try {
        const loadingToast = toast.loading("Fetching quotation details...");
        const res = await api.get(`/api/quotations/${quoteId}/`);
        const quoteData = res.data;
        
        toast.dismiss(loadingToast);
        toast.success("Data loaded from Quotation!");

        // 1. Set Customer
        if (quoteData.customer) {
            setSelectedCustomerId(quoteData.customer.toString());
        }

        // 2. Map Items (Quotation Price -> Invoice Rate)
        if (quoteData.items && quoteData.items.length > 0) {
            const mappedItems: InvoiceItem[] = quoteData.items.map((qItem: any, index: number) => ({
                sl_no: index + 1,
                description: qItem.description,
                quantity: 1, // Default to 1
                rate: parseFloat(qItem.price), // Use Quotation price as Rate
                price: parseFloat(qItem.price) // 1 * Rate
            }));
            setItems(mappedItems);
        }

        // 3. Set GST & Notes
        setGstApplied(quoteData.gst_applied);
        setGstRate(parseFloat(quoteData.gst_rate) || 18);
        
        // Append to notes or overwrite? Let's append if user already typed something, else overwrite
        const noteField = document.getElementById("notes") as HTMLTextAreaElement;
        if (noteField) {
            noteField.value = quoteData.notes || "";
        }

    } catch (error) {
        console.error("Error fetching quotation details", error);
        toast.error("Failed to fetch quotation data");
    }
  };

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

    // Auto-calculate Amount (price) if Quantity or Rate changes
    if (field === "quantity" || field === "rate") {
        const qty = field === "quantity" ? parseFloat(value) || 0 : item.quantity;
        const rate = field === "rate" ? parseFloat(value) || 0 : item.rate;
        item.price = qty * rate;
    }

    newItems[index] = item;
    setItems(newItems);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const gstAmount = gstApplied ? (subtotal * gstRate) / 100 : 0;
  const total = subtotal + gstAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCustomerId) {
        toast.error("Please select a customer");
        return;
    }

    setIsSubmitting(true);
    const form = e.target as HTMLFormElement;
    
    const payload = {
        invoice_id: (form.elements.namedItem("invoiceId") as HTMLInputElement).value,
        customer: selectedCustomerId,
        date: (form.elements.namedItem("date") as HTMLInputElement).value,
        status: "pending", 
        final_amount: total,
        gst_applied: gstApplied,
        gst_rate: gstApplied ? gstRate : 0,
        notes: (form.elements.namedItem("notes") as HTMLTextAreaElement).value,
        items: items 
    };

    try {
        await api.post("/api/invoices/", payload);
        toast.success("Invoice created successfully!");
        navigate("/invoices");
    } catch (error) {
        console.error(error);
        toast.error("Failed to create invoice.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const selectedCustomer = customers.find(c => c.id.toString() === selectedCustomerId);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create Invoice</h1>
            <p className="text-muted-foreground mt-1">Generate a new invoice</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/invoices")}>
            Back to Invoices
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* QUOTATION SELECTOR */}
          <Card className="bg-muted/50 border-dashed">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Copy details from Quotation (Optional)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4 items-end">
                    <div className="w-full max-w-md">
                        <Label className="mb-2 block text-xs">Select Quotation</Label>
                        <Select value={selectedQuotationId} onValueChange={handleQuotationSelect}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a quotation to autofill..." />
                            </SelectTrigger>
                            <SelectContent>
                                {quotations.map(q => (
                                    <SelectItem key={q.id} value={q.id.toString()}>
                                        {q.quotation_id} - {q.customer_name} (₹{q.total_amount})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoiceId">Invoice ID *</Label>
                  <Input
                    id="invoiceId"
                    name="invoiceId"
                    defaultValue={`INV-${Date.now().toString().slice(-6)}`}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer *</Label>
                  <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId} required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Customer" />
                    </SelectTrigger>
                    <SelectContent>
                        {customers.map(c => (
                            <SelectItem key={c.id} value={c.id.toString()}>
                                {c.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input value={selectedCustomer?.phone_number || ""} disabled placeholder="Auto-filled" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Items</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-4 items-end">
                    <div className="w-12">
                      <Label>Sl.</Label>
                      <Input value={item.sl_no} disabled className="text-center" />
                    </div>
                    <div className="flex-1">
                      <Label>Description *</Label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(index, "description", e.target.value)}
                        required
                      />
                    </div>
                    <div className="w-24">
                        <Label>Qty *</Label>
                        <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, "quantity", e.target.value)}
                            required
                        />
                    </div>
                    <div className="w-32">
                        <Label>Rate (₹) *</Label>
                        <Input
                            type="number"
                            value={item.rate}
                            onChange={(e) => updateItem(index, "rate", e.target.value)}
                            required
                        />
                    </div>
                    <div className="w-32">
                      <Label>Amount (₹)</Label>
                      <Input
                        type="number"
                        value={item.price}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        className="text-destructive mb-0.5"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Total</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id="gst"
                  checked={gstApplied}
                  onChange={(e) => setGstApplied(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="gst">Apply GST</Label>
                {gstApplied && (
                  <div className="flex items-center gap-2">
                    <Label>Rate (%):</Label>
                    <Input
                      type="number"
                      value={gstRate}
                      onChange={(e) => setGstRate(parseFloat(e.target.value) || 0)}
                      className="w-20"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2 text-right">
                <div className="flex justify-between text-lg">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                {gstApplied && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST ({gstRate}%):</span>
                    <span className="font-semibold">₹{gstAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-2xl font-bold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-primary">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
            <CardContent>
              <Textarea id="notes" name="notes" placeholder="Payment terms, bank details..." rows={4} />
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end">
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                Create Invoice
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default InvoiceCreate;