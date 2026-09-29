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

    // High-performance, zero-latency luxury scroll:
    // Exponential curve ensures immediate response (<16ms) to wheel inputs
    // while providing an ultra-silky, 60/120fps glide without sluggish lag.
    const lenis = new Lenis({
      duration: 0.75,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      autoRaf: false,
    });
    lenisInstance = lenis;
    (window as any).__lenis = lenis;

    let frame = 0;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return <>{children}</>;
}
