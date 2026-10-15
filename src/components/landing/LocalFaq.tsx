import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronDown, MessageCircle, HelpCircle } from 'lucide-react';
import MotionReveal from '@/components/landing/MotionReveal';

interface FaqItem {
  qBn: string;
  qEn: string;
  aBn: string;
  aEn: string;
}

const FAQS: FaqItem[] = [
  {
    qBn: 'আমি তো নিজেই ক্যানভা দিয়ে ডিজাইন করতে পারি, আপনাদের কেন লাগবে?',
    qEn: "Can't I just design on Canva myself? Why do I need you?",
    aBn: 'ক্যানভার ফ্রি টেমপ্লেটটি আজ আপনার পেজেও আছে, আবার চকবাজারের নকল প্রোডাক্টের পেজেও আছে। কাস্টমার দুটোকে আলাদা করতে পারে না বলেই ভয়ে অর্ডার করে না। আমরা আপনার প্রোডাক্টকে এমন একটা চেহারা দিই—যা দেখলেই কাস্টমার বোঝে এটি আসল।',
    aEn: "Free Canva templates are used everywhere, including counterfeit pages. Shoppers can't tell the difference, so they hesitate. We craft visuals that instantly prove your product is genuine.",
  },
  {
    qBn: '৳২,৫০০ টাকার টেস্ট প্যাকে কয় দিনে কী কী পাব?',
    qEn: 'What do I get in the ৳2,500 Test Pack and in how many days?',
    aBn: '৪৮ থেকে ৭২ ঘণ্টার মধ্যে ১টি ভিডিও রিল (9:16), ২টি ছবির পোস্ট (1:1) এবং বাংলা ক্যাপশন সরাসরি আপনার হোয়াটসঅ্যাপে পেয়ে যাবেন।',
    aEn: 'Within 48 to 72 hours, you get 1x video reel (9:16), 2x static feed posts (1:1), and persuasive Bengali copy delivered directly to your WhatsApp.',
  },
  {
    qBn: 'পেমেন্ট কীভাবে করব?',
    qEn: 'How do I make the payment?',
    aBn: 'বিকাশ, নগদ অথবা ব্যাংকে ১০০% অগ্রিম পেমেন্ট করে প্রোডাক্টের ছবি পাঠালেই কাজ শুরু হয়ে যাবে।',
    aEn: 'Simply complete 100% upfront payment via bKash, Nagad, or Bank Transfer and send product photos to begin.',
  },
  {
    qBn: 'ডিজাইনে কিছু বদলাতে চাইলে?',
    qEn: 'What if I want changes to the design?',
    aBn: 'প্রতিটি কাজে সর্বোচ্চ ২ বার লেখা বা রঙের ছোটখাটো পরিবর্তন একদম ফ্রি করে দেওয়া হবে।',
    aEn: 'Every order includes up to 2 rounds of minor copy or color refinements completely free of charge.',
  },
  {
    qBn: 'আমার কাস্টমাররা সবসময় ডিসকাউন্ট চায়—এটা কি বন্ধ হবে?',
    qEn: 'My customers always ask for discounts—will this stop?',
    aBn: 'মানুষ তখনই দামাদামি করে যখন সে প্রোডাক্টের মান নিয়ে সন্দিহান থাকে। ছবি ও ভিডিও দেখে প্রোডাক্টটিকে ভরসা করতে পারলে কাস্টমার পুরো দাম দিয়েই কেনে।',
    aEn: 'People only bargain when they doubt the product quality. Once visuals build genuine trust, customers happily order at full price.',
  },
  {
    qBn: 'পার্সেল রিটার্ন (COD Return) কি সত্যিই কমবে?',
    qEn: 'Will Cash-on-Delivery (COD) parcel returns really decrease?',
    aBn: 'হ্যাঁ। হুজুগে বা ছাড়ের লোভে অর্ডার করা মানুষই পার্সেল ফিরিয়ে দেয়। জেনে-বুঝে যারা অর্ডার করে, তারা ডেলিভারি ম্যানের কল মিস করে না।',
    aEn: 'Yes. Impulse buyers seeking cheap discounts are the ones who return parcels. Serious buyers who trust genuine quality eagerly wait for the rider.',
  },
];

export default function LocalFaq() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showAllMobile, setShowAllMobile] = useState(false);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-10 sm:py-14 md:py-28 px-4 sm:px-6 md:px-14 bg-[#f9fafb] text-primary border-t border-primary/10">
      <div className="max-w-[880px] mx-auto">
        <MotionReveal>
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <span 
              className="eyebrow-pill-kicker inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary mb-2.5 sm:mb-3.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-accent" />
              <span>{isBn ? 'সচরাচর জিজ্ঞাসা' : 'FREQUENTLY ASKED QUESTIONS'}</span>
            </span>
            <h2 
              className="section-heading-h2 font-heading font-normal text-primary mx-auto mb-2.5 sm:mb-3.5 text-center"
              style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : { fontFamily: "'Cormorant Garamond', serif" }}
            >
              {isBn ? (
                <>কোনো সংশয় বা প্রশ্ন? <span className="italic text-accent">জেনে নিন সরাসরি।</span></>
              ) : (
                <>Clear Answers for <span className="italic text-accent">Ambitious Brands.</span></>
              )}
            </h2>
            <p 
              className="section-lead-subtitle text-primary/75 max-w-xl mx-auto text-center"
              style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
            >
              {isBn 
                ? 'বাংলাদেশি ক্লায়েন্টদের সাধারণ ভাবনা ও উদ্বেগের খোলামেলা উত্তর।' 
                : 'Clear, transparent answers to help ambitious business owners make confident decisions.'}
            </p>
          </div>
        </MotionReveal>

        <div className="space-y-2.5 md:space-y-3.5">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            const isHiddenOnMobile = i >= 3 && !showAllMobile;

            return (
              <div key={i} className={isHiddenOnMobile ? 'hidden md:block' : 'block'}>
                <MotionReveal delay={0.04 * i}>
                  <div 
                    className={`rounded-xl md:rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isOpen 
                        ? 'bg-white border-accent/50 shadow-[0_8px_24px_rgba(0,0,0,0.06)]' 
                        : 'bg-white/70 border-primary/10 hover:border-primary/20 hover:bg-white'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      className="w-full py-3.5 md:py-4.5 px-4 md:px-6 text-left flex items-center justify-between gap-3 md:gap-4 font-heading cursor-pointer select-none"
                      aria-expanded={isOpen}
                    >
                      <span 
                        className={`text-[14px] md:text-[17px] font-medium transition-colors ${
                          isOpen ? 'text-primary font-semibold' : 'text-primary/90'
                        }`}
                        style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
                      >
                        {isBn ? faq.qBn : faq.qEn}
                      </span>
                      <span className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 bg-accent/15 text-accent' : 'bg-primary/5 text-primary/60'
                      }`}>
                        <ChevronDown className="w-4 h-4" />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <m.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 md:px-6 pb-4 md:pb-5 pt-1 border-t border-primary/5 text-xs md:text-sm text-primary/80 leading-relaxed font-sans">
                            <p style={isBn ? { fontFamily: "'Noto Serif Bengali', serif", lineHeight: 1.8 } : { lineHeight: 1.7 }}>
                              {isBn ? faq.aBn : faq.aEn}
                            </p>
                          </div>
                        </m.div>
                      )}
                    </AnimatePresence>
                  </div>
                </MotionReveal>
              </div>
            );
          })}
        </div>

        {/* Mobile Show More / Show Less Toggle Button (<768px) */}
        <div className="md:hidden mt-4 text-center">
          <button
            type="button"
            onClick={() => setShowAllMobile((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-primary/20 bg-white/80 text-[12px] font-semibold text-primary/80 hover:text-accent hover:border-accent shadow-xs cursor-pointer transition-colors"
            style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
          >
            <span>{isBn ? (showAllMobile ? 'সংক্ষিপ্ত করুন' : 'আরও ৩টি সাধারণ প্রশ্ন দেখুন') : (showAllMobile ? 'Show Less' : 'Show 3 More Questions')}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showAllMobile ? 'rotate-180' : ''}`} />
          </button>
        </div>
        {/* Minimal Reassuring WhatsApp Link below FAQ */}
        <MotionReveal delay={0.2}>
          <div className="mt-10 text-center">
            <a
              href="https://wa.me/8801346288210?text=Hi%20POLISHED%2C%20I%20have%20a%20question%20about%20working%20together."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-primary hover:text-accent transition-colors"
              style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
            >
              <MessageCircle className="w-4 h-4 text-accent" />
              <span>
                {isBn ? 'অন্য কোনো প্রশ্ন বা দ্বিধা আছে? সরাসরি হোয়াটসঅ্যাপে কথা বলুন →' : 'Still have questions? Chat directly with our team on WhatsApp →'}
              </span>
            </a>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
