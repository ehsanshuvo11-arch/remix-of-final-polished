import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLenis } from '@/components/landing/SmoothScroll';
import type { NavContent } from '@/types/database';

interface NavbarProps {
  onPuzzleOpen: () => void;
  content?: NavContent | null;
}

const LUXE = [0.22, 1, 0.36, 1] as const;

export default function Navbar({ onPuzzleOpen, content }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

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

  const navItems = [
    { label: t(content?.aboutEn ?? 'About', content?.aboutBn ?? 'আমাদের সম্পর্কে'), href: '#about' },
    { label: t(content?.servicesEn ?? 'Services', content?.servicesBn ?? 'সেবাসমূহ'), href: '#services' },
    { label: t(content?.workEn ?? 'Work', content?.workBn ?? 'কাজ'), href: '#work' },
    { label: t(content?.contactEn ?? 'Contact', content?.contactBn ?? 'যোগাযোগ'), href: '#contact' },
  ];

  const scrollTo = (href: string) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(el, { duration: 1.8, offset: 0 });
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
            if (lenis) lenis.scrollTo(0, { duration: 1.8 });
            else window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`font-heading text-[18px] md:text-[22px] font-semibold tracking-[4px] transition-colors duration-400 min-h-[44px] min-w-[44px] flex items-center ${
            scrolled || open ? 'text-primary' : 'text-primary-foreground'
          } ${open ? '!text-primary-foreground' : ''}`}
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
                className={`text-[13px] tracking-[1.5px] uppercase font-normal relative transition-colors duration-200 ${linkClass} after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-px after:bg-accent after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100`}
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: LUXE }}
            className="md:hidden fixed inset-0 z-[105] bg-primary/95 backdrop-blur-lg"
            onClick={() => setOpen(false)}
          >
            {/* Massive ambient studio spotlight — abstract top-right placement */}
            <div
              className="absolute -top-40 -right-32 w-[620px] h-[620px] rounded-full pointer-events-none"
              style={{ background: 'rgba(251,146,60,0.11)', filter: 'blur(100px)' }}
            />
            {/* Secondary softer bloom — bottom-left for atmospheric balance */}
            <div
              className="absolute -bottom-48 -left-40 w-[520px] h-[520px] rounded-full pointer-events-none"
              style={{ background: 'rgba(251,146,60,0.08)', filter: 'blur(100px)' }}
            />
            {/* Ultra-fine grain noise texture for tactile depth */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.18] mix-blend-overlay"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                backgroundSize: '220px 220px',
              }}
            />

            <div className="relative h-full flex flex-col justify-center items-end px-8 py-24 pointer-events-none">
              <ul
                className="flex flex-col items-end gap-7 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.15 + i * 0.08,
                      ease: LUXE,
                    }}
                    className="text-right"
                  >
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        setOpen(false);
                        // Wait for overlay close before scrolling
                        setTimeout(() => scrollTo(item.href), 350);
                      }}
                      className="font-heading text-[44px] leading-tight font-light text-primary-foreground hover:text-accent transition-colors duration-500 block min-h-[56px] text-right"
                      style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
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
                transition={{ duration: 0.7, delay: 0.5, ease: LUXE }}
                className="mt-16 pt-8 border-t border-primary-foreground/10 self-end w-full text-right pointer-events-none"
              >
                <p className="text-[10px] tracking-[3px] uppercase text-primary-foreground/40">
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
