import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageLoaderProps {
  onComplete?: () => void;
}

// Curtain choreography (snappy, continuous):
//  0.00s – ~0.75s : wordmark reveal
//  ~0.75s – ~0.85s : 0.1s breath
//  ~0.85s – ~1.35s : curtain slides up (0.5s premium cubic-bezier)
const REVEAL_END_MS = 750;
const MIN_HOLD_MS = 100;
const HOLD_MS = REVEAL_END_MS + MIN_HOLD_MS;
const EXIT_S = 0.5;

export default function PageLoader({ onComplete }: PageLoaderProps) {
  // Always run on every hard refresh — no session/local storage gating.
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!show) {
      onComplete?.();
      return;
    }

    // Lock body + html scroll (covers Lenis which reads from html/body).
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    // Pause Lenis if present on window.
    const lenis = (window as unknown as { lenis?: { stop?: () => void; start?: () => void } }).lenis;
    lenis?.stop?.();

    const dismissTimer = window.setTimeout(() => {
      setShow(false);
    }, HOLD_MS);

    return () => {
      window.clearTimeout(dismissTimer);
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
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
          transition={{ duration: EXIT_S, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={(def) => {
            if ((def as { y?: string })?.y === '-100%') {
              // Curtain has fully cleared the viewport — release scroll locks.
              document.body.style.overflow = '';
              document.documentElement.style.overflow = '';
              const lenis = (window as unknown as { lenis?: { start?: () => void } }).lenis;
              lenis?.start?.();
              onComplete?.();
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
              lang="en"
              className="brand-wordmark font-heading uppercase text-primary-foreground"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                letterSpacing: '4px',
                fontSize: 'clamp(2.25rem, 7vw, 5.25rem)',
                fontWeight: 600,
                lineHeight: 1.1,
                display: 'flex',
              } as React.CSSProperties}
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
                      duration: 0.55,
                      delay: 0.04 + i * 0.025,
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
  // Loader now plays on every refresh — signature brand entrance.
  return typeof window !== 'undefined';
}
