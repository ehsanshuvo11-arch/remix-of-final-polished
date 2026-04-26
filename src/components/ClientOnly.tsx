import { useEffect, useState, type ReactNode } from 'react';

/**
 * Strict client-only mounting boundary.
 *
 * Returns the `fallback` (or `null`) on the very first render — including any
 * SSR pass and the initial hydration tick — and only renders `children` AFTER
 * `useEffect` has fired, which is guaranteed to be on the client where
 * `window`, `document`, and a real WebGL context exist.
 *
 * Use this to wrap any subtree that:
 *   • Imports `three`, `@react-three/fiber`, `@react-three/drei`,
 *     `@react-three/postprocessing`, or any other browser-only module.
 *   • Touches `window` / `document` at module-init or render time.
 *
 * Because the children are only ever evaluated inside an effect, the JSX is
 * not walked during SSR and the modules behind a `lazy()` import are never
 * fetched on the server.
 */
export default function ClientOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setMounted(true);
  }, []);

  if (!mounted) return <>{fallback}</>;
  return <>{children}</>;
}
