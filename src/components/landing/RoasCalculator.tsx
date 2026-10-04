import React, { useState, useEffect } from 'react';
import { triggerInquiry } from '@/lib/inquiry-events';
import { openAuditModal } from '@/components/landing/VisualAuditModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Sparkles, RotateCcw } from 'lucide-react';

export default function RoasCalculator() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';

  // Standard eCommerce Benchmarks
  const DEFAULT_SPEND = 100000;
  const DEFAULT_CPC = 15;
  const DEFAULT_CR = 1.2;
  const DEFAULT_AOV = 2500;

  const [adSpend, setAdSpend] = useState(DEFAULT_SPEND);
  const [cpc, setCpc] = useState(DEFAULT_CPC);
  const [conversionRate, setConversionRate] = useState(DEFAULT_CR);
  const [aov, setAov] = useState(DEFAULT_AOV);

  // Calculated metrics
  const [currentRevenue, setCurrentRevenue] = useState(0);
  const [projectedRevenue, setProjectedRevenue] = useState(0);
  const [revenueLost, setRevenueLost] = useState(0);

  useEffect(() => {
    const traffic = adSpend / (cpc || 1);
    const current = traffic * (conversionRate / 100) * aov;
    
    // 1.5% conversion lift benchmark via visual upgrades
    const projectedCR = conversionRate + 1.5;
    const projected = traffic * (projectedCR / 100) * aov;
    
    setCurrentRevenue(current);
    setProjectedRevenue(projected);
    setRevenueLost(projected - current);
  }, [adSpend, cpc, conversionRate, aov]);

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat(isBn ? 'bn-BD' : 'en-IN', {
      maximumFractionDigits: 0,
    }).format(Math.round(num));
  };

  const isCustomized = 
    adSpend !== DEFAULT_SPEND || 
    cpc !== DEFAULT_CPC || 
    conversionRate !== DEFAULT_CR || 
    aov !== DEFAULT_AOV;

  const resetDefaults = () => {
    setAdSpend(DEFAULT_SPEND);
    setCpc(DEFAULT_CPC);
    setConversionRate(DEFAULT_CR);
    setAov(DEFAULT_AOV);
  };

  const fontPrimary = isBn ? '"Noto Serif Bengali", serif' : '"Cormorant Garamond", serif';
  const fontBody = isBn ? '"Noto Serif Bengali", sans-serif' : 'inherit';

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-[#f9fafb] border-t border-[#1e3a8a]/10 relative overflow-hidden scroll-mt-14">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#fb923c]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1e3a8a]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span 
            className="inline-block px-3 py-1 bg-[#fb923c]/10 text-[#fb923c] border border-[#fb923c]/20 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] mb-3" 
            style={{ fontFamily: fontBody }}
          >
            {isBn ? "রেভিনিউ ডায়াগনস্টিক" : "Revenue Diagnostic"}
          </span>
          <h2 
            className="text-[#1e3a8a] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium mb-3 leading-tight" 
            style={{ fontFamily: fontPrimary }}
          >
            {isBn ? (
              <>সাধারণ ভিজ্যুয়াল কি আপনার অ্যাড বাজেট <span className="text-[#fb923c] font-bold">নষ্ট</span> করছে?</>
            ) : (
              <>Is Poor Design <span className="text-[#fb923c] font-bold">Bleeding</span> Your Ad Budget?</>
            )}
          </h2>
          <p 
            className="text-[#1e3a8a]/70 text-xs sm:text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed" 
            style={{ fontFamily: fontBody }}
          >
            {isBn 
              ? "আপনার ব্যবসার বর্তমান সংখ্যাগুলো পরিবর্তন করে দেখুন—ডিজাইন দুর্বলতার কারণে প্রতি মাসে ঠিক কত টাকা সম্ভাব্য সেলস হারাচ্ছেন।"
              : "Adjust your metrics to calculate how much revenue you are leaving on the table every month due to average visuals."}
          </p>
        </div>

        {/* 2-Column Split: Clean 4-Row Inputs + High-Impact Results Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* LEFT: 4 CLEAN, BREATHABLE INPUT ROWS */}
          <div className="lg:col-span-7 bg-white rounded-2xl md:rounded-3xl border border-[#1e3a8a]/10 p-5 sm:p-7 md:p-8 shadow-sm flex flex-col justify-between">
            
            <div className="space-y-5 sm:space-y-6">
              
              {/* Row 1: Monthly Ad Spend */}
              <div className="group">
                <div className="flex items-baseline justify-between mb-2">
                  <label 
                    className="text-xs sm:text-sm font-semibold text-[#1e3a8a] tracking-wide"
                    style={{ fontFamily: fontBody }}
                  >
                    {isBn ? "মাসিক অ্যাড বাজেট" : "Monthly Ad Spend"}
                  </label>
                  <div className="text-right">
                    <span className="text-base sm:text-lg font-bold text-[#1e3a8a] font-mono">
                      ৳{formatCurrency(adSpend)}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-500 ml-1 font-mono">{isBn ? "টাকা" : "BDT"}</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="20000" 
                  max="1000000" 
                  step="5000"
                  value={adSpend} 
                  onChange={(e) => setAdSpend(Number(e.target.value))}
                  className="w-full h-2 bg-gray-100 hover:bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#fb923c] touch-pan-x transition-colors"
                  aria-label="Monthly Ad Spend"
                />
              </div>

              {/* Row 2: Average CPC */}
              <div className="group">
                <div className="flex items-baseline justify-between mb-2">
                  <label 
                    className="text-xs sm:text-sm font-semibold text-[#1e3a8a] tracking-wide"
                    style={{ fontFamily: fontBody }}
                  >
                    {isBn ? "গড় ক্লিক খরচ (CPC)" : "Avg. Cost Per Click (CPC)"}
                  </label>
                  <div className="text-right">
                    <span className="text-base sm:text-lg font-bold text-[#1e3a8a] font-mono">
                      ৳{cpc}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-500 ml-1 font-mono">{isBn ? "টাকা" : "BDT"}</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="100" 
                  step="1"
                  value={cpc} 
                  onChange={(e) => setCpc(Number(e.target.value))}
                  className="w-full h-2 bg-gray-100 hover:bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#fb923c] touch-pan-x transition-colors"
                  aria-label="Average CPC"
                />
              </div>

              {/* Row 3: Conversion Rate */}
              <div className="group">
                <div className="flex items-baseline justify-between mb-2">
                  <label 
                    className="text-xs sm:text-sm font-semibold text-[#1e3a8a] tracking-wide"
                    style={{ fontFamily: fontBody }}
                  >
                    {isBn ? "কনভার্শন রেট (CR)" : "Conversion Rate"}
                  </label>
                  <div className="text-right">
                    <span className="text-base sm:text-lg font-bold text-[#1e3a8a] font-mono">
                      {conversionRate}%
                    </span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="0.2" 
                  max="5.0" 
                  step="0.1"
                  value={conversionRate} 
                  onChange={(e) => setConversionRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-100 hover:bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#fb923c] touch-pan-x transition-colors"
                  aria-label="Conversion Rate"
                />
              </div>

              {/* Row 4: Average Order Value (AOV) */}
              <div className="group">
                <div className="flex items-baseline justify-between mb-2">
                  <label 
                    className="text-xs sm:text-sm font-semibold text-[#1e3a8a] tracking-wide"
                    style={{ fontFamily: fontBody }}
                  >
                    {isBn ? "গড় অর্ডার সাইজ (AOV)" : "Average Order Value"}
                  </label>
                  <div className="text-right">
                    <span className="text-base sm:text-lg font-bold text-[#1e3a8a] font-mono">
                      ৳{formatCurrency(aov)}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-500 ml-1 font-mono">{isBn ? "টাকা" : "BDT"}</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="500" 
                  max="15000" 
                  step="100"
                  value={aov} 
                  onChange={(e) => setAov(Number(e.target.value))}
                  className="w-full h-2 bg-gray-100 hover:bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#fb923c] touch-pan-x transition-colors"
                  aria-label="Average Order Value"
                />
              </div>

            </div>

            {/* Bottom Reset Action (Appears if customized) */}
            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="text-[11px]" style={{ fontFamily: fontBody }}>
                {isBn ? "💡 স্লাইডার নাড়িয়ে আপনার প্রকৃত ডেটা সেট করুন" : "💡 Adjust sliders to match your metrics"}
              </span>
              {isCustomized && (
                <button
                  type="button"
                  onClick={resetDefaults}
                  className="inline-flex items-center gap-1 text-[#fb923c] hover:underline font-medium cursor-pointer"
                  style={{ fontFamily: fontBody }}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{isBn ? "রিসেট ডিফল্ট" : "Reset Defaults"}</span>
                </button>
              )}
            </div>

          </div>

          {/* RIGHT: HIGH-IMPACT DEEP NAVY RESULTS CARD */}
          <div className="lg:col-span-5 bg-[#1e3a8a] text-white rounded-2xl md:rounded-3xl border border-white/10 p-5 sm:p-7 md:p-8 shadow-xl flex flex-col justify-between relative overflow-hidden">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#fb923c]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full justify-between gap-5 sm:gap-6">
              
              {/* TOP: Revenue Comparison Strip */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-white/[0.08] border border-white/10 text-center">
                <div>
                  <p className="text-white/60 text-[10px] uppercase font-semibold tracking-wider mb-0.5" style={{ fontFamily: fontBody }}>
                    {isBn ? "বর্তমান রেভিনিউ" : "Current Revenue"}
                  </p>
                  <p className="text-base sm:text-lg font-bold text-white font-mono">
                    ৳{formatCurrency(currentRevenue)}
                  </p>
                </div>
                <div className="border-l border-white/10 pl-2">
                  <p className="text-[#fb923c] text-[10px] uppercase font-bold tracking-wider mb-0.5" style={{ fontFamily: fontBody }}>
                    {isBn ? "POLISHED অপ্টিমাইজেশনে (+১.৫%)" : "With POLISHED (+1.5%)"}
                  </p>
                  <p className="text-base sm:text-lg font-bold text-[#fb923c] font-mono">
                    ৳{formatCurrency(projectedRevenue)}
                  </p>
                </div>
              </div>

              {/* MIDDLE: Hero Revenue Left On Table */}
              <div className="text-center my-auto py-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#fb923c] text-[11px] font-bold uppercase tracking-wider mb-2" style={{ fontFamily: fontBody }}>
                  <span className="w-2 h-2 rounded-full bg-[#fb923c] animate-pulse" />
                  <span>{isBn ? "সম্ভাব্য মাসিক লোকসান" : "Revenue Left on Table"}</span>
                </div>

                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none mb-2 font-mono">
                  ৳{formatCurrency(revenueLost)}{' '}
                  <span className="text-base sm:text-lg text-[#fb923c] font-bold">
                    {isBn ? "/মাস" : "/mo"}
                  </span>
                </div>

                <p className="text-[11px] sm:text-xs text-white/60 font-light max-w-sm mx-auto leading-relaxed" style={{ fontFamily: fontBody }}>
                  {isBn 
                    ? "ভিজ্যুয়াল কোয়ালিটি ও ল্যান্ডিং পেজ আপগ্রেডে মাত্র ১.৫% কনভার্শন বৃদ্ধি পেলেই এই বাড়তি টাকা সরাসরি আপনার একাউন্টে আসত।"
                    : "Based on a 1.5% conversion lift benchmark achieved through high-converting creative upgrades."}
                </p>
              </div>

              {/* BOTTOM: Direct Actions */}
              <div className="flex flex-col gap-2.5 pt-2">
                <a
                  href={`https://wa.me/8801346288210?text=${encodeURIComponent(
                    `Hi POLISHED, I calculated ~৳${formatCurrency(revenueLost)}/mo in lost revenue on my ৳${formatCurrency(adSpend)} monthly ad spend. I want to recover this profit with the ৳3,999 Skincare Trial Pack!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#fb923c] hover:bg-[#fb923c]/95 text-white font-bold text-xs sm:text-sm uppercase tracking-wider px-5 py-3.5 rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-200 active:scale-[0.98] btn-shimmer"
                  style={{ fontFamily: fontBody }}
                >
                  <span>{isBn ? "৳৩,৯৯৯ ট্রায়ালে লোকসান বন্ধ করুন" : "Recover with ৳3,999 Trial"}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    triggerInquiry({
                      revenueLost: `৳${formatCurrency(revenueLost)}`,
                      budget: adSpend >= 300000 ? '50k-plus' : '20k-50k',
                      note: `Calculated ~৳${formatCurrency(revenueLost)}/mo in lost revenue on monthly ad spend of ৳${formatCurrency(adSpend)}. Requesting visual teardown.`
                    });
                    openAuditModal({
                      source: 'ROAS Diagnostic Calculator',
                      note: `Calculated ~৳${formatCurrency(revenueLost)}/mo in lost revenue on monthly ad spend of ৳${formatCurrency(adSpend)}.`
                    });
                  }}
                  className="inline-flex items-center justify-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors cursor-pointer py-1 group"
                  style={{ fontFamily: fontBody }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#fb923c]" />
                  <span className="underline decoration-white/30 group-hover:decoration-white">
                    {isBn ? "অথবা ৫ মিনিটের ফ্রি অডিট নিন" : "Or request a free 5-minute audit"}
                  </span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}