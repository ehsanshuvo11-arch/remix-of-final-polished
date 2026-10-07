import { useState, useEffect } from 'react';
import { m, AnimatePresence, useScroll } from 'framer-motion';
import {
  Globe,
  ArrowRight,
  Sparkles,
  MessageCircle,
  HelpCircle,
  Layers,
  Sliders,
  Calculator,
  Tag,
  PhoneCall,
  Clock,
  X,
} from 'lucide-react';
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
  const [activeSection, setActiveSection] = useState<string>('');
  const { lang, toggleLanguage } = useLanguage();
  const isBn = lang === 'bn';
  const { scrollYProgress } = useScroll();
  const { data: labels } = useUILabels();

  // Scroll detection for sticky navbar background styling
  useEffect(() => {
    let frame = 0;
    let last = false;
    const handleScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const next = window.scrollY > 50;
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

  // ScrollSpy: Real-time active section tracking
  useEffect(() => {
    const sectionIds = ['work', 'evolution', 'process', 'calculator', 'services', 'faq', 'contact'];
    let frame = 0;

    const handleScrollSpy = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const triggerY = window.scrollY + 160;
        let current = '';

        for (let i = sectionIds.length - 1; i >= 0; i--) {
          const id = sectionIds[i];
          const el = document.getElementById(id);
          if (el) {
            const top = el.offsetTop;
            if (triggerY >= top) {
              current = id === 'services' ? 'pricing' : id;
              break;
            }
          }
        }
        setActiveSection(current);
      });
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    handleScrollSpy();
    return () => {
      window.removeEventListener('scroll', handleScrollSpy);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Sync with mobile bottom action bar dock
  useEffect(() => {
    const toggle = () => setOpen((o) => !o);
    window.addEventListener(MOBILE_MENU_EVENT, toggle);
    return () => window.removeEventListener(MOBILE_MENU_EVENT, toggle);
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('polished:menu-state', { detail: open }));
  }, [open]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Desktop Navigation Items (Ordered strictly by visitor decision hierarchy)
  const desktopNavItems = isBn
    ? [
        { id: 'work', label: labels?.navWorkBn ?? 'শোকেস', href: '#work' },
        { id: 'evolution', label: labels?.navEvolutionBn ?? 'বিবর্তন', href: '#evolution' },
        { id: 'process', label: 'প্রসেস', href: '#process' },
        { id: 'calculator', label: 'ক্যালকুলেটর', href: '#calculator' },
        { id: 'pricing', label: labels?.navServicesBn ?? 'প্রাইসিং', href: '#services' },
        { id: 'faq', label: 'এফএকিউ', href: '#faq' },
      ]
    : [
        { id: 'work', label: 'WORK', href: '#work' },
        { id: 'evolution', label: 'EVOLUTION', href: '#evolution' },
        { id: 'process', label: 'PROCESS', href: '#process' },
        { id: 'calculator', label: 'CALCULATOR', href: '#calculator' },
        { id: 'pricing', label: 'PRICING', href: '#services' },
        { id: 'faq', label: 'FAQ', href: '#faq' },
      ];

  // Mobile Drawer Structured Sitemap Clusters
  const sitemapClusters = [
    {
      titleBn: 'কাজের প্রমাণ ও ফলাফল',
      titleEn: 'Proof & Visual Impact',
      items: [
        {
          id: 'work',
          icon: Layers,
          labelBn: 'শোকেস ও কেস স্টাডি',
          labelEn: 'Showcase & Work',
          subBn: 'আসল ব্র্যান্ড ডিজাইন ও ROAS রেজাল্ট',
          subEn: 'Client campaigns & ad creatives',
          href: '#work',
        },
        {
          id: 'evolution',
          icon: Sliders,
          labelBn: 'বিবর্তন ও স্লাইডার তুলনা',
          labelEn: 'Visual Evolution Slider',
          subBn: 'সাধারণ টেমপ্লেট বনাম প্রিমিয়াম ক্রাফট',
          subEn: 'Before vs After visual teardowns',
          href: '#evolution',
        },
      ],
    },
    {
      titleBn: 'সিস্টেম ও ইনভেস্টমেন্ট',
      titleEn: 'Offers & Revenue Growth',
      items: [
        {
          id: 'pricing',
          icon: Tag,
          labelBn: 'প্রাইসিং ও অফার (ডুয়াল-ট্র্যাক)',
          labelEn: 'Pricing & Sprints',
          subBn: '৳৯৯৯ ট্রায়াল, গ্রোথ রিটেইনার ও মেটা স্প্রিন্ট',
          subEn: 'Dual-track fixed investment models',
          href: '#services',
          highlight: true,
        },
        {
          id: 'process',
          icon: Clock,
          labelBn: 'কীভাবে কাজ করি (প্রসেস)',
          labelEn: 'How We Operate (Process)',
          subBn: '৭২ ঘণ্টার দ্রুত ও ঝামেলাহীন ডেলিভারি',
          subEn: 'Frictionless 72-hour turnaround',
          href: '#process',
        },
        {
          id: 'calculator',
          icon: Calculator,
          labelBn: 'রেভিনিউ অপচয় ক্যালকুলেটর',
          labelEn: 'ROAS Lift Diagnostic',
          subBn: 'বিজ্ঞাপনের অপচয় ও সম্ভাব্য লাভ পরিমাপ',
          subEn: 'Calculate ad revenue leakages',
          href: '#calculator',
        },
      ],
    },
    {
      titleBn: 'সাপোর্ট ও যোগাযোগ',
      titleEn: 'Help & Direct Access',
      items: [
        {
          id: 'faq',
          icon: HelpCircle,
          labelBn: 'সচরাচর জিজ্ঞাসা (FAQ)',
          labelEn: 'Frequently Asked Questions',
          subBn: 'বিকাশ/নগদ, রিভিশন ও পলিসি গ্যারান্টি',
          subEn: 'Payments, revisions & policy safety',
          href: '#faq',
        },
        {
          id: 'contact',
          icon: PhoneCall,
          labelBn: 'সরাসরি যোগাযোগ ও পরামর্শ',
          labelEn: 'Get In Touch',
          subBn: 'হোয়াটসঅ্যাপ চ্যাট ও স্ট্র্যাটেজি ব্রিফ',
          subEn: 'Direct WhatsApp consultation',
          href: '#contact',
        },
      ],
    },
  ];

  const scrollTo = (href: string) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(el, { duration: 1.2, offset: -70 });
      } else {
        const top = el.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  const handleMobileNavClick = (href: string) => {
    setOpen(false);
    setTimeout(() => scrollTo(href), 280);
  };

  return (
    <>
      {/* Reading Progress hairline on mobile */}
      <m.div
        aria-hidden
        style={{ scaleX: scrollYProgress }}
        className="md:hidden fixed top-0 left-0 right-0 z-[140] h-[2px] origin-left bg-accent pointer-events-none"
      />

      <header>
        <nav
          aria-label="Primary Navigation"
          className={`fixed top-0 left-0 right-0 ${
            open ? 'z-[130]' : 'z-[110]'
          } flex justify-between items-center transition-all duration-300 ${
            open
              ? 'py-3.5 px-5 sm:px-8 md:px-12 bg-primary/95 backdrop-blur-xl border-b border-white/10 text-white shadow-lg'
              : scrolled
              ? 'py-3 px-5 sm:px-8 md:px-12 bg-white/95 md:backdrop-blur-xl border-b border-primary/10 shadow-[0_4px_24px_rgba(30,58,138,0.06)] text-primary'
              : 'py-4 sm:py-5 px-5 sm:px-8 md:px-12 bg-gradient-to-b from-primary/85 via-primary/40 to-transparent border-b border-transparent text-primary-foreground'
          }`}
          style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', isolation: 'isolate' }}
        >
          {/* Left Brand Identity + Live Sprint Status */}
          <div className="flex items-center gap-3.5 sm:gap-5">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                const lenis = getLenis();
                if (lenis) lenis.scrollTo(0, { duration: 1.2 });
                else window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              lang="en"
              aria-label="POLISHED Home"
              className={`brand-wordmark font-heading text-[20px] sm:text-[22px] md:text-[24px] font-bold tracking-[3.5px] transition-colors duration-200 min-h-[44px] flex items-center ${
                scrolled && !open ? 'text-primary hover:text-accent' : 'text-primary-foreground hover:text-accent'
              }`}
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              POLISHED<span className="text-accent">.</span>
            </a>

            {/* Live Availability Badge */}
            <div
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[10.5px] font-semibold tracking-wide border transition-all ${
                scrolled && !open
                  ? 'bg-accent/10 border-accent/30 text-accent'
                  : 'bg-white/10 border-white/20 text-primary-foreground/90'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              <span>{isBn ? '৭২ ঘণ্টার স্প্রিন্ট ওপেন' : '72h Sprints Open'}</span>
            </div>
          </div>

          {/* Desktop Sitemap Navigation with Real-Time ScrollSpy */}
          <ul className="hidden md:flex items-center gap-5 lg:gap-7">
            {desktopNavItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id} className="relative">
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(item.href);
                    }}
                    lang={isBn ? 'bn' : 'en'}
                    className={`relative py-1 text-[12px] lg:text-[13px] tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
                      isActive
                        ? 'text-accent font-bold'
                        : scrolled && !open
                        ? 'text-primary/75 hover:text-primary font-medium'
                        : 'text-primary-foreground/80 hover:text-white font-medium'
                    }`}
                    style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : { fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Desktop Right Actions: Language Switcher & Primary Conversion CTA */}
          <div className="hidden md:flex items-center gap-2.5 lg:gap-3">
            <button
              type="button"
              onClick={() => toggleLanguage()}
              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer active:scale-95 ${
                scrolled && !open
                  ? 'border-primary/15 bg-primary/5 text-primary hover:border-accent hover:text-accent'
                  : 'border-white/20 bg-white/10 text-primary-foreground hover:border-accent hover:text-accent'
              }`}
              title={isBn ? 'Switch to English' : 'বাংলা ভার্সন দেখুন'}
            >
              <Globe className="w-3.5 h-3.5 text-accent" />
              <span>{isBn ? 'EN' : 'বাংলা'}</span>
            </button>

            <a
              href="#services"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('#services');
              }}
              className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-accent hover:bg-accent/90 text-accent-foreground text-[11.5px] font-bold tracking-[1px] uppercase rounded-xl transition-all shadow-[0_4px_16px_rgba(251,146,60,0.35)] hover:shadow-[0_6px_22px_rgba(251,146,60,0.45)] active:scale-[0.98] cursor-pointer btn-shimmer"
            >
              <span>{isBn ? 'প্যাকেজ দেখুন' : 'Explore Plans'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Hamburger / Close Button */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close site map menu' : 'Open site map menu'}
            aria-expanded={open}
            className={`md:hidden relative w-11 h-11 flex flex-col items-center justify-center gap-[5.5px] z-[140] rounded-full transition-colors ${
              open ? 'text-primary-foreground bg-white/10' : scrolled ? 'text-primary' : 'text-primary-foreground'
            }`}
          >
            {open ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <>
                <span className="block h-[1.5px] w-5.5 bg-current transition-all" />
                <span className="block h-[1.5px] w-4 bg-current transition-all self-end mr-2.5" />
                <span className="block h-[1.5px] w-5.5 bg-current transition-all" />
              </>
            )}
          </button>
        </nav>
      </header>

      {/* ── MOBILE: Full Interactive Visual Sitemap Drawer ── */}
      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: LUXE }}
            className="md:hidden fixed inset-0 z-[125] bg-primary text-white flex flex-col justify-between overflow-y-auto"
            onClick={() => setOpen(false)}
          >
            {/* Ambient luxury glow */}
            <div
              className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-accent/20 blur-[100px] pointer-events-none"
            />
            <div
              className="absolute bottom-10 left-0 w-80 h-80 rounded-full bg-[#3b82f6]/10 blur-[100px] pointer-events-none"
            />

            {/* Drawer Body: Structured Sitemap Grid */}
            <div
              className="relative z-10 px-5 sm:px-7 pt-24 pb-8 flex-1 max-w-lg mx-auto w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Top Context Header */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <span className="text-[11px] font-bold uppercase tracking-[2px] text-accent">
                  {isBn ? 'ওয়েবসাইট নেভিগেশন ম্যাপ' : 'Website Sitemap & Navigation'}
                </span>
                <span className="text-[11px] text-white/60 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  {isBn ? '৭২ ঘণ্টার স্লট ওপেন' : '72h Sprints Open'}
                </span>
              </div>

              {/* Categorized Clusters */}
              <div className="space-y-6">
                {sitemapClusters.map((cluster, cIdx) => (
                  <m.div
                    key={cluster.titleEn}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.05 * (cIdx + 1), ease: LUXE }}
                  >
                    <p
                      className="text-[11px] font-bold uppercase tracking-[1.5px] text-white/45 mb-2.5"
                      style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
                    >
                      {isBn ? cluster.titleBn : cluster.titleEn}
                    </p>

                    <div className="space-y-2">
                      {cluster.items.map((item) => {
                        const Icon = item.icon;
                        const isCurrent = activeSection === item.id;
                        return (
                          <a
                            key={item.id}
                            href={item.href}
                            onClick={(e) => {
                              e.preventDefault();
                              handleMobileNavClick(item.href);
                            }}
                            className={`group flex items-center justify-between p-3 rounded-xl border transition-all active:scale-[0.98] ${
                              item.highlight
                                ? 'bg-accent/15 border-accent/40 text-white'
                                : isCurrent
                                ? 'bg-white/10 border-accent/50 text-white'
                                : 'bg-white/[0.04] border-white/10 text-white/90 hover:bg-white/[0.08] hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                  item.highlight
                                    ? 'bg-accent text-accent-foreground'
                                    : 'bg-white/10 text-accent group-hover:bg-accent/20'
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4
                                    className={`text-[14px] sm:text-[15px] font-semibold truncate ${
                                      item.highlight ? 'text-accent' : 'text-white'
                                    }`}
                                    style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
                                  >
                                    {isBn ? item.labelBn : item.labelEn}
                                  </h4>
                                  {isCurrent && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                                  )}
                                </div>
                                <p className="text-[11.5px] text-white/55 truncate">
                                  {isBn ? item.subBn : item.subEn}
                                </p>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                          </a>
                        );
                      })}
                    </div>
                  </m.div>
                ))}
              </div>

              {/* Bottom Quick Actions & Trust Assurance */}
              <m.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.25, ease: LUXE }}
                className="mt-7 pt-5 border-t border-white/10 space-y-3"
              >
                {/* 1-Tap Direct WhatsApp Consultation */}
                <a
                  href="https://wa.me/8801346288210?text=Hi%20POLISHED%2C%20I%20want%20to%20learn%20more%20about%20your%20design%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 rounded-xl bg-accent text-accent-foreground text-center font-bold text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_6px_24px_rgba(251,146,60,0.35)] btn-shimmer active:scale-[0.98]"
                  style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isBn ? 'হোয়াটসঅ্যাপে কথা বলুন' : 'Chat on WhatsApp'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>

                {/* Free 5-Min Audit Action */}
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setTimeout(() => openAuditModal({ source: 'Mobile Menu Drawer' }), 300);
                  }}
                  className="w-full py-3 px-5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold text-[12.5px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
                  style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
                >
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span>{isBn ? '৫-মিনিট ফ্রি ডিজাইন অডিট চান?' : 'Get Free 5-Min Ad Audit'}</span>
                </button>

                {/* Language Switcher & Assurance Strip */}
                <div className="flex items-center justify-between pt-2 text-[11px] text-white/50">
                  <button
                    type="button"
                    onClick={() => {
                      toggleLanguage();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-white/80 active:bg-white/15"
                  >
                    <Globe className="w-3 h-3 text-accent" />
                    <span>{isBn ? 'English Version' : 'বাংলা ভার্সন'}</span>
                  </button>

                  <span>⚡ ৭২ ঘণ্টা • 💳 বিকাশ/নগদ • 🛡️ ফ্রি রিভিশন</span>
                </div>
              </m.div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
