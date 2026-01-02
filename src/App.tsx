import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useLayoutEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FullGallery from "./pages/FullGallery";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollToHash } from "@/components/ScrollToHash";
import Preloader from "@/components/Preloader";
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

      <div className="relative z-10">
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
    </div>
  );
};

const App = () => {
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

        <Preloader />

        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
