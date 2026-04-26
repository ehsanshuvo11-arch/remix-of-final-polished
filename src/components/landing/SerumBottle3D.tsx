import { Component, Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react';

// Lazy-load the heavy R3F scene so it never enters the SSR bundle path
// and only downloads/executes on the client when the hero is in view.
const Scene = lazy(() => import('./SerumBottleScene'));

/**
 * Detect basic WebGL support without instantiating R3F. If WebGL is missing
 * or blocked (older devices, hardened browsers, headless bots), we never
 * mount the Canvas — preventing the "white screen of death" that R3F can
 * trigger when context creation throws synchronously.
 */
function hasWebGL(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return !!gl;
  } catch {
    return false;
  }
}

/**
 * Error boundary that swallows any runtime crash from the 3D scene
 * (shader compile failure, WebGL context loss, postprocessing init error,
 * dependency hiccup) and renders a graceful fallback instead of taking
 * the entire React tree down with it.
 */
class SceneErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Soft-log; never re-throw.
    // eslint-disable-next-line no-console
    console.warn('[SerumBottle3D] scene crashed, falling back gracefully:', error);
  }

  render() {
    if (this.state.hasError) return <>{this.props.fallback}</>;
    return <>{this.props.children}</>;
  }
}

/**
 * Premium minimalist fallback — a soft amber "bottle silhouette" glow
 * that matches the brand palette. Used both as the Suspense skeleton
 * (while the R3F chunk + textures load) and as the ErrorBoundary
 * fallback when WebGL is unavailable or the scene crashes.
 */
function BottleFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
      <div
        className="w-[55%] h-[78%] rounded-[40%/12%] opacity-70"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(251,146,60,0.22) 0%, rgba(251,146,60,0.08) 45%, rgba(10,15,31,0) 75%)',
          filter: 'blur(14px)',
          animation: 'pulseGlow 3.2s ease-in-out infinite',
        }}
      />
    </div>
  );
}

/**
 * Public wrapper — strictly client-only:
 *  • Renders nothing on the server (no `window`, no WebGL context).
 *  • Renders nothing until the hero is intersecting (saves GPU).
 *  • Renders nothing if WebGL is unavailable (renders fallback instead).
 *  • Wraps the Canvas in Suspense + ErrorBoundary so a 3D failure can
 *    never blank the rest of the page.
 */
export default function SerumBottle3D({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldMount, setShouldMount] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webglOk, setWebglOk] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setWebglOk(hasWebGL());

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener?.('change', onChange);

    const el = containerRef.current;
    if (!el) {
      return () => mq.removeEventListener?.('change', onChange);
    }

    if (!('IntersectionObserver' in window)) {
      setShouldMount(true);
      return () => mq.removeEventListener?.('change', onChange);
    }

    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShouldMount(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      mq.removeEventListener?.('change', onChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    >
      {/* WebGL unsupported → static premium fallback, never mount Canvas */}
      {webglOk === false && <BottleFallback />}

      {/* WebGL OK + viewport reached → mount scene with safety net */}
      {webglOk && shouldMount && (
        <SceneErrorBoundary fallback={<BottleFallback />}>
          <Suspense fallback={<BottleFallback />}>
            <Scene reducedMotion={reducedMotion} />
          </Suspense>
        </SceneErrorBoundary>
      )}
    </div>
  );
}
