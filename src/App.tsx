import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import FleetOverview from "./pages/FleetOverview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/fleet" element={<FleetOverview />} />
            <Route path="/tracking" element={<div className="text-center py-12"><h2 className="text-2xl font-bold mb-4">Live Tracking</h2><p className="text-muted-foreground">GPS tracking interface coming soon</p></div>} />
            <Route path="/drivers" element={<div className="text-center py-12"><h2 className="text-2xl font-bold mb-4">Driver Management</h2><p className="text-muted-foreground">Driver management interface coming soon</p></div>} />
            <Route path="/maintenance" element={<div className="text-center py-12"><h2 className="text-2xl font-bold mb-4">Maintenance</h2><p className="text-muted-foreground">Maintenance management interface coming soon</p></div>} />
            <Route path="/analytics" element={<div className="text-center py-12"><h2 className="text-2xl font-bold mb-4">Analytics</h2><p className="text-muted-foreground">Fleet analytics interface coming soon</p></div>} />
            <Route path="/settings" element={<div className="text-center py-12"><h2 className="text-2xl font-bold mb-4">Settings</h2><p className="text-muted-foreground">Settings interface coming soon</p></div>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
