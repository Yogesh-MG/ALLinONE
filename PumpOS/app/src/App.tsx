import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Attendance_cap from "@/components/members/attendance_cap";
import Hero from "./pages/Hero";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Attendance from "./pages/Attendance";
import Bookings from "./pages/Bookings";
import Sales from "./pages/Sales";
import CRM from "./pages/CRM";
import Marketing from "./pages/Marketing";
import Staff from "./pages/Staff";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          } />
          <Route path="/members" element={
            <DashboardLayout>
              <Members />
            </DashboardLayout>
          } />
          <Route path="/attendance" element={
            <DashboardLayout>
              <Attendance />
            </DashboardLayout>
          } />
          <Route path="/attendance_cap" element={
            <DashboardLayout>
              <Attendance_cap />
            </DashboardLayout>
          } />
          <Route path="/bookings" element={
            <DashboardLayout>
              <Bookings />
            </DashboardLayout>
          } />
          <Route path="/sales" element={
            <DashboardLayout>
              <Sales />
            </DashboardLayout>
          } />
          <Route path="/crm" element={
            <DashboardLayout>
              <CRM />
            </DashboardLayout>
          } />
          <Route path="/marketing" element={
            <DashboardLayout>
              <Marketing />
            </DashboardLayout>
          } />
          <Route path="/staff" element={
            <DashboardLayout>
              <Staff />
            </DashboardLayout>
          } />
          <Route path="/settings" element={
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
