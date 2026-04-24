// Film grain overlay — no mix-blend, neutral opacity (deploy trigger)
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='1'/></svg>`;
const DATA_URL = `url("data:image/svg+xml;utf8,${SVG}")`;

export default function FilmGrain() {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  if (location.pathname.startsWith("/admin")) return null;

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
