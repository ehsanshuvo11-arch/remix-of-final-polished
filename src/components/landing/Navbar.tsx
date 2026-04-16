import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLenis } from '@/components/landing/SmoothScroll';
import type { NavContent } from '@/types/database';

interface NavbarProps {
  onPuzzleOpen: () => void;
  content?: NavContent | null;
}

export default function Navbar({ onPuzzleOpen, content }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const linkClass = scrolled
    ? 'text-muted-foreground hover:text-accent'
    : 'text-primary-foreground/70 hover:text-accent';

  const navItems = [
    { label: t(content?.aboutEn ?? 'About', content?.aboutBn ?? 'আমাদের সম্পর্কে'), href: '#about' },
    { label: t(content?.servicesEn ?? 'Services', content?.servicesBn ?? 'সেবাসমূহ'), href: '#services' },
    { label: t(content?.workEn ?? 'Work', content?.workBn ?? 'কাজ'), href: '#work' },
    { label: t(content?.contactEn ?? 'Contact', content?.contactBn ?? 'যোগাযোগ'), href: '#contact' },
  ];

  return (
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
          scrolled ? 'text-primary' : 'text-primary-foreground'
        }`}
      >
        POLISHED<span className="text-accent">.</span>
      </a>

      <ul className="hidden md:flex items-center gap-9">
        {navItems.map((item) => (
           <li key={item.href}>
            <a
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                const id = item.href.replace('#', '');
                const el = document.getElementById(id);
                if (el) {
                  const lenis = getLenis();
                  if (lenis) lenis.scrollTo(el, { duration: 1.8, offset: 0 });
                  else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className={`text-[13px] tracking-[1.5px] uppercase font-normal relative transition-colors duration-200 ${linkClass} after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-px after:bg-accent after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
