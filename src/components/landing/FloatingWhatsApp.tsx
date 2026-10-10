import { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, X } from 'lucide-react';

export default function FloatingWhatsApp() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let ticking = false;
    let lastVisible = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        // Show after scrolling past 300px
        const next = window.scrollY > 300;
        if (next !== lastVisible) {
          lastVisible = next;
          setVisible(next);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {!dismissed && visible && (
        <m.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 350, damping: 26 }}
          style={{ transform: 'translateZ(0)' }}
          className="hidden md:flex fixed bottom-6 right-6 z-[95] items-center gap-2.5"
        >
          <m.a
            href="https://wa.me/8801346288210?text=Hi%20POLISHED%2C%20I%20want%20to%20chat%20about%20my%20brand%20design."
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="group flex items-center gap-2.5 py-2.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.4)] border border-white/20 cursor-pointer"
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
          </m.a>

          <m.button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss WhatsApp quick button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-7 h-7 rounded-full bg-primary/80 hover:bg-primary text-white/80 hover:text-white flex items-center justify-center text-xs backdrop-blur-md transition-colors shadow-md border border-white/10 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </m.button>
        </m.div>
      )}
    </AnimatePresence>
  );
}

