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
    <section className="py-24 bg-[#f9fafb] px-6 md:px-14">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[#1e3a8a] text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Is Poor Design Bleeding Your Ad Budget?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Calculate exactly how much revenue you are leaving on the table every month due to average visuals.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl bg-white border border-gray-100">
          
          {/* LEFT COLUMN: INPUTS */}
          <div className="w-full lg:w-1/2 p-8 md:p-12 bg-[#f9fafb]">
            <div className="space-y-8">
              
              {/* Input 1 */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-[#1e3a8a] font-semibold text-sm uppercase tracking-wide">
                    Monthly Ad Spend
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={adSpend}
                      onChange={(e) => setAdSpend(Number(e.target.value))}
                      className="w-32 px-3 py-2 border border-gray-200 rounded-lg text-right focus:outline-none focus:border-[#fb923c] text-[#1e3a8a] font-bold"
                    />
                    <span className="text-gray-400 text-sm font-medium">BDT</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="50000" max="5000000" step="10000"
                  value={adSpend} 
                  onChange={(e) => setAdSpend(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#fb923c]"
                />
              </div>

              {/* Input 2 */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-[#1e3a8a] font-semibold text-sm uppercase tracking-wide">
                    Avg. Cost Per Click (CPC)
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={cpc}
                      onChange={(e) => setCpc(Number(e.target.value))}
                      className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-right focus:outline-none focus:border-[#fb923c] text-[#1e3a8a] font-bold"
                    />
                    <span className="text-gray-400 text-sm font-medium">BDT</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="2" max="200" step="1"
                  value={cpc} 
                  onChange={(e) => setCpc(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#fb923c]"
                />
              </div>

              {/* Input 3 */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-[#1e3a8a] font-semibold text-sm uppercase tracking-wide">
                    Current Conversion Rate
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={conversionRate}
                      onChange={(e) => setConversionRate(Number(e.target.value))}
                      className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-right focus:outline-none focus:border-[#fb923c] text-[#1e3a8a] font-bold"
                    />
                    <span className="text-gray-400 text-sm font-medium">%</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="0.1" max="10" step="0.1"
                  value={conversionRate} 
                  onChange={(e) => setConversionRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#fb923c]"
                />
              </div>

              {/* Input 4 */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-[#1e3a8a] font-semibold text-sm uppercase tracking-wide">
                    Average Order Value
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={aov}
                      onChange={(e) => setAov(Number(e.target.value))}
                      className="w-32 px-3 py-2 border border-gray-200 rounded-lg text-right focus:outline-none focus:border-[#fb923c] text-[#1e3a8a] font-bold"
                    />
                    <span className="text-gray-400 text-sm font-medium">BDT</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="500" max="15000" step="100"
                  value={aov} 
                  onChange={(e) => setAov(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#fb923c]"
                />
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: RESULTS */}
          <div className="w-full lg:w-1/2 p-8 md:p-12 bg-[#1e3a8a] text-[#f9fafb] flex flex-col justify-center relative">
            
            <div className="mb-8 pb-8 border-b border-white/20 grid grid-cols-2 gap-6">
              <div>
                <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">Current Revenue</p>
                <p className="text-2xl font-bold" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  {formatCurrency(currentRevenue)}
                </p>
              </div>
              <div>
                <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">With POLISHED (+1.5% CR)</p>
                <p className="text-2xl font-bold text-[#fb923c]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  {formatCurrency(projectedRevenue)}
                </p>
              </div>
            </div>

            <div className="mb-10">
              <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                Revenue Left On The Table / Month
              </p>
              <h3 className="text-5xl md:text-6xl font-bold text-[#fb923c] mb-4 drop-shadow-md" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {formatCurrency(revenueLost)}
              </h3>
              <p className="text-white/50 text-xs italic">
                *Based on a conservative +1.5% conversion lift from premium visual trust.
              </p>
            </div>

            <button className="w-full bg-[#fb923c] hover:bg-[#e8812c] text-white py-4 px-8 rounded-xl font-bold text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_8px_30px_rgb(251,146,60,0.3)] hover:shadow-[0_8px_30px_rgb(251,146,60,0.5)] hover:-translate-y-1">
              Stop Losing Money. Upgrade Your Brand
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>

          </div>
        </div>
      </div>
    </section>
  );
}