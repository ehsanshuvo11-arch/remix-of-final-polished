import { lazy, Suspense, useLayoutEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index";
import FilmGrain from "./components/FilmGrain";
import CustomCursor from "./components/landing/CustomCursor";

const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const RouteCursorScope = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    const isAdminRoute = location.pathname.startsWith("/admin");

    document.body.classList.toggle("admin-panel", isAdminRoute);
    document.body.classList.toggle("public-site", !isAdminRoute);
    document.body.style.cursor = isAdminRoute ? "auto" : "";

    return () => {
      document.body.classList.remove("admin-panel", "public-site");
      document.body.style.cursor = "";
    };
  }, [location.pathname]);

  // Force scroll to top on first mount (no hash) so the page never lands mid-section.
  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>
        <BrowserRouter>
          <RouteCursorScope />
          <FilmGrain />
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin" element={<Admin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
    <Analytics />
  </QueryClientProvider>
);

export default App;
