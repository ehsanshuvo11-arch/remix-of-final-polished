import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

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
  const [showPopup, setShowPopup] = useState(() => !localStorage.getItem('polished_lang'));

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('polished_lang', l);
    document.documentElement.setAttribute('data-lang', l);
    setShowPopup(false);
  };

  useEffect(() => {
    if (lang) document.documentElement.setAttribute('data-lang', lang);
  }, [lang]);

  const t = (en: string, bn: string) => lang === 'bn' && bn ? bn : en;

  return (
    <LanguageContext.Provider value={{ lang: lang || 'en', setLang, t }}>
      {/* Language selection popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-[rgba(15,30,74,0.97)] z-[10000] flex items-center justify-center flex-col gap-12 transition-opacity duration-500">
          <div className="text-center">
            <div className="font-heading text-[28px] tracking-[6px] text-primary-foreground font-light text-center mb-2">
              POLISHED<span className="text-accent">.</span>
            </div>
            <p className="text-[13px] tracking-[2px] uppercase text-primary-foreground/40">
              Choose Your Language
            </p>
          </div>
          <div className="flex gap-5">
            <button
              onClick={() => setLang('en')}
              className="px-12 py-4 text-sm tracking-[3px] uppercase bg-accent text-accent-foreground rounded-sm font-normal transition-all duration-300 hover:bg-[hsl(28,96%,55%)] hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(251,146,60,0.4)]"
            >
              English
            </button>
            <button
              onClick={() => setLang('bn')}
              className="px-12 py-4 text-sm tracking-[3px] uppercase bg-transparent border border-primary-foreground/25 text-primary-foreground/80 rounded-sm font-normal transition-all duration-300 hover:border-accent hover:text-accent hover:-translate-y-1"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              বাংলা
            </button>
          </div>
        </div>
      )}

      {children}

      {/* Floating language toggle */}
      {!showPopup && (
        <button
          onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
          className="fixed bottom-7 right-7 z-[500] bg-primary text-primary-foreground border border-primary-foreground/15 rounded-full px-5 py-2.5 text-xs tracking-[2px] flex items-center gap-2 transition-all duration-300 shadow-[0_4px_20px_rgba(30,58,138,0.3)] hover:bg-accent hover:border-accent hover:-translate-y-0.5"
        >
          <span className="text-base">🌎</span>
          <span>{lang === 'en' ? 'বাংলা' : 'English'}</span>
        </button>
      )}
    </LanguageContext.Provider>
  );
}
