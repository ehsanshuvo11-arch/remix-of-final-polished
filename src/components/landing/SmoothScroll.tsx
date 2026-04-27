import { useEffect } from 'react';
import Lenis from 'lenis';

// Global Lenis instance for smooth anchor scrolling
let lenisInstance: Lenis | null = null;
export function getLenis() { return lenisInstance; }

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // On touch devices, let native momentum scrolling handle everything
    if (isTouchDevice()) return;

    const lenis = new Lenis({
      duration: 2.4,
      easing: (t: number) => {
        // Smoother, longer-tail easing for a silky glide
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      },
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.5,
      wheelMultiplier: 0.7,
      lerp: 0.075,
    });
    lenisInstance = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => { lenis.destroy(); lenisInstance = null; };
  }, []);

  return <>{children}</>;
}
