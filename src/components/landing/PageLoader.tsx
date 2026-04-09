import { useState, useEffect } from 'react';

export default function PageLoader() {
  const [hidden, setHidden] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 1800);
    const hideTimer = setTimeout(() => setHidden(true), 2400);
    return () => { clearTimeout(timer); clearTimeout(hideTimer); };
  }, []);

  if (hidden) return null;

  const letters = 'POLISHED'.split('');

  return (
    <div
      className={`fixed inset-0 bg-primary z-[9999] flex items-center justify-center transition-all duration-600 ${
        fadeOut ? 'opacity-0 -translate-y-full pointer-events-none' : ''
      }`}
    >
      <div className="font-heading text-[32px] tracking-[6px] text-primary-foreground uppercase overflow-hidden">
        {letters.map((letter, i) => (
          <span
            key={i}
            className="inline-block"
            style={{
              animation: `loaderChar 0.6s cubic-bezier(0.16,1,0.3,1) forwards`,
              animationDelay: `${0.1 + i * 0.08}s`,
              opacity: 0,
              transform: 'translateY(40px)',
            }}
          >
            {letter}
          </span>
        ))}
      </div>
      <div
        className="absolute bottom-0 left-0 h-0.5 bg-accent"
        style={{ animation: 'loaderBar 1.6s cubic-bezier(0.25,0.46,0.45,0.94) forwards' }}
      />
    </div>
  );
}
