import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLenis } from '@/components/landing/SmoothScroll';
import type { NavContent } from '@/types/database';
import { useUILabels } from '@/hooks/use-site-content';

interface NavbarProps {
  content?: NavContent | null;
}

const LUXE = [0.22, 1, 0.36, 1] as const;

export default function Navbar({ content }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const { lang, toggleLanguage } = useLanguage();
  const isBn = lang === 'bn';

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      // Smart scroll: hide going down (past the hero fold), reveal going up.
      if (!open) {
        if (y > lastY.current && y > 140) setHidden(true);
        else if (y < lastY.current) setHidden(false);
      }
      lastY.current = y;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [open]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      setHidden(false);
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  const { data: labels } = useUILabels();

  const navItems = isBn
    ? [
        { label: labels?.navServicesBn ?? 'এক্সপার্টিজ', href: '#services' },
        { label: labels?.navWorkBn ?? 'পোর্টফোলিও', href: '#work' },
        { label: 'ইনভেস্টমেন্ট', href: '#investment' },
        { label: labels?.navAboutBn ?? 'পরিচিতি', href: '#about' },
      ]
    : [
        { label: content?.servicesEn ?? 'Services', href: '#services' },
        { label: content?.workEn ?? 'Portfolio', href: '#work' },
        { label: 'Investment', href: '#investment' },
        { label: content?.aboutEn ?? 'About', href: '#about' },
      ];

  const linkTone = scrolled
    ? 'text-primary-foreground/65 hover:text-primary-foreground'
    : 'text-primary-foreground/70 hover:text-primary-foreground';

  const scrollTo = (href: string) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(el, { duration: 2.4, offset: 0 });
      else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <motion.nav
        initial={false}
        animate={{ y: hidden ? '-110%' : '0%' }}
        transition={{ duration: 0.7, ease: LUXE }}
        className={`fixed top-0 left-0 right-0 z-[100] grid grid-cols-[auto_1fr_auto] items-center transition-[background-color,padding,border-color,backdrop-filter] duration-500 ${
          scrolled
            ? 'py-3.5 px-6 md:px-12 bg-primary/70 backdrop-blur-md border-b border-primary-foreground/10'
            : 'py-[22px] px-6 md:px-12 bg-transparent border-b border-transparent'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
      >
        {/* Brand — far left */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            const lenis = getLenis();
            if (lenis) lenis.scrollTo(0, { duration: 2.4 });
            else window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          lang="en"
          className="brand-wordmark font-heading text-[18px] md:text-[22px] font-semibold tracking-[4px] text-primary-foreground min-h-[44px] min-w-[44px] flex items-center"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          POLISHED<span className="text-accent">.</span>
        </a>

        {/* Links — center */}
        <ul className="hidden md:flex items-center justify-center gap-10">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(item.href);
                }}
                lang={isBn ? 'bn' : 'en'}
                className={`group relative inline-block text-sm ${
                  isBn ? 'tracking-[0.5px] normal-case' : 'uppercase tracking-widest'
                } font-normal transition-colors duration-500 ${linkTone}`}
                style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
              >
                {item.label}
                <span className="pointer-events-none absolute -bottom-1.5 left-0 right-0 mx-auto h-px w-0 bg-accent transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        {/* Actions — far right */}
        <div className="flex items-center justify-end gap-4 md:gap-6">
          <div className="hidden md:flex items-center gap-1 text-[11px] tracking-[2px] uppercase">
            <button
              type="button"
              onClick={() => { if (isBn) toggleLanguage(); }}
              className={`px-1.5 py-1 transition-colors duration-500 ${
                !isBn ? 'text-accent' : 'text-primary-foreground/45 hover:text-primary-foreground'
              }`}
            >
              EN
            </button>
            <span className="text-primary-foreground/25">/</span>
            <button
              type="button"
              onClick={() => { if (!isBn) toggleLanguage(); }}
              className={`px-1.5 py-1 transition-colors duration-500 ${
                isBn ? 'text-accent' : 'text-primary-foreground/45 hover:text-primary-foreground'
              }`}
            >
              BN
            </button>
          </div>

          <button
            type="button"
            onClick={() => scrollTo('#contact')}
            lang={isBn ? 'bn' : 'en'}
            className={`hidden md:inline-flex items-center rounded-sm border border-primary-foreground/25 px-6 py-2.5 text-[11px] font-medium text-primary-foreground transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] hover:border-accent hover:bg-accent hover:text-accent-foreground ${
              isBn ? 'tracking-[0.5px]' : 'uppercase tracking-[2px]'
            }`}
            style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
          >
            {isBn ? 'কথা বলি' : "Let's Talk"}
          </button>

          {/* Mobile hamburger — two ultra-thin lines */}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="md:hidden relative w-11 h-11 flex flex-col items-center justify-center gap-[7px] z-[110] text-primary-foreground"
          >
            <span
              className="block h-px w-6 bg-current transition-all duration-500"
              style={{
                transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
                transform: open ? 'translateY(4px) rotate(45deg)' : 'none',
              }}
            />
            <span
              className="block h-px w-6 bg-current transition-all duration-500"
              style={{
                transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
                transform: open ? 'translateY(-4px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile full-screen overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: LUXE }}
            className="md:hidden fixed inset-0 z-[105] bg-primary"
            onClick={() => setOpen(false)}
          >
            <div
              className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full pointer-events-none bg-accent"
              style={{ filter: 'blur(100px)', opacity: 0.12 }}
            />

            <div className="relative h-full flex flex-col justify-center items-end px-6 sm:px-8 py-24 pointer-events-none">
              <ul
                className="flex flex-col items-end gap-6 sm:gap-7 pointer-events-auto w-full"
                onClick={(e) => e.stopPropagation()}
              >
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.7, delay: 0.15 + i * 0.08, ease: LUXE }}
                    className="text-right w-full"
                  >
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        setOpen(false);
                        setTimeout(() => scrollTo(item.href), 350);
                      }}
                      lang={isBn ? 'bn' : 'en'}
                      className="font-heading text-primary-foreground hover:text-accent text-[clamp(34px,9vw,52px)] leading-tight font-light transition-colors duration-500 block min-h-[56px] text-right [text-wrap:balance]"
                      style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)', ...(isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : {}) }}
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.45, ease: LUXE }}
                className="mt-12 pt-8 self-end w-full text-right pointer-events-auto border-t border-primary-foreground/15 flex flex-col items-end gap-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-1 text-[11px] tracking-[2px] uppercase">
                  <button
                    type="button"
                    onClick={() => { if (isBn) toggleLanguage(); }}
                    className={`px-1.5 py-1 transition-colors duration-500 ${!isBn ? 'text-accent' : 'text-primary-foreground/45'}`}
                  >
                    EN
                  </button>
                  <span className="text-primary-foreground/25">/</span>
                  <button
                    type="button"
                    onClick={() => { if (!isBn) toggleLanguage(); }}
                    className={`px-1.5 py-1 transition-colors duration-500 ${isBn ? 'text-accent' : 'text-primary-foreground/45'}`}
                  >
                    BN
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setTimeout(() => scrollTo('#contact'), 350);
                  }}
                  lang={isBn ? 'bn' : 'en'}
                  className={`inline-flex items-center rounded-sm border border-primary-foreground/25 px-7 py-3 text-[11px] font-medium text-primary-foreground transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-accent hover:bg-accent hover:text-accent-foreground ${
                    isBn ? 'tracking-[0.5px]' : 'uppercase tracking-[2px]'
                  }`}
                  style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
                >
                  {isBn ? 'কথা বলি' : "Let's Talk"}
                </button>

                <p lang="en" className="brand-wordmark text-[10px] tracking-[3px] uppercase text-primary-foreground/45" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '3px' }}>
                  POLISHED<span className="text-accent">.</span> Studio
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
