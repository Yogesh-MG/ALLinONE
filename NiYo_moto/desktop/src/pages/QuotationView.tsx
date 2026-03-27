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

interface QuotationItem {
  id: number;
  sl_no: number;
  description: string;
  price: string;
}

interface QuotationDetail {
  id: number;
  quotation_id: string;
  customer_name: string;
  customer_address?: string;
  customer_phone?: string;
  customer_gst?: string;
  customer_email?: string;
  date: string;
  gst_applied: boolean;
  gst_rate: string;
  notes: string;
  status: string;
  total_amount: string;
  items: QuotationItem[];
}

// --- HELPER: Number to Words (Indian Format) ---
const numberToWords = (num: number): string => {
  const a = [
    "", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ", "Ten ",
    "Eleven ", "Twelve ", "Thirteen ", "Fourteen ", "Fifteen ", "Sixteen ", "Seventeen ", "Eighteen ", "Nineteen "
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  if ((num = num.toString().length > 9 ? parseFloat(num.toString().slice(0, 9)) : num) === 0) return "Zero"; // overflow stop
  
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

const QuotationView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState<QuotationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const response = await api.get(`api/quotations/${id}/`);
        setQuotation(response.data);
      } catch (error) {
        console.error("Error fetching quotation:", error);
        toast.error("Failed to load quotation details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchQuotation();
  }, [id]);

  const handlePrint = () => window.print();

  const handleEmail = () => {
    if (!quotation) return;
    const subject = `Quotation: ${quotation.quotation_id} from ${COMPANY_NAME}`;
    const body = `Dear ${quotation.customer_name},\n\nPlease find the details for quotation ${quotation.quotation_id}.\nTotal Amount: ₹${quotation.total_amount}\n\nRegards,\n${COMPANY_NAME}`;
    window.location.href = `mailto:${quotation.customer_email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!quotation) return <div>Not Found</div>;

  const subtotal = quotation.items.reduce((sum, item) => sum + parseFloat(item.price), 0);
  const gstAmount = quotation.gst_applied ? (subtotal * parseFloat(quotation.gst_rate)) / 100 : 0;
  const grandTotal = parseFloat(quotation.total_amount);
  const amountInWords = numberToWords(Math.round(grandTotal));

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 print:p-0 print:bg-white">
      {/* Action Bar */}
      <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center print:hidden">
        <Button variant="outline" onClick={() => navigate("/quotations")} className="gap-2">
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
        <div className="p-[15mm] flex flex-col h-full relative">
          
          {/* 1. Header (Centered Company Info) */}
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
              <h2 className="text-xl font-bold underline decoration-2 underline-offset-4">QUOTATION</h2>
              <div className="print:hidden">
                <Badge variant={quotation.status === 'accepted' ? 'default' : 'secondary'}>
                    {quotation.status.toUpperCase()}
                </Badge>
              </div>
          </div>

          {/* 2. Customer & Quote Details (Side by Side) */}
          <div className="flex border border-black mb-6">
             {/* Left: Bill To */}
             <div className="w-1/2 p-3 border-r border-black">
                <h3 className="font-bold text-sm underline mb-2">BILL TO:</h3>
                <p className="font-bold text-lg">{quotation.customer_name}</p>
                {quotation.customer_address && (
                    <p className="text-sm whitespace-pre-line">{quotation.customer_address}</p>
                )}
                {quotation.customer_gst &&<p className="text-sm mt-1">GSTIN: {quotation.customer_gst}</p>}
                {quotation.customer_phone &&<p className="text-sm mt-1">Ph: {quotation.customer_phone}</p>}
             </div>

             {/* Right: Quote Details */}
             <div className="w-1/2 p-3">
                <div className="grid grid-cols-[100px_1fr] gap-y-1 text-sm">
                    <span className="font-bold">Quote No:</span>
                    <span className="font-mono font-bold">{quotation.quotation_id}</span>
                    
                    <span className="font-bold">Date:</span>
                    <span>{quotation.date}</span>
                    
                    <span className="font-bold">Valid Until:</span>
                    <span>1 year*</span>
                </div>
             </div>
          </div>

          {/* 3. Description Box (Table with Borders) */}
          <div className="flex-grow mb-4">
            <table className="w-full border-collapse border border-black text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black px-2 py-2 w-12 text-center">Sl.</th>
                  <th className="border border-black px-2 py-2 text-left">Description</th>
                  <th className="border border-black px-2 py-2 w-32 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {quotation.items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="border border-black px-2 py-2 text-center align-top">{index + 1}</td>
                    <td className="border border-black px-2 py-2 align-top whitespace-pre-wrap">{item.description}</td>
                    <td className="border border-black px-2 py-2 text-right align-top">
                      {parseFloat(item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
                
                {/* Empty rows filler to maintain box height if needed, optional */}
                {quotation.items.length < 5 && Array.from({ length: 5 - quotation.items.length }).map((_, i) => (
                    <tr key={`empty-${i}`}>
                        <td className="border border-black px-2 py-4"></td>
                        <td className="border border-black px-2 py-4"></td>
                        <td className="border border-black px-2 py-4"></td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 4. Totals & Amount in Words */}
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
                    {quotation.gst_applied && (
                        <div className="flex justify-between px-2 py-1 border-t border-dotted border-gray-400">
                            <span className="text-sm">GST ({parseFloat(quotation.gst_rate)}%):</span>
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

          {/* 5. Footer: Terms & Signatures */}
          <div className="mt-auto">
             {quotation.notes && (
                <div className="mb-8 text-xs">
                    <p className="font-bold underline mb-1">Terms & Conditions:</p>
                    <p className="whitespace-pre-wrap text-gray-700">{quotation.notes}</p>
                </div>
             )}

             <div className="flex justify-between items-end mt-12 mb-4">
                <div className="text-center">
                    <div className="w-40 border-b border-black mb-1"></div>
                    <p className="font-bold text-sm">Customer Signature</p>
                </div>
                <div className="text-center">
                    <div className="h-12 mb-1">
                        {/* Space for Digital Stamp/Sig if needed */}
                    </div>
                    <div className="w-40 border-b border-black mb-1"></div>
                    <p className="font-bold text-sm">Authorized Signatory</p>
                    <p className="text-xs">{COMPANY_NAME}</p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default QuotationView;