import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useLayoutEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Gallery from "./pages/Gallery";
import Team from "./pages/Team";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollToHash } from "@/components/ScrollToHash";
import { Preloader } from "@/components/Preloader";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminGuard from "@/components/auth/AdminGuard";
import GalleryManager from "@/pages/admin/GalleryManager";
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
    if (location.pathname !== "/") return;

    let hasSeenOffer = false;
    try {
      hasSeenOffer = Boolean(localStorage.getItem("hide_new_year_offer"));
    } catch {
      hasSeenOffer = false;
    }

    if (hasSeenOffer) return;

    const t = window.setTimeout(() => {
      setIsPopupOpen(true);
    }, 3000);

    return () => window.clearTimeout(t);
  }, [hideChrome, location.pathname]);

  const dismissOffer = () => {
    setIsPopupOpen(false);
    try {
      localStorage.setItem("hide_new_year_offer", "true");
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden isolate">
      {location.pathname === "/" && <Preloader />}

      {/* Unified site wallpaper (single high-perf backdrop) */}
      <div
        aria-hidden
        className="fixed inset-0 z-[-1] pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 50% -10%, rgba(217, 119, 6, 0.2), transparent 60%),
            radial-gradient(circle at 50% 110%, rgba(255, 255, 255, 0.05), transparent 50%),
            #050505
          `,
          backgroundAttachment: "fixed",
        }}
      />

      <div className="relative z-10">
        {!hideChrome && <Navbar onOpenPopup={() => setIsPopupOpen(true)} />}
        <ScrollToHash />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/team" element={<Team />} />
          <Route path="/gallery" element={<Gallery />} />
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
          <Route
            path="/admin/gallery"
            element={
              <AdminGuard>
                <GalleryManager />
              </AdminGuard>
            }
          />
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {!hideChrome && <Footer />}

        <PromoPopup
          isOpen={isPopupOpen}
          onDismiss={dismissOffer}
          onBook={() => setIsPopupOpen(false)}
        />
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

        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
