import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ('ontouchstart' in window) return;

    document.body.style.cursor = 'none';

    let mx = 0, my = 0, fx = 0, fy = 0;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = mx + 'px';
        cursorRef.current.style.top = my + 'px';
      }
    };

    const loop = () => {
      fx += (mx - fx) * 0.12;
      fy += (my - fy) * 0.12;
      if (followerRef.current) {
        followerRef.current.style.left = fx + 'px';
        followerRef.current.style.top = fy + 'px';
      }
      animId = requestAnimationFrame(loop);
    };

    const onEnter = () => {
      if (cursorRef.current) { cursorRef.current.style.width = '20px'; cursorRef.current.style.height = '20px'; }
      if (followerRef.current) { followerRef.current.style.width = '60px'; followerRef.current.style.height = '60px'; followerRef.current.style.opacity = '0.3'; }
    };
    const onLeave = () => {
      if (cursorRef.current) { cursorRef.current.style.width = '10px'; cursorRef.current.style.height = '10px'; }
      if (followerRef.current) { followerRef.current.style.width = '40px'; followerRef.current.style.height = '40px'; followerRef.current.style.opacity = '0.5'; }
    };

    document.addEventListener('mousemove', onMouseMove);
    animId = requestAnimationFrame(loop);

    const selector = 'a,button,.service-card,.work-card,.stat-box,.play-btn';
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    const observer = new MutationObserver(() => {
      document.querySelectorAll(selector).forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
      elements.forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
      observer.disconnect();
    };
  }, []);

  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null;

  return (
    <>
      {/* Orange dot */}
      <div
        ref={cursorRef}
        className="fixed w-2.5 h-2.5 rounded-full pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2"
        style={{
          backgroundColor: 'hsl(28 96% 61%)',
          transition: 'width 0.2s, height 0.2s',
        }}
      />
      {/* Orange circle follower */}
      <div
        ref={followerRef}
        className="fixed w-10 h-10 rounded-full pointer-events-none z-[99998] -translate-x-1/2 -translate-y-1/2"
        style={{
          border: '1.5px solid hsl(28 96% 61%)',
          opacity: 0.5,
          transition: 'width 0.25s, height 0.25s, opacity 0.25s',
        }}
      />
    </>
  );
}
