import { useState, useEffect } from 'react';
import { m, AnimatePresence, useScroll } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLenis } from '@/components/landing/SmoothScroll';
import type { NavContent } from '@/types/database';
import { useUILabels } from '@/hooks/use-site-content';
import { MOBILE_MENU_EVENT } from '@/components/landing/MobileActionBar';
import { openAuditModal } from '@/components/landing/VisualAuditModal';


interface NavbarProps {
  content?: NavContent | null;
}


const LUXE = [0.22, 1, 0.36, 1] as const;

export default function Navbar({ content }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { t, lang, toggleLanguage } = useLanguage();
  const isBn = lang === 'bn';
  const { scrollYProgress } = useScroll();


  useEffect(() => {
    let frame = 0;
    let last = false;
    const handleScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const next = window.scrollY > 60;
        if (next !== last) {
          last = next;
          setScrolled(next);
        }
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // The thumb dock can toggle the same menu from the bottom of the screen.
  useEffect(() => {
    const toggle = () => setOpen((o) => !o);
    window.addEventListener(MOBILE_MENU_EVENT, toggle);
    return () => window.removeEventListener(MOBILE_MENU_EVENT, toggle);
  }, []);

  // Broadcast state so the dock icon can mirror open/close.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('polished:menu-state', { detail: open }));
  }, [open]);

  const linkClass = scrolled
    ? 'text-muted-foreground hover:text-accent'
    : 'text-primary-foreground/70 hover:text-accent';

  const { data: labels } = useUILabels();

  // EN: keep English wordmark feel matching reference font. BN: localized labels.
  const navItems = isBn
    ? [
      { label: labels?.navAboutBn ?? 'পরিচিতি', href: '#about' },
      { label: labels?.navServicesBn ?? 'এক্সপার্টিজ', href: '#services' },
      { label: labels?.navEvolutionBn ?? 'বিবর্তন', href: '#evolution' },
      { label: labels?.navWorkBn ?? 'শোকেস', href: '#work' },
      { label: labels?.navContactBn ?? 'যোগাযোগ', href: '#contact' },
    ]
    : [
      { label: 'ABOUT', href: '#about' },
      { label: 'SERVICES', href: '#services' },
      { label: 'THE EVOLUTION', href: '#evolution' },
      { label: 'SHOWCASE', href: '#work' },
      { label: 'CONTACT', href: '#contact' },
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
      {/* Mobile reading-progress hairline — orientation without extra chrome */}
      <m.div
        aria-hidden
        style={{ scaleX: scrollYProgress }}
        className="md:hidden fixed top-0 left-0 right-0 z-[130] h-[2px] origin-left bg-accent pointer-events-none"
      />

      <nav
        className={`fixed top-0 left-0 right-0 ${open ? 'z-[120]' : 'z-[100]'} flex justify-between items-center transition-all duration-500 ${scrolled && !open
          ? 'py-3.5 px-6 md:px-14 bg-[#f9fafb]/95 md:backdrop-blur-2xl border-b border-primary/10 shadow-[0_4px_24px_rgba(0,0,0,0.08)] text-primary'
          : 'py-[20px] px-6 md:px-14 bg-gradient-to-b from-primary/80 via-primary/30 to-transparent border-b border-transparent text-primary-foreground'
          }`}
      >
        <div className="flex items-center gap-4 md:gap-6">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              const lenis = getLenis();
              if (lenis) lenis.scrollTo(0, { duration: 2.4 });
              else window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            lang="en"
            className={`brand-wordmark font-heading text-[20px] md:text-[24px] font-bold tracking-[4px] transition-colors duration-400 min-h-[44px] min-w-[44px] flex items-center ${scrolled && !open ? 'text-primary hover:text-accent' : 'text-primary-foreground hover:text-accent'
              }`}
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            POLISHED<span className="text-accent">.</span>
          </a>

          {/* Availability Status Badge */}
          <div className={`hidden lg:flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide border ${scrolled && !open
            ? 'bg-accent/10 border-accent/40 text-accent'
            : 'bg-accent/15 border-accent/30 text-accent'
            }`}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span>{isBn ? '৩টি স্প্রিন্ট স্লট বাকি' : '3 Sprint Slots Open'}</span>
          </div>
        </div>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-7 lg:gap-8">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(item.href);
                }}
                lang={isBn ? 'bn' : 'en'}
                className={`${isBn ? 'text-[15px] tracking-[0.3px] normal-case font-medium' : 'text-[12px] tracking-[0.22em] uppercase font-normal'} relative transition-colors duration-200 ${scrolled && !open ? 'text-primary/85 hover:text-accent font-normal' : 'text-primary-foreground/90 hover:text-accent font-normal'
                  } after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-px after:bg-accent after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100`}
                style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : { fontFamily: "'DM Sans', sans-serif" }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop conversion actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={() => toggleLanguage()}
            className={`inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wider px-3 py-1.5 rounded-full border transition-all duration-300 ${scrolled && !open
              ? 'border-primary/20 bg-primary/5 text-primary hover:border-accent hover:text-accent'
              : 'border-primary-foreground/20 bg-white/5 text-primary-foreground hover:border-accent hover:text-accent'
              } cursor-pointer active:scale-95`}
            title={isBn ? 'Switch to English' : 'বাংলা ভার্সন দেখুন'}
          >
            <Globe className="w-3.5 h-3.5 opacity-80 text-accent" />
            <span className="font-semibold">{isBn ? 'ENGLISH' : 'বাংলা'}</span>
          </button>

          <a
            href="https://wa.me/8801346288210?text=Hi%20POLISHED%2C%20I%20want%20to%20start%20the%20%E0%A7%B33999%20Skincare%20Trial%20Pack!"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-accent-foreground text-[11px] font-bold tracking-[1.5px] uppercase rounded-sm transition-all duration-300 hover:bg-accent/90 hover:shadow-[0_4px_20px_rgba(251,146,60,0.45)] active:scale-[0.97] cursor-pointer btn-shimmer"
            title="Start ৳3,999 Trial on WhatsApp"
          >
            <span>{isBn ? '৳৩,৯৯৯ ট্রায়াল শুরু করুন' : 'Start ৳3,999 Trial'}</span>
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className={`md:hidden relative w-11 h-11 flex flex-col items-center justify-center gap-[6px] z-[110] transition-colors duration-500 ${open ? 'text-primary-foreground' : scrolled ? 'text-primary' : 'text-primary-foreground'
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
            className="md:hidden fixed inset-0 min-h-[100dvh] z-[9999] bg-primary overflow-y-auto"
            onClick={() => setOpen(false)}
          >
            {/* Soft orange studio glow — top-right accent */}
            <div
              className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full pointer-events-none bg-accent"
              style={{ filter: 'blur(100px)', opacity: 0.14 }}
            />
            {/* Deep cinematic vignette at the base */}
            <div
              className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
              style={{ background: 'linear-gradient(to top, hsl(var(--primary) / 0.9), transparent)' }}
            />
            {/* Hairline glass edge */}
            <div className="absolute inset-0 pointer-events-none border-t border-primary-foreground/10" />


            {/* Bottom-anchored so every link lands inside the natural thumb arc */}
            <div className="relative h-full flex flex-col justify-end items-end px-7 sm:px-9 pt-24 pb-[calc(env(safe-area-inset-bottom)+96px)] pointer-events-none">
              <ul
                className="flex flex-col items-end gap-4 sm:gap-5 pointer-events-auto w-full"
                onClick={(e) => e.stopPropagation()}

              >
                {navItems.map((item, i) => (
                  <m.li
                    key={item.href}
                    initial={{ opacity: 0, y: 34 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.1 + i * 0.075,
                      ease: LUXE,
                    }}
                    style={{ willChange: 'transform, opacity' }}
                    className="text-right w-full transform-gpu"
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
                      className={`font-heading text-primary-foreground hover:text-accent active:text-accent transition-all duration-500 active:scale-[0.97] origin-right flex items-baseline justify-end gap-3 min-h-[56px] px-1 text-right [text-wrap:balance] font-light ${isBn
                        ? 'text-[clamp(26px,7.2vw,40px)] leading-[1.45]'
                        : 'text-[clamp(32px,8.4vw,48px)] leading-[1.08] tracking-[-0.015em]'
                        }`}

                      style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)', ...(isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : {}) }}
                    >
                      <span className="brand-wordmark text-accent/50 text-[11px] tracking-[2px] font-normal not-italic">
                        0{i + 1}
                      </span>
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
                className="mt-6 pt-5 self-end w-full flex flex-col gap-4 pointer-events-auto border-t border-primary-foreground/15"
                onClick={(e) => e.stopPropagation()}
              >
                {/* High-Converting Mobile Drawer Action */}
                <a
                  href="https://wa.me/8801346288210?text=Hi%20POLISHED%2C%20I%20want%20to%20start%20the%20%E0%A7%B33999%20Skincare%20Trial%20Pack!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-full bg-accent text-accent-foreground text-center font-bold text-xs uppercase tracking-[2px] shadow-[0_4px_20px_rgba(251,146,60,0.35)] flex items-center justify-center gap-2 btn-shimmer"
                >
                  <span>{isBn ? '৳৩,৯৯৯ ট্রায়াল শুরু করুন' : 'Start ৳3,999 Trial'}</span>
                  <span>→</span>
                </a>

                <div className="flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setTimeout(() => toggleLanguage(), 320);
                    }}
                    className="min-h-[44px] rounded-full border border-primary-foreground/20 px-4 text-[11px] tracking-[2px] text-primary-foreground/80 transition-colors duration-300 active:bg-primary-foreground/10 active:text-accent"
                  >
                    {isBn ? 'English' : 'বাংলা'}
                  </button>
                  <p lang="en" className="brand-wordmark text-[10.5px] tracking-[3px] uppercase text-primary-foreground/45" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '3px' }}>
                    POLISHED<span className="text-accent">.</span> Studio
                  </p>
                </div>
              </m.div>
            </div>
          </m.div>
        )}
      </AnimatePresence>

    </>
  );
}
