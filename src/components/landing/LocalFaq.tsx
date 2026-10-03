import { useState } from 'react';
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
    qBn: 'আমার পেজ তো এখনও নতুন বা ছোট, আমাদের মতো ব্র্যান্ডের জন্য কি আপনারা কাজ করেন?',
    qEn: 'My business is relatively new or small. Do you work with brands like mine?',
    aBn: 'হ্যাঁ, অবশ্যই! আসলে নতুন পেজেই প্রফেশনাল ডিজাইনের সবচেয়ে বেশি দরকার। বাংলাদেশে ক্রেতারা অচেনা ব্র্যান্ড দেখে ক্যাশ অন ডেলিভারিতেও (COD) অর্ডার করতে দ্বিধাবোধ করে। একটি প্রিমিয়াম, পরিচ্ছন্ন ভিজ্যুয়াল প্রেজেন্টেশন মুহূর্তেই ক্রেতার আস্থা অর্জন করে। আর তাই কোনো দীর্ঘমেয়াদী চুক্তি ছাড়াই মাত্র ৩,৯৯৯ টাকায় আমরা স্টার্টার টেস্ট ড্রাইভ স্প্রিন্ট রেখেছি।',
    aEn: 'Absolutely! Emerging brands need high-trust visuals the most. In local e-commerce, shoppers hesitate on Cash-on-Delivery with unverified brands. Polished creative instantly establishes credibility. That is why we offer our ৳3,999 trial sprint—zero contracts, pure results.',
  },
  {
    qBn: '৩,৯৯৯ টাকার নো-রিস্ক টেস্ট ড্রাইভে আমি ঠিক কী কী পাব?',
    qEn: 'What exactly do I get in the ৳3,999 No-Risk Test Drive?',
    aBn: 'আপনি পাচ্ছেন আপনার নির্দিষ্ট একটি প্রোডাক্টের জন্য ৫টি হাই-কনভার্টিং মেটা অ্যাড ক্রিয়েটিভ (ফেসবুক ও ইনস্টাগ্রামের জন্য স্কয়ার ফিড ও ৯:১৬ স্টোরি সাইজ)। সাথে থাকবে অর্ডার কনভার্সন বাড়ানোর মতো মনস্তাত্ত্বিক বাংলা ও ইংরেজি সেলস কপিরাইটিং। ব্রিফ পাওয়ার মাত্র ৪৮ ঘণ্টার মধ্যে রেডি-টু-রান ক্রিয়েটিভ আপনার হাতে পৌঁছে যাবে।',
    aEn: 'You receive 5 high-converting Meta Ad creatives tailored to your hero product (Feed + 9:16 Story formats), complete with persuasive Bengali & English ad copy designed to maximize ROAS. Delivered in just 48 hours, 100% ready to run.',
  },
  {
    qBn: 'পেমেন্ট কীভাবে করব? কোনো আন্তর্জাতিক ডলার কার্ড লাগবে?',
    qEn: 'How do I pay? Do I need an international dollar card?',
    aBn: 'কোনো আন্তর্জাতিক ডলার কার্ড বা পাসপোর্ট এনডোর্সমেন্টের প্রয়োজন নেই। আপনি বিকাশ, নগদ, রকেট অথবা যেকোনো বাংলাদেশি ব্যাংকে সরাসরি ট্রান্সফারের মাধ্যমে সহজেই পেমেন্ট সম্পন্ন করতে পারবেন। পেমেন্টের সাথে সাথেই প্রজেক্ট কনফার্মেশন ও ডিজিটাল ইনভয়েস পাঠিয়ে দেওয়া হয়।',
    aEn: 'No international cards needed. You can pay seamlessly via bKash, Nagad, Rocket, or direct local bank transfer. An official invoice and receipt are issued immediately upon confirmation.',
  },
  {
    qBn: 'ডিজাইন পছন্দ না হলে বা কোনো পরিবর্তন লাগলে কী হবে?',
    qEn: 'What if I need changes or revisions to the creatives?',
    aBn: 'আপনার সন্তুষ্টিই আমাদের সর্বোচ্চ অগ্রাধিকার। ৪৮ ঘণ্টায় ড্রাফট ক্রিয়েটিভ দেখার পর আপনি যেকোনো টেক্সট, কালার বা লেআউট পরিবর্তন চাইতে পারেন। আপনি সম্পূর্ণ সন্তুষ্ট না হওয়া পর্যন্ত আমরা বিনামূল্যে আনলিমিটেড রিভিশন ও ফাইন-টিউনিং সাপোর্ট প্রদান করি।',
    aEn: 'Your satisfaction is our priority. Once you review your 48-hour delivery, you can request any layout, text, or color adjustments. We provide unlimited fine-tuning until you are 100% delighted.',
  },
  {
    qBn: 'কাজ শুরু করতে আমাকে কী করতে হবে? কোনো জটিল ফর্ম বা মিটিং আছে?',
    qEn: 'How do we get started? Are there long forms or kickoff meetings?',
    aBn: 'একদমই কোনো জটিল ফর্ম বা দীর্ঘ মিটিং নেই! নিচের হোয়াটসঅ্যাপ বাটনে ক্লিক করলেই সরাসরি আমাদের ক্রিয়েটিভ টিমের সাথে চ্যাট ওপেন হবে। আপনার প্রোডাক্টের ছবি বা ফেসবুক পেজের লিংক আমাদের সাথে শেয়ার করলেই বাকি পুরো প্রসেস আমরা সামলে নেব।',
    aEn: 'Zero friction, zero tedious onboarding. Simply tap the WhatsApp button to chat directly with our team. Share your product photos or Facebook page link, and we handle the rest.',
  },
  {
    qBn: 'আপনারা কি শুধু স্কিনকেয়ারের কাজ করেন নাকি অন্যান্য ব্র্যান্ডেও করেন?',
    qEn: 'Do you only work with skincare or other niches as well?',
    aBn: 'স্কিনকেয়ার ও কসমেটিকস আমাদের প্রধান বিশেষত্ব হলেও, আমরা নিয়মিত পারফিউম, ফ্যাশন ও ক্লোদিং, অর্গানিক ফুড, হেলথ সাপ্লিমেন্ট এবং লাক্সারি লাইফস্টাইল ব্র্যান্ডের জন্যও হাই-কনভার্টিং অ্যাড ও ভিজ্যুয়াল আইডেন্টিটি তৈরি করি।',
    aEn: 'While skincare and beauty are our flagship expertise, we regularly scale perfumes, premium apparel, organic health foods, and boutique lifestyle D2C brands across Bangladesh.',
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
    <section id="faq" className="py-20 md:py-28 px-6 md:px-14 bg-[#f9fafb] text-primary border-t border-primary/10">
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

                  {isOpen && (
                    <div className="px-5 md:px-6 pb-5 pt-1 border-t border-primary/5 text-xs md:text-sm text-primary/80 leading-relaxed font-sans animate-in fade-in duration-300">
                      <p style={isBn ? { fontFamily: "'Noto Serif Bengali', serif", lineHeight: 1.8 } : { lineHeight: 1.7 }}>
                        {isBn ? faq.aBn : faq.aEn}
                      </p>
                    </div>
                  )}
                </div>
              </MotionReveal>
            );
          })}
        </div>

        {/* Reassuring WhatsApp CTA below FAQ */}
        <MotionReveal delay={0.3}>
          <div className="mt-12 p-6 md:p-8 rounded-2xl bg-[#1e3a8a] text-primary-foreground text-center relative overflow-hidden shadow-xl">
            <div className="relative z-10 max-w-md mx-auto">
              <h3 
                className="text-lg md:text-xl font-heading font-medium text-white mb-2"
                style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
              >
                {isBn ? 'আপনার ব্র্যান্ড নিয়ে কোনো নির্দিষ্ট প্রশ্ন আছে?' : 'Have a Specific Question About Your Brand?'}
              </h3>
              <p 
                className="text-xs md:text-sm text-white/80 mb-5"
                style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
              >
                {isBn 
                  ? 'কোনো চাপ নেই। সরাসরি আমাদের ডিজাইনার টিমের সাথে হোয়াটসঅ্যাপে চ্যাট করে ফ্রিতে পরামর্শ নিন।' 
                  : 'Zero pressure. Chat directly with our creative team on WhatsApp for free actionable advice.'}
              </p>
              <a
                href="https://wa.me/8801346288210?text=Hi%20POLISHED%2C%20I%20have%20a%20question%20about%20working%20together."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-accent text-accent-foreground font-bold text-xs md:text-sm uppercase tracking-wider rounded-xl transition-all duration-300 hover:shadow-[0_8px_25px_rgba(251,146,60,0.5)] active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}>
                  {isBn ? 'হোয়াটসঅ্যাপে চ্যাট করুন 💬' : 'Chat on WhatsApp 💬'}
                </span>
              </a>
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
