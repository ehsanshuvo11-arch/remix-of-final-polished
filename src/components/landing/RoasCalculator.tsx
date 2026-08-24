import React, { useState, useEffect } from 'react';

export default function RoasCalculator() {
  // ১০০% গ্যারান্টেড ল্যাঙ্গুয়েজ ডিটেকশন (MutationObserver দিয়ে)
  const [isBn, setIsBn] = useState(false);

  useEffect(() => {
    // Initial check
    const currentLang = document.documentElement.lang;
    setIsBn(currentLang === 'bn' || currentLang === 'bn-BD');

    // Watch for language changes from the toggle button
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'lang') {
          const newLang = document.documentElement.lang;
          setIsBn(newLang === 'bn' || newLang === 'bn-BD');
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang']
    });

    return () => observer.disconnect();
  }, []);

  const [adSpend, setAdSpend] = useState(300000);
  const [cpc, setCpc] = useState(15);
  const [conversionRate, setConversionRate] = useState(1.2);
  const [aov, setAov] = useState(2500);

  const [currentRevenue, setCurrentRevenue] = useState(0);
  const [projectedRevenue, setProjectedRevenue] = useState(0);
  const [revenueLost, setRevenueLost] = useState(0);

  useEffect(() => {
    const traffic = adSpend / (cpc || 1);
    const current = traffic * (conversionRate / 100) * aov;
    
    // Assuming a conservative +1.5% CR boost with premium design
    const projectedCR = conversionRate + 1.5;
    const projected = traffic * (projectedCR / 100) * aov;
    
    setCurrentRevenue(current);
    setProjectedRevenue(projected);
    setRevenueLost(projected - current);
  }, [adSpend, cpc, conversionRate, aov]);

  const formatCurrency = (num: number) => {
    const formatted = new Intl.NumberFormat(isBn ? 'bn-BD' : 'en-IN', {
      maximumFractionDigits: 0,
    }).format(num);
    return `${formatted}`; 
  };

  // 🌍 Translation Dictionary (Strictly Formal Bengali)
  const t = {
    subtitle: isBn ? "রেভিনিউ ডায়াগনস্টিক" : "Revenue Diagnostic",
    desc: isBn ? "অ্যাভারেজ ভিজ্যুয়ালের কারণে প্রতি মাসে আপনি ঠিক কত টাকা হারাচ্ছেন, তা হিসাব করুন।" : "Calculate exactly how much revenue you are leaving on the table every month due to average visuals.",
    adSpend: isBn ? "মাসিক অ্যাড স্পেন্ড" : "Monthly Ad Spend",
    cpc: isBn ? "প্রতি ক্লিকের গড় খরচ" : "Avg. Cost Per Click",
    cr: isBn ? "কনভার্শন রেট" : "Conversion Rate",
    aov: isBn ? "গড় অর্ডারের মূল্য" : "Avg. Order Value",
    currentRev: isBn ? "বর্তমান রেভিনিউ" : "Current Revenue",
    withPolished: isBn ? "POLISHED এর সাথে (+১.৫%)" : "With POLISHED (+1.5%)",
    lostRev: isBn ? "প্রতি মাসে আপনার হারানো রেভিনিউ" : "Revenue Left On The Table",
    disclaimer: isBn ? "*প্রিমিয়াম ভিজ্যুয়াল ট্রাস্ট এবং স্ট্র্যাটেজির কারণে ন্যূনতম ১.৫% কনভার্শন বৃদ্ধির ওপর ভিত্তি করে।" : "*Based on a conservative 1.5% conversion lift from premium visual trust & strategy.",
    btn: isBn ? "লোকসান বন্ধ করুন" : "Stop Losing Money",
    currency: isBn ? "টাকা" : "BDT"
  };

  const fontPrimary = isBn ? '"Noto Serif Bengali", serif' : '"Cormorant Garamond", serif';
  const fontBody = isBn ? '"Noto Serif Bengali", sans-serif' : 'inherit';

  return (
    <section className="py-24 bg-[#f9fafb] border-t border-[#1e3a8a]/10 relative overflow-hidden">
      
      {/* Subtle Orange Accent Graphic in Background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#fb923c] opacity-[0.03] rounded-bl-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 md:px-14 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-[#fb923c]/10 text-[#fb923c] border border-[#fb923c]/20 rounded-sm text-[10px] font-bold uppercase tracking-[0.3em] mb-4" style={{ fontFamily: fontBody }}>
            {t.subtitle}
          </span>
          <h2 className="text-[#1e3a8a] text-4xl md:text-5xl font-medium mb-6 leading-tight" style={{ fontFamily: fontPrimary }}>
            {isBn ? (
              <>গড়পড়তা ডিজাইন কি আপনার অ্যাড বাজেট <span className="text-[#fb923c] font-bold">নষ্ট</span> করছে?</>
            ) : (
              <>Is Poor Design <span className="text-[#fb923c] font-bold">Bleeding</span> Your Ad Budget?</>
            )}
          </h2>
          <p className="text-[#1e3a8a]/70 text-base max-w-2xl mx-auto font-light" style={{ fontFamily: fontBody }}>
            {t.desc}
          </p>
        </div>

        {/* Quiet Luxury Calculator Layout */}
        <div className="flex flex-col lg:flex-row shadow-lg border border-[#1e3a8a]/10 bg-white">
          
          {/* LEFT COLUMN: INPUTS */}
          <div className="w-full lg:w-1/2 p-10 md:p-14 bg-white relative">
            <div className="space-y-12 relative z-10">
              
              {/* Input 1 */}
              <div className="group">
                <div className="flex justify-between items-end mb-3">
                  <label className="text-[#1e3a8a] text-xs uppercase tracking-widest font-semibold flex items-center gap-2" style={{ fontFamily: fontBody }}>
                    <span className="w-1 h-3 bg-[#fb923c] inline-block opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {t.adSpend}
                  </label>
                  <div className="flex items-center gap-1 border-b border-[#1e3a8a]/20 group-hover:border-[#fb923c]/50 transition-colors pb-1">
                    <input 
                      type="number" 
                      value={adSpend}
                      onChange={(e) => setAdSpend(Number(e.target.value))}
                      className="w-28 bg-transparent text-right focus:outline-none text-[#1e3a8a] font-medium text-lg"
                      style={{ fontFamily: fontPrimary }}
                    />
                    <span className="text-[#1e3a8a]/60 text-[10px] uppercase tracking-wider">{t.currency}</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="50000" max="5000000" step="10000"
                  value={adSpend} 
                  onChange={(e) => setAdSpend(Number(e.target.value))}
                  className="w-full h-[3px] bg-[#1e3a8a]/10 appearance-none cursor-pointer accent-[#fb923c]"
                />
              </div>

              {/* Input 2 */}
              <div className="group">
                <div className="flex justify-between items-end mb-3">
                  <label className="text-[#1e3a8a] text-xs uppercase tracking-widest font-semibold flex items-center gap-2" style={{ fontFamily: fontBody }}>
                    <span className="w-1 h-3 bg-[#fb923c] inline-block opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {t.cpc}
                  </label>
                  <div className="flex items-center gap-1 border-b border-[#1e3a8a]/20 group-hover:border-[#fb923c]/50 transition-colors pb-1">
                    <input 
                      type="number" 
                      value={cpc}
                      onChange={(e) => setCpc(Number(e.target.value))}
                      className="w-20 bg-transparent text-right focus:outline-none text-[#1e3a8a] font-medium text-lg"
                      style={{ fontFamily: fontPrimary }}
                    />
                    <span className="text-[#1e3a8a]/60 text-[10px] uppercase tracking-wider">{t.currency}</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="2" max="200" step="1"
                  value={cpc} 
                  onChange={(e) => setCpc(Number(e.target.value))}
                  className="w-full h-[3px] bg-[#1e3a8a]/10 appearance-none cursor-pointer accent-[#fb923c]"
                />
              </div>

              {/* Input 3 */}
              <div className="group">
                <div className="flex justify-between items-end mb-3">
                  <label className="text-[#1e3a8a] text-xs uppercase tracking-widest font-semibold flex items-center gap-2" style={{ fontFamily: fontBody }}>
                    <span className="w-1 h-3 bg-[#fb923c] inline-block opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {t.cr}
                  </label>
                  <div className="flex items-center gap-1 border-b border-[#1e3a8a]/20 group-hover:border-[#fb923c]/50 transition-colors pb-1">
                    <input 
                      type="number" 
                      value={conversionRate}
                      onChange={(e) => setConversionRate(Number(e.target.value))}
                      className="w-20 bg-transparent text-right focus:outline-none text-[#1e3a8a] font-medium text-lg"
                      style={{ fontFamily: fontPrimary }}
                    />
                    <span className="text-[#1e3a8a]/60 text-[10px] uppercase tracking-wider">%</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="0.1" max="10" step="0.1"
                  value={conversionRate} 
                  onChange={(e) => setConversionRate(Number(e.target.value))}
                  className="w-full h-[3px] bg-[#1e3a8a]/10 appearance-none cursor-pointer accent-[#fb923c]"
                />
              </div>

              {/* Input 4 */}
              <div className="group">
                <div className="flex justify-between items-end mb-3">
                  <label className="text-[#1e3a8a] text-xs uppercase tracking-widest font-semibold flex items-center gap-2" style={{ fontFamily: fontBody }}>
                    <span className="w-1 h-3 bg-[#fb923c] inline-block opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {t.aov}
                  </label>
                  <div className="flex items-center gap-1 border-b border-[#1e3a8a]/20 group-hover:border-[#fb923c]/50 transition-colors pb-1">
                    <input 
                      type="number" 
                      value={aov}
                      onChange={(e) => setAov(Number(e.target.value))}
                      className="w-28 bg-transparent text-right focus:outline-none text-[#1e3a8a] font-medium text-lg"
                      style={{ fontFamily: fontPrimary }}
                    />
                    <span className="text-[#1e3a8a]/60 text-[10px] uppercase tracking-wider">{t.currency}</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="500" max="15000" step="100"
                  value={aov} 
                  onChange={(e) => setAov(Number(e.target.value))}
                  className="w-full h-[3px] bg-[#1e3a8a]/10 appearance-none cursor-pointer accent-[#fb923c]"
                />
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: RESULTS */}
          <div className="w-full lg:w-1/2 p-10 md:p-14 bg-[#1e3a8a] text-[#f9fafb] flex flex-col justify-between relative overflow-hidden">
            
            {/* Subtle Right Column Accent */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#fb923c] opacity-[0.05] rounded-tl-full pointer-events-none"></div>

            <div className="mb-12 border-b border-white/10 pb-10 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              <div>
                <p className="text-white/60 text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ fontFamily: fontBody }}>{t.currentRev}</p>
                <p className="text-3xl font-medium tracking-tight" style={{ fontFamily: fontPrimary }}>
                  {formatCurrency(currentRevenue)} <span className="text-base text-white/70">{t.currency}</span>
                </p>
              </div>
              <div>
                <p className="text-[#fb923c] text-[10px] font-bold uppercase tracking-widest mb-3" style={{ fontFamily: fontBody }}>
                  {t.withPolished}
                </p>
                <p className="text-3xl font-bold tracking-tight text-[#fb923c]" style={{ fontFamily: fontPrimary }}>
                  {formatCurrency(projectedRevenue)} <span className="text-base">{t.currency}</span>
                </p>
              </div>
            </div>

            <div className="mb-12 relative z-10">
              <p className="text-white/90 text-[10px] font-semibold uppercase tracking-[0.2em] mb-4 bg-[#fb923c]/20 inline-block px-3 py-1 rounded-sm border border-[#fb923c]/30" style={{ fontFamily: fontBody }}>
                <span className="text-[#fb923c] mr-2">■</span>{t.lostRev}
              </p>
              <h3 className="text-5xl md:text-6xl font-normal text-white mb-6 leading-tight flex items-baseline gap-3" style={{ fontFamily: fontPrimary }}>
                {formatCurrency(revenueLost)} <span className="text-2xl text-[#fb923c]">{t.currency}</span>
              </h3>
              <p className="text-white/50 text-xs italic font-light" style={{ fontFamily: fontBody }}>
                {t.disclaimer}
              </p>
            </div>

            {/* Accent Color Button */}
            <button className="w-full bg-[#fb923c] hover:bg-[#e8812c] text-white py-5 px-8 font-bold text-[11px] uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-3 relative z-10 shadow-[0_4px_20px_rgba(251,146,60,0.3)] hover:shadow-[0_8px_30px_rgba(251,146,60,0.5)] border border-[#fb923c]/50" style={{ fontFamily: fontBody }}>
              {t.btn}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            
          </div>
        </div>
      </div>
    </section>
  );
}