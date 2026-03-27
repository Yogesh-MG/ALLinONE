import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Loader2 } from "lucide-react";
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

interface QuotationItem {
  sl_no: number;
  description: string;
  price: number;
}

const QuotationCreate = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<QuotationItem[]>([
    { sl_no: 1, description: "", price: 0 },
  ]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  
  const [gstApplied, setGstApplied] = useState(false);
  const [gstRate, setGstRate] = useState(18);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch customers for the dropdown
    api.get("/api/customer/")
        .then(res => setCustomers(res.data))
        .catch(err => console.error("Error fetching customers", err));
  }, []);

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
    
    // Construct Payload matching Django Serializer
    const payload = {
        quotation_id: (form.elements.namedItem("quotationId") as HTMLInputElement).value,
        customer: selectedCustomerId,
        date: (form.elements.namedItem("date") as HTMLInputElement).value,
        gst_applied: gstApplied,
        gst_rate: gstApplied ? gstRate : 0,
        notes: (form.elements.namedItem("notes") as HTMLTextAreaElement).value,
        items: items // This nested array matches the backend Serializer logic
    };

    try {
        await api.post("/api/quotations/", payload);
        toast.success("Quotation created successfully!");
        navigate("/quotations");
    } catch (error) {
        console.error(error);
        toast.error("Failed to create quotation.");
    } finally {
        setIsSubmitting(false);
    }
  };

  // Helper to fill address/phone when customer is selected
  const selectedCustomer = customers.find(c => c.id.toString() === selectedCustomerId);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create Quotation</h1>
            <p className="text-muted-foreground mt-1">Generate a new quotation</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/quotations")}>
            Back to Quotations
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quotationId">Quotation ID *</Label>
                  <Input
                    id="quotationId"
                    name="quotationId"
                    defaultValue={`QUO-${Date.now().toString().slice(-6)}`}
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
                    {/* Read only info for visual confirmation */}
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
                    <div className="w-16">
                      <Label>Sl No.</Label>
                      <Input value={item.sl_no} disabled />
                    </div>
                    <div className="flex-1">
                      <Label>Description *</Label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(index, "description", e.target.value)}
                        required
                      />
                    </div>
                    <div className="w-32">
                      <Label>Price (₹) *</Label>
                      <Input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItem(index, "price", parseFloat(e.target.value) || 0)}
                        required
                      />
                    </div>
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        className="text-destructive"
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
              <Textarea id="notes" name="notes" placeholder="Additional notes..." rows={4} />
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end">
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                Create Quotation
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default QuotationCreate;