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
    <section className="py-32 relative bg-[#f9fafb] overflow-hidden">
      {/* Subtle Background Glow for Premium Depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e3a8a]/5 to-transparent blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-14 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <span className="text-[#fb923c] text-xs font-bold uppercase tracking-[0.25em] mb-4 block">
            Revenue Diagnostic
          </span>
          <h2 className="text-[#1e3a8a] text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            Is Poor Design Bleeding Your Ad Budget?
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Calculate exactly how much revenue you are leaving on the table every month due to average visuals.
          </p>
        </div>

        {/* The Main Calculator Card */}
        <div className="flex flex-col lg:flex-row rounded-[2rem] overflow-hidden shadow-[0_30px_100px_-20px_rgba(30,58,138,0.15)] bg-white border border-white/50 backdrop-blur-xl">
          
          {/* LEFT COLUMN: INPUTS */}
          <div className="w-full lg:w-7/12 p-10 md:p-14 bg-white/60">
            <div className="space-y-12">
              
              {/* Input 1 */}
              <div className="group">
                <div className="flex justify-between items-end mb-3">
                  <label className="text-[#1e3a8a] font-bold text-xs uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
                    Monthly Ad Spend
                  </label>
                  <div className="flex items-center gap-2 border-b-2 border-gray-100 group-hover:border-[#fb923c] transition-colors pb-1">
                    <input 
                      type="number" 
                      value={adSpend}
                      onChange={(e) => setAdSpend(Number(e.target.value))}
                      className="w-32 bg-transparent text-right focus:outline-none text-[#1e3a8a] font-bold text-lg"
                    />
                    <span className="text-gray-400 text-xs font-bold tracking-wider">BDT</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="50000" max="5000000" step="10000"
                  value={adSpend} 
                  onChange={(e) => setAdSpend(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#fb923c] hover:h-2 transition-all"
                />
              </div>

              {/* Input 2 */}
              <div className="group">
                <div className="flex justify-between items-end mb-3">
                  <label className="text-[#1e3a8a] font-bold text-xs uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
                    Avg. Cost Per Click (CPC)
                  </label>
                  <div className="flex items-center gap-2 border-b-2 border-gray-100 group-hover:border-[#fb923c] transition-colors pb-1">
                    <input 
                      type="number" 
                      value={cpc}
                      onChange={(e) => setCpc(Number(e.target.value))}
                      className="w-24 bg-transparent text-right focus:outline-none text-[#1e3a8a] font-bold text-lg"
                    />
                    <span className="text-gray-400 text-xs font-bold tracking-wider">BDT</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="2" max="200" step="1"
                  value={cpc} 
                  onChange={(e) => setCpc(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#fb923c] hover:h-2 transition-all"
                />
              </div>

              {/* Input 3 */}
              <div className="group">
                <div className="flex justify-between items-end mb-3">
                  <label className="text-[#1e3a8a] font-bold text-xs uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
                    Current Conversion Rate
                  </label>
                  <div className="flex items-center gap-2 border-b-2 border-gray-100 group-hover:border-[#fb923c] transition-colors pb-1">
                    <input 
                      type="number" 
                      value={conversionRate}
                      onChange={(e) => setConversionRate(Number(e.target.value))}
                      className="w-24 bg-transparent text-right focus:outline-none text-[#1e3a8a] font-bold text-lg"
                    />
                    <span className="text-gray-400 text-xs font-bold tracking-wider">%</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="0.1" max="10" step="0.1"
                  value={conversionRate} 
                  onChange={(e) => setConversionRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#fb923c] hover:h-2 transition-all"
                />
              </div>

              {/* Input 4 */}
              <div className="group">
                <div className="flex justify-between items-end mb-3">
                  <label className="text-[#1e3a8a] font-bold text-xs uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
                    Average Order Value
                  </label>
                  <div className="flex items-center gap-2 border-b-2 border-gray-100 group-hover:border-[#fb923c] transition-colors pb-1">
                    <input 
                      type="number" 
                      value={aov}
                      onChange={(e) => setAov(Number(e.target.value))}
                      className="w-32 bg-transparent text-right focus:outline-none text-[#1e3a8a] font-bold text-lg"
                    />
                    <span className="text-gray-400 text-xs font-bold tracking-wider">BDT</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="500" max="15000" step="100"
                  value={aov} 
                  onChange={(e) => setAov(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#fb923c] hover:h-2 transition-all"
                />
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: RESULTS */}
          <div className="w-full lg:w-5/12 p-10 md:p-14 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#2749a3] via-[#1e3a8a] to-[#0f2156] text-[#f9fafb] flex flex-col justify-center relative overflow-hidden">
            
            {/* Decorative Glow */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#fb923c] rounded-full mix-blend-screen filter blur-[100px] opacity-10"></div>
            
            <div className="relative z-10">
              <div className="mb-10 pb-10 border-b border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-2">Current Revenue</p>
                  <p className="text-2xl font-medium tracking-tight" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                    {formatCurrency(currentRevenue)}
                  </p>
                </div>
                <div>
                  <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-2">With POLISHED (+1.5%)</p>
                  <p className="text-2xl font-bold text-[#fb923c] tracking-tight drop-shadow-md" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                    {formatCurrency(projectedRevenue)}
                  </p>
                </div>
              </div>

              <div className="mb-12">
                <p className="text-[#fb923c] text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#fb923c] animate-pulse"></span>
                  Revenue Left On The Table
                </p>
                <h3 className="text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg leading-none" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                  {formatCurrency(revenueLost)}
                </h3>
                <p className="text-white/40 text-xs italic font-light">
                  *Based on a highly conservative 1.5% conversion lift from premium visual trust & strategy.
                </p>
              </div>

              <button className="w-full bg-[#fb923c] hover:bg-white hover:text-[#1e3a8a] text-white py-5 px-8 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-3 shadow-[0_10px_40px_-10px_rgb(251,146,60,0.6)] hover:shadow-[0_20px_40px_-10px_rgb(255,255,255,0.4)] hover:-translate-y-1">
                Stop Losing Money
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}