import { useEffect, useRef, useState } from 'react';

/**
 * SerumCursor — a luxury "drop of serum" trail.
 *
 * Soft, blurred liquid trail blending brand orange (#fb923c) with a warm ivory.
 * Follows the pointer with light inertia; particles fade + shrink within ~0.7s.
 * Uses a single canvas (lighter blend, additive) for performance.
 *
 * Fully disabled below 1024px and on touch devices. Pointer-events: none.
 */
export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isTouch =
      'ontouchstart' in window ||
      (navigator as Navigator & { maxTouchPoints?: number }).maxTouchPoints! > 0;

    const evaluate = () => {
      setEnabled(!isTouch && window.innerWidth >= 1024);
    };
    evaluate();
    window.addEventListener('resize', evaluate);
    return () => window.removeEventListener('resize', evaluate);
  }, []);

  useEffect(() => {
    if (!enabled) {
      document.body.style.cursor = '';
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    document.body.style.cursor = 'none';

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Pointer state
    const target = { x: width / 2, y: height / 2 };
    const head = { x: width / 2, y: height / 2 };
    let visible = false;
    let lastEmit = 0;
    let lastMove = performance.now();

    type Drop = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      life: number; // 0..1 remaining
      maxLife: number; // ms
      hue: 'orange' | 'ivory';
    };
    const drops: Drop[] = [];
    const MAX_DROPS = 80;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      visible = true;
      lastMove = performance.now();
    };
    const onLeave = () => {
      visible = false;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseout', (e) => {
      if (!e.relatedTarget) onLeave();
    });

    let raf = 0;
    let prev = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(now - prev, 48);
      prev = now;

      // Inertia: head eases toward target
      const ease = 0.18;
      const px = head.x;
      const py = head.y;
      head.x += (target.x - head.x) * ease;
      head.y += (target.y - head.y) * ease;
      const speed = Math.hypot(head.x - px, head.y - py);

      // Emit drops while pointer is moving
      if (visible && now - lastEmit > 14 && speed > 0.4) {
        lastEmit = now;
        const count = Math.min(2, Math.floor(1 + speed * 0.05));
        for (let i = 0; i < count; i++) {
          if (drops.length >= MAX_DROPS) drops.shift();
          const jitter = () => (Math.random() - 0.5) * 4;
          drops.push({
            x: head.x + jitter(),
            y: head.y + jitter(),
            vx: (head.x - px) * 0.05 + (Math.random() - 0.5) * 0.3,
            vy: (head.y - py) * 0.05 + (Math.random() - 0.5) * 0.3,
            r: 14 + Math.random() * 10 + Math.min(speed * 0.4, 12),
            life: 1,
            maxLife: 650 + Math.random() * 250, // 0.65–0.9s
            hue: Math.random() < 0.55 ? 'orange' : 'ivory',
          });
        }
      }

      // If idle, gently let trail die
      if (now - lastMove > 120) {
        // no new emissions, drops decay normally
      }

      // Clear with full alpha (no smearing — blur is from radial gradients)
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.life -= dt / d.maxLife;
        if (d.life <= 0) {
          drops.splice(i, 1);
          continue;
        }
        d.x += d.vx;
        d.y += d.vy;
        d.vx *= 0.92;
        d.vy *= 0.92;

        const eased = d.life * d.life; // ease-out shrink/fade
        const radius = d.r * (0.4 + eased * 0.9);
        const alpha = eased * 0.35;

        const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, radius);
        if (d.hue === 'orange') {
          grad.addColorStop(0, `rgba(251,146,60,${alpha})`);
          grad.addColorStop(0.45, `rgba(251,146,60,${alpha * 0.45})`);
          grad.addColorStop(1, 'rgba(251,146,60,0)');
        } else {
          grad.addColorStop(0, `rgba(255,244,224,${alpha * 0.85})`);
          grad.addColorStop(0.5, `rgba(255,236,210,${alpha * 0.3})`);
          grad.addColorStop(1, 'rgba(255,236,210,0)');
        }
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Soft head — keeps cursor precise since OS cursor is hidden
      if (visible) {
        ctx.globalCompositeOperation = 'lighter';
        const headGrad = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 14);
        headGrad.addColorStop(0, 'rgba(255,236,210,0.9)');
        headGrad.addColorStop(0.4, 'rgba(251,146,60,0.55)');
        headGrad.addColorStop(1, 'rgba(251,146,60,0)');
        ctx.fillStyle = headGrad;
        ctx.beginPath();
        ctx.arc(head.x, head.y, 14, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      document.body.style.cursor = '';
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[99999]"
      style={{
        // Subtle blur softens the gradient blobs into a fluid serum feel
        filter: 'blur(6px) saturate(1.05)',
      }}
    />
  );
}
