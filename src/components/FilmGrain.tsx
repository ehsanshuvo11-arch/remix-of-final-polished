import { memo } from 'react';
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useIsMobileDevice } from '@/lib/use-is-mobile-device';

const SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='1'/></svg>`;
const DATA_URL = `url("data:image/svg+xml;utf8,${SVG}")`;

function FilmGrain() {
  // Performance: Full-screen SVG turbulence filters cause significant GPU compositor jank
  // during scroll. Disabling this overlay ensures native 60/120fps hardware acceleration.
  return null;
}

export default memo(FilmGrain);
