import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import MotionReveal from '@/components/landing/MotionReveal';
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
  const [brand, setBrand] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

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
    brandPlaceholderEn: 'Your Brand Name / আপনার ব্র্যান্ডের নাম',
    brandPlaceholderBn: 'আপনার ব্র্যান্ডের নাম / Your Brand Name',
    emailPlaceholderEn: 'Email Address / ইমেইল',
    emailPlaceholderBn: 'ইমেইল / Email Address',
    messagePlaceholderEn: 'Tell us about your brand... / আপনার ব্র্যান্ড সম্পর্কে বলুন...',
    messagePlaceholderBn: 'আপনার ব্র্যান্ড সম্পর্কে বলুন... / Tell us about your brand...',
    submitLabelEn: 'Send Inquiry',
    submitLabelBn: 'বার্তা পাঠান',
  };

  const links = [
    { icon: <EmailIcon />, label: c.email, href: `mailto:${c.email}` },
    { icon: <InstagramIcon />, label: c.ig, href: `https://instagram.com/${c.ig.replace('@', '')}` },
    { icon: <FacebookIcon />, label: c.fb, href: `https://facebook.com/${c.fb}` },
    { icon: <WhatsAppIcon />, label: c.wa, href: `https://wa.me/${c.wa.replace(/\D/g, '')}` },
  ];

  const handleSubmit = () => {
    const subject = encodeURIComponent(`Inquiry from ${brand || 'Website'}`);
    const body = encodeURIComponent(`Brand: ${brand}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${c.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div id="contact" className="bg-primary">
      <div className="py-[110px] px-6 md:px-14 max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start">
        <div>
          <MotionReveal>
            <p className="text-[10px] tracking-[4px] uppercase text-accent mb-4 font-medium">
              {t(c.sectionLabelEn ?? 'Get In Touch', c.sectionLabelBn ?? 'যোগাযোগ করুন')}
            </p>
          </MotionReveal>
          <MotionReveal delay={0.1}>
            <h2 className="font-heading font-normal text-primary-foreground mb-7 text-[clamp(36px,5vw,60px)] leading-[1.1]">
              {t(c.titleLine1En ?? "Let's build something", c.titleLine1Bn ?? 'আসুন এমন কিছু তৈরি করি')}<br />
              <em className="italic">{t(c.titleLine2En ?? 'worth noticing.', c.titleLine2Bn ?? 'যা নজর কাড়ে।')}</em>
            </h2>
          </MotionReveal>
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
                  className="flex items-center gap-3.5 text-primary-foreground/70 text-sm transition-all duration-300 hover:text-accent hover:translate-x-2 group"
                >
                  <span className="w-9 h-9 border border-primary-foreground/15 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:border-accent group-hover:bg-accent/10 group-hover:rotate-[10deg]">
                    {link.icon}
                  </span>
                  {link.label}
                </a>
              </MotionReveal>
            ))}
          </div>
        </div>

        <MotionReveal delay={0.2}>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder={t(c.brandPlaceholderEn ?? 'Your Brand Name', c.brandPlaceholderBn ?? 'আপনার ব্র্যান্ডের নাম')}
              className="bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground px-5 py-4 text-sm font-light outline-none rounded-sm transition-all duration-300 placeholder:text-primary-foreground/30 focus:border-accent focus:bg-primary-foreground/8 focus:translate-x-1"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t(c.emailPlaceholderEn ?? 'Email Address', c.emailPlaceholderBn ?? 'ইমেইল')}
              className="bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground px-5 py-4 text-sm font-light outline-none rounded-sm transition-all duration-300 placeholder:text-primary-foreground/30 focus:border-accent focus:bg-primary-foreground/8 focus:translate-x-1"
            />
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t(c.messagePlaceholderEn ?? 'Tell us about your brand...', c.messagePlaceholderBn ?? 'আপনার ব্র্যান্ড সম্পর্কে বলুন...')}
              className="bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground px-5 py-4 text-sm font-light outline-none rounded-sm resize-none transition-all duration-300 placeholder:text-primary-foreground/30 focus:border-accent focus:bg-primary-foreground/8 focus:translate-x-1"
            />
            <button
              onClick={handleSubmit}
              className="w-full py-4 text-xs tracking-[2px] uppercase font-normal rounded-sm bg-accent text-accent-foreground text-center relative overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(251,146,60,0.4)] active:scale-[0.97]"
            >
              {t(c.submitLabelEn ?? 'Send Inquiry', c.submitLabelBn ?? 'বার্তা পাঠান')}
            </button>
          </div>
        </MotionReveal>
      </div>
    </div>
  );
}
