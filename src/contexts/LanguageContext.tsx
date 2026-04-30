import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
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

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('polished_lang');
    if (saved === 'bn') return 'bn';
    if (saved === 'en') return 'en';
    return 'en';
  });
  const [showPopup, setShowPopup] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [curtain, setCurtain] = useState(false);

  const syncDocumentLanguage = (l: Lang = lang) => {
    document.documentElement.setAttribute('data-lang', l);
    document.documentElement.setAttribute('lang', l);
  };

  const swapLanguagePreservingScroll = (l: Lang) => {
    // Snapshot scroll position from every plausible source.
    const scrollY =
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    setLangState(l);
    localStorage.setItem('polished_lang', l);
    syncDocumentLanguage(l);

    // Restore scroll across the next several frames to defeat any layout
    // reflow, Lenis re-init, or AnimatePresence remount that would otherwise
    // jump the page to the top.
    const restore = () => {
      window.scrollTo(0, scrollY);
      document.documentElement.scrollTop = scrollY;
      document.body.scrollTop = scrollY;
      const lenis = (window as unknown as { lenis?: { scrollTo?: (y: number, opts?: unknown) => void } }).lenis;
      lenis?.scrollTo?.(scrollY, { immediate: true, force: true });
    };
    restore();
    requestAnimationFrame(restore);
    requestAnimationFrame(() => requestAnimationFrame(restore));
    setTimeout(restore, 80);
    setTimeout(restore, 200);
  };

  const setLang = (l: Lang) => {
    // Used by the (now hidden) initial popup. Keep behaviour but preserve scroll.
    swapLanguagePreservingScroll(l);
    setTransitioning(true);
    setTimeout(() => {
      setShowPopup(false);
      setTimeout(() => setTransitioning(false), 600);
    }, 800);
  };

  // Curtain-drop language toggle used by the floating button.
  const toggleLanguageWithCurtain = () => {
    if (curtain) return;
    const next: Lang = lang === 'en' ? 'bn' : 'en';
    setCurtain(true);
    // Wait until the curtain fully covers the screen, then swap content.
    // 420ms matches the curtain's drop duration below.
    window.setTimeout(() => {
      swapLanguagePreservingScroll(next);
      // Hold briefly so the swap is invisible, then reveal.
      window.setTimeout(() => setCurtain(false), 180);
    }, 460);
  };

  useEffect(() => {
    syncDocumentLanguage(lang);
  }, [lang]);

  const t = (en: string, bn: string) => (lang === 'bn' ? bn : en);

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
            data-language-overlay="true"
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
              {/* English slides in from LEFT */}
              <motion.button
                initial={{ opacity: 0, x: -80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setLang('en')}
                className="px-12 py-4 text-sm tracking-[3px] uppercase bg-accent text-accent-foreground rounded-sm font-normal transition-all duration-300 hover:bg-[hsl(28,96%,55%)] hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(251,146,60,0.4)] active:scale-[0.96]"
              >
                English
              </motion.button>
              {/* Bengali slides in from RIGHT */}
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

      {/* Luxurious transition overlay after language selection */}
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

      {/* Crossfade between languages — outgoing fades 0.15s, incoming 0.3s */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={lang}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] },
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.15, ease: [0.76, 0, 0.24, 1] },
          }}
          style={{ willChange: 'opacity' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Floating language toggle */}
      {!showPopup && !transitioning && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          onClick={() => {
            setLangState(prev => {
              const next = prev === 'en' ? 'bn' : 'en';
              localStorage.setItem('polished_lang', next);
              syncDocumentLanguage(next);
              return next;
            });
          }}
          className="fixed bottom-7 right-7 z-[500] bg-primary text-primary-foreground border border-primary-foreground/15 rounded-full px-5 py-2.5 text-xs tracking-[2px] flex items-center gap-2 transition-all duration-300 shadow-[0_4px_20px_rgba(30,58,138,0.3)] hover:bg-accent hover:border-accent hover:-translate-y-0.5"
        >
          <span className="text-base">🌎</span>
          <span>{lang === 'en' ? 'বাংলা' : 'English'}</span>
        </motion.button>
      )}
    </LanguageContext.Provider>
  );
}