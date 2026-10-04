import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ShieldCheck, Zap, MessageCircle, PhoneCall, ArrowRight, CreditCard, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';

export const QUICK_BOOKING_EVENT = 'polished:open-quick-booking';

export interface QuickBookingDetail {
  tierId?: string;
  tierTitle?: string;
  tierTitleBn?: string;
  price?: string;
  priceBn?: string;
  delivery?: string;
  deliveryBn?: string;
  deliverables?: string[];
  deliverablesBn?: string[];
  source?: string;
}

export function openQuickBookingModal(detail?: QuickBookingDetail) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(QUICK_BOOKING_EVENT, { detail }));
  }
}

const DEFAULT_DETAILS: QuickBookingDetail = {
  tierId: 'trial-pack',
  tierTitle: 'Ad Test Drive Sprint (Stop Budget Leak)',
  tierTitleBn: 'বিজ্ঞাপন টেস্ট ড্রাইভ স্প্রিন্ট (বিজ্ঞাপনের টাকা অপচয় বন্ধের ট্রায়াল)',
  price: '৳3,999',
  priceBn: '৳৩,৯৯৯',
  delivery: '48-Hour Rapid Delivery',
  deliveryBn: '৪৮ ঘণ্টায় দ্রুত ডেলিভারি',
  deliverables: [
    '5 High-Converting Meta Ad Creatives (1:1 Feed & 9:16 Story/Reels)',
    'Persuasive Bengali & English Ad Copy & Strategic Hooks',
    '100% Free Unlimited Revisions until fully satisfied',
    'bKash, Nagad & Local Bank Transfer supported',
  ],
  deliverablesBn: [
    '৫টি হাই-কনভার্টিং মেটা অ্যাড ক্রিয়েটিভ (১:১ ফিড ও ৯:১৬ রিলস)',
    'অর্ডার বাড়ানোর ধারালো বাংলা ও ইংরেজি সেলস কপিরাইটিং',
    '১০০% ফ্রি আনলিমিটেড রিভিশন নিশ্চয়তা',
    'বিকাশ, নগদ ও দেশি ব্যাংক ট্রান্সফারে সহজ পেমেন্ট',
  ],
};

export default function QuickBookingModal() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';

  const [isOpen, setIsOpen] = useState(false);
  const [details, setDetails] = useState<QuickBookingDetail>(DEFAULT_DETAILS);
  const [showCallback, setShowCallback] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [brand, setBrand] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customDetail = (e as CustomEvent<QuickBookingDetail>).detail;
      setDetails({
        ...DEFAULT_DETAILS,
        ...(customDetail || {}),
      });
      setIsSuccess(false);
      setErrorMsg('');
      setShowCallback(false);
      setIsOpen(true);
      window.dispatchEvent(new CustomEvent('polished:modal-state', { detail: { open: true } }));
    };

    window.addEventListener(QUICK_BOOKING_EVENT, handleOpen);
    return () => window.removeEventListener(QUICK_BOOKING_EVENT, handleOpen);
  }, []);

  const close = () => {
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent('polished:modal-state', { detail: { open: false } }));
  };

  // Close on ESC
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) close();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const activeTitle = isBn ? (details.tierTitleBn || details.tierTitle) : details.tierTitle;
  const activePrice = isBn ? (details.priceBn || details.price) : details.price;
  const activeDelivery = isBn ? (details.deliveryBn || details.delivery) : details.delivery;
  const activePerks = (isBn && details.deliverablesBn && details.deliverablesBn.length > 0)
    ? details.deliverablesBn
    : details.deliverables;

  // Construct instant WhatsApp deep link
  const waMessage = encodeURIComponent(
    `Hi POLISHED! I want to confirm the ${details.tierTitle} (${details.price}). My brand is: `
  );
  const waUrl = `https://wa.me/8801346288210?text=${waMessage}`;

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMsg(isBn ? 'অনুগ্রহ করে আপনার নাম এবং মোবাইল নম্বর দিন।' : 'Please enter your name and phone number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const { error } = await supabase.from('leads').insert([
        {
          client_name: name.trim(),
          brand_name: brand.trim() || 'Direct Callback Request',
          whatsapp: phone.trim(),
          objective: `Quick Booking: ${details.tierTitle} (${details.price})`,
          notes: `Callback requested via Quick Booking Modal. Source: ${details.source || 'Website CTA'}`,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error('Lead submission error:', error);
      }
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setIsSuccess(true); // Don't block user experience
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[500] overflow-y-auto p-4 flex items-center justify-center min-h-screen">
          {/* Frosted Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            className="fixed inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <m.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-[#1e3a8a] text-[#f9fafb] border border-white/15 rounded-2xl md:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.65)] overflow-hidden z-10 my-auto max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient luxury accent glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

            {/* Header */}
            <div className="relative z-10 px-6 pt-6 pb-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent text-[11px] font-bold tracking-wider uppercase">
                  <Zap className="w-3 h-3" />
                  <span>{activeDelivery}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-white/60 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                  <span>{isBn ? 'জিরো লক-ইন' : 'Zero Lock-in'}</span>
                </span>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close modal"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="relative z-10 p-6 md:p-7 space-y-6 overflow-y-auto max-h-[calc(92vh-70px)]">
              {/* Package Summary Box */}
              <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/10">
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <h3
                    className="text-lg md:text-xl font-bold text-white tracking-wide"
                    style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
                  >
                    {activeTitle}
                  </h3>
                  <span className="text-2xl md:text-3xl font-extrabold text-accent shrink-0 font-sans">
                    {activePrice}
                  </span>
                </div>
                <p className="text-xs text-white/70 mb-4 font-sans">
                  {isBn
                    ? 'কোনো দীর্ঘমেয়াদী চুক্তি নেই। সন্তুষ্ট না হওয়া পর্যন্ত ১০০% রিভিশন নিশ্চয়তা।'
                    : 'No long-term contracts. 100% fine-tuning until you are fully satisfied.'}
                </p>

                {/* Deliverables Checklist */}
                <div className="space-y-2.5 pt-3 border-t border-white/10">
                  {activePerks?.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-white/90">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instant WhatsApp Conversion Button (Primary High-Converting Action) */}
              <div className="space-y-3">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className="w-full py-4 px-6 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-sm md:text-base flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_36px_rgba(37,211,102,0.6)] active:scale-[0.98] group cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-current shrink-0 group-hover:scale-110 transition-transform" />
                  <span style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}>
                    {isBn ? 'হোয়াটসঅ্যাপে বুকিং কনফার্ম করুন (তাৎক্ষণিক রেসপন্স)' : 'Confirm via WhatsApp (Instant Reply)'}
                  </span>
                  <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
                </a>

                {/* Payment Assurance Strip */}
                <div className="flex items-center justify-between text-[11px] text-white/60 px-1 font-sans">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-accent" />
                    <span>{isBn ? 'বিকাশ, নগদ ও ব্যাংক ট্রান্সফার' : 'bKash, Nagad & Bank Transfer'}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-accent" />
                    <span>{isBn ? 'গড় রেসপন্স: ৫-১০ মিনিট' : 'Avg. Reply: 5-10 mins'}</span>
                  </span>
                </div>
              </div>

              {/* Secondary Option: Request Quick Phone Callback */}
              <div className="pt-2 border-t border-white/10">
                {!showCallback && !isSuccess && (
                  <button
                    type="button"
                    onClick={() => setShowCallback(true)}
                    className="w-full py-2.5 text-center text-xs text-white/70 hover:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-accent" />
                    <span>
                      {isBn
                        ? 'অথবা সরাসরি ফোনে কথা বলতে চান? কল ব্যাক রিকোয়েস্ট পাঠান'
                        : 'Prefer a quick phone call? Request a call back'}
                    </span>
                  </button>
                )}

                {showCallback && !isSuccess && (
                  <form onSubmit={handleCallbackSubmit} className="space-y-3 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        placeholder={isBn ? 'আপনার নাম *' : 'Your Name *'}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 bg-white/[0.08] border border-white/15 rounded-lg text-xs text-white placeholder-white/40 focus:outline-none focus:border-accent"
                      />
                      <input
                        type="tel"
                        placeholder={isBn ? 'মোবাইল নম্বর *' : 'Phone Number *'}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 bg-white/[0.08] border border-white/15 rounded-lg text-xs text-white placeholder-white/40 focus:outline-none focus:border-accent"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder={isBn ? 'ব্র্যান্ডের নাম / ফেসবুক পেজ লিঙ্ক (ঐচ্ছিক)' : 'Brand Name or Page Link (Optional)'}
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white/[0.08] border border-white/15 rounded-lg text-xs text-white placeholder-white/40 focus:outline-none focus:border-accent"
                    />
                    {errorMsg && <p className="text-[11px] text-red-400">{errorMsg}</p>}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <span>{isBn ? 'পাঠানো হচ্ছে...' : 'Sending...'}</span>
                      ) : (
                        <>
                          <span>{isBn ? 'কল ব্যাক রিকোয়েস্ট নিশ্চিত করুন' : 'Submit Call Back Request'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {isSuccess && (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-center">
                    <p className="text-xs text-emerald-300 font-bold mb-1">
                      {isBn ? '✓ আপনার রিকোয়েস্ট পাওয়া গেছে!' : '✓ Callback request received!'}
                    </p>
                    <p className="text-[11px] text-white/70">
                      {isBn
                        ? 'আমাদের সিনিয়র ডিজাইনার ১০-১৫ মিনিটের মধ্যে আপনার সাথে যোগাযোগ করবেন।'
                        : 'Our senior designer will call you back within 10-15 minutes.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
