import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { openAuditModal } from '@/components/landing/VisualAuditModal';
import { openQuickBookingModal } from '@/components/landing/QuickBookingModal';
import { 
  Check, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  AlertCircle,
  Clock,
  Compass
} from 'lucide-react';

export default function StickyStorytelling() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  const [activeTab, setActiveTab] = useState(1); // Default to POLISHED Solution (index 1) for immediate high-status impact

  const chapters = [
    {
      id: 'trap',
      num: isBn ? '০১' : '01',
      tabLabelEn: '1. The Real Trap',
      tabLabelBn: '১. আসল ফাঁদ',
      eyebrowEn: 'Where Your Budget Disappears',
      eyebrowBn: 'বিজ্ঞাপনের টাকা যেভাবে নষ্ট হয়',
      titleEn: 'Inbox Full of "Price Please?" and Zero Sales',
      titleBn: 'ইনবক্সে "দাম কত" বলে মানুষ উধাও?',
      descEn:
        'Meta charges your credit card every morning. Hundreds of comments ask "Price please?"—and then vanish. To force sales, you slash prices by 30%. Then comes the 35% COD return rate. After delivery fees, your net profit is zero. Sound familiar?',
      descBn:
        'অ্যাডম্যানেজারে প্রতিদিন ডলার কাটছে। শত শত মানুষ কমেন্টে "দাম কত" লিখে উধাও হয়ে যাচ্ছে। কাস্টমার ধরে রাখতে আপনি বারবার ২০%-৩০% ছাড় দিচ্ছেন। কিন্তু দিনশেষে ডেলিভারি আর ৩৫% রিটার্ন চার্জের পর আপনার ক্যাশে কোনো লাভই থাকছে না।',
      bulletPoints: [
        {
          en: 'Recycled Canva templates that make customers scroll past without thinking',
          bn: 'ক্যানভার চেনা টেমপ্লেট দেখে কাস্টমার চোখ বন্ধ করে স্ক্রোল করে চলে যায়',
          negative: true,
        },
        {
          en: 'Zero visual credibility—local shoppers assume your product is cheap or fake',
          bn: 'অনলাইন শপিংয়ে মানুষের চরম অবিশ্বাস—তারা ভাবছে আপনিও ভূয়া বা সস্তা পণ্য বিক্রি করছেন',
          negative: true,
        },
        {
          en: 'Heavy discount traps that destroy profit margins after COD return losses',
          bn: 'বাধ্য হয়ে অতিরিক্ত ছাড় দেওয়ার ফাঁদ—যা রিটার্ন চার্জের পর পুরো ব্যবসাই লোকসানে ফেলে',
          negative: true,
        },
      ],
      showcase: {
        badgeEn: 'Typical Meta Ad Performance',
        badgeBn: 'সাধারণ বিজ্ঞাপনের বাস্তব চিত্র',
        cardTitleEn: 'Generic Template Approach',
        cardTitleBn: 'সাধারণ ফেসবুক বিজ্ঞাপন',
        headlineEn: '"50% MEGA DISCOUNT - BEST WHITENING CREAM"',
        headlineBn: '"৫০% মেগা ডিসকাউন্ট! সেরা ক্রিম এখনই অর্ডার করুন"',
        sublineEn: 'Bargain hunters flood comments, but nobody completes checkout.',
        sublineBn: 'ডিসকাউন্ট চেয়ে কাস্টমার ইনবক্স ভাসাবে, কিন্তু কেউ অর্ডার নেবে না।',
        metrics: [
          { label: isBn ? 'গড় আরওএএস (ROAS)' : 'Average ROAS', val: '0.8x - 1.2x', alert: true },
          { label: isBn ? 'সিওডি রিটার্ন হার' : 'COD Return Rate', val: '35% - 45%', alert: true },
          { label: isBn ? 'দিনশেষে লাভ' : 'Net Business Profit', val: isBn ? 'পকেট খালি' : 'Zero Cash', alert: true },
        ],
        footerNoteEn: 'Ad spend is wasted while customer acquisition costs spiral out of control.',
        footerNoteBn: 'বিজ্ঞাপনের টাকা পানিতে যায় এবং দিনশেষে ক্যাশ-অন-ডেলিভারি রিটার্নে আসল পুঁজি ক্ষতিগ্রস্ত হয়।',
      },
    },
    {
      id: 'solution',
      num: isBn ? '০২' : '02',
      tabLabelEn: '2. The Fix',
      tabLabelBn: '২. আসল সমাধান',
      eyebrowEn: 'The Conversion Engine',
      eyebrowBn: 'আমাদের সিগনেচার সিস্টেম',
      titleEn: 'Visuals That Command Full Price',
      titleBn: 'এমন ডিজাইন যা কাস্টমারকে বিশ্বাস করতে বাধ্য করে',
      descEn:
        'We do not draw pretty pictures. We engineer performance creatives with local consumer psychology. Clean framing, crisp typography, and persuasive Bengali copy that answer customer doubts instantly. When trust is high, price resistance vanishes.',
      descBn:
        'আমরা শুধু সুন্দর ছবি আঁকি না। আমরা বাংলাদেশি কাস্টমারের মনস্তত্ত্ব বুঝে এমন পারফরম্যান্স ক্রিয়েটিভ তৈরি করি, যা প্রথম দেখাতেই প্রোডাক্টকে খাঁটি ও নির্ভরতার জায়গায় বসিয়ে দেয়। যখন কাস্টমার চোখে বিশ্বাস পায়, তখন সে ছাড় খোঁজে না—পুরো টাকা দিয়ে অর্ডার করে।',
      bulletPoints: [
        {
          en: 'Thumb-stopping visual hooks engineered to halt the scroll within 0.8 seconds',
          bn: 'প্রথম ০.৮ সেকেন্ডেই কাস্টমারের আঙুলের স্ক্রলিং থামিয়ে দেওয়ার মতো ভিজ্যুয়াল হুক',
          negative: false,
        },
        {
          en: 'Culturally sharp Bengali sales copy that speaks directly to genuine desires',
          bn: 'মার্জিত বাংলা সেলস কপি যা কাস্টমারের ভেতরে খাঁটি বিশ্বাস ও কেনার তাগিদ তৈরি করে',
          negative: false,
        },
        {
          en: '100% Meta Ad Policy Safe—protect your ad account from sudden restrictions',
          bn: '১০০% মেটা পলিসি সুরক্ষিত—অ্যাকাউন্ট রেস্ট্রিকশন বা পলিসি ভায়োলেশনের কোনো ভয় নেই',
          negative: false,
        },
      ],
      showcase: {
        badgeEn: 'POLISHED Signature Creative',
        badgeBn: 'POLISHED পারফরম্যান্স আর্ট',
        cardTitleEn: 'Premium Bengali Standard',
        cardTitleBn: 'পরিশীলিত বাংলা স্ট্যান্ডার্ড',
        headlineEn: '“অনুভবে স্নিগ্ধতা, পরিচর্যায় খাঁটি যত্ন।”',
        headlineBn: '“অনুভবে স্নিগ্ধতা, পরিচর্যায় খাঁটি যত্ন।”',
        sublineEn: 'High-status framing that justifies a premium price tag instantly.',
        sublineBn: 'এমন পরিচ্ছন্ন ফিনিশ যা দেখে কাস্টমার বুঝতে পারে এই প্রোডাক্টের কোয়ালিটি সেরা।',
        metrics: [
          { label: isBn ? 'আস্থার মাত্রা' : 'Trust Level', val: isBn ? 'হাই-স্ট্যাটাস' : 'High-Status', alert: false },
          { label: isBn ? 'মেটা পলিসি' : 'Meta Policy', val: '100% Safe', alert: false },
          { label: isBn ? 'কমিউনিকেশন' : 'Brand Tone', val: isBn ? 'মার্জিত বাংলা' : 'Persuasive', alert: false },
        ],
        footerNoteEn: 'Engineered specifically for ambitious skincare and lifestyle brands.',
        footerNoteBn: 'প্রিমিয়াম স্কিনকেয়ার ও লাইফস্টাইল ব্র্যান্ডের জন্য বিশেষভাবে তৈরি।',
      },
    },
    {
      id: 'payoff',
      num: isBn ? '০৩' : '03',
      tabLabelEn: '3. Real Profit',
      tabLabelBn: '৩. আসল লাভ',
      eyebrowEn: 'Verified Business Impact',
      eyebrowBn: 'বাস্তব বাণিজ্যিক ফলাফল',
      titleEn: 'Lower CPR. Real Profit in Your Bank.',
      titleBn: 'বিজ্ঞাপন খরচ কমবে, আসল লাভ পকেটে থাকবে',
      descEn:
        'When your creatives look 10x more trustworthy than your competitors, Meta rewards you with cheaper reach. Return rates drop because customers are proud of what they ordered. Real profit stays in your bank account.',
      descBn:
        'প্রতিযোগীদের চেয়ে আপনার ডিজাইন যখন ১০ গুণ বেশি বিশ্বাসযোগ্য দেখায়, তখন মেটা কম খরচে সঠিক ক্রেতা এনে দেয়। মানুষ মন থেকে ভালোবেসে অর্ডার করে, ফলে ডেলিভারি নেওয়ার হার বাড়ে এবং রিটার্ন কমে যায়। বিজ্ঞাপনের টাকা আর জলে যায় না।',
      bulletPoints: [
        {
          en: 'Average 3.2x ROAS lift demonstrated across 30+ premium Bangladeshi D2C stores',
          bn: '৩০+ বাংলাদেশি ব্র্যান্ডে পরীক্ষিত: গড়ে ৩.২x পর্যন্ত আরওএএস (ROAS) বৃদ্ধি',
          negative: false,
        },
        {
          en: 'Up to 42% reduction in Cost Per Result (CPR) through higher click-through trust',
          bn: 'উচ্চমানের আস্থার কারণে বিজ্ঞাপনের খরচ (CPR) গড়ে ৪২% পর্যন্ত কমে আসে',
          negative: false,
        },
        {
          en: 'White-label agency partnership: Scaled output without designer hiring headaches',
          bn: 'মার্কেটিং এজেন্সি পার্টনারশিপ: ইন-হাউস ডিজাইনারের প্যারা ছাড়াই ক্লায়েন্টের ফলাফল স্কেল করুন',
          negative: false,
        },
      ],
      showcase: {
        badgeEn: 'Performance Benchmark',
        badgeBn: 'বাস্তব পারফরম্যান্স মেট্রিক্স',
        cardTitleEn: 'Verified Growth Metrics',
        cardTitleBn: 'ভেরিফায়েড গ্রোথ মেট্রিক্স',
        headlineEn: '3.2x Average ROAS & 42% Lower CPR',
        headlineBn: 'গড় ৩.২x ROAS ও ৪২% কম বিজ্ঞাপন খরচ',
        sublineEn: 'Turning daily ad spend from a bleeding expense into predictable profit.',
        sublineBn: 'বিজ্ঞাপনের ব্যয়কে প্রতিদিনের লোকসান থেকে একটি স্থায়ী লাভের ইঞ্জিনে রূপান্তর করুন।',
        metrics: [
          { label: isBn ? 'গড় ROAS বৃদ্ধি' : 'Avg. ROAS Lift', val: '3.2x - 4.5x', alert: false },
          { label: isBn ? 'বিজ্ঞাপন খরচ (CPR)' : 'CPR Reduction', val: '-42%', alert: false },
          { label: isBn ? 'ডেলিভারি স্প্রিন্ট' : 'Delivery Sprint', val: isBn ? '৪৮ ঘণ্টা' : '48 Hours', alert: false },
        ],
        footerNoteEn: 'Start with 5 conversion creatives for ৳3,999 — zero long-term lock-in.',
        footerNoteBn: 'কোনো দীর্ঘমেয়াদী চুক্তি ছাড়াই মাত্র ৳৩,৯৯৯-তে ৫টি ক্রিয়েটিভ দিয়ে ট্রায়াল শুরু করুন।',
      },
    },
  ];

  const current = chapters[activeTab];

  return (
    <section 
      id="brand-positioning" 
      className="relative bg-[#1e3a8a] text-[#f9fafb] py-10 sm:py-16 md:py-28 px-4 sm:px-8 md:px-14 overflow-hidden border-t border-b border-white/10"
    >
      {/* Brand Subtle Moving Grid Texture matching Hero */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Elegant Warm Amber & Off-White Ambient Lighting */}
      <div 
        className="absolute -top-32 -right-32 w-96 h-96 bg-[#fb923c]/10 rounded-full blur-[120px] pointer-events-none" 
      />
      <div 
        className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#f9fafb]/5 rounded-full blur-[120px] pointer-events-none" 
      />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-16">
          <span 
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fb923c]/15 text-[#fb923c] border border-[#fb923c]/30 text-[10px] md:text-[11px] font-semibold uppercase mb-2.5 md:mb-4 shadow-sm ${
              isBn ? 'tracking-normal' : 'tracking-[0.25em]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{isBn ? 'কেন বেশিরভাগ বিজ্ঞাপন ফেইল করে?' : 'Why Most Meta Ads Bleed Money'}</span>
          </span>

          <h2 
            className="text-xl sm:text-3xl md:text-5xl font-heading font-normal text-[#f9fafb] tracking-tight leading-snug mb-2 md:mb-4"
            style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : { fontFamily: "'Cormorant Garamond', serif" }}
          >
            {isBn ? (
              <>
                সমস্যা আপনার প্রোডাক্টে না, সমস্যা <span className="text-[#fb923c] italic font-semibold">বিজ্ঞাপনের চেহারায়</span>
              </>
            ) : (
              <>
                The Problem Isn't Your Product. It’s <span className="text-[#fb923c] italic font-semibold">How It Looks.</span>
              </>
            )}
          </h2>

          <p 
            className="text-[#f9fafb]/80 text-[12px] sm:text-[14px] md:text-[16px] leading-relaxed font-light max-w-2xl mx-auto"
            style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
          >
            {isBn 
              ? 'ভালো প্রোডাক্ট বানিয়েও লাভ নেই, যদি বিজ্ঞাপনে সেটাকে সাধারণ ক্যানভা টেমপ্লেট মনে হয়। মানুষ চোখে বিশ্বাস না পেলে কখনো ফুল প্রাইস দিয়ে অর্ডার করে না।'
              : 'You can make the finest product in Bangladesh. But if your ad looks like a 10-minute Canva template, people assume it is cheap. Trust drives orders. Not discounts.'
            }
          </p>
        </div>

        {/* MOBILE VIEW: Ultra-Clean High-Impact 2-Column Comparison Matrix */}
        <div className="block lg:hidden mb-2">
          <div className="p-3.5 sm:p-5 rounded-2xl bg-white/[0.06] border border-white/12 shadow-xl backdrop-blur-md">
            <div className="text-center mb-3">
              <span className="text-[9.5px] font-mono uppercase tracking-[1.5px] text-accent font-semibold">
                {isBn ? 'বাস্তব তুলনামূলক পার্থক্য' : 'Side-by-Side Reality'}
              </span>
              <h3 
                className="text-base font-bold text-white mt-0.5"
                style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : { fontFamily: "'Cormorant Garamond', serif" }}
              >
                {isBn ? 'সস্তা ক্যানভা টেমপ্লেট ❌ বনাম POLISHED সিস্টেম ✨' : 'Cheap Canva Ads ❌ vs POLISHED System ✨'}
              </h3>
            </div>

            {/* 2-Column Side-by-Side Matrix */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 text-left">
              {/* Left Column: Canva / Typical */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-red-950/25 border border-red-500/25 flex flex-col justify-between">
                <div>
                  <span className="text-[9.5px] font-bold text-red-400 uppercase tracking-wider block mb-1.5">
                    {isBn ? 'সাধারণ ক্যানভা ❌' : 'Generic Canva ❌'}
                  </span>
                  <ul className="space-y-1.5 text-[10px] text-white/70">
                    <li className="flex items-start gap-1">
                      <span className="text-red-400">✕</span>
                      <span>{isBn ? 'চেনা টেমপ্লেট ও দুর্বল কপি' : 'Recycled template, weak copy'}</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-red-400">✕</span>
                      <span>{isBn ? '০.৮x - ১.২x ROAS (লস)' : '0.8x - 1.2x ROAS (Losing money)'}</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-red-400">✕</span>
                      <span>{isBn ? '৩৫% - ৪৫% COD রিটার্ন' : '35% - 45% COD returns'}</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-red-400">✕</span>
                      <span>{isBn ? 'ইনবক্সে "দাম কত" বলে উধাও' : 'Inbox "Price please?" ghosting'}</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-2.5 pt-1.5 border-t border-red-500/15 text-[9px] text-red-300/80 font-mono">
                  {isBn ? 'ডলার অপচয় ও শূন্য লাভ' : 'Budget Drain & Zero Profit'}
                </div>
              </div>

              {/* Right Column: POLISHED */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-accent/15 border border-accent/30 flex flex-col justify-between">
                <div>
                  <span className="text-[9.5px] font-bold text-accent uppercase tracking-wider block mb-1.5">
                    {isBn ? 'POLISHED সিস্টেম ✨' : 'POLISHED System ✨'}
                  </span>
                  <ul className="space-y-1.5 text-[10px] text-white/95">
                    <li className="flex items-start gap-1">
                      <span className="text-accent font-bold">✓</span>
                      <span>{isBn ? 'আস্থার প্রতীক বাংলা সেলস আর্ট' : 'Authority visual & copy'}</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-accent font-bold">✓</span>
                      <span>{isBn ? '৩.২x - ৪.৫x গড় ROAS' : '3.2x - 4.5x average ROAS'}</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-accent font-bold">✓</span>
                      <span>{isBn ? 'COD রিটার্ন এক ধাক্কায় কমে' : 'Dramatic drop in returns'}</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-accent font-bold">✓</span>
                      <span>{isBn ? 'ছাড় ছাড়াই নিশ্চিন্ত অর্ডার' : 'Full-price orders without discounts'}</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-2.5 pt-1.5 border-t border-accent/20 text-[9px] text-accent font-mono font-bold">
                  {isBn ? 'গড় ৩.২x ভেরিফায়েড সেলস' : '3.2x Scaled Revenue'}
                </div>
              </div>
            </div>

            {/* Single High-Converting CTA */}
            <div className="mt-3 pt-2.5 border-t border-white/10">
              <button
                type="button"
                onClick={() => openQuickBookingModal({
                  source: 'Mobile Comparison Card',
                })}
                className="w-full py-2.5 px-4 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span>{isBn ? '৳৩,৯৯৯ টেস্ট ড্রাইভে তফাত দেখুন' : 'Experience ৳3,999 Sprint'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* DESKTOP VIEW: Quiet Luxury Interactive Chapter Tabs & Showcase */}
        <div className="hidden lg:block">
          <div className="flex justify-center mb-8 md:mb-14 px-1">
            <div className="grid grid-cols-3 p-1 sm:p-1.5 rounded-2xl bg-white/[0.07] border border-white/15 backdrop-blur-md shadow-lg w-full max-w-md sm:max-w-2xl">
              {chapters.map((ch, idx) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`relative py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl text-[11px] sm:text-sm font-medium transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 text-center ${
                  activeTab === idx
                    ? 'text-white font-semibold shadow-md'
                    : 'text-white/60 hover:text-white/90 hover:bg-white/[0.04]'
                }`}
              >
                {activeTab === idx && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 rounded-xl bg-[#fb923c]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 font-mono text-[10px] sm:text-[11px] opacity-80">{ch.num}.</span>
                <span className="relative z-10 hidden sm:inline">{isBn ? ch.tabLabelBn : ch.tabLabelEn}</span>
                <span className="relative z-10 inline sm:hidden">
                  {isBn 
                    ? (idx === 0 ? 'ভুল ফাঁদ' : idx === 1 ? 'সমাধান' : 'ফলাফল')
                    : (idx === 0 ? 'The Flaw' : idx === 1 ? 'Solution' : 'Payoff')
                  }
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Presentation Content Box */}
        <div className="rounded-3xl border border-white/15 bg-white/[0.05] backdrop-blur-xl p-6 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              
              {/* Left Column: Narrative & Strategic Reasoning */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* Eyebrow badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-mono tracking-wider uppercase text-[#fb923c]">
                  <span>{isBn ? current.eyebrowBn : current.eyebrowEn}</span>
                </div>

                {/* Chapter Title */}
                <h3 
                  className="text-2xl sm:text-3xl md:text-4xl font-heading font-normal text-white leading-snug"
                  style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : { fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {isBn ? current.titleBn : current.titleEn}
                </h3>

                {/* Description */}
                <p 
                  className="text-[#f9fafb]/85 text-[14px] sm:text-[15px] leading-relaxed font-light"
                  style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
                >
                  {isBn ? current.descBn : current.descEn}
                </p>

                {/* Strategic Proofpoints */}
                <ul className="space-y-3 pt-2">
                  {current.bulletPoints.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-3 text-[13px] sm:text-[14px] text-white/90">
                      <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                        pt.negative
                          ? 'border-white/30 bg-white/10 text-white/70'
                          : 'border-[#fb923c]/50 bg-[#fb923c]/20 text-[#fb923c]'
                      }`}>
                        {pt.negative ? (
                          <AlertCircle className="w-3 h-3 text-white/70" />
                        ) : (
                          <Check className="w-3 h-3 text-[#fb923c]" />
                        )}
                      </div>
                      <span className="leading-snug">{isBn ? pt.bn : pt.en}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Buttons */}
                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <a
                    href="https://wa.me/8801346288210?text=Hi%20POLISHED%2C%20I%20want%20to%20start%20the%20%E0%A7%B33999%20Skincare%20Trial%20Pack!"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#fb923c] text-white font-bold text-xs uppercase tracking-wider shadow-[0_8px_25px_rgba(251,146,60,0.35)] hover:bg-[#f97316] transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>{isBn ? '৳৩,৯৯৯ ট্রায়াল শুরু করুন' : 'Start ৳3,999 Trial'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <button
                    type="button"
                    onClick={() => openAuditModal({ source: 'Brand Positioning Section' })}
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-[#f9fafb] text-xs font-semibold tracking-wider transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#fb923c]" />
                    <span>{isBn ? 'ফ্রি ৫-মিনিট ভিজ্যুয়াল অডিট' : 'Free 5-Min Visual Audit'}</span>
                  </button>
                </div>

              </div>

              {/* Right Column: High-End Quiet Luxury Editorial Showcase */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-white/20 bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-6 sm:p-8 backdrop-blur-xl shadow-xl relative overflow-hidden">
                  
                  {/* Card Header Bar */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#fb923c]" />
                      <span className="text-[11px] font-mono uppercase tracking-widest text-[#f9fafb]/70">
                        {isBn ? current.showcase.cardTitleBn : current.showcase.cardTitleEn}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[#fb923c] font-semibold">
                      {isBn ? current.showcase.badgeBn : current.showcase.badgeEn}
                    </span>
                  </div>

                  {/* Stage Mockup Frame */}
                  <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 flex flex-col justify-center text-center relative overflow-hidden min-h-[220px]">
                    
                    {/* Subtle aesthetic corner marks */}
                    <div className="absolute top-2 left-2 text-[10px] font-mono text-white/30">✦</div>
                    <div className="absolute top-2 right-2 text-[10px] font-mono text-white/30">✦</div>
                    <div className="absolute bottom-2 left-2 text-[10px] font-mono text-white/30">✦</div>
                    <div className="absolute bottom-2 right-2 text-[10px] font-mono text-white/30">✦</div>

                    <h4 
                      className={`text-xl sm:text-2xl md:text-3xl font-heading mb-3 leading-snug ${
                        activeTab === 0 
                          ? 'text-white/80 line-through opacity-70' 
                          : 'text-[#f9fafb] font-normal italic'
                      }`}
                      style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : { fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {isBn ? current.showcase.headlineBn : current.showcase.headlineEn}
                    </h4>

                    <p 
                      className="text-xs sm:text-sm text-[#f9fafb]/75 font-light max-w-md mx-auto leading-relaxed"
                      style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
                    >
                      {isBn ? current.showcase.sublineBn : current.showcase.sublineEn}
                    </p>

                    {activeTab === 1 && (
                      <div className="mt-5 inline-flex items-center justify-center gap-3 text-[11px] font-mono text-[#fb923c] border-t border-white/10 pt-3">
                        <span>✦ Meta Safe</span>
                        <span>•</span>
                        <span>★ High AOV Architecture</span>
                        <span>•</span>
                        <span>⚡ 48h Sprint</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Verified Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center bg-white/[0.04] rounded-xl p-3 sm:p-4 border border-white/10 mt-5">
                    {current.showcase.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="px-1">
                        <span className="text-[10px] sm:text-[11px] text-[#f9fafb]/60 block font-light leading-tight">
                          {m.label}
                        </span>
                        <span className={`text-xs sm:text-sm font-bold block font-mono mt-1 ${
                          m.alert ? 'text-white/70' : 'text-[#fb923c]'
                        }`}>
                          {m.val}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Editorial Footnote */}
                  <p className="text-[11px] text-[#f9fafb]/60 text-center font-light mt-4 italic">
                    {isBn ? current.showcase.footerNoteBn : current.showcase.footerNoteEn}
                  </p>

                </div>
              </div>

            </motion.div>
          </AnimatePresence>

        </div>
        </div>

      </div>
    </section>
  );
}
