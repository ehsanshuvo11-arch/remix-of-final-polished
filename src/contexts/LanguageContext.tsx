import { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


type Lang = 'en' | 'bn';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (en: string, bn: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (en) => en,
});

export function useLanguage() {
  return useContext(LanguageContext);
}

// Curtain timing — kept as constants so motion + JS stay perfectly in sync.
const CURTAIN_DROP_S = 0.45;   // covering the screen (top → full)
const CURTAIN_HOLD_MS = 80;    // tiny invisible beat for the DOM to swap
const CURTAIN_LIFT_S = 0.55;   // lifting away (full → off top)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('polished_lang');
    if (saved === 'bn') return 'bn';
    if (saved === 'en') return 'en';
    return 'en';
  });
  const [showPopup, setShowPopup] = useState(() => !localStorage.getItem('polished_lang'));
  const [transitioning, setTransitioning] = useState(false);

  // Curtain orchestration: 'idle' | 'covering' | 'lifting'
  // While 'covering' or 'lifting' the curtain is mounted on screen.
  const [curtain, setCurtain] = useState<'idle' | 'covering' | 'lifting'>('idle');
  const pendingLangRef = useRef<Lang | null>(null);

  const syncDocumentLanguage = (l: Lang) => {
    document.documentElement.setAttribute('data-lang', l);
    document.documentElement.setAttribute('lang', l);
  };

  const setLang = useCallback((l: Lang) => {
    // Initial popup path keeps the original luxurious selection animation.
    if (showPopup) {
      setLangState(l);
      localStorage.setItem('polished_lang', l);
      syncDocumentLanguage(l);
      setTransitioning(true);
      setTimeout(() => {
        setShowPopup(false);
        setTimeout(() => setTransitioning(false), 600);
      }, 800);
      return;
    }

    // Guard: ignore clicks while a transition is already running, or no-op switches.
    if (curtain !== 'idle') return;
    if (l === lang) return;

    // Stash desired language; we will commit it once the curtain fully covers.
    pendingLangRef.current = l;
    setCurtain('covering');
  }, [showPopup, curtain, lang]);

  useEffect(() => {
    syncDocumentLanguage(lang);
  }, [lang]);

  const t = (en: string, bn: string) => (lang === 'bn' ? bn : en);

  // Fired the moment the drop animation reaches 100% coverage.
  const handleCurtainCovered = () => {
    const next = pendingLangRef.current;
    if (!next) return;
    // The screen is fully blocked — safely swap language behind it.
    setLangState(next);
    localStorage.setItem('polished_lang', next);
    syncDocumentLanguage(next);
    pendingLangRef.current = null;
    // Tiny hold so React commits + fonts settle, then lift the curtain.
    window.setTimeout(() => setCurtain('lifting'), CURTAIN_HOLD_MS);
  };

  const handleCurtainLifted = () => {
    setCurtain('idle');
  };

  return (
    <LanguageContext.Provider value={{ lang: lang || 'en', setLang, t }}>
      {/* Language selection popup with slide-in animations */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 bg-[rgba(15,30,74,0.97)] z-[10000] flex items-center justify-center flex-col gap-12"
          >
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <div className="font-heading text-[28px] tracking-[6px] text-primary-foreground font-light text-center mb-2">
                POLISHED<span className="text-accent">.</span>
              </div>
              <p className="text-[13px] tracking-[2px] uppercase text-primary-foreground/40">
                Choose Your Language
              </p>
            </motion.div>
            <div className="flex gap-5">
              <motion.button
                initial={{ opacity: 0, x: -80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setLang('en')}
                className="px-12 py-4 text-sm tracking-[3px] uppercase bg-accent text-accent-foreground rounded-sm font-normal transition-all duration-300 hover:bg-[hsl(28,96%,55%)] hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(251,146,60,0.4)] active:scale-[0.96]"
              >
                English
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setLang('bn')}
                className="px-12 py-4 text-sm tracking-[3px] uppercase bg-transparent border border-primary-foreground/25 text-primary-foreground/80 rounded-sm font-normal transition-all duration-300 hover:border-accent hover:text-accent hover:-translate-y-1 active:scale-[0.96]"
                style={{ fontFamily: "'Noto Serif Bengali', serif" }}
              >
                বাংলা
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Initial popup transition overlay */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeInOut' }}
            className="fixed inset-0 bg-primary z-[9998] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/*
        Children render with a HARD structural lock during the curtain transition.
        Fixed dimensions + overflow:hidden physically prevents any text reflow / squish
        underneath the curtain while React commits the new language.
      */}
      <div
        style={
          curtain !== 'idle'
            ? {
                contain: 'layout paint size style',
                willChange: 'contents',
                overflow: 'hidden',
              }
            : undefined
        }
      >
        {children}
      </div>

      {/*
        SEQUENCED CURTAIN.
        Two layers working together to guarantee zero-glitch:
          1. INSTANT BLOCKER — appears the same frame the user clicks. Pure opacity
             snap (no transform), so there is literally no frame where the screen is
             not covered. Mounted for the entire 'covering' + 'lifting' duration.
          2. ANIMATED CURTAIN — slides in/out on top of the blocker for the luxe feel.
        The state swap only fires after the animated curtain reports 100% coverage.
      */}
      {curtain !== 'idle' && (
        <div
          aria-hidden
          className="fixed inset-0 z-[9996] bg-primary pointer-events-auto"
          style={{
            opacity: curtain === 'covering' ? 1 : 0,
            transition: curtain === 'lifting'
              ? `opacity ${CURTAIN_LIFT_S}s cubic-bezier(0.22,1,0.36,1) ${CURTAIN_LIFT_S * 0.55}s`
              : 'none',
          }}
        />
      )}
      <AnimatePresence>
        {curtain !== 'idle' && (
          <motion.div
            key="lang-curtain"
            aria-hidden
            className="fixed inset-0 z-[9997] bg-primary pointer-events-auto"
            initial={{ y: '-100%' }}
            animate={{ y: curtain === 'covering' ? '0%' : '-100%' }}
            transition={{
              duration: curtain === 'covering' ? CURTAIN_DROP_S : CURTAIN_LIFT_S,
              ease: curtain === 'covering' ? [0.76, 0, 0.24, 1] : [0.22, 1, 0.36, 1],
            }}
            onAnimationComplete={() => {
              if (curtain === 'covering') handleCurtainCovered();
              else if (curtain === 'lifting') handleCurtainLifted();
            }}
          >
            {/* Soft brand depth on the curtain */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: [
                  'radial-gradient(ellipse 60% 55% at 0% 0%, hsl(var(--accent) / 0.18), transparent 60%)',
                  'radial-gradient(ellipse 55% 50% at 100% 100%, hsl(var(--primary-foreground) / 0.10), transparent 65%)',
                ].join(', '),
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating language toggle */}
      {!showPopup && !transitioning && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
          disabled={curtain !== 'idle'}
          className="fixed bottom-7 right-7 z-[500] bg-primary text-primary-foreground border border-primary-foreground/15 rounded-full px-5 py-2.5 text-xs tracking-[2px] flex items-center gap-2 transition-all duration-300 shadow-[0_4px_20px_rgba(30,58,138,0.3)] hover:bg-accent hover:border-accent hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
        >
          <span className="text-base">🌎</span>
          <span className="whitespace-nowrap">{lang === 'en' ? 'বাংলা' : 'English'}</span>
        </motion.button>
      )}
    </LanguageContext.Provider>
  );
}
