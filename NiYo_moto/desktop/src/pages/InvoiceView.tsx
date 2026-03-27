import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Printer, Mail, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import api from "@/utils/api";

// --- ENV VARS ---
const COMPANY_NAME = import.meta.env.VITE_COMPANY_NAME || "NiYo Motor Windings";
const COMPANY_ADDRESS = import.meta.env.VITE_COMPANY_ADDRESS || "123 Workshop Street, Industrial Area, Bengaluru - 560001";
const COMPANY_PHONE = import.meta.env.VITE_COMPANY_PHONE || "+91 98765 43210";
const COMPANY_GSTIN = import.meta.env.VITE_COMPANY_GSTIN || "29AAAAA0000A1Z5";

interface InvoiceItem {
  id: number;
  sl_no: number;
  description: string;
  quantity?: number; // Added Quantity
  rate?: string;     // Added Rate
  price: string;     // Total Amount
}

interface InvoiceDetail {
  id: number;
  invoice_id: string;
  customer_name: string;
  customer_address?: string;
  customer_phone?: string;
  customer_email?: string;
  customer_gst?: string;
  date: string;
  status: string;
  final_amount: string; // The total amount
  items?: InvoiceItem[]; // Optional if backend supports it
  notes?: string;
  gst_applied?: boolean; // If metadata supported
  gst_rate?: string;
}

// --- HELPER: Number to Words ---
const numberToWords = (num: number): string => {
  const a = [
    "", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ", "Ten ",
    "Eleven ", "Twelve ", "Thirteen ", "Fourteen ", "Fifteen ", "Sixteen ", "Seventeen ", "Eighteen ", "Nineteen "
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  if ((num = num.toString().length > 9 ? parseFloat(num.toString().slice(0, 9)) : num) === 0) return "Zero";
  
  const n = ("000000000" + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return "";

  let str = "";
  str += (Number(n[1]) !== 0) ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + "Crore " : "";
  str += (Number(n[2]) !== 0) ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + "Lakh " : "";
  str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + "Thousand " : "";
  str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + "Hundred " : "";
  str += (Number(n[5]) !== 0) ? ((str !== "") ? "and " : "") + (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]]) : "";

  return str.trim();
};

const InvoiceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await api.get(`/api/invoices/${id}/`);
        setInvoice(response.data);
      } catch (error) {
        console.error("Error fetching invoice:", error);
        toast.error("Failed to load invoice details.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchInvoice();
  }, [id]);

  const handlePrint = () => window.print();

  const handleEmail = () => {
    if (!invoice) return;
    const subject = `Invoice: ${invoice.invoice_id} from ${COMPANY_NAME}`;
    const body = `Dear ${invoice.customer_name},\n\nPlease find attached the invoice ${invoice.invoice_id}.\nTotal Amount: ₹${invoice.final_amount}\n\nRegards,\n${COMPANY_NAME}`;
    window.location.href = `mailto:${invoice.customer_email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!invoice) return <div>Not Found</div>;

  // Calculation Logic
  const items = invoice.items || [];
  const grandTotal = parseFloat(invoice.final_amount);
  
  // Calculate Subtotal
  let subtotal = 0;
  if (items.length > 0) {
    subtotal = items.reduce((sum, item) => sum + parseFloat(item.price), 0);
  } else {
    // Fallback manual calc
    if (invoice.gst_applied && invoice.gst_rate) {
       subtotal = grandTotal / (1 + (parseFloat(invoice.gst_rate) / 100));
    } else {
       subtotal = grandTotal;
    }
  }

  // Calculate GST Amount
  const gstRate = invoice.gst_applied ? parseFloat(invoice.gst_rate || "0") : 0;
  const gstAmount = invoice.gst_applied ? (subtotal * gstRate) / 100 : 0;

  const amountInWords = numberToWords(Math.round(grandTotal));

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 print:p-0 print:bg-white">
      {/* Action Bar */}
      <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center print:hidden">
        <Button variant="outline" onClick={() => navigate("/invoices")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/email-interface")} className="gap-2">
            <Mail className="h-4 w-4" /> Email
          </Button>
          <Button onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" /> Print
          </Button>
        </div>
      </div>

      {/* A4 Paper */}
      <div className="max-w-[210mm] mx-auto bg-white shadow-xl min-h-[297mm] print:shadow-none print:w-full print:m-0 box-border">
        {/* Changed h-full to min-h-[297mm] to allow expansion */}
        <div className="p-[15mm] flex flex-col min-h-[297mm] relative">
          
          {/* 1. Header */}
          <div className="text-center border-b-2 border-black pb-4 mb-4">
            <h1 className="text-3xl font-bold uppercase tracking-wide">{COMPANY_NAME}</h1>
            <p className="text-sm font-semibold mt-1">{COMPANY_ADDRESS}</p>
            <div className="flex justify-center gap-4 text-sm mt-1 font-medium">
                <span>Ph: {COMPANY_PHONE}</span>
                <span>|</span>
                <span>GSTIN: {COMPANY_GSTIN}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold underline decoration-2 underline-offset-4">TAX INVOICE</h2>
              <div className="print:hidden">
                <Badge variant={invoice.status === 'paid' ? 'default' : invoice.status === 'overdue' ? 'destructive' : 'secondary'}>
                    {invoice.status.toUpperCase()}
                </Badge>
              </div>
          </div>

          {/* 2. Customer & Invoice Details */}
          <div className="flex border border-black mb-6">
             <div className="w-1/2 p-3 border-r border-black">
                <h3 className="font-bold text-sm underline mb-2">BILL TO:</h3>
                <p className="font-bold text-lg">{invoice.customer_name}</p>
                {invoice.customer_address && (
                    <p className="text-sm whitespace-pre-line">{invoice.customer_address}</p>
                )}
                {invoice.customer_gst && <p className="text-sm mt-1">GSTIN: {invoice.customer_gst}</p>}
                {invoice.customer_phone && <p className="text-sm mt-1">Ph: {invoice.customer_phone}</p>}
             </div>

             <div className="w-1/2 p-3">
                <div className="grid grid-cols-[100px_1fr] gap-y-1 text-sm">
                    <span className="font-bold">Invoice No:</span>
                    <span className="font-mono font-bold">{invoice.invoice_id}</span>
                    
                    <span className="font-bold">Date:</span>
                    <span>{invoice.date}</span>
                </div>
             </div>
          </div>

          {/* 3. Items Table */}
          <div className="flex-grow mb-4">
            <table className="w-full border-collapse border border-black text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black px-2 py-2 w-10 text-center">Sl.</th>
                  <th className="border border-black px-2 py-2 text-left">Description</th>
                  <th className="border border-black px-2 py-2 w-16 text-center">Qty</th>
                  <th className="border border-black px-2 py-2 w-24 text-right">Rate</th>
                  <th className="border border-black px-2 py-2 w-32 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? items.map((item, index) => (
                  <tr key={item.id || index}>
                    <td className="border border-black px-2 py-2 text-center align-top">{index + 1}</td>
                    <td className="border border-black px-2 py-2 align-top">{item.description}</td>
                    <td className="border border-black px-2 py-2 text-center align-top">
                        {item.quantity || "-"}
                    </td>
                    <td className="border border-black px-2 py-2 text-right align-top">
                        {item.rate ? parseFloat(item.rate).toFixed(2) : "-"}
                    </td>
                    <td className="border border-black px-2 py-2 text-right align-top">
                      {parseFloat(item.price).toFixed(2)}
                    </td>
                  </tr>
                )) : (
                    <tr>
                        <td className="border border-black px-2 py-4 text-center">1</td>
                        <td className="border border-black px-2 py-4">Total Bill Amount</td>
                        <td className="border border-black px-2 py-4 text-center">-</td>
                        <td className="border border-black px-2 py-4 text-right">-</td>
                        <td className="border border-black px-2 py-4 text-right">{grandTotal.toFixed(2)}</td>
                    </tr>
                )}
                
                {/* Filler Rows - Only show if not overflowing */}
                {items.length < 5 && items.length > 0 && Array.from({ length: 5 - items.length }).map((_, i) => (
                    <tr key={`empty-${i}`}>
                        <td className="border border-black px-2 py-4"></td>
                        <td className="border border-black px-2 py-4"></td>
                        <td className="border border-black px-2 py-4"></td>
                        <td className="border border-black px-2 py-4"></td>
                        <td className="border border-black px-2 py-4"></td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FOOTER BLOCK (Totals + Signatures) 
             'break-inside-avoid' forces this whole block to move to the next page 
             if it doesn't fit on the current one.
          */}
         
              {/* 4. Totals */}
              <div className="flex flex-col border border-black mb-8 p-0">
                 <div className="flex border-b border-black">
                    <div className="flex-1 p-2 border-r border-black flex items-center">
                        <span className="font-bold text-sm mr-2">Amount in Words:</span>
                        <span className="italic text-sm capitalize">
                            {amountInWords} Rupees Only
                        </span>
                    </div>
                    <div className="w-64">
                        <div className="flex justify-between px-2 py-1">
                            <span className="text-sm">Subtotal:</span>
                            <span className="font-bold">₹{subtotal.toFixed(2)}</span>
                        </div>
                        {invoice.gst_applied && (
                            <div className="flex justify-between px-2 py-1 border-t border-dotted border-gray-400">
                                <span className="text-sm">GST ({gstRate}%):</span>
                                <span>₹{gstAmount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between px-2 py-2 border-t border-black bg-gray-100">
                            <span className="font-bold text-base">Grand Total:</span>
                            <span className="font-bold text-base">₹{grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                 </div>
              </div>

              {/* 5. Footer / Signatures */}
         
              <div>
                 {invoice.notes && (
                    <div className="mb-8 text-xs">
                        <p className="font-bold underline mb-1">Notes / Terms:</p>
                        <p className="whitespace-pre-wrap text-gray-700">{invoice.notes}</p>
                    </div>
                 )}
            <div className="break-inside-avoid mt-auto">
                 <div className="flex justify-between items-end mt-12 mb-4">
                    <div className="text-center">
                        <div className="w-40 border-b border-black mb-1"></div>
                        <p className="font-bold text-sm">Receiver's Signature</p>
                    </div>
                    <div className="text-center">
                        <div className="h-12 mb-1"></div>
                        <div className="w-40 border-b border-black mb-1"></div>
                        <p className="font-bold text-sm">For {COMPANY_NAME}</p>
                        <p className="text-xs">Authorized Signatory</p>
                    </div>
                 </div>
                 
                 <div className="text-center text-sm font-semibold border-t border-gray-300 pt-2">
                    <p>“Thank you for doing business with us!”</p>
                 </div>
              </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InvoiceView;