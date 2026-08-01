import { lazy, Suspense, useEffect, useLayoutEffect, useState } from "react";
import { LazyMotion } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";

const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Non-critical chrome — none of it is needed for the first paint, so it is
// code-split and mounted only once the browser is idle. This keeps the
// initial JS payload (and therefore FCP/TBT on mobile) as small as possible.
const Toaster = lazy(() => import("@/components/ui/toaster").then((m) => ({ default: m.Toaster })));
const Sonner = lazy(() => import("@/components/ui/sonner").then((m) => ({ default: m.Toaster })));
const TooltipProvider = lazy(() =>
  import("@/components/ui/tooltip").then((m) => ({ default: m.TooltipProvider })),
);
const FilmGrain = lazy(() => import("./components/FilmGrain"));
const CustomCursor = lazy(() => import("./components/landing/CustomCursor"));
const Analytics = lazy(() => import("@vercel/analytics/react").then((m) => ({ default: m.Analytics })));

// Framer Motion features are loaded asynchronously AFTER first paint, keeping
// the initial JS payload lean. `domMax` is required because Portfolio uses drag.
const loadMotionFeatures = () => import("framer-motion").then((mod) => mod.domMax);

// Fewer retries + longer cache = far less network chatter on first load.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    },
  },
});

/** Mounts its children only after the browser has gone idle post-paint. */
const AfterPaint = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (win.requestIdleCallback) {
      const id = win.requestIdleCallback(() => setReady(true), { timeout: 2500 });
      return () => win.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setReady(true), 1200);
    return () => window.clearTimeout(id);
  }, []);

  if (!ready) return null;
  return <Suspense fallback={null}>{children}</Suspense>;
};

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
    <LanguageProvider>
      <LazyMotion features={loadMotionFeatures}>
        <BrowserRouter>
          <RouteCursorScope />
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin" element={<Admin />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <AfterPaint>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <FilmGrain />
              <CustomCursor />
              <Analytics />
            </TooltipProvider>
          </AfterPaint>
        </BrowserRouter>
      </LazyMotion>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
