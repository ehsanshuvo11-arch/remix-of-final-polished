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
    const touch = isTouchDevice();

    const lenis = new Lenis(
      touch
        ? {
            // Premium momentum-style scrolling for phones / tablets
            // syncTouch makes finger drags feel weighted and glide on release
            duration: 1.6,
            easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            syncTouch: true,
            syncTouchLerp: 0.085, // glide weight after finger lifts
            touchInertiaMultiplier: 28, // longer, silkier coast
            touchMultiplier: 2,
            lerp: 0.1,
          }
        : {
            duration: 2.4,
            easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            syncTouch: false,
            touchMultiplier: 1.5,
            wheelMultiplier: 0.7,
            lerp: 0.075,
          }
    );
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
