import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SESSION_KEY = 'polished_loader_shown';

interface PageLoaderProps {
  onComplete?: () => void;
}

export default function PageLoader({ onComplete }: PageLoaderProps) {
  // Decide synchronously so we never flash a loader on subsequent navigations.
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem(SESSION_KEY) !== '1';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!show) {
      onComplete?.();
      return;
    }

    // Lock body scroll while loader is on screen.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Total choreography:
    //  0.0s – 1.0s : wordmark reveal (mask slide + blur-to-sharp)
    //  1.0s – 1.5s : hold
    //  1.5s – 2.4s : curtain drops up (0.9s cubic ease-in-out)
    const dismissTimer = window.setTimeout(() => {
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* noop */ }
      setShow(false);
      // Match the curtain duration so hero entrance is in sync.
      window.setTimeout(() => onComplete?.(), 900);
    }, 1500);

    return () => {
      window.clearTimeout(dismissTimer);
      document.body.style.overflow = prevOverflow;
    };
  }, [show, onComplete]);

  const letters = 'POLISHED'.split('');

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="cinematic-loader"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-primary"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={(def) => {
            if ((def as { y?: string })?.y === '-100%') {
              document.body.style.overflow = '';
            }
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, hsl(var(--primary-foreground) / 0.06), transparent 60%)',
            }}
          />

          <div className="relative overflow-hidden px-6">
            <div
              className="font-heading uppercase text-primary-foreground"
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                letterSpacing: '0.18em',
                fontSize: 'clamp(2.25rem, 7vw, 5.25rem)',
                fontWeight: 500,
                lineHeight: 1.1,
                display: 'flex',
              }}
            >
              {letters.map((letter, i) => (
                <span
                  key={i}
                  className="relative inline-block overflow-hidden"
                  style={{ paddingBottom: '0.12em' }}
                >
                  <motion.span
                    className="inline-block"
                    initial={{ y: '110%', filter: 'blur(14px)', opacity: 0 }}
                    animate={{ y: '0%', filter: 'blur(0px)', opacity: 1 }}
                    transition={{
                      duration: 1,
                      delay: 0.05 + i * 0.045,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {letter}
                  </motion.span>
                </span>
              ))}
              <span
                className="relative inline-block overflow-hidden"
                style={{ paddingBottom: '0.12em' }}
              >
                <motion.span
                  className="inline-block text-accent"
                  initial={{ y: '110%', filter: 'blur(14px)', opacity: 0 }}
                  animate={{ y: '0%', filter: 'blur(0px)', opacity: 1 }}
                  transition={{
                    duration: 1,
                    delay: 0.05 + letters.length * 0.045,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  .
                </motion.span>
              </span>
            </div>

            <motion.div
              className="absolute bottom-0 left-0 h-px w-full bg-primary-foreground/30"
              initial={{ scaleX: 0, transformOrigin: '0% 50%' }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function shouldShowLoader() {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(SESSION_KEY) !== '1';
  } catch {
    return true;
  }
}
