import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import MotionReveal from '@/components/landing/MotionReveal';
import WordReveal from '@/components/landing/WordReveal';
import { triggerInquiry } from '@/lib/inquiry-events';
import { openAuditModal } from '@/components/landing/VisualAuditModal';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

export default function MarketGap() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  const [mobileTab, setMobileTab] = useState<'solution' | 'flaw'>('solution');

  return (
    <section id="positioning" className="py-20 md:py-28 px-6 md:px-14 max-w-[1200px] mx-auto relative">
      <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
        <MotionReveal>
          <p
            lang={isBn ? 'bn' : 'en'}
            className="text-[10px] md:text-[11px] tracking-[3px] uppercase text-accent mb-3 font-semibold"
            style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : { fontFamily: "'DM Sans', sans-serif" }}
          >
            {isBn ? 'মার্কেট গ্যাপ ও সমাধান' : 'The Market Gap & Our Positioning'}
          </p>
        </MotionReveal>
        <MotionReveal delay={0.1}>
          <h2
            lang={isBn ? 'bn' : 'en'}
            className={`font-heading font-normal text-primary leading-[1.15] mb-6 ${isBn ? 'text-[26px] md:text-[44px]' : 'text-[30px] md:text-[48px]'
              }`}
          >
            {isBn ? (
              <>
                <WordReveal delay={0.1}>কেন বেশিরভাগ ব্র্যান্ড সাধারণ ডিজাইনের কারণে</WordReveal>{' '}
                <em className="italic text-accent">
                  <WordReveal delay={0.25}>সেলস ও কাস্টমার হারায়?</WordReveal>
                </em>
              </>
            ) : (
              <>
                <WordReveal delay={0.1}>The Expensive Flaw in</WordReveal>{' '}
                <em className="italic text-accent">
                  <WordReveal delay={0.25}>Bangladeshi E-Commerce.</WordReveal>
                </em>
              </>
            )}
          </h2>
        </MotionReveal>
        <MotionReveal delay={0.2}>
          <p
            lang={isBn ? 'bn' : 'en'}
            className="text-[14px] md:text-[16px] text-muted-foreground leading-[1.8] font-light"
            style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
          >
            {isBn
              ? 'বাংলাদেশের ই-কমার্সে একটি বড় ভুল ধারণা রয়েছে—বাংলা ব্যবহার করলেই নাকি ব্র্যান্ড ভ্যালু কমে যায়! ফলে ব্র্যান্ডগুলো হয় দুর্বল ইংলিশ ব্যবহার করে যা কাস্টমারকে স্পর্শ করে না, নয়তো সস্তা ক্যানভা স্টাইলের বাংলা ডিজাইন করে যা বিশ্বাস নষ্ট করে।'
              : 'There is a costly misconception in Bangladeshi e-commerce that using Bengali lowers perceived brand value. As a result, brands either rely on broken English (which fails to connect deeply) or cheap-looking visuals (which destroy luxury positioning).'}
          </p>
        </MotionReveal>
      </div>

      {/* Side-by-Side Comparison Grid (Mobile: Sequential Contrast, Desktop: 2-Col Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch mb-12">
        {/* The Costly Mistake Card */}
        <MotionReveal delay={0.2} className="h-full">
          <div className="h-full rounded-2xl md:rounded-sm border border-red-500/20 bg-red-500/[0.02] p-6 sm:p-8 md:p-10 flex flex-col justify-between relative overflow-hidden transition-all duration-500 hover:border-red-500/35">
            <div>
              <div className="flex items-center gap-2 text-red-500 font-semibold text-[11px] tracking-widest uppercase mb-4">
                <XCircle className="w-4 h-4 shrink-0" />
                <span>{isBn ? 'সাধারণ ভুল পদ্ধতি' : 'The Common Industry Flaw'}</span>
              </div>
              <h3
                lang={isBn ? 'bn' : 'en'}
                className="font-heading text-xl sm:text-2xl md:text-3xl text-primary font-normal mb-5 leading-snug"
                style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
              >
                {isBn
                  ? 'জেনেরিক টেমপ্লেট ও দুর্বল কমিউনিকেশন'
                  : 'Broken English & Templated Visuals'}
              </h3>
              <ul className="space-y-3.5 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold shrink-0 mt-0.5">✕</span>
                  <span>
                    {isBn
                      ? 'অপ্রাসঙ্গিক ইংলিশ কপি যা সাধারণ ক্রেতার আবেগকে স্পর্শ করে না'
                      : 'Average English copywriting that feels distant and fails to trigger buying impulses'}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold shrink-0 mt-0.5">✕</span>
                  <span>
                    {isBn
                      ? 'ক্যানভা-লেভেল সাধারণ ডিজাইন—ব্র্যান্ডকে সস্তা দেখায় ও ডিসকাউন্টের ওপর নির্ভরশীল করে'
                      : 'Cheap-looking social posts that diminish product prestige and force endless discounting'}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold shrink-0 mt-0.5">✕</span>
                  <span>
                    {isBn
                      ? 'উচ্চ কাস্টমার একুইজিশন খরচ (CAC) এবং দুর্বল অ্যাড রিটার্ন (Low ROAS)'
                      : 'Skyrocketing Customer Acquisition Cost (CAC) caused by low click-through & banner blindness'}
                  </span>
                </li>
              </ul>
            </div>
            <div className="mt-7 pt-4 border-t border-red-500/15 text-[11px] sm:text-[12px] text-red-600/90 font-medium">
              {isBn ? 'ফলাফল: বিজ্ঞাপনের টাকা অপচয় ও ব্র্যান্ড ভ্যালু হ্রাস' : 'Result: Wasted Ad Spend & Compromised Brand Authority'}
            </div>
          </div>
        </MotionReveal>

        {/* The POLISHED Solution Card */}
        <MotionReveal delay={0.3} className="h-full">
          <div className="h-full rounded-2xl md:rounded-sm border border-accent/40 bg-primary text-primary-foreground p-6 sm:p-8 md:p-10 flex flex-col justify-between relative overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.25)] transition-all duration-500 hover:border-accent">
            <div className="absolute top-0 right-0 w-44 h-44 bg-accent/10 blur-3xl pointer-events-none rounded-full" />
            <div>
              <div className="flex items-center gap-2 text-accent font-semibold text-[11px] tracking-widest uppercase mb-4">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-accent" />
                <span>{isBn ? 'POLISHED সিগনেচার সমাধান' : 'The POLISHED Standard'}</span>
              </div>
              <h3
                lang={isBn ? 'bn' : 'en'}
                className="font-heading text-xl sm:text-2xl md:text-3xl text-primary-foreground font-normal mb-5 leading-snug"
                style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
              >
                {isBn
                  ? '"প্রিমিয়াম বাংলা" অ্যাসথেটিক ও কনভার্শন আর্কিটেকচার'
                  : 'The "Premium Bengali" Aesthetic & Conversion Architecture'}
              </h3>
              <ul className="space-y-3.5 text-[13px] md:text-[14px] text-primary-foreground/80 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold shrink-0 mt-0.5">✓</span>
                  <span>
                    {isBn
                      ? 'উচ্চমানের পরিশীলিত বাংলা কপিরাইটিং এবং বিশ্বমানের ভিজ্যুয়াল ডিজাইন — যা লাক্সারি লুক অক্ষুণ্ণ রেখে স্থানীয় ক্রেতাদের সর্বোচ্চ বিশ্বাস ও আকর্ষণ তৈরি করে'
                      : 'High-class, sophisticated Bengali copywriting paired with world-class visual design — delivering maximum cultural relatability with zero compromise on luxury prestige'}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold shrink-0 mt-0.5">✓</span>
                  <span>
                    {isBn
                      ? 'মনস্তাত্ত্বিক ভিজ্যুয়াল হুকস যা ১.৩ সেকেন্ডে স্ক্রল থামায়, ব্যানার ব্লাইন্ডনেস দূর করে এবং মেটা অ্যাডের CPR উল্লেখযোগ্যভাবে কমায়'
                      : 'Psychological visual hooks that stop the scroll within 1.3 seconds, eliminate banner blindness, and drop Meta Ad CPR'}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold shrink-0 mt-0.5">✓</span>
                  <span>
                    {isBn
                      ? 'কম্বো সেলিং ভিজ্যুয়াল আর্কিটেকচার যা গড় অর্ডার ভ্যালু (AOV) বাড়ায় এবং ক্যাশ-অন-ডেলিভারি (COD) গ্রাহকদের সংশয় দূর করে'
                      : 'Combo selling visual architecture that maximizes Average Order Value (AOV) and eliminates COD return hesitation'}
                  </span>
                </li>
              </ul>
            </div>
            <div className="mt-7 pt-4 border-t border-primary-foreground/15 text-[11px] sm:text-[12px] text-accent font-semibold flex items-center justify-between">
              <span>{isBn ? 'ফলাফল: ৩.২x বেশি ROAS, কম CAC ও প্রিমিয়াম ব্র্যান্ড ভ্যালু' : 'Result: 3.2x Average ROAS, Lower CAC & Zero Ad Rejections'}</span>
            </div>
          </div>
        </MotionReveal>
      </div>

      {/* Call to action bar */}
      <MotionReveal delay={0.4}>
        <div className="bg-[#f9fafb] border border-primary/15 rounded-sm p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <h4
              lang={isBn ? 'bn' : 'en'}
              className="font-heading text-xl md:text-2xl text-primary font-medium mb-1"
              style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
            >
              {isBn ? 'আপনার ব্র্যান্ডের বর্তমান ভিজ্যুয়াল কি গ্রাহকের বিশ্বাস অর্জন করতে পারছে?' : 'Ready to upgrade from average design to conversion mastery?'}
            </h4>
            <p
              lang={isBn ? 'bn' : 'en'}
              className="text-xs md:text-sm text-muted-foreground"
              style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
            >
              {isBn
                ? 'আমাদের সাথে ৫ মিনিটের ফ্রি ক্রিয়েটিভ অডিট নিন এবং জেনে নিন কোথায় রেভিনিউ লিক হচ্ছে।'
                : 'Claim a 1-on-1 visual strategy consultation with our Creative Director.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              triggerInquiry({ note: 'Interested in Premium Bengali positioning upgrade' });
              openAuditModal({ source: 'Market Gap CTA', note: 'Requesting positioning & creative audit' });
            }}
            className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-accent-foreground text-xs font-semibold tracking-[1.5px] uppercase rounded-sm transition-all duration-300 hover:bg-accent/90 hover:shadow-[0_8px_24px_rgba(251,146,60,0.35)] active:scale-[0.97] cursor-pointer"
          >
            <span>{isBn ? 'ফ্রি ৫-মিনিট অডিট বুক করুন' : 'Claim Free Visual Audit'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </MotionReveal>
    </section>
  );
}
