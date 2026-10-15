import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
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
  const [mobileComparisonTab, setMobileComparisonTab] = useState<'polished' | 'canva'>('polished');

  const chapters = [
    {
      id: 'trap',
      num: isBn ? '০১' : '01',
      tabLabelEn: "The Shopper's Eyes",
      tabLabelBn: 'কাস্টমারের চোখ',
      eyebrowEn: 'Late Night Scrolling',
      eyebrowBn: 'রাত ১১টায় বিছানায় শুয়ে স্ক্রল',
      titleEn: 'রাত ১১টায় সস্তা ডিজাইন দেখলে আঙুল থামে না।',
      titleBn: 'রাত ১১টায় সস্তা ডিজাইন দেখলে আঙুল থামে না।',
      descEn:
        'When your ad looks like another free Canva template, shoppers instantly scroll past without feeling trust.',
      descBn:
        '১০ মিনিটের ফ্রি টেমপ্লেট দেখলেই কাস্টমারের মনে সন্দেহ জাগে—আর ত্বকের জন্য কেউ সন্দেহ নিয়ে কোনো প্রোডাক্ট কেনে না।',
      bulletPoints: [
        {
          en: '✓ সবাই একই ক্যানভা টেমপ্লেট ব্যবহার করে।',
          bn: '✓ সবাই একই ক্যানভা টেমপ্লেট ব্যবহার করে।',
          negative: true,
        },
        {
          en: '✓ বারকোড বা টেকক্সচার না দেখলে রেপ্লিকা মনে হয়।',
          bn: '✓ বারকোড বা টেক্সচার না দেখলে রেপ্লিকা মনে হয়।',
          negative: true,
        },
        {
          en: '✓ দাম শুনেই কাস্টমার নীরবে ইনবক্স ছাড়ে।',
          bn: '✓ দাম শুনেই কাস্টমার নীরবে ইনবক্স ছাড়ে।',
          negative: true,
        },
      ],
      showcase: {
        badgeEn: 'Common Canva Ad',
        badgeBn: 'সাধারণ ক্যানভা বিজ্ঞাপন',
        cardTitleEn: 'Cheap Discount Angle',
        cardTitleBn: 'সস্তা ডিসকাউন্টের পোস্ট',
        headlineEn: '"50% MEGA DISCOUNT - BEST CREAM"',
        headlineBn: '"৫০% বিশাল ডিসকাউন্ট! এখনই কিনুন"',
        sublineEn: 'সস্তা বিজ্ঞাপন কেনার অনুরোধ করে। ভালো বিজ্ঞাপন শুধু নিজের মান দেখায়।',
        sublineBn: 'সস্তা বিজ্ঞাপন কেনার অনুরোধ করে। ভালো বিজ্ঞাপন শুধু নিজের মান দেখায়।',
        metrics: [
          { label: isBn ? 'ইনবক্স সাড়া' : 'Inbox Reply', val: isBn ? 'Price Please?' : 'Ghosting', alert: true },
          { label: isBn ? 'পার্সেল রিটার্ন' : 'COD Return', val: '35%+', alert: true },
          { label: isBn ? 'দিনশেষে লাভ' : 'Profit', val: isBn ? 'লোকসান' : 'Bleeding', alert: true },
        ],
        footerNoteEn: 'Every morning Meta charges your card while shoppers vanish after asking the price.',
        footerNoteBn: 'প্রতিদিন সকালে বিজ্ঞাপনের টাকা ঠিকই কাটা যায়, কিন্তু দিনশেষে কোনো স্থায়ী কাস্টমার থাকে না।',
      },
    },
    {
      id: 'solution',
      num: isBn ? '০২' : '02',
      tabLabelEn: 'Inbox Silence',
      tabLabelBn: 'ইনবক্সের নীরবতা',
      eyebrowEn: 'Value Over Bargaining',
      eyebrowBn: 'দাম নয়, আসল ভরসা',
      titleEn: 'কাস্টমার দাম দেখে পালায় না, ভরসা পায় না বলে পালায়।',
      titleBn: 'কাস্টমার দাম দেখে পালায় না, ভরসা পায় না বলে পালায়।',
      descEn:
        'Show the barcode, active ingredients, and true texture right inside the visual so buyers never ask for discounts.',
      descBn:
        'ভিডিও ও ছবিতে যখন প্রোডাক্টের আসল আভিজাত্য ফুটে ওঠে, কাস্টমার আর ১০০ টাকা ছাড় খোঁজে না—সরাসরি অর্ডার করে।',
      bulletPoints: [
        {
          en: '✓ প্রথম সেকেন্ডেই ক্রিম বা সিরামের আসল ঘনত্ব দেখানো হয়।',
          bn: '✓ প্রথম সেকেন্ডেই ক্রিম বা সিরামের আসল ঘনত্ব দেখানো হয়।',
          negative: false,
        },
        {
          en: '✓ ছবির ভেতরেই থাকে বারকোড ও আসল উপাদানের প্রমাণ।',
          bn: '✓ ছবির ভেতরেই থাকে বারকোড ও আসল উপাদানের প্রমাণ।',
          negative: false,
        },
        {
          en: '✓ সন্দেহ দূর হলে কাস্টমার আর ডিসকাউন্ট চায় না।',
          bn: '✓ সন্দেহ দূর হলে কাস্টমার আর ডিসকাউন্ট চায় না।',
          negative: false,
        },
      ],
      showcase: {
        badgeEn: 'POLISHED Craft',
        badgeBn: 'নীরব আভিজাত্য',
        cardTitleEn: 'Signature Polish',
        cardTitleBn: 'আমাদের কাজের মান',
        headlineEn: '“অনুভবে স্নিগ্ধতা, পরিচর্যায় খাঁটি যত্ন।”',
        headlineBn: '“অনুভবে স্নিগ্ধতা, পরিচর্যায় খাঁটি যত্ন।”',
        sublineEn: 'সস্তা বিজ্ঞাপন কেনার অনুরোধ করে। ভালো বিজ্ঞাপন শুধু নিজের মান দেখায়।',
        sublineBn: 'সস্তা বিজ্ঞাপন কেনার অনুরোধ করে। ভালো বিজ্ঞাপন শুধু নিজের মান দেখায়।',
        metrics: [
          { label: isBn ? 'ডিজাইন' : 'Design', val: isBn ? '১০০% নিজস্ব' : '100% Bespoke', alert: false },
          { label: isBn ? 'ভাষা' : 'Language', val: isBn ? 'মার্জিত বাংলা' : 'Refined Bengali', alert: false },
          { label: isBn ? 'সময়' : 'Delivery', val: isBn ? '৪৮–৭২ ঘণ্টা' : '48–72 Hours', alert: false },
        ],
        footerNoteEn: 'Start with 1x Video Reel + 2x Image Ads for ৳2,500 — zero long-term commitments.',
        footerNoteBn: 'মাত্র ৳২,৫০০ টাকায় ১টি ভিডিও রিল + ২টি ছবির বিজ্ঞাপন দিয়ে আজই শুরু করুন।',
      },
    },
    {
      id: 'payoff',
      num: isBn ? '০৩' : '03',
      tabLabelEn: "The Rider's Call",
      tabLabelBn: 'ডেলিভারি ম্যানের কল',
      eyebrowEn: 'Delivery at the Gate',
      eyebrowBn: 'গেটে ডেলিভারি ম্যানের ফোন',
      titleEn: 'ডেলিভারি ম্যান ফোন দিলে কাস্টমারের নম্বর আর বন্ধ থাকে না।',
      titleBn: 'ডেলিভারি ম্যান ফোন দিলে কাস্টমারের নম্বর আর বন্ধ থাকে না।',
      descEn:
        'People who buy from trust wait eagerly for their parcel. COD returns drop by half.',
      descBn:
        'বিশ্বাস নিয়ে যারা ফুল-প্রাইসে অর্ডার করে, তারা ডেলিভারি ম্যানের ফোন মিস করে না। পার্সেল রিটার্ন অর্ধেকে নেমে আসে।',
      bulletPoints: [
        {
          en: '✓ ভুয়া ছাড়ের লোভে অর্ডার করা মানুষই পার্সেল ফিরিয়ে দেয়।',
          bn: '✓ ভুয়া ছাড়ের লোভে অর্ডার করা মানুষই পার্সেল ফিরিয়ে দেয়।',
          negative: false,
        },
        {
          en: '✓ মান দেখে যারা অর্ডার করে, তারা পার্সেলের অপেক্ষায় থাকে।',
          bn: '✓ মান দেখে যারা অর্ডার করে, তারা পার্সেলের অপেক্ষায় থাকে।',
          negative: false,
        },
        {
          en: '✓ ডিসকাউন্ট ছাড়াই ফুল-প্রাইসে বিক্রি ও কম রিটার্ন।',
          bn: '✓ ডিসকাউন্ট ছাড়াই ফুল-প্রাইসে বিক্রি ও কম রিটার্ন।',
          negative: false,
        },
      ],
      showcase: {
        badgeEn: 'Real Result',
        badgeBn: 'বাস্তব ফলাফল',
        cardTitleEn: 'Low Returns & Predictable Margin',
        cardTitleBn: 'সুরক্ষিত লাভ ও জিরো রিটার্ন ভয়',
        headlineEn: '“অনুভবে স্নিগ্ধতা, পরিচর্যায় খাঁটি যত্ন।”',
        headlineBn: '“অনুভবে স্নিগ্ধতা, পরিচর্যায় খাঁটি যত্ন।”',
        sublineEn: 'সস্তা বিজ্ঞাপন কেনার অনুরোধ করে। ভালো বিজ্ঞাপন শুধু নিজের মান দেখায়।',
        sublineBn: 'সস্তা বিজ্ঞাপন কেনার অনুরোধ করে। ভালো বিজ্ঞাপন শুধু নিজের মান দেখায়।',
        metrics: [
          { label: isBn ? 'অর্ডার কোয়ালিটি' : 'Order Quality', val: isBn ? 'ফুল-প্রাইস' : 'Full-Price', alert: false },
          { label: isBn ? 'সিওডি রিটার্ন' : 'COD Returns', val: isBn ? 'অর্ধেক হ্রাস' : 'Cut by 50%', alert: false },
          { label: isBn ? 'ডেলিভারি' : 'Delivery', val: isBn ? '৪৮–৭২ ঘণ্টা' : '48–72h', alert: false },
        ],
        footerNoteEn: 'Stop wasting ad money on cheap Canva templates. Upgrade your creatives in 72h.',
        footerNoteBn: 'বিজ্ঞাপনের টাকা পানিতে ফেলা বন্ধ করুন। মাত্র ৪৮–৭২ ঘণ্টায় নিজের পেজের ফলাফল পরখ করুন।',
      },
    },
  ];

  const current = chapters[activeTab];

  return (
    <section 
      id="brand-positioning" 
      className="relative bg-white text-primary border-t border-b border-primary/10 md:bg-[#1e3a8a] md:text-[#f9fafb] md:border-white/10 py-10 sm:py-16 md:py-28 px-4 sm:px-8 md:px-14 overflow-hidden"
    >
      {/* Brand Subtle Moving Grid Texture matching Hero (Desktop Only) */}
      <div 
        className="hidden md:block absolute inset-0 pointer-events-none opacity-40" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Elegant Warm Amber & Off-White Ambient Lighting (Hardware-accelerated radial glow with zero blur filter overhead - Desktop Only) */}
      <div 
        className="hidden md:block absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none" 
        style={{
          background: 'radial-gradient(circle, rgba(251, 146, 60, 0.12) 0%, rgba(251, 146, 60, 0.03) 45%, transparent 70%)',
        }}
      />
      <div 
        className="hidden md:block absolute -bottom-32 -left-32 w-96 h-96 rounded-full pointer-events-none" 
        style={{
          background: 'radial-gradient(circle, rgba(249, 250, 251, 0.07) 0%, rgba(249, 250, 251, 0.02) 45%, transparent 70%)',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-14">
          <span 
            className="eyebrow-pill-kicker inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fb923c]/15 text-[#fb923c] border border-[#fb923c]/30 mb-2.5 md:mb-4 shadow-sm"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>WHY ADS BLEED MONEY</span>
          </span>

          <h2 
            className="section-heading-h2 font-heading font-normal text-primary md:text-[#f9fafb] tracking-tight mx-auto mb-2 md:mb-4 text-center"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            The Problem Is <span className="text-[#fb923c] italic font-normal">How It Looks.</span>
          </h2>

          <p 
            className="section-lead-subtitle text-primary/75 md:text-[#f9fafb]/85 mx-auto text-center"
            style={isBn ? { fontFamily: "'Noto Serif Bengali', serif", lineHeight: 1.85 } : undefined}
          >
            {isBn 
              ? '১০ মিনিটের ক্যানভা টেমপ্লেট দেখলেই কাস্টমারের মনে সন্দেহ জাগে—আর সন্দেহ নিয়ে কেউ ত্বকের ক্রিম কেনে না।'
              : 'When an ad looks like a 10-minute Canva template, doubt creeps in—and nobody buys skincare with doubt.'
            }
          </p>
        </div>

        {/* UNIFIED INTERACTIVE 3 CHAPTER TABS: Swipeable on Mobile (<768px), 3-col on Desktop */}
        <div className="flex justify-center mb-4 md:mb-12 px-1">
          <div className="flex overflow-x-auto whitespace-nowrap scrollbar-none gap-1.5 p-1 sm:p-1.5 rounded-2xl bg-primary/[0.04] border border-primary/10 md:bg-white/[0.07] md:border-white/15 backdrop-blur-md shadow-xs md:shadow-lg w-full max-w-2xl sm:grid sm:grid-cols-3">
            {chapters.map((ch, idx) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`relative min-h-[38px] sm:min-h-[40px] py-1.5 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 text-center shrink-0 sm:shrink cursor-pointer ${
                  activeTab === idx
                    ? 'text-white font-semibold shadow-md'
                    : 'text-primary/60 hover:text-primary hover:bg-primary/[0.04] md:text-white/60 md:hover:text-white/90 md:hover:bg-white/[0.04]'
                }`}
              >
                {activeTab === idx && (
                  <m.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 rounded-xl bg-[#fb923c]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 font-mono text-[10px] sm:text-[11px] opacity-80">{ch.num}.</span>
                <span className="relative z-10">{isBn ? ch.tabLabelBn : ch.tabLabelEn}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Presentation Content Box */}
        <div className="rounded-2xl sm:rounded-3xl border border-primary/10 md:border-white/15 bg-[#f9fafb] md:bg-white/[0.05] md:backdrop-blur-xl p-4 sm:p-8 md:p-12 shadow-sm md:shadow-2xl relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            <m.div
              key={current.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-12 items-center"
            >
              
              {/* Left Column: Narrative & Strategic Reasoning */}
              <div className="lg:col-span-6 space-y-3.5 md:space-y-6">
                
                {/* Eyebrow badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fb923c]/10 border border-[#fb923c]/20 md:bg-white/10 md:border-white/15 text-[10.5px] sm:text-[11px] font-mono tracking-wider uppercase text-[#fb923c]">
                  <span>{isBn ? current.eyebrowBn : current.eyebrowEn}</span>
                </div>

                {/* Chapter Title */}
                <h3 
                  className="text-lg sm:text-2xl md:text-[28px] font-heading font-normal text-primary md:text-white leading-snug"
                  style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : { fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {isBn ? current.titleBn : current.titleEn}
                </h3>

                {/* Description */}
                <p 
                  className="text-xs sm:text-sm md:text-base text-primary/75 md:text-[#f9fafb]/85 leading-relaxed font-light"
                  style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
                >
                  {isBn ? current.descBn : current.descEn}
                </p>

                {/* Strategic Proofpoints */}
                <ul className="space-y-2 md:space-y-3 pt-1 md:pt-2">
                  {current.bulletPoints.map((pt, pIdx) => (
                    <li key={pIdx} className="text-xs sm:text-[13px] md:text-sm flex items-start gap-2.5 text-primary/85 md:text-white/90">
                      <div className={`mt-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0 border ${
                        pt.negative
                          ? 'border-primary/20 bg-primary/5 text-primary/60 md:border-white/30 md:bg-white/10 md:text-white/70'
                          : 'border-[#fb923c]/40 bg-[#fb923c]/10 text-[#fb923c] md:border-[#fb923c]/50 md:bg-[#fb923c]/20'
                      }`}>
                        {pt.negative ? (
                          <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        ) : (
                          <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#fb923c]" />
                        )}
                      </div>
                      <span className="leading-snug">{isBn ? pt.bn : pt.en}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Buttons */}
                <div className="pt-2 md:pt-4 flex flex-wrap items-center gap-2.5 sm:gap-4">
                  <a
                    href="https://wa.me/8801346288210?text=%E0%A6%B9%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%B2%E0%A7%8B%20POLISHED%2C%20%E0%A6%86%E0%A6%AE%E0%A6%BF%20%E0%A7%B3%E0%A7%A8%2C%E0%A7%AB%E0%A7%A6%E0%A7%A6%20%E0%A6%9F%E0%A6%BE%E0%A6%95%E0%A6%BE%E0%A6%B0%2072h%20Test%20Drive%20%E0%A6%AA%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%95%20%E0%A6%A6%E0%A6%BF%E0%A7%9F%E0%A7%87%20%E0%A6%B6%E0%A7%81%E0%A6%B0%E0%A7%81%20%E0%A6%95%E0%A6%B0%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A5%A4%20%E0%A6%86%E0%A6%AE%E0%A6%BE%E0%A6%B0%20%E0%A6%AA%E0%A7%87%E0%A6%9C%E0%A7%87%E0%A6%B0%20%E0%A6%B2%E0%A6%BF%E0%A6%82%E0%A6%95%3A%20"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-xl bg-[#fb923c] text-white font-bold text-xs uppercase tracking-wider shadow-[0_6px_20px_rgba(251,146,60,0.35)] hover:bg-[#f97316] transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>{isBn ? '৳২,৫০০ টেস্ট প্যাক নিন →' : 'Get ৳2,500 Test Pack →'}</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </a>

                  <button
                    type="button"
                    onClick={() => openAuditModal({ source: 'Brand Positioning Section' })}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 sm:px-5 sm:py-3.5 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/15 text-primary md:bg-white/10 md:hover:bg-white/15 md:border-white/20 md:text-[#f9fafb] text-xs font-semibold tracking-wider transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#fb923c]" />
                    <span>{isBn ? 'ফ্রি ভিডিও রিভিউ' : 'Free 5-Min Video Review'}</span>
                  </button>
                </div>

              </div>

              {/* Right Column: High-End Quiet Luxury Editorial Showcase */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-primary/10 md:border-white/20 bg-white md:bg-gradient-to-b md:from-white/[0.08] md:to-white/[0.03] p-4 sm:p-8 shadow-xs md:shadow-xl relative overflow-hidden">
                  
                  {/* Card Header Bar */}
                  <div className="flex items-center justify-between border-b border-primary/10 md:border-white/10 pb-3 mb-4 sm:mb-6">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#fb923c]" />
                      <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-primary/70 md:text-[#f9fafb]/70">
                        {isBn ? current.showcase.cardTitleBn : current.showcase.cardTitleEn}
                      </span>
                    </div>
                    <span className="text-[9.5px] sm:text-[10px] font-mono uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-[#fb923c]/10 border border-[#fb923c]/20 text-[#fb923c] font-semibold md:bg-white/10 md:border-white/15">
                      {isBn ? current.showcase.badgeBn : current.showcase.badgeEn}
                    </span>
                  </div>

                  {/* Stage Mockup Frame */}
                  <div className="rounded-xl border border-primary/10 md:border-white/10 bg-[#f9fafb] md:bg-white/[0.04] p-4 sm:p-8 flex flex-col justify-center text-center relative overflow-hidden min-h-[160px] md:min-h-[220px]">
                    
                    {/* Subtle aesthetic corner marks */}
                    <div className="absolute top-2 left-2 text-[10px] font-mono text-primary/20 md:text-white/30">✦</div>
                    <div className="absolute top-2 right-2 text-[10px] font-mono text-primary/20 md:text-white/30">✦</div>
                    <div className="absolute bottom-2 left-2 text-[10px] font-mono text-primary/20 md:text-white/30">✦</div>
                    <div className="absolute bottom-2 right-2 text-[10px] font-mono text-primary/20 md:text-white/30">✦</div>

                    <h4 
                      className={`text-[16px] sm:text-[18px] md:text-[22px] font-heading mb-2 leading-snug ${
                        activeTab === 0 
                          ? 'text-primary/50 line-through opacity-70 md:text-white/80' 
                          : 'text-primary md:text-[#f9fafb] font-normal italic'
                      }`}
                      style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : { fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {isBn ? current.showcase.headlineBn : current.showcase.headlineEn}
                    </h4>

                    <p 
                      className="text-xs sm:text-sm text-primary/75 md:text-[#f9fafb]/80 font-light max-w-md mx-auto leading-relaxed"
                      style={isBn ? { fontFamily: "'Noto Serif Bengali', serif" } : undefined}
                    >
                      {isBn ? current.showcase.sublineBn : current.showcase.sublineEn}
                    </p>

                    {activeTab === 1 && (
                      <div className="mt-3 sm:mt-5 inline-flex items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-mono text-[#fb923c] border-t border-primary/10 md:border-white/10 pt-2.5">
                        <span>✦ Meta Safe</span>
                        <span>•</span>
                        <span>★ High AOV</span>
                        <span>•</span>
                        <span>⚡ 48h Sprint</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Creative Spec Grid */}
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center bg-[#f9fafb] md:bg-white/[0.04] rounded-xl p-2.5 sm:p-4 border border-primary/10 md:border-white/10 mt-3 sm:mt-5">
                    {current.showcase.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="px-1">
                        <span className="text-[9.5px] sm:text-[11px] text-primary/60 md:text-[#f9fafb]/60 block font-light leading-tight">
                          {m.label}
                        </span>
                        <span className={`text-[11px] sm:text-sm font-bold block font-mono mt-0.5 sm:mt-1 ${
                          m.alert ? 'text-primary/70 md:text-white/70' : 'text-[#fb923c]'
                        }`}>
                          {m.val}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Editorial Footnote */}
                  <p className="text-[10px] sm:text-[11px] text-primary/60 md:text-[#f9fafb]/60 text-center font-light mt-3 sm:mt-4 italic">
                    {isBn ? current.showcase.footerNoteBn : current.showcase.footerNoteEn}
                  </p>

                </div>
              </div>

            </m.div>
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
