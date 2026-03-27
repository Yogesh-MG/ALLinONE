import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
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
import Dashboarddemo from "./pages/demo/Dashboard-demo";
import Inventorydemo from "./pages/demo/Inventory-demo";
import InventoryAdddemo from "./pages/demo/InventoryAdd-demo";
import Devicesdemo from "./pages/demo/Devices-demo";
import DeviceOrderdemo from "./pages/demo/DeviceOrder-demo";
import DeviceMaintenancedemo from "./pages/demo/DeviceMaintenance-demo";
import DeviceDetaildemo from "./pages/demo/DeviceDetail-demo";
import Suppliersdemo from "./pages/demo/Suppliers-demo";
import SupplierAdddemo from "./pages/demo/SupplierAdd-demo";
import Compliancedemo from "./pages/demo/Compliance-demo";
import Billingdemo from "./pages/demo/Billing-demo";
import Invoicedemo from "./pages/demo/Invoice-demo";
import Patientsdemo from "./pages/demo/Patients-demo";
import PatientAdddemo from "./pages/demo/PatientAdd-demo";
import Analyticsdemo from "./pages/demo/Analytics-demo";
import Settingsdemo from "./pages/demo/Settings-demo";
import Supportdemo from "./pages/demo/Support-demo";
import Reportsdemo from "./pages/demo/Reports-demo";
import Ticketsdemo from "./pages/demo/Tickets-demo";
import TicketDetaildemo from "./pages/demo/TicketDetail-demo";
import TicketRaisedemo from "./pages/demo/TicketRaise-demo";
import NotFound from "./pages/NotFound";
import HospitalRegistration from "./pages/HospitalRegistration";
import HospitalDashboard from "./pages/HospitalDashboard";
import Payment from "./pages/Payment";
import Features from "./pages/Features";
import Solutions from "./pages/Solutions";
import Pricing from "./pages/Pricing";
import About from "./pages/About";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Index2 />} />
          <Route path="/features" element={<Features />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/hospital-registration" element={<HospitalRegistration />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/ai-test-lab" element={<AITestLab />} />
          <Route path="/devices" element={<Devices />} />
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
          
          
          {/* ADD ALL DEMO LINKS HERE"*"*/}
          <Route path="/demo/dashboard" element={<Dashboarddemo />} />
          <Route path="/demo/inventory" element={<Inventorydemo />} />
          <Route path="/demo/inventory/add" element={<InventoryAdddemo />} />
          <Route path="/demo/devices" element={<Devicesdemo />} />
          <Route path="/demo/devices/order" element={<DeviceOrderdemo />} />
          <Route path="/demo/devices/maintenance" element={<DeviceMaintenancedemo />} />
          <Route path="/demo/devices/:id" element={<DeviceDetaildemo />} />
          <Route path="/demo/suppliers" element={<Suppliersdemo />} />
          <Route path="/demo/suppliers/add" element={<SupplierAdddemo />} />
          <Route path="/demo/compliance" element={<Compliancedemo />} />
          <Route path="/demo/billing" element={<Billingdemo />} />
          <Route path="/demo/billing/invoice" element={<Invoicedemo />} />
          <Route path="/demo/patients" element={<Patientsdemo />} />
          <Route path="/demo/patients/add" element={<PatientAdddemo />} />
          <Route path="/demo/analytics" element={<Analyticsdemo />} />
          <Route path="/demo/reports" element={<Reportsdemo />} />
          <Route path="/demo/settings" element={<Settingsdemo />} />
          <Route path="/demo/support" element={<Supportdemo />} />
          <Route path="/demo/ticket" element={<Ticketsdemo/>}/>
          <Route path="/demo/ticket-raise" element={<TicketRaisedemo/>}/>
          <Route path="/demo/ticket/:id" element={<TicketDetaildemo/>}/>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
