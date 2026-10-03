import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, X } from 'lucide-react';

export default function FloatingWhatsApp() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        // Show after scrolling past 300px
        if (window.scrollY > 300) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (dismissed || !visible) return null;

  return (
    <div className="hidden md:flex fixed bottom-6 right-6 z-[95] items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <a
        href="https://wa.me/8801346288210?text=Hi%20POLISHED%2C%20I%20want%20to%20chat%20about%20my%20brand%20design."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group flex items-center gap-2.5 py-2.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20"
      >
        <span className="relative flex h-3 w-3 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
        </span>
        <MessageCircle className="w-5 h-5 fill-current" />
        <span 
          className="text-xs md:text-sm font-bold tracking-wide whitespace-nowrap"
          style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
        >
          {isBn ? 'হোয়াটসঅ্যাপে কথা বলুন' : 'Chat on WhatsApp'}
        </span>
      </a>

      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss WhatsApp quick button"
        className="w-7 h-7 rounded-full bg-primary/80 hover:bg-primary text-white/80 hover:text-white flex items-center justify-center text-xs backdrop-blur-md transition-colors shadow-md border border-white/10"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
