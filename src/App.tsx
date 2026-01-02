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
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminGuard from "@/components/auth/AdminGuard";
import PromoPopup from "@/components/PromoPopup";

const queryClient = new QueryClient();

const AppLayout = () => {
  const location = useLocation();
  const hideChrome =
    location.pathname === "/gallery" || location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen text-white relative overflow-hidden isolate">
      {/* Global ambient spotlight */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"
      />

      {/* Film grain overlay */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 film-grain" />

      {/* Ambient background orbs */}
      <div
        aria-hidden
        className="pointer-events-none fixed top-[-220px] right-[-260px] w-[800px] h-[800px] bg-amber-500/10 blur-[150px] animate-pulse-slow"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-[-280px] left-[-320px] w-[1000px] h-[1000px] bg-purple-900/10 blur-[180px] animate-float"
      />

      {!hideChrome && <Header />}
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/gallery" element={<FullGallery />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <Admin />
            </AdminGuard>
          }
        />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideChrome && <Footer />}

      {/* Luxury Promo Popup (auto-shows + can be triggered from Header) */}
      <PromoPopup />
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
