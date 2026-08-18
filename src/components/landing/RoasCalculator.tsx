import { useEffect, useMemo, useRef, useState } from 'react';
import { m } from 'framer-motion';
import { TrendingUp, ArrowRight, Wallet, MousePointerClick, Percent, ShoppingBag } from 'lucide-react';

/** Conservative uplift in conversion rate (in percentage points) from premium visuals. */
const UPLIFT_PP = 1.5;

const bdt = (n: number) =>
  '৳' + Math.round(n).toLocaleString('en-US');

/** Smooth rAF count-up that eases toward the target whenever it changes. */
function useCountUp(target: number, duration = 700) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef<number>();

  useEffect(() => {
    const from = fromRef.current;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + (target - from) * eased;
      setValue(next);
      fromRef.current = next;
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return value;
}

interface FieldProps {
  label: string;
  icon: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (v: number) => void;
}

const Field = ({ label, icon, value, min, max, step, suffix, onChange }: FieldProps) => {
  const pct = ((value - min) / (max - min)) * 100;

  const commit = (raw: string) => {
    const n = Number(raw.replace(/[^0-9.]/g, ''));
    if (Number.isNaN(n)) return;
    onChange(Math.min(max, Math.max(min, n)));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <label className="flex items-center gap-2 font-body text-sm md:text-[0.95rem] text-[#1e3a8a]/70">
          <span className="text-[#fb923c]">{icon}</span>
          {label}
        </label>
        <div className="flex items-center rounded-lg bg-[#1e3a8a]/[0.04] px-3 py-1.5">
          <input
            type="text"
            inputMode="decimal"
            value={value.toLocaleString('en-US')}
            onChange={(e) => commit(e.target.value)}
            aria-label={label}
            className="w-24 bg-transparent text-right font-body text-sm md:text-base font-medium text-[#1e3a8a] outline-none"
          />
          {suffix && <span className="pl-1 font-body text-xs text-[#1e3a8a]/50">{suffix}</span>}
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={`${label} slider`}
        onChange={(e) => onChange(Number(e.target.value))}
        className="roas-slider h-11 w-full cursor-pointer appearance-none bg-transparent"
        style={{
          background: `linear-gradient(to right, #fb923c 0%, #fb923c ${pct}%, rgba(30,58,138,0.12) ${pct}%, rgba(30,58,138,0.12) 100%)`,
        }}
      />
    </div>
  );
};

export default function RoasCalculator() {
  const [adSpend, setAdSpend] = useState(300000);
  const [cpc, setCpc] = useState(18);
  const [cvr, setCvr] = useState(1.2);
  const [aov, setAov] = useState(2200);

  const { current, projected, leak } = useMemo(() => {
    const clicks = cpc > 0 ? adSpend / cpc : 0;
    const cur = clicks * (cvr / 100) * aov;
    const proj = clicks * ((cvr + UPLIFT_PP) / 100) * aov;
    return { current: cur, projected: proj, leak: Math.max(proj - cur, 0) };
  }, [adSpend, cpc, cvr, aov]);

  const animCurrent = useCountUp(current);
  const animProjected = useCountUp(projected);
  const animLeak = useCountUp(leak);

  return (
    <section
      id="calculator"
      data-theme="light"
      className="relative bg-[#f9fafb] px-4 py-16 md:px-8 md:py-28"
    >
      <style>{`
        .roas-slider { border-radius: 9999px; }
        .roas-slider::-webkit-slider-runnable-track { height: 4px; border-radius: 9999px; background: transparent; }
        .roas-slider::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          height: 22px; width: 22px; margin-top: -9px; border-radius: 9999px;
          background: #fb923c; border: 3px solid #f9fafb;
          box-shadow: 0 4px 14px rgba(251,146,60,0.45);
          transition: transform .2s cubic-bezier(0.22,1,0.36,1);
        }
        .roas-slider::-webkit-slider-thumb:active { transform: scale(1.15); }
        .roas-slider::-moz-range-track { height: 4px; border-radius: 9999px; background: transparent; }
        .roas-slider::-moz-range-thumb {
          height: 20px; width: 20px; border-radius: 9999px;
          background: #fb923c; border: 3px solid #f9fafb;
          box-shadow: 0 4px 14px rgba(251,146,60,0.45);
        }
      `}</style>

      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-body text-[0.7rem] uppercase tracking-[0.35em] text-[#fb923c]">
            Revenue Diagnostic
          </p>
          <h2 className="mt-5 font-heading text-[clamp(2rem,7vw,3.75rem)] leading-[1.05] text-[#1e3a8a]">
            Is Poor Design Bleeding Your Ad Budget?
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-body text-sm leading-relaxed text-[#1e3a8a]/60 md:text-base">
            Calculate how much revenue you are leaving on the table every month due to average visuals.
          </p>
        </div>

        {/* Body */}
        <div className="mt-12 grid overflow-hidden rounded-3xl border border-[#1e3a8a]/10 bg-[#f9fafb] shadow-[0_40px_90px_-50px_rgba(30,58,138,0.45)] md:mt-20 md:grid-cols-2">
          {/* Inputs */}
          <div className="space-y-8 border-b border-[#1e3a8a]/10 p-6 md:border-b-0 md:border-r md:p-12">
            <Field
              label="Monthly Ad Spend"
              icon={<Wallet className="h-4 w-4" />}
              value={adSpend}
              min={50000}
              max={5000000}
              step={10000}
              suffix="BDT"
              onChange={setAdSpend}
            />
            <Field
              label="Average Cost Per Click"
              icon={<MousePointerClick className="h-4 w-4" />}
              value={cpc}
              min={5}
              max={100}
              step={1}
              suffix="BDT"
              onChange={setCpc}
            />
            <Field
              label="Current Conversion Rate"
              icon={<Percent className="h-4 w-4" />}
              value={cvr}
              min={0.5}
              max={5}
              step={0.1}
              suffix="%"
              onChange={setCvr}
            />
            <Field
              label="Average Order Value"
              icon={<ShoppingBag className="h-4 w-4" />}
              value={aov}
              min={500}
              max={5000}
              step={50}
              suffix="BDT"
              onChange={setAov}
            />
          </div>

          {/* Results */}
          <div className="flex flex-col justify-center bg-[#1e3a8a] p-6 md:p-12">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="font-body text-[0.7rem] uppercase tracking-[0.2em] text-[#f9fafb]/50">
                  Current Revenue
                </p>
                <p className="mt-2 font-heading text-2xl text-[#f9fafb] md:text-3xl">
                  {bdt(animCurrent)}
                </p>
              </div>
              <div>
                <p className="font-body text-[0.7rem] uppercase tracking-[0.2em] text-[#fb923c]/80">
                  With POLISHED
                </p>
                <p className="mt-2 font-heading text-2xl text-[#f9fafb] md:text-3xl">
                  {bdt(animProjected)}
                </p>
              </div>
            </div>

            <div className="my-8 h-px w-full bg-[#f9fafb]/15" />

            <div>
              <p className="flex items-center gap-2 font-body text-[0.7rem] uppercase tracking-[0.25em] text-[#f9fafb]/50">
                <TrendingUp className="h-4 w-4 text-[#fb923c]" />
                Revenue left on the table / month
              </p>
              <m.p
                key={Math.round(leak)}
                initial={{ opacity: 0.65 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="mt-3 font-heading text-[clamp(2.75rem,9vw,5rem)] font-bold leading-[0.95] text-[#fb923c]"
              >
                {bdt(animLeak)}
              </m.p>
              <p className="mt-4 font-body text-xs leading-relaxed text-[#f9fafb]/45 md:text-sm">
                Based on a conservative +{UPLIFT_PP}% conversion lift from premium visual trust.
              </p>
            </div>

            <a
              href="#contact"
              className="group mt-10 inline-flex min-h-[56px] w-full items-center justify-center gap-3 rounded-full bg-[#fb923c] px-8 font-body text-sm font-medium tracking-wide text-[#1e3a8a] shadow-[0_18px_40px_-14px_rgba(251,146,60,0.85)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03] hover:bg-[#f97316] hover:shadow-[0_26px_55px_-14px_rgba(249,115,22,0.8)] md:text-base"
            >
              Stop Losing Money. Upgrade Your Brand
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
