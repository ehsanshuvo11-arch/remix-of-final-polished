import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SESSION_KEY = 'polished_loader_shown';
export const BRAND_LAYOUT_ID = 'brand-logo';

interface PageLoaderProps {
  onComplete?: () => void;
  onDismissStart?: () => void;
}

export function shouldShowLoader() {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(SESSION_KEY) !== '1';
  } catch {
    return true;
  }
}

const LUXE = [0.76, 0, 0.24, 1] as const;

export default function PageLoader({ onComplete, onDismissStart }: PageLoaderProps) {
  const [show, setShow] = useState(() => shouldShowLoader());

  useEffect(() => {
    if (!show) {
      onComplete?.();
      return;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Timeline:
    //  0.0s – 0.9s : wordmark reveal (mask slide + blur-to-sharp)
    //  0.9s – 2.1s : 1.2s anticipation hold
    //  2.1s        : trigger morph — overlay clip-paths away,
    //                shared layout logo glides into the Navbar position
    //  2.1s – 3.3s : 1.2s shared layout transition
    const dismissTimer = window.setTimeout(() => {
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* noop */ }
      onDismissStart?.();
      setShow(false);
      // Match the morph duration so hero entrance is in sync.
      window.setTimeout(() => onComplete?.(), 1200);
    }, 2100);

    return () => {
      window.clearTimeout(dismissTimer);
      document.body.style.overflow = prevOverflow;
    };
  }, [show, onComplete, onDismissStart]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="cinematic-loader"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-primary"
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 1.2, ease: LUXE }}
          onAnimationComplete={() => {
            document.body.style.overflow = '';
          }}
        >
          {/* Subtle vertical sheen for richness */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, hsl(var(--primary-foreground) / 0.06), transparent 60%)',
            }}
          />

          {/* Hairline accent — fades out as the curtain leaves */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 h-px bg-primary-foreground/30"
            initial={{ width: 0 }}
            animate={{ width: 'min(420px, 60vw)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ top: 'calc(50% + clamp(2.4rem, 6vw, 4.4rem))' }}
          />

          {/* SHARED LAYOUT WORDMARK
              This element shares layoutId="brand-logo" with the Navbar.
              When the loader unmounts, Framer Motion animates the layout
              transition from this large centered position to the small
              Navbar position — gliding, scaling, and morphing in one shot. */}
          <motion.div
            layoutId={BRAND_LAYOUT_ID}
            className="font-heading uppercase text-primary-foreground"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              letterSpacing: '0.18em',
              fontSize: 'clamp(2.25rem, 7vw, 5.25rem)',
              fontWeight: 500,
              lineHeight: 1.1,
            }}
            transition={{ duration: 1.2, ease: LUXE }}
          >
            POLISHED<span className="text-accent">.</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
