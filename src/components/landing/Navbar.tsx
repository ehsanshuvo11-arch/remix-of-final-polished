import { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
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
  const [open, setOpen] = useState(false);
  const { t, lang } = useLanguage();
  const isBn = lang === 'bn';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  const linkClass = scrolled
    ? 'text-muted-foreground hover:text-accent'
    : 'text-primary-foreground/70 hover:text-accent';

  const { data: labels } = useUILabels();

  // EN: keep English wordmark feel. BN: localized labels per request.
  const navItems = isBn
    ? [
        { label: labels?.navAboutBn ?? 'পরিচিতি', href: '#about' },
        { label: labels?.navServicesBn ?? 'এক্সপার্টিজ', href: '#services' },
        { label: labels?.navEvolutionBn ?? 'বিবর্তন', href: '#evolution' },
        { label: labels?.navWorkBn ?? 'সিগনেচার প্রজেক্ট', href: '#work' },
        { label: labels?.navContactBn ?? 'যোগাযোগ', href: '#contact' },
      ]
    : [
        { label: content?.aboutEn ?? 'About', href: '#about' },
        { label: content?.servicesEn ?? 'Services', href: '#services' },
        { label: labels?.navEvolutionEn ?? 'The Evolution', href: '#evolution' },
        { label: content?.workEn ?? 'Work', href: '#work' },
        { label: content?.contactEn ?? 'Contact', href: '#contact' },
      ];

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
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] flex justify-between items-center transition-all duration-500 ${
          scrolled
            ? 'py-3.5 px-6 md:px-14 bg-background/95 backdrop-blur-2xl border-b border-border shadow-[0_2px_24px_rgba(0,0,0,0.05)]'
            : 'py-[22px] px-6 md:px-14 bg-transparent border-b border-transparent'
        }`}
      >
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            const lenis = getLenis();
            if (lenis) lenis.scrollTo(0, { duration: 2.4 });
            else window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          lang="en"
          className={`brand-wordmark font-heading text-[18px] md:text-[22px] font-semibold tracking-[4px] transition-colors duration-400 min-h-[44px] min-w-[44px] flex items-center ${
            scrolled || open ? 'text-primary' : 'text-primary-foreground'
          } ${open ? '!text-primary-foreground' : ''}`}
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          POLISHED<span className="text-accent">.</span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-9">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(item.href);
                }}
                lang={isBn ? 'bn' : 'en'}
                className={`${isBn ? 'text-[15px] tracking-[0.3px] normal-case font-medium' : 'text-[13px] tracking-[1.5px] uppercase font-normal'} relative transition-colors duration-200 ${linkClass} after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-px after:bg-accent after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100`}
                style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className={`md:hidden relative w-11 h-11 flex flex-col items-center justify-center gap-[6px] z-[110] transition-colors duration-500 ${
            open ? 'text-primary-foreground' : scrolled ? 'text-primary' : 'text-primary-foreground'
          }`}
        >
          <span
            className="block h-px w-6 bg-current transition-all duration-500"
            style={{
              transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
              transform: open ? 'translateY(3.5px) rotate(45deg)' : 'none',
            }}
          />
          <span
            className="block h-px w-6 bg-current transition-all duration-500"
            style={{
              transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
              transform: open ? 'translateY(-3.5px) rotate(-45deg)' : 'none',
            }}
          />
        </button>
      </nav>

      {/* Mobile full-screen overlay menu */}
      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: LUXE }}
            className="md:hidden fixed inset-0 z-[105] bg-primary"
            onClick={() => setOpen(false)}
          >
            {/* Soft orange studio glow — top-right accent */}
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
                  <m.li
                    key={item.href}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.15 + i * 0.08,
                      ease: LUXE,
                    }}
                    className="text-right w-full"
                  >
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        setOpen(false);
                        // Wait for overlay close before scrolling
                        setTimeout(() => scrollTo(item.href), 350);
                      }}
                      lang={isBn ? 'bn' : 'en'}
                      className="font-heading text-primary-foreground hover:text-accent text-[clamp(34px,9vw,52px)] leading-tight font-light transition-colors duration-500 block min-h-[56px] text-right [text-wrap:balance]"
                      style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)', ...(isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : {}) }}
                    >
                      {item.label}
                    </a>
                  </m.li>
                ))}
              </ul>

              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.5, ease: LUXE }}
                className="mt-16 pt-8 self-end w-full text-right pointer-events-none border-t border-primary-foreground/15"
              >
                <p lang="en" className="brand-wordmark text-[10px] tracking-[3px] uppercase text-primary-foreground/45" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '3px' }}>
                  POLISHED<span className="text-accent">.</span> Studio
                </p>
              </m.div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
