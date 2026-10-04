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
      tabLabelEn: 'The Industry Flaw',
      tabLabelBn: 'বাজারের সাধারণ ভুল',
      eyebrowEn: 'The Common Misconception',
      eyebrowBn: 'বাংলাদেশের ই-কমার্সের বড় ভুল',
      titleEn: 'Broken English & Cheap Templated Visuals',
      titleBn: 'জেনেরিক ক্যানভা টেমপ্লেট ও দুর্বল কমিউনিকেশন',
      descEn:
        'In the Bangladeshi e-commerce space, there is a massive misconception that using Bengali automatically lowers a brand’s perceived value. As a result, brands resort to broken, generic English that fails to connect emotionally, or cheap Canva templates that destroy luxury perception and force endless discounting.',
      descBn:
        'বাংলাদেশের ই-কমার্সে একটি প্রচলিত ভুল ধারণা রয়েছে—বাংলা ব্যবহার করলে নাকি ব্র্যান্ডের আভিজাত্য কমে যায়। ফলে বেশিরভাগ ব্র্যান্ড দুর্বল ইংরেজি কপি ব্যবহার করে যা ক্রেতার আবেগে পৌঁছায় না, অথবা সস্তা ক্যানভা টেমপ্লেটে ডিজাইন করে যা ব্র্যান্ডের মর্যাদা নষ্ট করে এবং গ্রাহককে শুধু ডিসকাউন্টের পেছনে দৌড়ায়।',
      bulletPoints: [
        {
          en: 'Uninspiring generic English that fails to trigger emotional buying impulses in local shoppers',
          bn: 'অপ্রাসঙ্গিক ইংরেজি টেক্সট যা সাধারণ বাংলাদেশি ক্রেতার আবেগ বা কেনার তাড়না জাগায় না',
          negative: true,
        },
        {
          en: 'Recycled Canva templates that make a ৳2,000 skincare product look like a ৳200 cheap commodity',
          bn: 'ক্যানভা-লেভেল চেনা টেমপ্লেট—যা প্রিমিয়াম প্রোডাক্টকে সস্তা সাধারণ পণ্যের মতো দেখায়',
          negative: true,
        },
        {
          en: 'Aggressive discount-chasing and policy violations that lead to frequent Meta ad bans',
          bn: 'অতিরিক্ত ছাড়ের ফাঁদ এবং মেটা পলিসি না মেনে অ্যাড দেওয়ায় অ্যাকাউন্ট ব্যানের ঝুঁকি',
          negative: true,
        },
      ],
      showcase: {
        badgeEn: 'Typical Ad Performance',
        badgeBn: 'সাধারণ অ্যাডের বাস্তব চিত্র',
        cardTitleEn: 'Average Generic Approach',
        cardTitleBn: 'সাধারণ ফেসবুক বিজ্ঞাপন',
        headlineEn: '"50% MEGA SALE - BEST WHITENING CREAM"',
        headlineBn: '"৫০% মেগা ডিসকাউন্ট! সেরা ক্রিম অর্ডার করুন"',
        sublineEn: 'Disjointed messaging, low brand trust, and heavy customer skepticism.',
        sublineBn: 'আস্থার চরম অভাব, মাত্রাতিরিক্ত ডিসকাউন্ট নির্ভরতা ও ক্রেতার অনীহা।',
        metrics: [
          { label: isBn ? 'গড় আরওএএস (ROAS)' : 'Average ROAS', val: '0.9x - 1.3x', alert: true },
          { label: isBn ? 'সিওডি রিটার্ন হার' : 'COD Return Risk', val: '30% - 40%', alert: true },
          { label: isBn ? 'ব্র্যান্ড পারসেপশন' : 'Brand Perception', val: isBn ? 'কমোডিটি / সস্তা' : 'Low Status', alert: true },
        ],
        footerNoteEn: 'Result: Ad spend is wasted while customer acquisition costs spiral out of control.',
        footerNoteBn: 'ফলাফল: বিজ্ঞাপনের টাকা অপচয় হয় এবং দিনশেষে ক্যাশ-অন-ডেলিভারি রিটার্নে বড় ক্ষতি হয়।',
      },
    },
    {
      id: 'solution',
      num: isBn ? '০২' : '02',
      tabLabelEn: 'The POLISHED Solution',
      tabLabelBn: 'POLISHED সমাধান',
      eyebrowEn: 'The Strategic Distinction',
      eyebrowBn: 'আমাদের সিগনেচার মেথডলজি',
      titleEn: "Pioneering the 'Premium Bengali' Aesthetic",
      titleBn: 'পরিশীলিত বাংলা ও শান্ত লাক্সারি ভিজ্যুয়াল',
      descEn:
        'We pioneer the "Premium Bengali" aesthetic. We pair world-class, clean Quiet Luxury visual design with deeply evocative, sophisticated Bengali copywriting. The result: maximum relatability for the Bangladeshi demographic, combined with unquestioned prestige and buying conviction.',
      descBn:
        'আমরা তৈরি করেছি "প্রিমিয়াম বাংলা" নান্দনিক ধারা। আন্তর্জাতিক মানের শান্ত লাক্সারি (Quiet Luxury) ভিজ্যুয়ালের সাথে আমরা যুক্ত করি মার্জিত ও আভিজাত্যপূর্ণ বাংলা কপিরাইটিং। এর ফলে ক্রেতা প্রথম দেখাতেই ব্র্যান্ডটিকে বিশ্বাস করে এবং নিশ্চিন্তে উচ্চমূল্যের অর্ডার প্লেস করে।',
      bulletPoints: [
        {
          en: 'Psychological visual hierarchy designed to stop the frantic scroll within 0.8 seconds',
          bn: 'সাইকোলজিক্যাল ভিজ্যুয়াল হায়ারার্কি যা প্রথম ০.৮ সেকেন্ডেই স্ক্রলিং থামিয়ে নজরে আটকে রাখে',
          negative: false,
        },
        {
          en: 'Sophisticated cultural copywriting that communicates exclusivity and genuine care',
          bn: 'মার্জিত ও আত্মবিশ্বাসী বাংলা ভাষা—যা ব্র্যান্ডকে সম্মানজনক ও নির্ভরযোগ্য অবস্থানে রাখে',
          negative: false,
        },
        {
          en: '100% Meta Ad Policy Compliant creatives engineered to protect ad accounts from bans',
          bn: '১০০% মেটা অ্যাড পলিসি কমপ্লায়েন্ট—অ্যাকাউন্ট রেস্ট্রিকশন বা পলিসি ভায়োলেশনের ভয় নেই',
          negative: false,
        },
      ],
      showcase: {
        badgeEn: 'POLISHED Quiet Luxury Creative',
        badgeBn: 'POLISHED সিগনেচার ক্রিয়েটিভ',
        cardTitleEn: 'Premium Bengali Standard',
        cardTitleBn: 'পরিশীলিত বাংলা আর্কিটেকচার',
        headlineEn: '“অনুভবে স্নিগ্ধতা, পরিচর্যায় আভিজাত্য।”',
        headlineBn: '“অনুভবে স্নিগ্ধতা, পরিচর্যায় আভিজাত্য।”',
        sublineEn: 'Crafted for discerning Bangladeshi buyers who value genuine prestige over cheap gimmicks.',
        sublineBn: 'অভিজাত ক্রেতাদের মনের মতো করে তৈরি—যেখানে প্রতিটি শব্দ ও ফ্রেম আস্থা ও প্রিমিয়াম ফিল নিশ্চিত করে।',
        metrics: [
          { label: isBn ? 'মেটা পলিসি গ্রেড' : 'Meta Policy Grade', val: '100% Safe', alert: false },
          { label: isBn ? 'ভিজ্যুয়াল ক্যাটাগরি' : 'Visual Category', val: 'Quiet Luxury', alert: false },
          { label: isBn ? 'কমিউনিকেশন টোন' : 'Brand Voice', val: isBn ? 'মার্জিত ও প্রাজ্ঞ' : 'Classy & Confident', alert: false },
        ],
        footerNoteEn: 'Engineered specifically for premium skincare, haircare, and wellness D2C brands.',
        footerNoteBn: 'প্রিমিয়াম স্কিনকেয়ার, হেয়ারকেয়ার ও ওয়েলনেস ব্র্যান্ডের জন্য বিশেষভাবে উপযোগী।',
      },
    },
    {
      id: 'payoff',
      num: isBn ? '০৩' : '03',
      tabLabelEn: 'Commercial Payoff',
      tabLabelBn: 'পরিমাপযোগ্য ফলাফল',
      eyebrowEn: 'Verified Business Impact',
      eyebrowBn: 'বাণিজ্যিক সাফল্য ও আরওএএস',
      titleEn: 'Slashing CPR & Scaling Net Profit Margin',
      titleBn: 'বিজ্ঞাপনের খরচ হ্রাস ও বিক্রির নতুন গতি',
      descEn:
        'When your creatives look 10x more authoritative than the market standard, ad relevance scores surge, Cost Per Result (CPR) plunges, and Cash-on-Delivery (COD) return risks drop to near zero. We empower both D2C brands and marketing agencies to scale sustainably.',
      descBn:
        'প্রতিযোগীদের চেয়ে আপনার ডিজাইন যখন ১০ গুণ বেশি বিশ্বাসযোগ্য ও অভিজাত দেখায়, তখন মেটা অ্যালগরিদম আপনাকে সবচেয়ে কম খরচে সর্বোচ্চ কোয়ালিটির ক্রেতা এনে দেয়। ক্যাশ-অন-ডেলিভারি রিটার্ন ঝুঁকি কমে প্রায় শূন্যে নেমে আসে এবং আরওএএস বহুগুণ বৃদ্ধি পায়।',
      bulletPoints: [
        {
          en: 'Average 3.2x ROAS lift demonstrated across 30+ premium Bangladeshi D2C stores',
          bn: '৩০+ বাংলাদেশি স্কিনকেয়ার ব্র্যান্ডে পরীক্ষিত: গড়ে ৩.২x পর্যন্ত আরওএএস (ROAS) বৃদ্ধি',
          negative: false,
        },
        {
          en: 'Up to 42% reduction in Cost Per Result (CPR) through superior creative engagement',
          bn: 'উচ্চমানের ক্রিয়েটিভের কারণে বিজ্ঞাপন খরচ (CPR) গড়ে ৪২% পর্যন্ত কমে আসে',
          negative: false,
        },
        {
          en: 'White-label agency partnership: The invisible backend creative engine for marketing agencies',
          bn: 'মার্কেটিং এজেন্সিগুলোর জন্য হোয়াইট-লেবেল সুবিধা—টিম খরচ ছাড়াই ক্লায়েন্টের ফলাফল স্কেল করুন',
          negative: false,
        },
      ],
      showcase: {
        badgeEn: 'Performance Benchmark',
        badgeBn: 'বাস্তব পারফরম্যান্স মেট্রিক্স',
        cardTitleEn: 'The Scaled Enterprise Result',
        cardTitleBn: 'ভেরিফায়েড গ্রোথ মেট্রিক্স',
        headlineEn: '3.2x Average ROAS Lift',
        headlineBn: 'গড় ৩.২x ROAS ও ৪২% কম CPR',
        sublineEn: 'Transforming marketing spend from a bleeding expense into a predictable revenue engine.',
        sublineBn: 'বিজ্ঞাপনের ব্যয়কে অনিশ্চিত খরচ থেকে একটি প্রেডিক্টেবল প্রফিট ইঞ্জিনে রূপান্তর করুন।',
        metrics: [
          { label: isBn ? 'গড় ROAS বৃদ্ধি' : 'Avg. ROAS Lift', val: '3.2x - 3.8x', alert: false },
          { label: isBn ? 'বিজ্ঞাপন খরচ (CPR)' : 'CPR Reduction', val: '-42%', alert: false },
          { label: isBn ? 'ডেলিভারি স্প্রিন্ট' : 'Turnaround', val: isBn ? '৪৮ ঘণ্টা' : '48 Hours', alert: false },
        ],
        footerNoteEn: 'Start with 5 conversion creatives for ৳3,999 — no long-term contracts required.',
        footerNoteBn: 'কোনো দীর্ঘমেয়াদী চুক্তি ছাড়াই মাত্র ৳৩,৯৯৯-তে ৫টি প্রিমিয়াম ক্রিয়েটিভ দিয়ে ট্রায়াল শুরু করুন।',
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
            <span>{isBn ? 'স্ট্র্যাটেজিক পজিশনিং ও আর্কিটেকচার' : 'The Strategic Advantage'}</span>
          </span>

          <h2 
            className="text-xl sm:text-3xl md:text-5xl font-heading font-normal text-[#f9fafb] tracking-tight leading-snug mb-2 md:mb-4"
            style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : { fontFamily: "'Cormorant Garamond', serif" }}
          >
            {isBn ? (
              <>
                পরিশীলিত বাংলা ও <span className="text-[#fb923c] italic font-semibold">শান্ত লাক্সারির</span> মেলবন্ধন
              </>
            ) : (
              <>
                Pioneering the <span className="text-[#fb923c] italic font-semibold">"Premium Bengali"</span> Aesthetic
              </>
            )}
          </h2>

          <p 
            className="text-[#f9fafb]/80 text-[12px] sm:text-[14px] md:text-[16px] leading-relaxed font-light max-w-2xl mx-auto"
            style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
          >
            {isBn 
              ? 'আমরা বিশ্বাস করি বাংলাদেশের স্কিনকেয়ার ও D2C ব্র্যান্ডগুলোর জন্য আন্তর্জাতিক মানের আভিজাত্য এবং স্থানীয় সাংস্কৃতিক সংযোগ—দুটোই একসাথে নিশ্চিত করা সম্ভব।'
              : 'Bridging the gap between world-class Quiet Luxury design and deep cultural resonance to unlock record-breaking conversions for skincare brands.'
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
                {isBn ? 'ক্যানভা টেমপ্লেট ❌ বনাম POLISHED ✨' : 'Generic Canva ❌ vs POLISHED Standard ✨'}
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
                      <span>{isBn ? 'চেনা টেমপ্লেট ও সাধারণ কপি' : 'Recycled templated visuals'}</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-red-400">✕</span>
                      <span>{isBn ? '০.৯x - ১.৩x গড় ROAS' : '0.9x - 1.3x Avg ROAS'}</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-red-400">✕</span>
                      <span>{isBn ? '৩০-৪০% COD রিটার্ন ঝুঁকি' : '30-40% COD return rate'}</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-red-400">✕</span>
                      <span>{isBn ? 'বারবার ডিসকাউন্টের চাপ' : 'Forced heavy discounting'}</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-2.5 pt-1.5 border-t border-red-500/15 text-[9px] text-red-300/80 font-mono">
                  {isBn ? 'সিপিআর বৃদ্ধি ও বাজেট অপচয়' : 'High CAC & Budget Drain'}
                </div>
              </div>

              {/* Right Column: POLISHED */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-accent/15 border border-accent/30 flex flex-col justify-between">
                <div>
                  <span className="text-[9.5px] font-bold text-accent uppercase tracking-wider block mb-1.5">
                    {isBn ? 'POLISHED স্ট্যান্ডার্ড ✨' : 'POLISHED Standard ✨'}
                  </span>
                  <ul className="space-y-1.5 text-[10px] text-white/95">
                    <li className="flex items-start gap-1">
                      <span className="text-accent font-bold">✓</span>
                      <span>{isBn ? 'আভিজাত্যময় বাংলা কপি ও আর্ট' : 'Custom high-status visuals'}</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-accent font-bold">✓</span>
                      <span>{isBn ? '৩.২x - ৪.৫x গড় ROAS' : '3.2x - 4.5x Avg ROAS'}</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-accent font-bold">✓</span>
                      <span>{isBn ? 'COD রিটার্নে বড় পতন' : 'Drastic drop in returns'}</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-accent font-bold">✓</span>
                      <span>{isBn ? 'কোনো ছাড় ছাড়াই হাই AOV' : 'Zero discounts required'}</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-2.5 pt-1.5 border-t border-accent/20 text-[9px] text-accent font-mono font-bold">
                  {isBn ? 'গড় ৩.২x সেলস গ্রোথ' : '3.2x Validated Scaling'}
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
