import { useLanguage } from '@/contexts/LanguageContext';
import MotionReveal from '@/components/landing/MotionReveal';
import WordReveal from '@/components/landing/WordReveal';
import type { ContactContent } from '@/types/database';

interface ContactProps {
  contact: ContactContent | null;
}

const EmailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
    <path d="M3 4h14a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M2 5l8 7 8-7" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
    <rect x="3" y="3" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="14.5" cy="5.5" r="1" fill="currentColor"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
    <path d="M11 10.5h2.5l.5-2.5H11V6.5c0-.7.2-1.5 1.5-1.5H14V3s-1-.2-2.1-.2C9.1 2.8 8 4.5 8 6.5V8H5.5v2.5H8V18h3v-7.5z" fill="currentColor"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
    <path d="M10 2a8 8 0 00-6.93 12L2 18l4.07-1.07A8 8 0 1010 2z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M7.5 8.5s.5 1 1.5 2 2 1.5 2 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export default function Contact({ contact }: ContactProps) {
  const { t, lang } = useLanguage();
  const isBn = lang === 'bn';

  const fbHandle = (contact?.fb || 'polishedbd.online').replace(/^https?:\/\/(www\.)?facebook\.com\/?/, '').replace(/\/$/, '');

  const c = {
    email: contact?.email || 'contact@polishedbd.com',
    ig: contact?.ig || '@polished.studio.bd',
    fb: fbHandle,
    wa: contact?.wa || '+8801346288210',
    sectionLabelEn: contact?.sectionLabelEn ?? 'Get In Touch',
    sectionLabelBn: contact?.sectionLabelBn ?? 'যোগাযোগ করুন',
    titleLine1En: contact?.titleLine1En ?? 'Stop Burning Ad Spend on Weak Creatives.',
    titleLine1Bn: contact?.titleLine1Bn ?? 'বিজ্ঞাপনে টাকা অপচয় বন্ধ করতে প্রস্তুত?',
    titleLine2En: contact?.titleLine2En ?? "Let's fix your conversions.",
    titleLine2Bn: contact?.titleLine2Bn ?? 'সরাসরি কথা বলুন।',
    descEn: contact?.descEn ?? "Tired of spending money on Meta ads only to get ghosted in your inbox? We craft creatives and hooks that make shoppers order at full price. We accept strictly 3 brand sprints per week.",
    descBn: contact?.descBn ?? 'প্রতিদিন বিজ্ঞাপনে টাকা ঢালছেন, কিন্তু ইনবক্সে এসে মানুষ দাম জিজ্ঞেস করে উধাও? আর নয়। আপনার ব্র্যান্ডের আসল সেলস নিশ্চিত করতে চলুন সরাসরি কথা বলি। প্রতি সপ্তাহে আমরা সর্বোচ্চ ৩টি ব্র্যান্ড নিয়ে কাজ করি।',
  } as ContactContent;

  const links = [
    { icon: <EmailIcon />, label: c.email, href: `mailto:${c.email}` },
    { icon: <InstagramIcon />, label: c.ig, href: `https://instagram.com/${c.ig.replace('@', '')}` },
    { icon: <FacebookIcon />, label: c.fb, href: `https://facebook.com/${c.fb}` },
    { icon: <WhatsAppIcon />, label: c.wa, href: `https://wa.me/${c.wa.replace(/\D/g, '')}` },
  ];

  // Contact heading/label/desc
  const enFont = { fontFamily: "'DM Sans', sans-serif" } as const;
  const line1 = c.titleLine1En ?? 'Stop Burning Ad Spend on Weak Creatives.';
  const line2 = c.titleLine2En ?? "Let's fix your conversions.";

  return (
    <div id="contact" className="bg-[#1e3a8a]">
      <div className="py-6 md:py-24 px-6 md:px-14 max-w-[1200px] mx-auto">
        <hr className="border-t border-white/10" />
      </div>
      <div className="pb-14 pt-2 md:py-[110px] px-5 sm:px-6 md:px-14 max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-start">
        <div>
          <MotionReveal>
            {isBn ? (
              <p lang="bn" className="eyebrow-pill-kicker text-accent mb-3 md:mb-4 font-medium" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                সরাসরি যোগাযোগ
              </p>
            ) : (
              <p lang="en" style={enFont} className="eyebrow-pill-kicker text-accent mb-3 md:mb-4 font-medium">
                {c.sectionLabelEn ?? 'Get In Touch'}
              </p>
            )}
          </MotionReveal>
          <h2 lang={isBn ? 'bn' : 'en'} className="section-heading-h2 font-heading font-normal text-primary-foreground mb-4 md:mb-6">
            {isBn ? (
              <>
                <WordReveal delay={0.1}>আপনার প্রোডাক্টটি ভালো। এবার বিজ্ঞাপনটিকেও</WordReveal>
                <br />
                <em className="hero-accent-line not-italic text-accent">
                  <WordReveal delay={0.25}>প্রোডাক্টের মতোই বিশ্বাসযোগ্য করে তুলুন।</WordReveal>
                </em>
              </>
            ) : (
              <>
                <WordReveal delay={0.1}>{line1}</WordReveal>
                <br />
                <em className="hero-accent-line not-italic text-accent">
                  <WordReveal delay={0.25}>{line2}</WordReveal>
                </em>
              </>
            )}
          </h2>
          <MotionReveal delay={0.15}>
            <p lang={isBn ? 'bn' : 'en'} style={isBn ? { fontFamily: "'Noto Serif Bengali', serif", lineHeight: 1.85 } : { ...enFont, lineHeight: 1.75 }} className="section-lead-subtitle text-primary-foreground/80 mb-6 md:mb-10">
              {isBn
                ? 'নিজের মুখের ত্বকে কেউ সন্দেহ নিয়ে সস্তা জিনিস মাখে না। আপনার বিজ্ঞাপনের ছবি ও ভিডিও দেখেই যখন কাস্টমার বোঝে প্রোডাক্টটি আসল—তখন সে পুরো দাম দিয়েই অর্ডার করে।'
                : (c.descEn ?? "Tired of spending money on Meta ads only to get ghosted in your inbox? We craft creatives and hooks that make shoppers order at full price. We accept strictly 3 brand sprints per week.")}
            </p>
          </MotionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 mb-8 md:mb-0">
            {links.map((link, i) => (
              <MotionReveal key={link.label} delay={0.2 + i * 0.06}>
                <a
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-primary-foreground/80 text-xs sm:text-sm p-2.5 rounded-xl bg-white/[0.04] border border-white/10 transition-all duration-300 hover:border-accent hover:text-accent group min-h-[44px]"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
                >
                  <span className="w-8 h-8 border border-primary-foreground/15 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:border-accent group-hover:bg-accent/10">
                    {link.icon}
                  </span>
                  <span className="truncate">{link.label}</span>
                </a>
              </MotionReveal>
            ))}
          </div>

          {/* Partnership Process Roadmap */}
          <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/10">
            <p className="text-[10px] tracking-[2px] uppercase text-accent font-semibold mb-4">
              {isBn ? 'ইনকোয়ারির পরবর্তী ৩টি ধাপ' : 'What Happens Next'}
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="text-xs font-medium text-primary-foreground">
                    {isBn ? 'বিজ্ঞাপন ও পেজ অডিট' : 'Store & Live Ad Audit'}
                  </p>
                  <p className="text-[11px] text-primary-foreground/50 leading-relaxed">
                    {isBn
                      ? '২৪ ঘণ্টার মধ্যে আমরা আপনার বর্তমান বিজ্ঞাপন ও ফেসবুক পেজ দেখে কোথায় সেলস আটকাচ্ছে তা বের করব।'
                      : 'Within 24 hours, our creative director reviews your live ads to pinpoint why shoppers bounce.'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="text-xs font-medium text-primary-foreground">
                    {isBn ? '৫-মিনিটের ভিডিও রিভিউ' : '5-Minute Video Review'}
                  </p>
                  <p className="text-[11px] text-primary-foreground/50 leading-relaxed">
                    {isBn
                      ? 'হোয়াটসঅ্যাপে ৫ মিনিটের একটি কাস্টম ভিডিও পাবেন, যেখানে দেখিয়ে দেওয়া হবে কেন কাস্টমার দাম শুনে চলে যাচ্ছে।'
                      : 'A private 5-minute video sent to your WhatsApp breaking down exact drop-off points.'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <p className="text-xs font-medium text-primary-foreground">
                    {isBn ? '৪৮–৭২ ঘণ্টায় টেস্ট প্যাক ডেলিভারি' : '48–72h Test Pack Delivery'}
                  </p>
                  <p className="text-[11px] text-primary-foreground/50 leading-relaxed">
                    {isBn
                      ? '১টি ভিডিও রিল, ২টি আসল প্রোডাক্টের ছবির পোস্ট ও মন ছুঁয়ে যাওয়া বাংলা ক্যাপশন রেডি।'
                      : '1x video reel and 2x authentic product static posts with heart-touching Bengali copy, ready to launch.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <MotionReveal delay={0.2}>
          <div className="rounded-2xl sm:rounded-3xl bg-white/[0.05] border border-white/15 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col justify-between">
            {/* Ambient subtle glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

            <div className="relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent text-[10.5px] font-bold uppercase tracking-wider mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span>{isBn ? 'সরাসরি হোয়াটসঅ্যাপে কথা • কোনো ফর্ম পূরণের ঝামেলা নেই' : 'DIRECT WHATSAPP ONBOARDING • ZERO MEETINGS'}</span>
              </div>

              {/* Headline */}
              <h3 
                className="text-xl sm:text-2xl md:text-[26px] font-bold text-white leading-snug mb-3"
                style={{ fontFamily: "'Noto Serif Bengali', serif" }}
              >
                {isBn ? '"আপনার পেজের জন্য কোনটা দিয়ে শুরু করতে চান?"' : '"Which package would you like to start with?"'}
              </h3>

              {/* Sub-copy */}
              <p 
                className="text-xs sm:text-[13px] text-white/70 leading-relaxed mb-6"
                style={{ fontFamily: "'Noto Serif Bengali', serif" }}
              >
                "কোনো ফর্ম পূরণের দরকার নেই। নিচের যেকোনো একটি অপশনে ক্লিক করলেই সরাসরি আমাদের হোয়াটসঅ্যাপে (+8801346288210) কথা শুরু হবে:"
              </p>

              {/* 3 Direct Action Buttons */}
              <div className="space-y-3.5">
                {/* Button 1: ⚡ ১. টেস্ট প্যাক নিন (৳২,৫০০ • ১টি ভিডিও + ২টি ছবি) */}
                <a
                  href="https://wa.me/8801346288210?text=%E0%A6%B9%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%B2%E0%A7%8B%20POLISHED%2C%20%E0%A6%86%E0%A6%AE%E0%A6%BF%20%E0%A7%B3%E0%A7%A8%2C%E0%A7%AB%E0%A7%A6%E0%A7%A6%20%E0%A6%9F%E0%A6%BE%E0%A6%95%E0%A6%BE%E0%A6%B0%20%E0%A6%9F%E0%A7%87%E0%A6%B8%E0%A7%8D%E0%A6%9F%20%E0%A6%AA%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%95%20%E0%A6%A6%E0%A6%BF%E0%A7%9F%E0%A7%87%20%E0%A6%B6%E0%A7%81%E0%A6%B0%E0%A7%81%20%E0%A6%95%E0%A6%B0%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A5%A4%20%E0%A6%86%E0%A6%AE%E0%A6%BE%E0%A6%B0%20%E0%A6%AA%E0%A7%87%E0%A6%9C%E0%A7%87%E0%A6%B0%20%E0%A6%B2%E0%A6%BF%E0%A6%82%E0%A6%95%3A%20"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-4 rounded-xl bg-[#fb923c] hover:bg-[#fb923c]/90 text-[#f9fafb] font-bold text-xs sm:text-[13px] flex items-center justify-between shadow-lg hover:shadow-orange-500/25 transition-all group active:scale-[0.98]"
                  style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                >
                  <span className="flex items-center gap-2">
                    <span>⚡ ১. টেস্ট প্যাক নিন (৳২,৫০০ • ১টি ভিডিও + ২টি ছবি)</span>
                  </span>
                  <span className="font-sans text-base transition-transform group-hover:translate-x-1">→</span>
                </a>

                {/* Button 2: 🚀 ২. মাসিক পার্টনার হোন (৳৯,৯৯৯/মাস • ৮টি বিজ্ঞাপন + কম্বো সেট) */}
                <a
                  href="https://wa.me/8801346288210?text=%E0%A6%B9%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%B2%E0%A7%8B%20POLISHED%2C%20%E0%A6%86%E0%A6%AE%E0%A6%BF%20%E0%A7%B3%E0%A7%AF%2C%E0%A7%AF%E0%A7%AF%E0%A7%AF%2F%E0%A6%AE%E0%A6%BE%E0%A6%B8%20%E0%A6%AE%E0%A6%BE%E0%A6%B8%E0%A6%BF%E0%A6%95%20%E0%A6%AA%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%9F%E0%A6%A8%E0%A6%BE%E0%A6%B0%20%E0%A6%AA%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%95%E0%A7%87%E0%A6%9C%E0%A7%87%20%E0%A6%AF%E0%A7%81%E0%A6%95%E0%A7%8D%E0%A6%A4%20%E0%A6%B9%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A5%A4%20%E0%A6%86%E0%A6%AE%E0%A6%BE%E0%A6%B0%20%E0%A6%AA%E0%A7%87%E0%A6%9C%E0%A7%87%E0%A6%B0%20%E0%A6%B2%E0%A6%BF%E0%A6%82%E0%A6%95%3A%20"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs sm:text-[13px] flex items-center justify-between transition-all group active:scale-[0.98]"
                  style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                >
                  <span className="flex items-center gap-2">
                    <span>🚀 ২. মাসিক পার্টনার হোন (৳৯,৯৯৯/মাস • ৮টি বিজ্ঞাপন + কম্বো সেট)</span>
                  </span>
                  <span className="font-sans text-base transition-transform group-hover:translate-x-1">→</span>
                </a>

                {/* Button 3: 🎥 আপনার পেজের ফ্রি ৫-মিনিট ভিডিও রিভিউ নিন */}
                <a
                  href="https://wa.me/8801346288210?text=%E0%A6%B9%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%B2%E0%A7%8B%20POLISHED%2C%20%E0%A6%86%E0%A6%AE%E0%A6%BF%20%E0%A6%86%E0%A6%AE%E0%A6%BE%E0%A6%B0%20Skincare%2FBeauty%20%E0%A6%AA%E0%A7%87%E0%A6%9C%E0%A7%87%E0%A6%B0%20%E0%A6%B0%E0%A6%BE%E0%A6%A8%E0%A6%BF%E0%A6%82%20%E0%A6%85%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%A1%E0%A7%87%E0%A6%B0%20%E0%A6%9C%E0%A6%A8%E0%A7%8D%E0%A6%AF%20Free%205-Min%20Video%20Audit%20%E0%A6%AA%E0%A7%87%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A5%A4%20%E0%A6%86%E0%A6%AE%E0%A6%BE%E0%A6%B0%20%E0%A6%AA%E0%A7%87%E0%A6%9C%E0%A7%87%E0%A6%B0%20%E0%A6%B2%E0%A6%BF%E0%A6%82%E0%A6%95%3A%20"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl border border-[#fb923c]/50 text-[#fb923c] hover:bg-[#fb923c]/10 font-semibold text-xs sm:text-[13px] flex items-center justify-between transition-all group active:scale-[0.98]"
                  style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                >
                  <span className="flex items-center gap-2">
                    <span>🎥 ৩. আপনার পেজের ফ্রি ৫-মিনিট ভিডিও রিভিউ নিন</span>
                  </span>
                  <span className="font-sans text-base transition-transform group-hover:translate-x-1">→</span>
                </a>
              </div>

              {/* Bottom Reassurance Micro-Copy */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                <span>⚡ গড় রেসপন্স টাইম: ৫–১০ মিনিট</span>
                <span>💳 বিকাশ, নগদ ও ব্যাংক পেমেন্ট</span>
              </div>
            </div>
          </div>
        </MotionReveal>
      </div>
    </div>
  );
}
