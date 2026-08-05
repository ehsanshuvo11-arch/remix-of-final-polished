import { useEffect } from 'react';
import Lenis from 'lenis';

// Global Lenis instance for smooth anchor scrolling (desktop only)
let lenisInstance: Lenis | null = null;
export function getLenis() { return lenisInstance; }

function isTouchDevice() {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(hover: none) and (pointer: coarse)').matches
  );
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // On phones/tablets we hand scrolling entirely back to the OS.
    // Native momentum is smoother than anything JS can emulate, and any
    // hijacking here is what makes touch scrolling feel broken.
    if (isTouchDevice()) {
      lenisInstance = null;
      return;
    }

    const lenis = new Lenis({
      // Ultra butter-smooth desktop wheel scrolling
      duration: 0.9,
      easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -8 * t)),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1.5,
      touchMultiplier: 2,
      lerp: 0.16,
    });
    lenisInstance = lenis;

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
