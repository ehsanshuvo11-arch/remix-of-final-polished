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

  const c = contact ?? {
    email: 'polished.bd@gmail.com',
    ig: '@polished.studio.bd',
    fb: 'polished.studio.bd',
    wa: '+8801346288210',
    sectionLabelEn: 'Get In Touch',
    sectionLabelBn: 'যোগাযোগ করুন',
    titleLine1En: "Let's build something",
    titleLine1Bn: 'আসুন এমন কিছু তৈরি করি',
    titleLine2En: 'worth noticing.',
    titleLine2Bn: 'যা নজর কাড়ে।',
    descEn: "Have a skincare brand that deserves better visuals? Let's talk. We take on a limited number of projects to ensure every client gets full attention.",
    descBn: 'আপনার স্কিনকেয়ার ব্র্যান্ড কি আরও ভালো ভিজ্যুয়াল পাওয়ার যোগ্য? যোগাযোগ করুন। আমরা সীমিত সংখ্যক প্রজেক্ট নিই।',
  } as ContactContent;

  const links = [
    { icon: <EmailIcon />, label: c.email, href: `mailto:${c.email}` },
    { icon: <InstagramIcon />, label: c.ig, href: `https://instagram.com/${c.ig.replace('@', '')}` },
    { icon: <FacebookIcon />, label: c.fb, href: `https://facebook.com/${c.fb}` },
    { icon: <WhatsAppIcon />, label: c.wa, href: `https://wa.me/${c.wa.replace(/\D/g, '')}` },
  ];

  const line1 = t(c.titleLine1En ?? "Let's build something", c.titleLine1Bn ?? 'আসুন এমন কিছু তৈরি করি');
  const line2 = t(c.titleLine2En ?? 'worth noticing.', c.titleLine2Bn ?? 'যা নজর কাড়ে।');

  return (
    <div id="contact" className="bg-primary">
      <div className="py-[110px] px-6 md:px-14 max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start">
        <div>
          <MotionReveal>
            <p className="text-[10px] tracking-[4px] uppercase text-accent mb-4 font-medium">
              {t(c.sectionLabelEn ?? 'Get In Touch', c.sectionLabelBn ?? 'যোগাযোগ করুন')}
            </p>
          </MotionReveal>
          <h2 className="font-heading font-normal text-primary-foreground mb-7 text-[clamp(36px,5vw,60px)] leading-[1.1]">
            <WordReveal delay={0.1}>{line1}</WordReveal>
            <br />
            <em className="italic">
              <WordReveal delay={0.25}>{line2}</WordReveal>
            </em>
          </h2>
          <MotionReveal delay={0.15}>
            <p className="text-[15px] leading-[1.85] text-primary-foreground/50 mb-10">
              {t(c.descEn ?? "Have a skincare brand that deserves better visuals? Let's talk.", c.descBn ?? 'আপনার স্কিনকেয়ার ব্র্যান্ড কি আরও ভালো ভিজ্যুয়াল পাওয়ার যোগ্য?')}
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
        </div>

        <MotionReveal delay={0.2}>
          <LeadForm isBn={isBn} />
        </MotionReveal>
      </div>
    </div>
  );
}
