import { memo } from 'react';
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useIsMobileDevice } from '@/lib/use-is-mobile-device';

const SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='1'/></svg>`;
const DATA_URL = `url("data:image/svg+xml;utf8,${SVG}")`;

function FilmGrain() {
  const location = useLocation();
  const isMobile = useIsMobileDevice();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  // Performance: SVG turbulence filters are expensive on mobile GPUs.
  // We disable the grain overlay on mobile to ensure smooth 60fps scrolling.
  if (isMobile || location.pathname.startsWith("/admin")) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        pointerEvents: "none",
        backgroundImage: DATA_URL,
        backgroundRepeat: "repeat",
        opacity: 0.035,
      }}
    />
  );
}

export default memo(FilmGrain);
