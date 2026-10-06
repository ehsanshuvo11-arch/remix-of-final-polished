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

    // Zero-latency native hardware-accelerated scrolling:
    // Wheel events are handled directly by the browser compositor thread at 120/144Hz with 0ms input lag.
    // Lenis remains active for silky-smooth programmatic anchor scrolling (Navbar, CTAs).
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: false, // Prevents mouse wheel drag, delay, and rubber-band latency on desktop
      syncTouch: false,
      autoRaf: true,
    });
    lenisInstance = lenis;
    (window as any).__lenis = lenis;

    return () => {
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return <>{children}</>;
}
