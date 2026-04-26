import { Suspense, lazy, useEffect, useRef, useState } from 'react';

// Lazy-load the heavy R3F scene so it doesn't block initial paint / SSR.
const Scene = lazy(() => import('./SerumBottleScene'));

/**
 * Public wrapper. SSR-safe (renders nothing on server / before mount),
 * respects prefers-reduced-motion, and gates mounting on viewport
 * intersection so the GPU only spins up when the hero is actually visible.
 */
export default function SerumBottle3D({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldMount, setShouldMount] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener?.('change', onChange);

    const el = containerRef.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setShouldMount(true);
    } else {
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
    }

    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    >
      {shouldMount && (
        <Suspense fallback={null}>
          <Scene reducedMotion={reducedMotion} />
        </Suspense>
      )}
    </div>
  );
}
