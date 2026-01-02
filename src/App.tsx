import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { useEffect, useLayoutEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Preloader } from "@/components/Preloader";
import FullGallery from "./pages/FullGallery";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollToHash } from "@/components/ScrollToHash";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminGuard from "@/components/auth/AdminGuard";
import PromoPopup from "@/components/PromoPopup";
import Unauthorized from "@/pages/admin/Unauthorized";

const queryClient = new QueryClient();

const AppLayout = () => {
  const location = useLocation();
  const hideChrome =
    location.pathname === "/gallery" || location.pathname.startsWith("/admin");

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    if (hideChrome) return;

    const t = window.setTimeout(() => {
      setIsPopupOpen(true);
    }, 2000);

    return () => window.clearTimeout(t);
  }, [hideChrome, location.pathname]);

  return (
    <div className="min-h-screen text-white relative overflow-hidden isolate">
      <div
        className="fixed inset-0 z-[-1] pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, #2a2a2a 0%, #000000 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {!hideChrome && <Navbar onOpenPopup={() => setIsPopupOpen(true)} />}
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/gallery" element={<FullGallery />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/unauthorized" element={<Unauthorized />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminGuard>
              <AdminDashboard />
            </AdminGuard>
          }
        />
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideChrome && <Footer />}

      <PromoPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </div>
  );
};

const App = () => {
  const [showPreloader, setShowPreloader] = useState(true);

  useLayoutEffect(() => {
    // 1. Disable browser's default scroll restoration
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // 2. Force scroll to top immediately
    window.scrollTo(0, 0);

    // 3. Optional: Re-enable auto scroll on cleanup (if needed for other behavior)
    return () => {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "auto";
      }
    };
  }, []);

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
