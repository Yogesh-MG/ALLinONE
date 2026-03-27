import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// ✅ Works perfectly with Electron's file system
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Quotations from "./pages/Quotations";
import QuotationCreate from "./pages/QuotationCreate";
import Invoices from "./pages/Invoices";
import MotorLibrary from "./pages/MotorLibrary";
import IncomingGoods from "./pages/IncomingGoods";
import Reports from "./pages/Reports";
import QuotationView from "./pages/QuotationView";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import InvoiceCreate from "./pages/InvoiceCreate";
import InvoiceView from "./pages/InvoiceView";
import EmailInterface from "./pages/EmailInterface";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/quotations" element={<Quotations />} />
          <Route path="/quotations/create" element={<QuotationCreate />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/motor-library" element={<MotorLibrary />} />
          <Route path="/incoming-goods" element={<IncomingGoods />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/quotations/:id" element={<QuotationView />} />
          <Route path="/invoices/create" element={<InvoiceCreate />} />
          <Route path="/invoices/:id" element={<InvoiceView />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/email-interface" element={<EmailInterface />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
