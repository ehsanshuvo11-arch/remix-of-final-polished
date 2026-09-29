import React, { useState } from 'react';
import { m } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import LuxuryBottle3D from '@/components/3d/LuxuryBottle3D';
import { openAuditModal } from '@/components/landing/VisualAuditModal';
import { triggerInquiry } from '@/lib/inquiry-events';
import { Sparkles, Layers, ShieldCheck, TrendingUp, ArrowRight, Eye, RefreshCw, Box } from 'lucide-react';

export default function Showcase3D() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  const [activePersona, setActivePersona] = useState<'d2c' | 'agency'>('d2c');
  const [viewMode, setViewMode] = useState<'interactive' | 'breakdown'>('interactive');

  return (
    <section id="tactile-3d" className="py-24 md:py-32 px-6 md:px-14 max-w-[1280px] mx-auto relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#fb923c]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[#1e3a8a]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1e3a8a]/5 border border-[#1e3a8a]/15 rounded-sm mb-4">
          <Box className="w-3.5 h-3.5 text-[#fb923c]" />
          <span className="text-[10px] md:text-[11px] uppercase tracking-[3px] font-semibold text-[#1e3a8a]">
            {isBn ? '৩ডি ট্যাকটাইল আইডেন্টিটি অভিজ্ঞতা' : '3D Tactile Identity Experience'}
          </span>
        </div>

        <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl text-[#1e3a8a] font-normal leading-[1.15] mb-5">
          {isBn ? (
            <>
              ফ্ল্যাট সাধারণ গ্রাফিক্স নয়—{' '}
              <em className="italic text-[#fb923c] font-normal">
                স্পর্শযোগ্য লাক্সারি ভিজ্যুয়াল।
              </em>
            </>
          ) : (
            <>
              Why Flat Visuals Fail & How{' '}
              <em className="italic text-[#fb923c] font-normal">
                3D Tactile Luxury Converts.
              </em>
            </>
          )}
        </h2>

        <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-light max-w-2xl mx-auto">
          {isBn
            ? 'ডিজিটাল স্ক্রিনে আপনার পণ্য দেখতে প্রিমিয়াম ও এক্সপেনসিভ না লাগলে গ্রাহক কখনোই উচ্চমূল্যে প্রি-অর্ডার করবে না। ৩ডি লাইটিং, গ্লাস রিফ্লেকশন ও সিগনেচার বাংলা টাইপোগ্রাফির সমন্বয়ে আমরা ব্র্যান্ডকে অনন্য উচ্চতায় নিয়ে যাই।'
            : 'If your product looks flat and templated on social feeds, high-value buyers scroll past. We engineer tactile 3D packaging depth, amber caustics, and world-class typography that command instant trust and higher pricing power.'}
        </p>

        {/* Persona Switcher for conversion relevance */}
        <div className="mt-8 inline-flex items-center p-1 bg-[#1e3a8a]/5 border border-[#1e3a8a]/15 rounded-full">
          <button
            type="button"
            onClick={() => setActivePersona('d2c')}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
              activePersona === 'd2c'
                ? 'bg-[#1e3a8a] text-white shadow-md'
                : 'text-[#1e3a8a]/70 hover:text-[#1e3a8a]'
            }`}
          >
            {isBn ? 'D2C স্কিনকেয়ার ও সেলফ-কেয়ার ব্র্যান্ড' : 'For D2C Skincare & Brands'}
          </button>
          <button
            type="button"
            onClick={() => setActivePersona('agency')}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
              activePersona === 'agency'
                ? 'bg-[#1e3a8a] text-white shadow-md'
                : 'text-[#1e3a8a]/70 hover:text-[#1e3a8a]'
            }`}
          >
            {isBn ? 'মার্কেটিং এজেন্সি (হোয়াইট-লেবেল)' : 'For Marketing Agencies'}
          </button>
        </div>
      </div>

      {/* Main Interactive 3D Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-primary border border-primary-foreground/20 rounded-sm p-6 sm:p-10 md:p-12 text-primary-foreground relative shadow-[0_20px_60px_rgba(30,58,138,0.35)] overflow-hidden">
        {/* Subtle grid pattern in dark container */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* LEFT COLUMN: Real-Time WebGL 3D Luxury Packaging Viewport */}
        <div className="lg:col-span-6 relative">
          <div className="relative rounded-sm border border-white/10 bg-primary-foreground/5 overflow-hidden shadow-inner">
            {/* Top Toolbar */}
            <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-[11px] text-white/60 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#fb923c] animate-pulse" />
                <span className="font-mono uppercase tracking-wider text-[#fb923c] font-medium">POLISHED WebGL 3D Studio</span>
              </div>
              <span className="text-[10px] tracking-widest uppercase text-white/40 hidden sm:inline">Physically Based Rendering (PBR)</span>
            </div>

            {/* 3D Canvas Mount */}
            <div className="relative min-h-[380px] sm:min-h-[440px] flex items-center justify-center">
              <LuxuryBottle3D interactive={true} showBadge={false} />

              {/* In-Canvas Instruction Overlay */}
              <div className="absolute top-4 left-4 z-20 pointer-events-none bg-black/40 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded text-[9px] uppercase tracking-widest text-white/70">
                ✦ 360° Drag to Inspect
              </div>

              {/* 3D Specs floating nodes */}
              <div className="absolute bottom-4 right-4 z-20 bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded text-[10px] text-white/80 max-w-[200px] hidden sm:block">
                <p className="text-[#fb923c] font-bold uppercase tracking-wider text-[9px] mb-1">Optical Attributes</p>
                <div className="space-y-1 text-[10px] text-white/60">
                  <div className="flex justify-between"><span>Transmission:</span> <span className="text-white">88%</span></div>
                  <div className="flex justify-between"><span>Refraction IOR:</span> <span className="text-white">1.52</span></div>
                  <div className="flex justify-between"><span>Emboss Finish:</span> <span className="text-[#fb923c]">24K Gold</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Conversion Impact Architecture & Persona Value */}
        <div className="lg:col-span-6 relative z-10 flex flex-col justify-between space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#fb923c]/20 border border-[#fb923c]/30 rounded-sm text-[#fb923c] text-[10px] font-bold uppercase tracking-[2px] mb-3">
              <Sparkles className="w-3 h-3" />
              <span>{activePersona === 'd2c' ? (isBn ? 'D2C ব্র্যান্ড রূপান্তর' : 'D2C Conversion Engine') : (isBn ? 'হোয়াইট-লেবেল এজেন্সি পাওয়ারহাউস' : 'Agency White-Label Engine')}</span>
            </div>

            <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl text-white font-normal leading-snug mb-4">
              {activePersona === 'd2c' ? (
                isBn ? (
                  <>যেভাবে ৩ডি ট্যাকটাইল ডিজাইন আপনার <span className="text-[#fb923c] italic">গড় অর্ডার ভ্যালু (AOV)</span> বাড়ায়</>
                ) : (
                  <>Transforming Digital Browsers Into <span className="text-[#fb923c] italic">High-AOV Luxury Buyers</span></>
                )
              ) : (
                isBn ? (
                  <>এজেন্সির নিজস্ব টিম হায়ারিংয়ের ঝামেলা ছাড়াই <span className="text-[#fb923c] italic">ক্লায়েন্টদের ৩.২x ROAS দিন</span></>
                ) : (
                  <>Deliver World-Class 3D Assets for Your Clients <span className="text-[#fb923c] italic">Without In-House Bottlenecks</span></>
                )
              )}
            </h3>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light mb-6">
              {activePersona === 'd2c' ? (
                isBn
                  ? 'সাধারণ ক্যানভা টেমপ্লেটে তৈরি প্রোডাক্ট ছবি দেখলে ক্রেতা সন্দেহ করে এবং বারবার ডিসকাউন্ট চায়। কিন্তু যখন আপনার পণ্য ৩ডি আলো, গ্লাস রিফ্লেকশন ও পরিশীলিত ব্র্যান্ড ভাষায় উপস্থাপিত হয়, তখন পণ্যের পারসিভড ভ্যালু ৪ গুণ বেড়ে যায়।'
                  : 'Commodity 2D graphics trigger price resistance and force constant discounting. Tactile 3D visual identities establish immediate perceived luxury, elevating products into must-have lifestyle staples with zero price objection.'
              ) : (
                isBn
                  ? 'মার্কেটিং এজেন্সির প্রধান সমস্যা হলো দক্ষ ক্রিয়েটিভ ডিজাইনার ধরে রাখা এবং দ্রুত কনভার্শন-ফোকাসড অ্যাড তৈরি করা। POLISHED কাজ করে আপনার অদৃশ্য ব্যাকএন্ড ক্রিয়েটিভ টিম হিসেবে—৪৮ ঘণ্টার মধ্যে রেডি-টু-স্কেল অ্যাড অ্যাসেট ডেলিভারি দিয়ে।'
                  : 'Hiring full-time 3D and conversion designers is expensive and slow. POLISHED acts as your invisible backend design powerhouse—delivering white-label, client-ready 3D creatives and Bengali ad funnels under strict 48-hour turnarounds.'
              )}
            </p>

            {/* Metric Comparison Badges */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
              <div className="bg-white/5 border border-white/10 rounded-sm p-4 hover:border-[#fb923c]/40 transition-colors">
                <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-1">
                  {activePersona === 'd2c' ? (isBn ? 'গড় ROAS বৃদ্ধি' : 'Average ROAS Lift') : (isBn ? 'টার্নঅ্যারাউন্ড স্পিড' : 'Turnaround SLA')}
                </span>
                <p className="font-heading text-2xl sm:text-3xl text-[#fb923c] font-normal">
                  {activePersona === 'd2c' ? '3.2x' : '48 Hours'}
                </p>
                <p className="text-[11px] text-white/60 mt-1">
                  {activePersona === 'd2c'
                    ? (isBn ? 'মেটা ও টিকটক বিজ্ঞাপনে পরীক্ষিত' : 'Proven across Meta & TikTok campaigns')
                    : (isBn ? 'ক্যাম্পেইনে কখনোই দেরি হবে না' : 'Strict sprint delivery guarantee')}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-sm p-4 hover:border-[#fb923c]/40 transition-colors">
                <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-1">
                  {activePersona === 'd2c' ? (isBn ? 'CAC হ্রাস' : 'CAC Reduction') : (isBn ? 'এজেন্সি লাভ' : 'Overhead Saved')}
                </span>
                <p className="font-heading text-2xl sm:text-3xl text-[#fb923c] font-normal">
                  {activePersona === 'd2c' ? '-38%' : '100% NDA'}
                </p>
                <p className="text-[11px] text-white/60 mt-1">
                  {activePersona === 'd2c'
                    ? (isBn ? 'কাস্টমার একুইজিশন খরচ কমে' : 'Lower acquisition costs, higher profit margin')
                    : (isBn ? 'আপনার ব্র্যান্ড নামে ক্লায়েন্ট ডেলিভারি' : 'Completely invisible white-label partnership')}
                </p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-4">
            <button
              type="button"
              onClick={() => openAuditModal({
                source: '3D Tactile Showcase',
                service: activePersona === 'd2c' ? 'D2C 3D Tactile Identity' : 'White-Label Agency Backend'
              })}
              className="w-full sm:w-auto py-3.5 px-7 bg-accent hover:bg-accent/90 text-accent-foreground text-xs font-bold uppercase tracking-[2px] rounded-sm transition-all duration-300 shadow-[0_4px_20px_rgba(251,146,60,0.35)] hover:shadow-[0_8px_30px_rgba(251,146,60,0.5)] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>{isBn ? 'ফ্রি ৫-মিনিট ভিডিও অডিট নিন' : 'Claim Free 5-Min Video Teardown'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => triggerInquiry({
                service: activePersona === 'd2c' ? '3D Product Packaging & Visuals' : 'White-Label Agency Partnership',
                note: `Inquiry from 3D showcase (${activePersona.toUpperCase()})`
              })}
              className="w-full sm:w-auto py-3.5 px-6 bg-transparent border border-white/20 hover:border-white text-white text-xs font-medium uppercase tracking-[1.5px] rounded-sm transition-colors flex items-center justify-center"
            >
              <span>{isBn ? 'কাস্টম প্যাকেজ আলোচনা' : 'Inquire for Custom Scope'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
