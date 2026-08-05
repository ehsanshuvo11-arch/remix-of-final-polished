import { useEffect, type RefObject } from 'react';

/**
 * Desktop pointer-drag + wheel/trackpad support for horizontal scroll tracks.
 *
 * - Click & pull to scroll (cursor-grab / cursor-grabbing), with a light
 *   inertial glide on release for a native-app feel.
 * - Vertical wheel / trackpad gestures are translated into horizontal scroll
 *   ONLY while the track can still move in that direction — at either end the
 *   page keeps scrolling normally, so the gesture never feels trapped.
 * - Only activates when the element is actually horizontally scrollable and
 *   the pointer is a mouse (touch keeps its native momentum scrolling).
 */
export function useDragScroll(ref: RefObject<HTMLElement>, enabled = true) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const scrollable = () => el.scrollWidth - el.clientWidth > 4;

    // ── Pointer drag ──────────────────────────────────────────────
    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0;
    let raf = 0;
    let moved = false;

    const glide = () => {
      velocity *= 0.94;
      if (Math.abs(velocity) < 0.05) {
        raf = 0;
        el.style.scrollSnapType = '';
        return;
      }
      el.scrollLeft -= velocity * 16;
      raf = requestAnimationFrame(glide);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0 || !scrollable()) return;
      dragging = true;
      moved = false;
      startX = lastX = e.clientX;
      startScroll = el.scrollLeft;
      lastT = performance.now();
      velocity = 0;
      if (raf) cancelAnimationFrame(raf), (raf = 0);
      el.style.scrollSnapType = 'none';
      el.classList.add('cursor-grabbing');
    };

    const onPointerMove = (e: PointerEvent) => {
      // Touch/pen must always remain completely native. In particular, never
      // call preventDefault after a hybrid device has started a mouse drag.
      if (e.pointerType !== 'mouse' || !dragging) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 3) {
        moved = true;
        el.setPointerCapture?.(e.pointerId);
      }
      if (!moved) return;
      e.preventDefault();
      el.scrollLeft = startScroll - dx;
      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) velocity = (e.clientX - lastX) / dt;
      lastX = e.clientX;
      lastT = now;
    };

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      el.classList.remove('cursor-grabbing');
      if (moved && Math.abs(velocity) > 0.1) {
        raf = requestAnimationFrame(glide);
      } else {
        el.style.scrollSnapType = '';
      }
    };

    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };

    // ── Wheel / trackpad ──────────────────────────────────────────
    const onWheel = (e: WheelEvent) => {
      if (!scrollable()) return;
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1;
      const dx = e.deltaX * unit;
      const dy = e.deltaY * unit;
      // Horizontal trackpad gesture: let the browser handle it natively.
      if (Math.abs(dx) > Math.abs(dy)) return;
      const max = el.scrollWidth - el.clientWidth;
      const atStart = el.scrollLeft <= 0 && dy < 0;
      const atEnd = el.scrollLeft >= max - 1 && dy > 0;
      if (atStart || atEnd) return; // release the gesture back to the page
      e.preventDefault();
      if (raf) cancelAnimationFrame(raf), (raf = 0);
      el.scrollLeft += dy;
    };

    el.addEventListener('pointerdown', onPointerDown, { passive: true });
    el.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    el.addEventListener('click', onClickCapture, true);
    el.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('pointercancel', endDrag);
      el.removeEventListener('click', onClickCapture, true);
      el.removeEventListener('wheel', onWheel);
      if (raf) cancelAnimationFrame(raf);
      el.style.scrollSnapType = '';
      el.classList.remove('cursor-grabbing');
    };
  }, [ref, enabled]);
}

export default useDragScroll;
