import { useLanguage } from '@/contexts/LanguageContext';
import MotionReveal from '@/components/landing/MotionReveal';
import WordReveal from '@/components/landing/WordReveal';
import LeadForm from '@/components/landing/LeadForm';
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

  const c = {
    email: 'contact@polishedbd.com',
    ig: '@polished.studio.bd',
    fb: 'polished.studio.bd',
    wa: '+8801346288210',
    sectionLabelEn: 'Get In Touch',
    sectionLabelBn: 'যোগাযোগ করুন',
    titleLine1En: 'Stop Burning Ad Spend on Weak Creatives.',
    titleLine1Bn: 'বিজ্ঞাপনে টাকা অপচয় বন্ধ করতে প্রস্তুত?',
    titleLine2En: "Let's fix your conversions.",
    titleLine2Bn: 'সরাসরি কথা বলুন।',
    descEn: "Tired of spending money on Meta ads only to get ghosted in your inbox? We craft creatives and hooks that make shoppers order at full price. We accept strictly 3 brand sprints per week.",
    descBn: 'প্রতিদিন বিজ্ঞাপনে টাকা ঢালছেন, কিন্তু ইনবক্সে এসে মানুষ দাম জিজ্ঞেস করে উধাও? আর নয়। আপনার ব্র্যান্ডের আসল সেলস নিশ্চিত করতে চলুন সরাসরি কথা বলি। প্রতি সপ্তাহে আমরা সর্বোচ্চ ৩টি ব্র্যান্ড নিয়ে কাজ করি।',
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
      <div className="py-10 md:py-24 px-6 md:px-14 max-w-[1200px] mx-auto">
        <hr className="border-t border-white/10" />
      </div>
      <div className="py-12 md:py-[110px] px-5 sm:px-6 md:px-14 max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start">
        <div>
          <MotionReveal>
            {isBn ? (
              <p lang="bn" className="text-[15px] tracking-[2px] text-accent mb-4 font-medium leading-[1]" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                সরাসরি যোগাযোগ
              </p>
            ) : (
              <p lang="en" style={enFont} className="text-[10px] tracking-[4px] uppercase text-accent mb-4 font-medium">
                {c.sectionLabelEn ?? 'Get In Touch'}
              </p>
            )}
          </MotionReveal>
          <h2 lang={isBn ? 'bn' : 'en'} className={`font-heading font-normal text-primary-foreground mb-7 leading-[1.1] ${isBn ? 'text-[clamp(20px,5.2vw,30px)] md:text-[clamp(30px,4.2vw,50px)]' : 'text-[clamp(28px,7.5vw,36px)] md:text-[clamp(36px,5vw,60px)]'}`}>
            {isBn ? (
              <>
                <WordReveal delay={0.1}>বিজ্ঞাপনে টাকা অপচয় বন্ধ করতে প্রস্তুত?</WordReveal>
                <br />
                <em className="italic text-accent">
                  <WordReveal delay={0.25}>সরাসরি কথা বলুন।</WordReveal>
                </em>
              </>
            ) : (
              <>
                <WordReveal delay={0.1}>{line1}</WordReveal>
                <br />
                <em className="italic text-accent">
                  <WordReveal delay={0.25}>{line2}</WordReveal>
                </em>
              </>
            )}
          </h2>
          <MotionReveal delay={0.15}>
            <p lang={isBn ? 'bn' : 'en'} style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : enFont} className={`${isBn ? 'text-[13px] md:text-[14px]' : 'text-[15px]'} leading-[1.85] text-primary-foreground/50 mb-10`}>
              {isBn
                ? (c.descBn ?? 'প্রতিদিন বিজ্ঞাপনে টাকা ঢালছেন, কিন্তু ইনবক্সে এসে মানুষ দাম জিজ্ঞেস করে উধাও? আর নয়। আপনার ব্র্যান্ডের আসল সেলস নিশ্চিত করতে চলুন সরাসরি কথা বলি। প্রতি সপ্তাহে আমরা সর্বোচ্চ ৩টি ব্র্যান্ড নিয়ে কাজ করি।')
                : (c.descEn ?? "Tired of spending money on Meta ads only to get ghosted in your inbox? We craft creatives and hooks that make shoppers order at full price. We accept strictly 3 brand sprints per week.")}
            </p>
          </MotionReveal>

          <div className="flex flex-col gap-4">
            {links.map((link, i) => (
              <MotionReveal key={link.label} delay={0.2 + i * 0.06}>
                <a
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 text-primary-foreground/70 text-sm transition-all duration-500 hover:text-accent hover:translate-x-2 group min-h-[44px] py-1"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
                >
                  <span className="w-9 h-9 border border-primary-foreground/15 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:border-accent group-hover:bg-accent/10 group-hover:rotate-[10deg]">
                    {link.icon}
                  </span>
                  {link.label}
                </a>
              </MotionReveal>
            ))}
          </div>

          {/* Partnership Process Roadmap */}
          <div className="mt-12 pt-8 border-t border-white/10">
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
                      ? '২৪ ঘণ্টার মধ্যে আমরা আপনার বর্তমান বিজ্ঞাপন ও ফেসবুক পেজ যাচাই করে কোথায় সেলস লিক হচ্ছে বের করব।'
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
                    {isBn ? '৫-মিনিটের ভিডিও টিয়ারডাউন' : '5-Minute Video Teardown'}
                  </p>
                  <p className="text-[11px] text-primary-foreground/50 leading-relaxed">
                    {isBn
                      ? 'হোয়াটসঅ্যাপে ৫ মিনিটের একটি কাস্টম ভিডিও পাবেন, যেখানে দেখিয়ে দেওয়া হবে কোন কোন ডিজাইনে বিজ্ঞাপনের টাকা নষ্ট হচ্ছে।'
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
                    {isBn ? '৭২ ঘণ্টার টেস্ট ড্রাইভ স্প্রিন্ট' : '72-Hour Sprint Delivery'}
                  </p>
                  <p className="text-[11px] text-primary-foreground/50 leading-relaxed">
                    {isBn
                      ? 'কোনো দীর্ঘ চুক্তি ছাড়া ৫টি হাই-কোয়ালিটি ডিজাইন আর ধারালো সেলস কপি সরাসরি আপনার হাতে।'
                      : '5 custom product designs and punchy copy, 100% ready to launch with zero guesswork.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <MotionReveal delay={0.2}>
          <LeadForm isBn={isBn} />
        </MotionReveal>
      </div>
    </div>
  );
}
