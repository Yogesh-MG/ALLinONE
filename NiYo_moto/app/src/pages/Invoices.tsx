import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Printer, Mail, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Invoices = () => {
  const [viewInvoice, setViewInvoice] = useState<any>(null);

  const invoices = [
    { id: "INV-001", customer: "ABC Motors", date: "2024-01-15", total: "₹15,000", status: "paid" },
    { id: "INV-002", customer: "XYZ Industries", date: "2024-01-14", total: "₹28,500", status: "pending" },
    { id: "INV-003", customer: "Modern Engineering", date: "2024-01-13", total: "₹42,000", status: "paid" },
    { id: "INV-004", customer: "Tech Solutions", date: "2024-01-12", total: "₹19,800", status: "overdue" },
    { id: "INV-005", customer: "Global Motors", date: "2024-01-11", total: "₹31,200", status: "pending" },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive", className: string }> = {
      paid: { variant: "default", className: "bg-success hover:bg-success/90" },
      pending: { variant: "secondary", className: "bg-warning hover:bg-warning/90" },
      overdue: { variant: "destructive", className: "" },
    };
    
    return (
      <Badge variant={variants[status].variant} className={variants[status].className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handlePrint = (invoice: any) => {
    toast.success("Opening print dialog...");
    window.print();
  };

  const handleEmail = (invoice: any) => {
    toast.success(`Email sent to ${invoice.customer}!`);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
            <p className="text-muted-foreground mt-1">Manage and track your invoices</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Invoice
          </Button>
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
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.customer}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell className="font-semibold">{invoice.total}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setViewInvoice(invoice)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handlePrint(invoice)}>
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEmail(invoice)}>
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Invoice View Dialog */}
      <Dialog open={!!viewInvoice} onOpenChange={() => setViewInvoice(null)}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>
          {viewInvoice && (
            <div className="bg-white text-black p-8 space-y-6 overflow-y-auto max-h-[70vh]">
              <div className="text-center border-b pb-4">
                <h1 className="text-3xl font-bold">NiYo Invoicing</h1>
                <p className="text-sm text-gray-600">Motor Rewinding Specialists</p>
                <p className="text-sm text-gray-600">123 Workshop Street, City, PIN</p>
                <p className="text-sm text-gray-600">Phone: +91 12345 67890 | GSTIN: 29XXXXX1234X1Z5</p>
              </div>

              <div className="flex justify-between">
                <div>
                  <h2 className="font-bold text-lg mb-2">INVOICE</h2>
                  <p><strong>Invoice No:</strong> {viewInvoice.id}</p>
                  <p><strong>Date:</strong> {viewInvoice.date}</p>
                  <p><strong>Status:</strong> {viewInvoice.status.toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <h3 className="font-bold mb-2">Bill To:</h3>
                  <p className="font-semibold">{viewInvoice.customer}</p>
                  <p className="text-sm text-gray-600">Customer Address Line 1</p>
                  <p className="text-sm text-gray-600">Customer Address Line 2</p>
                  <p className="text-sm text-gray-600">Phone: +91 98765 43210</p>
                </div>
              </div>

              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 p-2 text-left">Sl No.</th>
                    <th className="border border-gray-300 p-2 text-left">Description</th>
                    <th className="border border-gray-300 p-2 text-right">Quantity</th>
                    <th className="border border-gray-300 p-2 text-right">Rate (₹)</th>
                    <th className="border border-gray-300 p-2 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">1</td>
                    <td className="border border-gray-300 p-2">Motor Rewinding - 5HP</td>
                    <td className="border border-gray-300 p-2 text-right">1</td>
                    <td className="border border-gray-300 p-2 text-right">{viewInvoice.total}</td>
                    <td className="border border-gray-300 p-2 text-right">{viewInvoice.total}</td>
                  </tr>
                </tbody>
              </table>

              <div className="text-right space-y-1">
                <p><strong>Subtotal:</strong> {viewInvoice.total}</p>
                <p><strong>GST (18%):</strong> ₹{(parseFloat(viewInvoice.total.replace('₹', '').replace(',', '')) * 0.18).toFixed(2)}</p>
                <p className="text-xl font-bold border-t pt-2">
                  <strong>Total:</strong> {viewInvoice.total}
                </p>
              </div>

              <div className="text-sm text-gray-600 border-t pt-4">
                <p><strong>Terms & Conditions:</strong></p>
                <p>1. Payment due within 30 days</p>
                <p>2. Warranty: 6 months on workmanship</p>
                <p className="mt-4 text-center">Thank you for your business!</p>
              </div>

              <div className="flex gap-3 justify-end border-t pt-4">
                <Button variant="outline" onClick={() => handlePrint(viewInvoice)}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" onClick={() => handleEmail(viewInvoice)}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button onClick={() => setViewInvoice(null)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Invoices;
