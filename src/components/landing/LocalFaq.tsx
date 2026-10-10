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
    qBn: 'ক্যানভা দিয়ে নিজে বানালেই তো হয়, আপনাদের কেন টাকা দেব?',
    qEn: "Can't I just design on Canva myself? Why hire you?",
    aBn: 'ক্যানভার ফ্রি টেমপ্লেট এখন ফেসবুকের হাজারটা পেজ ব্যবহার করছে। কাস্টমার স্ক্রল করার আধা সেকেন্ডের মধ্যেই বুঝে ফেলে এটা সস্তা কোনো প্রোডাক্ট। ফলাফল? বিজ্ঞাপনে ক্লিক ঠিকই পড়ে, কিন্তু ইনবক্সে এসে "দাম কত" বলেই মানুষ উধাও হয়ে যায়। আমরা কোনো সাধারণ ছবি বানাই না; আমরা প্রোডাক্টের আসল গুণ আর ক্রেতার কেনার মনস্তত্ত্ব ফ্রেম করি। এতে বিজ্ঞাপন খরচ কমে, কাস্টমার দ্বিধা ছাড়া ফুল প্রাইসে কেনে।',
    aEn: "Everyone on Facebook uses the same Canva templates. Shoppers spot them in 0.5 seconds. They assume your product is cheap, drop a lazy 'Price please?' in comments, and vanish. We do not make generic graphics. We build trust triggers and sharp copy that make people order at full price without bargaining.",
  },
  {
    qBn: '৩,৯৯৯ টাকার টেস্ট ড্রাইভ স্প্রিন্টে আমি ঠিক কী কী পাব এবং ডেলিভারি কবে?',
    qEn: 'What exactly do I get in the ৳3,999 sprint and how fast is delivery?',
    aBn: 'আপনার একটি নির্দিষ্ট হিরো প্রোডাক্টের জন্য পাচ্ছেন ৫টি হাই-কনভার্টিং মেটা অ্যাড ক্রিয়েটিভ (ফিড স্কয়ার ও ৯:১৬ স্টোরি/রিলস সাইজ)। সাথে থাকছে ধারালো বাংলা ও ইংরেজি সেলস কপি, যা বিজ্ঞাপনের ক্লিকের সংখ্যা বাড়ায় ও প্রতি অর্ডারের খরচ কমায়। ব্রিফ পাওয়ার ঠিক ৭২ ঘণ্টার মধ্যে রেডি-টু-রান ক্রিয়েটিভ আপনার হাতে পৌঁছে যাবে।',
    aEn: 'You receive 5 conversion-ready Meta ad creatives tailored to your hero product (Feed + 9:16 Story/Reels), complete with punchy Bengali & English hooks engineered to cut cost-per-result. Delivered in 72 hours flat, 100% ready to run.',
  },
  {
    qBn: 'পেমেন্ট কীভাবে করব? বিকাশ বা নগদে কি দেওয়া যাবে?',
    qEn: 'How do I pay? Do you accept bKash or Nagad?',
    aBn: 'কোনো ডলার কার্ড বা পাসপোর্ট এনডোর্সমেন্টের ঝামেলা নেই। বিকাশ, নগদ, রকেট কিংবা যেকোনো দেশি ব্যাংক ট্রান্সফারের মাধ্যমে সহজেই পেমেন্ট করতে পারবেন। পেমেন্ট কনফার্ম হওয়ার সাথে সাথেই ডিজিটাল ইনভয়েস ও ডেলিভারি কাউন্টডাউন শুরু হয়ে যাবে।',
    aEn: 'Zero dollar card or passport endorsement hassle. You can pay directly via bKash, Nagad, Rocket, or local bank transfer. An official invoice and delivery schedule are issued immediately.',
  },
  {
    qBn: 'ডিজাইন পছন্দ না হলে বা কোনো পরিবর্তন লাগলে কী হবে?',
    qEn: 'What if I need revisions or changes to the creatives?',
    aBn: '৭২ ঘণ্টায় ডেলিভারি পাওয়ার পর আপনি টেক্সট, কালার, সাইজ বা লেআউট পরিবর্তন চাইতে পারেন। যতক্ষণ না মনে হবে ক্রিয়েটিভটি দিয়ে বিজ্ঞাপনে নামলে আসল সেলস আসবে, ততক্ষণ পর্যন্ত আমরা বিনামূল্যে সম্পূর্ণ রিভিশন সাপোর্ট দেব।',
    aEn: 'Once you review your 72-hour delivery, you can request any layout, hook, or visual adjustments. We provide unlimited fine-tuning until you are completely confident in running the ads.',
  },
  {
    qBn: 'আমার কাস্টমাররা তো সবসময় ডিসকাউন্ট খোঁজে, ভালো ক্রিয়েটিভে কি ফুল প্রাইসে বিক্রি হবে?',
    qEn: 'My customers always demand discounts. Will better creatives fix this?',
    aBn: 'কাস্টমার তখনই ডিসকাউন্ট চায় যখন সে বিজ্ঞাপনে প্রোডাক্টের বিশ্বাসযোগ্যতা পায় না। সস্তা বিজ্ঞাপন মানেই প্রোডাক্ট সস্তা। যখন আপনার ক্রিয়েটিভ দেখতে হাই-এন্ড ব্র্যান্ডের মতো হবে এবং কথায় স্পষ্ট যুক্তি থাকবে, তখন মানুষ দাম নিয়ে দরদাম করা বন্ধ করে সরাসরি পুরো দামে অর্ডার করবে।',
    aEn: "Shoppers haggle when an ad looks cheap and generic. When your creative carries unquestionable authority and sharp copy, buyers realize it is premium. They stop bargaining and place orders at full price.",
  },
  {
    qBn: 'ক্যাশ অন ডেলিভারিতে (COD) রিটার্ন রেট কি এতে কমবে?',
    qEn: 'Will this help reduce high Cash-on-Delivery (COD) return rates?',
    aBn: 'অবশ্যই। যারা ভুল প্রত্যাশা নিয়ে হুজুগে ক্লিক করে, তারাই ডেলিভারিম্যান দরজায় গেলে পার্সেল ফিরিয়ে দেয়। আমাদের প্রতিটি ক্রিয়েটিভে প্রোডাক্টের ব্যবহার, ফলাফল এবং কার্যকারিতা স্বচ্ছভাবে তুলে ধরা হয়। ফলে শুধু সিরিয়াস বায়াররাই অর্ডার করে, যা আপনার পার্সেল রিটার্নের লোকসান নাটকীয়ভাবে কমিয়ে দেয়।',
    aEn: 'Confused or impulse-click shoppers cancel at the door. When your ads set crystal-clear expectations and showcase genuine product proof upfront, frivolous clicks drop. Only serious buyers order, drastically slashing your return loss.',
  },
];

export default function LocalFaq() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-14 md:py-28 px-4 sm:px-6 md:px-14 bg-[#f9fafb] text-primary border-t border-primary/10">
      <div className="max-w-[880px] mx-auto">
        <MotionReveal>
          <div className="text-center mb-12">
            <span 
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-[2px] uppercase bg-primary/10 text-primary mb-3"
              style={isBn ? { fontFamily: "'Noto Serif Bengali', serif", letterSpacing: '1px' } : undefined}
            >
              <HelpCircle className="w-3.5 h-3.5 text-accent" />
              {isBn ? 'সচরাচর জিজ্ঞাসা ও ভয় দূরীকরণ' : 'Frequently Asked Questions'}
            </span>
            <h2 
              className="text-2xl md:text-4xl font-heading font-normal text-primary leading-tight mb-3"
              style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
            >
              {isBn ? 'কোনো সংশয় বা প্রশ্ন? জেনে নিন সরাসরি।' : 'Got Questions? Everything You Need to Know.'}
            </h2>
            <p 
              className="text-sm md:text-base text-primary/70 max-w-lg mx-auto"
              style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
            >
              {isBn 
                ? 'বাংলাদেশি ক্লায়েন্টদের সাধারণ ভাবনা ও উদ্বেগের খোলামেলা উত্তর।' 
                : 'Clear, transparent answers to help ambitious business owners make confident decisions.'}
            </p>
          </div>
        </MotionReveal>

        <div className="space-y-3.5">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <MotionReveal key={i} delay={0.06 * i}>
                <div 
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen 
                      ? 'bg-white border-accent/50 shadow-[0_8px_24px_rgba(0,0,0,0.06)]' 
                      : 'bg-white/70 border-primary/10 hover:border-primary/20 hover:bg-white'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    className="w-full py-4.5 px-5 md:px-6 text-left flex items-center justify-between gap-4 font-heading cursor-pointer select-none"
                    aria-expanded={isOpen}
                  >
                    <span 
                      className={`text-[15px] md:text-[17px] font-medium transition-colors ${
                        isOpen ? 'text-primary font-semibold' : 'text-primary/90'
                      }`}
                      style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
                    >
                      {isBn ? faq.qBn : faq.qEn}
                    </span>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
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
                        <div className="px-5 md:px-6 pb-5 pt-1 border-t border-primary/5 text-xs md:text-sm text-primary/80 leading-relaxed font-sans">
                          <p style={isBn ? { fontFamily: "'Noto Serif Bengali', serif", lineHeight: 1.8 } : { lineHeight: 1.7 }}>
                            {isBn ? faq.aBn : faq.aEn}
                          </p>
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              </MotionReveal>
            );
          })}
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
