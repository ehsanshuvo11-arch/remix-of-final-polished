import { useEffect } from 'react';
import Lenis from 'lenis';

// Global Lenis instance for smooth anchor scrolling (desktop only)
let lenisInstance: Lenis | null = null;
export function getLenis() { return lenisInstance; }

function isMobileTouchOnly() {
  if (typeof window === 'undefined') return false;
  // Mobile phones and tablets only: coarse pointer without hover capability.
  // Desktop and laptop PCs (even with touchscreen) retain fine pointer & hover.
  return window.matchMedia('(pointer: coarse) and (hover: none)').matches;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Pure touch mobile phones/tablets keep native OS momentum scrolling
    if (isMobileTouchOnly()) {
      lenisInstance = null;
      return;
    }

    // Ultra-smooth, responsive inertial glide:
    // duration 0.85s with exponential ease-out provides instant, zero-latency response
    // without sluggish lag or rubbery floatiness, matching high-end luxury sites.
    const lenis = new Lenis({
      duration: 0.85,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      autoRaf: true,
    });
    lenisInstance = lenis;
    (window as any).__lenis = lenis;
    (window as any).lenis = lenis;

    return () => {
      lenis.destroy();
      lenisInstance = null;
      (window as any).__lenis = null;
      (window as any).lenis = null;
    };
  }, []);

  return <>{children}</>;
}
