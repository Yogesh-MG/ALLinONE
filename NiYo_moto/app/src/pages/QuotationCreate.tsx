import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface QuotationItem {
  slno: number;
  description: string;
  price: number;
}

const QuotationCreate = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<QuotationItem[]>([
    { slno: 1, description: "", price: 0 },
  ]);
  const [gstApplied, setGstApplied] = useState(false);
  const [gstRate, setGstRate] = useState(18);
  const [showPDFPreview, setShowPDFPreview] = useState(false);

  const addItem = () => {
    setItems([...items, { slno: items.length + 1, description: "", price: 0 }]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems.map((item, i) => ({ ...item, slno: i + 1 })));
  };

  const updateItem = (index: number, field: keyof QuotationItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const gstAmount = gstApplied ? (subtotal * gstRate) / 100 : 0;
  const total = subtotal + gstAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Quotation created successfully!");
    navigate("/quotations");
  };

  const handlePreview = () => {
    setShowPDFPreview(true);
  };

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
                    placeholder="QUO-001"
                    defaultValue={`QUO-${Date.now().toString().slice(-6)}`}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input id="customerName" placeholder="Customer name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Customer address" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" placeholder="+91 xxxxx xxxxx" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
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
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.slno} className="flex gap-4 items-end">
                    <div className="w-16">
                      <Label>Sl No.</Label>
                      <Input value={item.slno} disabled />
                    </div>
                    <div className="flex-1">
                      <Label>Description *</Label>
                      <Input
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) => updateItem(index, "description", e.target.value)}
                        required
                      />
                    </div>
                    <div className="w-32">
                      <Label>Price (₹) *</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={item.price || ""}
                        onChange={(e) =>
                          updateItem(index, "price", parseFloat(e.target.value) || 0)
                        }
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
            <CardHeader>
              <CardTitle>Total</CardTitle>
            </CardHeader>
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
                    <Label htmlFor="gstRate">Rate (%):</Label>
                    <Input
                      id="gstRate"
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
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Additional notes or terms and conditions..."
                rows={4}
              />
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={handlePreview}>
              <FileText className="h-4 w-4 mr-2" />
              Preview PDF
            </Button>
            <Button type="submit">Create Quotation</Button>
          </div>
        </form>
      </div>

      {/* PDF Preview Dialog */}
      <Dialog open={showPDFPreview} onOpenChange={setShowPDFPreview}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Quotation Preview</DialogTitle>
          </DialogHeader>
          <div className="bg-white text-black p-8 space-y-6 overflow-y-auto max-h-[70vh]">
            <div className="text-center border-b pb-4">
              <h1 className="text-3xl font-bold">NiYo Invoicing</h1>
              <p className="text-sm text-gray-600">Motor Rewinding Specialists</p>
            </div>

            <div className="flex justify-between">
              <div>
                <h2 className="font-bold text-lg mb-2">QUOTATION</h2>
                <p>
                  <strong>Quote No:</strong> QUO-{Date.now().toString().slice(-6)}
                </p>
                <p>
                  <strong>Date:</strong> {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <h3 className="font-bold">To:</h3>
                <p>[Customer Name]</p>
                <p>[Address]</p>
                <p>[Phone]</p>
                <p>[Email]</p>
              </div>
            </div>

            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 p-2 text-left">Sl No.</th>
                  <th className="border border-gray-300 p-2 text-left">Description</th>
                  <th className="border border-gray-300 p-2 text-right">Price (₹)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.slno}>
                    <td className="border border-gray-300 p-2">{item.slno}</td>
                    <td className="border border-gray-300 p-2">{item.description || "-"}</td>
                    <td className="border border-gray-300 p-2 text-right">
                      {item.price.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right space-y-1">
              <p>
                <strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}
              </p>
              {gstApplied && (
                <p>
                  <strong>GST ({gstRate}%):</strong> ₹{gstAmount.toFixed(2)}
                </p>
              )}
              <p className="text-xl font-bold border-t pt-2">
                <strong>Total:</strong> ₹{total.toFixed(2)}
              </p>
            </div>

            <div className="text-center text-sm text-gray-600 border-t pt-4">
              <p>Thank you for your business!</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default QuotationCreate;
