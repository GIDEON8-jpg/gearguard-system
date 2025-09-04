import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import FleetOverview from "./pages/FleetOverview";
import DriverManagement from "./pages/DriverManagement";
import VehicleManagement from "./pages/VehicleManagement";
import MaintenanceManagement from "./pages/MaintenanceManagement";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/fleet" element={<FleetOverview />} />
        <Route path="/tracking" element={<div className="text-center py-12"><h2 className="text-2xl font-bold mb-4">Live Tracking</h2><p className="text-muted-foreground">GPS tracking interface coming soon</p></div>} />
        <Route path="/drivers" element={<DriverManagement />} />
        <Route path="/maintenance" element={<MaintenanceManagement />} />
        <Route path="/vehicles" element={<VehicleManagement />} />
        <Route path="/analytics" element={<div className="text-center py-12"><h2 className="text-2xl font-bold mb-4">Analytics</h2><p className="text-muted-foreground">Fleet analytics interface coming soon</p></div>} />
        <Route path="/settings" element={<div className="text-center py-12"><h2 className="text-2xl font-bold mb-4">Settings</h2><p className="text-muted-foreground">Settings interface coming soon</p></div>} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/signup" element={<Navigate to="/" replace />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
