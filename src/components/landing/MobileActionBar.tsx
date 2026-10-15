import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const MOBILE_MENU_EVENT = 'polished:toggle-menu';

const WA_AUDIT_URL = "https://wa.me/8801346288210?text=%E0%A6%B9%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%B2%E0%A7%8B%20POLISHED%2C%20%E0%A6%86%E0%A6%AE%E0%A6%BE%E0%A6%B0%20Skincare%2FBeauty%20%E0%A6%AA%E0%A7%87%E0%A6%9C%E0%A7%87%E0%A6%B0%20%E0%A6%B0%E0%A6%BE%E0%A6%A8%E0%A6%BF%E0%A6%82%20%E0%A6%85%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%A1%E0%A7%87%E0%A6%B0%20%E0%A6%9C%E0%A6%A8%E0%A7%8D%E0%A6%AF%20Free%205-Min%20Video%20Audit%20%E0%A6%AA%E0%A7%87%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A5%A4%20%E0%A6%86%E0%A6%AE%E0%A6%BE%E0%A6%B0%20%E0%A6%AA%E0%A7%87%E0%A6%9C%E0%A7%87%E0%A6%B0%20%E0%A6%B2%E0%A6%BF%E0%A6%82%E0%A6%95%3A%20";
const WA_TEST_PACK_URL = "https://wa.me/8801346288210?text=%E0%A6%B9%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%B2%E0%A7%8B%20POLISHED%2C%20%E0%A6%86%E0%A6%AE%E0%A6%BF%20%E0%A7%B3%E0%A7%A8%2C%E0%A7%AB%E0%A7%A6%E0%A7%A6%20%E0%A6%9F%E0%A7%87%E0%A6%B8%E0%A7%8D%E0%A6%9F%20%E0%A6%AA%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%95%20%E0%A6%A8%E0%A6%BF%E0%A6%AF%E0%A6%BC%E0%A7%87%20%E0%A6%B6%E0%A7%81%E0%A6%B0%E0%A7%81%20%E0%A6%95%E0%A6%B0%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A5%A4";

/**
 * Native-App Fixed Bottom Conversion Bar on Mobile (<768px Only)
 * High conversion thumb bar locked to the bottom edge of the screen.
 * Desktop (>=768px) is strictly display: none.
 */
export default function MobileActionBar() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Show only after scrolling past the hero fold (scrollY > 260px)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY || document.documentElement.scrollTop;
          setIsVisible(scrollY > 260);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen for modal state to tuck bar away when modal is active
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ open: boolean }>).detail;
      if (detail) setIsModalOpen(detail.open);
    };
    window.addEventListener('polished:modal-state', handler);
    return () => window.removeEventListener('polished:modal-state', handler);
  }, []);

  const tap = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate?.(10);
  };

  if (isModalOpen) return null;

  return (
    <nav
      id="mobile-bottom-conversion-bar"
      aria-label="Mobile quick actions"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        background: 'rgba(15, 29, 70, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '7px 10px',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 7px)',
        transform: isVisible ? 'translateY(0)' : 'translateY(110%)',
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease',
      }}
      className="flex md:hidden items-center gap-2 shadow-[0_-6px_25px_rgba(0,0,0,0.35)]"
    >
      {/* Left Button: 42% width, border-white, Free Video Review */}
      <a
        id="mobile-bar-video-audit"
        href={WA_AUDIT_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={tap}
        style={{
          width: '42%',
          minHeight: '38px',
          height: '38px',
          border: '1px solid rgba(249, 250, 251, 0.25)',
          color: '#f9fafb',
          borderRadius: '8px',
          fontSize: '11.5px',
          fontWeight: 600,
          fontFamily: isBn ? "'Noto Serif Bengali', serif" : "'DM Sans', sans-serif",
        }}
        className="inline-flex items-center justify-center text-center px-1.5 transition-transform active:scale-[0.98] cursor-pointer hover:bg-white/10"
      >
        <span className="truncate">{isBn ? '💬 ফ্রি অডিট' : '💬 Free Audit'}</span>
      </a>

      {/* Right Button: 58% width, orange, ৳২,৫০০ Test Pack */}
      <a
        id="mobile-bar-test-pack"
        href={WA_TEST_PACK_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={tap}
        style={{
          width: '58%',
          minHeight: '38px',
          height: '38px',
          background: '#fb923c',
          color: '#f9fafb',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: 700,
          fontFamily: isBn ? "'Noto Serif Bengali', serif" : "'DM Sans', sans-serif",
        }}
        className="inline-flex items-center justify-center text-center px-2 transition-transform active:scale-[0.98] cursor-pointer shadow-[0_3px_12px_rgba(251,146,60,0.35)] btn-shimmer"
      >
        <span className="truncate">{isBn ? '⚡ ৳২,৫০০ টেস্ট প্যাক →' : '⚡ ৳2,500 Test Pack →'}</span>
      </a>
    </nav>
  );
}
