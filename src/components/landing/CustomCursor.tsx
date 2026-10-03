import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { m, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  // Performance & Usability: Native OS hardware cursor provides zero-latency 144Hz precision
  // and eliminates mouse tracking lag and continuous main-thread spring computations.
  return null;
}
