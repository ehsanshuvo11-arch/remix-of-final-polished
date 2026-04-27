import { useEffect, useState } from 'react';

/**
 * Returns true on small / touch devices where we want to disable
 * scroll-driven reveal animations for instant content visibility.
 * SSR-safe: defaults to false on the server, resolves on mount.
 */
export function useIsMobileDevice(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const narrow = window.innerWidth < breakpoint;
      setIsMobile(touch || narrow);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);

  return isMobile;
}
