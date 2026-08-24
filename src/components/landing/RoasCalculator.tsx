import React, { useState, useEffect } from 'react';

export default function RoasCalculator() {
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
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(num) + ' BDT';
  };

  return (
    <section className="py-24 bg-[#f9fafb] border-t border-[#1e3a8a]/10">
      <div className="max-w-6xl mx-auto px-6 md:px-14">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="text-[#fb923c] text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">
            Revenue Diagnostic
          </span>
          <h2 className="text-[#1e3a8a] text-4xl md:text-5xl font-medium mb-6" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            Is Poor Design Bleeding Your Ad Budget?
          </h2>
          <p className="text-[#1e3a8a]/70 text-base max-w-2xl mx-auto font-light">
            Calculate exactly how much revenue you are leaving on the table every month due to average visuals.
          </p>
        </div>

        {/* Quiet Luxury Calculator Layout */}
        <div className="flex flex-col lg:flex-row shadow-sm border border-[#1e3a8a]/10">
          
          {/* LEFT COLUMN: INPUTS (Off-white - 40%) */}
          <div className="w-full lg:w-1/2 p-10 md:p-14 bg-[#f9fafb]">
            <div className="space-y-12">
              
              {/* Input 1 */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="text-[#1e3a8a] text-xs uppercase tracking-widest font-semibold">
                    Monthly Ad Spend
                  </label>
                  <div className="flex items-center gap-1 border-b border-[#1e3a8a]/20 pb-1">
                    <input 
                      type="number" 
                      value={adSpend}
                      onChange={(e) => setAdSpend(Number(e.target.value))}
                      className="w-28 bg-transparent text-right focus:outline-none text-[#1e3a8a] font-medium text-lg"
                      style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    />
                    <span className="text-[#1e3a8a]/60 text-[10px] uppercase tracking-wider">BDT</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="50000" max="5000000" step="10000"
                  value={adSpend} 
                  onChange={(e) => setAdSpend(Number(e.target.value))}
                  className="w-full h-[2px] bg-gray-200 appearance-none cursor-pointer accent-[#1e3a8a]"
                />
              </div>

              {/* Input 2 */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="text-[#1e3a8a] text-xs uppercase tracking-widest font-semibold">
                    Avg. Cost Per Click
                  </label>
                  <div className="flex items-center gap-1 border-b border-[#1e3a8a]/20 pb-1">
                    <input 
                      type="number" 
                      value={cpc}
                      onChange={(e) => setCpc(Number(e.target.value))}
                      className="w-20 bg-transparent text-right focus:outline-none text-[#1e3a8a] font-medium text-lg"
                      style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    />
                    <span className="text-[#1e3a8a]/60 text-[10px] uppercase tracking-wider">BDT</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="2" max="200" step="1"
                  value={cpc} 
                  onChange={(e) => setCpc(Number(e.target.value))}
                  className="w-full h-[2px] bg-gray-200 appearance-none cursor-pointer accent-[#1e3a8a]"
                />
              </div>

              {/* Input 3 */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="text-[#1e3a8a] text-xs uppercase tracking-widest font-semibold">
                    Conversion Rate
                  </label>
                  <div className="flex items-center gap-1 border-b border-[#1e3a8a]/20 pb-1">
                    <input 
                      type="number" 
                      value={conversionRate}
                      onChange={(e) => setConversionRate(Number(e.target.value))}
                      className="w-20 bg-transparent text-right focus:outline-none text-[#1e3a8a] font-medium text-lg"
                      style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    />
                    <span className="text-[#1e3a8a]/60 text-[10px] uppercase tracking-wider">%</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="0.1" max="10" step="0.1"
                  value={conversionRate} 
                  onChange={(e) => setConversionRate(Number(e.target.value))}
                  className="w-full h-[2px] bg-gray-200 appearance-none cursor-pointer accent-[#1e3a8a]"
                />
              </div>

              {/* Input 4 */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="text-[#1e3a8a] text-xs uppercase tracking-widest font-semibold">
                    Avg. Order Value
                  </label>
                  <div className="flex items-center gap-1 border-b border-[#1e3a8a]/20 pb-1">
                    <input 
                      type="number" 
                      value={aov}
                      onChange={(e) => setAov(Number(e.target.value))}
                      className="w-28 bg-transparent text-right focus:outline-none text-[#1e3a8a] font-medium text-lg"
                      style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    />
                    <span className="text-[#1e3a8a]/60 text-[10px] uppercase tracking-wider">BDT</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="500" max="15000" step="100"
                  value={aov} 
                  onChange={(e) => setAov(Number(e.target.value))}
                  className="w-full h-[2px] bg-gray-200 appearance-none cursor-pointer accent-[#1e3a8a]"
                />
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: RESULTS (Navy-blue - 60%) */}
          <div className="w-full lg:w-1/2 p-10 md:p-14 bg-[#1e3a8a] text-[#f9fafb] flex flex-col justify-between">
            
            <div className="mb-12 border-b border-white/20 pb-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-white/60 text-[10px] font-semibold uppercase tracking-widest mb-3">Current Revenue</p>
                <p className="text-3xl font-medium tracking-tight" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                  {formatCurrency(currentRevenue)}
                </p>
              </div>
              <div>
                <p className="text-white/60 text-[10px] font-semibold uppercase tracking-widest mb-3">With POLISHED (+1.5%)</p>
                <p className="text-3xl font-medium tracking-tight text-[#fb923c]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                  {formatCurrency(projectedRevenue)}
                </p>
              </div>
            </div>

            <div className="mb-12">
              <p className="text-[#fb923c] text-[10px] font-semibold uppercase tracking-[0.2em] mb-4">
                Revenue Left On The Table / Month
              </p>
              <h3 className="text-5xl md:text-6xl font-normal text-white mb-6 leading-tight" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                {formatCurrency(revenueLost)}
              </h3>
              <p className="text-white/50 text-xs italic font-light" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                *Based on a conservative 1.5% conversion lift from premium visual trust & strategy.
              </p>
            </div>

            {/* Accent Color - 10% */}
            <button className="w-full bg-[#fb923c] hover:bg-[#e8812c] text-white py-5 px-8 font-semibold text-[11px] uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-3">
              Stop Losing Money
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            
          </div>
        </div>
      </div>
    </section>
  );
}