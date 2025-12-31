import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { Preloader } from "@/components/Preloader";
import FullGallery from "./pages/FullGallery";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollToHash } from "@/components/ScrollToHash";

const queryClient = new QueryClient();

const AppLayout = () => {
  const location = useLocation();
  const hideHeader = location.pathname === "/gallery";

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a0b2e] via-black to-black">
      {!hideHeader && <Header />}
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/gallery" element={<FullGallery />} />
        <Route path="/admin" element={<Admin />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
};

const App = () => {
  const [showPreloader, setShowPreloader] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <AnimatePresence>
          {showPreloader && (
            <Preloader onComplete={() => setShowPreloader(false)} />
          )}
        </AnimatePresence>

        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
