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

    // Luxury butter-smooth inertial glide for desktop, wheel, and trackpad:
    // With CSS scroll-behavior: smooth removed, Lenis delivers 100% pure 60/120fps glide
    // without frame collision or stutter.
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1.15,
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
