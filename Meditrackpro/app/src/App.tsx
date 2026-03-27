import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index2 from "./pages/Index2";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import WrappedInventoryAdd from "./pages/InventoryAdd";
import InventoryItemDetails from "./pages/InventoryItemDetails";
import InventoryEdit from "./pages/inventoryedit";
import Devices from "./pages/Devices";
import DeviceOrder from "./pages/DeviceOrder";
import DeviceDetail from "./pages/DeviceDetail";
import Suppliers from "./pages/Suppliers";
import SupplierAdd from "./pages/SupplierAdd";
import SupplierEdit from "./pages/Supplieredit";
import Compliance from "./pages/Compliance";
import Billing from "./pages/Billing";
import Invoice from "./pages/Invoice";
import Patients from "./pages/Patients";  
import PatientAdd from "./pages/PatientAdd";
import PatientDetail from "./pages/PatientDetail";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import Reports from "./pages/Reports";
import Tickets from "./pages/Tickets";
import TicketDetail from "./pages/TicketDetail";
import TicketRaise from "./pages/TicketRaise";
import AITestLab from "./pages/AITestLab";

//DEMO
import NotFound from "./pages/NotFound";
import HospitalRegistration from "./pages/HospitalRegistration";
import HospitalDashboard from "./pages/HospitalDashboard";
import Payment from "./pages/Payment";
import Features from "./pages/Features";
import Solutions from "./pages/Solutions";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import { App as cApp } from "@capacitor/app"


const queryClient = new QueryClient();
cApp.addListener('backButton', ({ canGoBack }) => {
  if (canGoBack) {
    // Navigate to the previous page
    window.history.back();
  } else {
    // Optionally show a confirmation dialog before exiting
    if (confirm('Are you sure you want to exit the app?')) {
      cApp.exitApp();
    }
  }
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index2 />} />
          <Route path="/login" element={<Index2 />} />
          <Route path="/features" element={<Features />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/hospital-registration" element={<HospitalRegistration />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/ai-test-lab" element={<AITestLab />} />
          <Route path="/devices/order" element={<DeviceOrder />} />
          <Route path="/devices/:id" element={<DeviceDetail />} />
          <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/inventory/:inventoryItemId/details" element={<InventoryItemDetails />} />
          <Route path="/inventory/add" element={<WrappedInventoryAdd />} />
          <Route path="/inventory/edit/:inventoryItemId" element={<InventoryEdit />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/suppliers/add" element={<SupplierAdd />} />
          <Route path="/suppliers/edit/:supplierId" element={<SupplierEdit />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/add" element={<PatientAdd />} />
          <Route path="/patients/:id" element={<PatientDetail />} />
          <Route path="/ticket" element={<Tickets />} />
          <Route path="/ticket/:id" element={<TicketDetail />} />
          <Route path="/ticket-raise" element={<TicketRaise/>}/>
          
          {/* Above backend completed"*"*/}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/billing/invoice" element={<Invoice />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/support" element={<Support />} />
          <Route path="/ticket" element={<Tickets />} />
          <Route path="/ticket/:id" element={<TicketDetail />} />
          <Route path="/ticket-raise" element={<TicketRaise/>}/>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
