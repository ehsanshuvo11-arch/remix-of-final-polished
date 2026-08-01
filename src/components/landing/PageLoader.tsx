import { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';

interface PageLoaderProps {
  onComplete?: () => void;
}

// Curtain choreography (snappy, continuous):
//  0.00s – ~0.75s : wordmark reveal
//  ~0.75s – ~0.85s : 0.1s breath
//  ~0.85s – ~1.35s : curtain slides up (0.5s premium cubic-bezier)
const REVEAL_END_MS = 600; // matches longest letter end (~0.59s)
const MIN_HOLD_MS = 40;
const HOLD_MS = REVEAL_END_MS + MIN_HOLD_MS;
const EXIT_S = 0.35;

export default function PageLoader({ onComplete }: PageLoaderProps) {
  // Always run on every hard refresh — no session/local storage gating.
  const [show, setShow] = useState(true);
  const [gone, setGone] = useState(false);
  // Keep the latest callback in a ref so parent re-renders (data loading on
  // slow mobile connections) can never reset the dismiss timer mid-flight.
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!show) {
      onCompleteRef.current?.();
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
      // Notify parent the moment the curtain begins exiting so the page
      // underneath can fade in *behind* the rising curtain — no blank gap.
      onCompleteRef.current?.();
      setShow(false);
    }, HOLD_MS);

    return () => {
      window.clearTimeout(dismissTimer);
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [show]);

  // Safety net: if the exit animation never resolves (e.g. Framer Motion's
  // lazy features are still loading on a slow connection), force-unmount the
  // curtain and release the scroll locks anyway.
  useEffect(() => {
    if (show) return;
    const t = window.setTimeout(() => {
      setGone(true);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      (window as unknown as { lenis?: { start?: () => void } }).lenis?.start?.();
    }, EXIT_S * 1000 + 250);
    return () => window.clearTimeout(t);
  }, [show]);

  const letters = 'POLISHED'.split('');

  if (gone) return null;

  return (
    <AnimatePresence>
      {show && (

        <m.div
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
            }
          }}
        >
          {/* Soft corner glows — adds depth so the curtain doesn't read as flat navy */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: [
                'radial-gradient(ellipse 60% 55% at 0% 0%, hsl(var(--accent) / 0.18), transparent 60%)',
                'radial-gradient(ellipse 55% 50% at 100% 100%, hsl(var(--primary-foreground) / 0.12), transparent 65%)',
                'radial-gradient(ellipse 45% 40% at 100% 0%, hsl(var(--primary-foreground) / 0.06), transparent 70%)',
                'radial-gradient(ellipse 50% 45% at 0% 100%, hsl(var(--accent) / 0.08), transparent 70%)',
              ].join(', '),
            }}
          />
          {/* Subtle center vignette to keep wordmark in focus */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, transparent 40%, hsl(var(--primary) / 0.45) 100%)',
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
                  <m.span
                    className="inline-block"
                    initial={{ y: '110%', filter: 'blur(14px)', opacity: 0 }}
                    animate={{ y: '0%', filter: 'blur(0px)', opacity: 1 }}
                    transition={{
                      duration: 0.42,
                      delay: 0.03 + i * 0.018,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {letter}
                  </m.span>
                </span>
              ))}
              <span
                className="relative inline-block overflow-hidden"
                style={{ paddingBottom: '0.12em' }}
              >
                <m.span
                  className="inline-block text-accent"
                  initial={{ y: '110%', filter: 'blur(14px)', opacity: 0 }}
                  animate={{ y: '0%', filter: 'blur(0px)', opacity: 1 }}
                  transition={{
                    duration: 0.42,
                    delay: 0.03 + letters.length * 0.018,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  .
                </m.span>
              </span>
            </div>

            <m.div
              className="absolute bottom-0 left-0 h-px w-full bg-primary-foreground/30"
              initial={{ scaleX: 0, transformOrigin: '0% 50%' }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

export function shouldShowLoader() {
  // Loader now plays on every refresh — signature brand entrance.
  return typeof window !== 'undefined';
}
