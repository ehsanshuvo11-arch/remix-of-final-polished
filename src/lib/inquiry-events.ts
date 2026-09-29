import { getLenis } from '@/components/landing/SmoothScroll';

export interface InquiryPrefillDetail {
  service?: string;
  budget?: string;
  revenueLost?: string;
  note?: string;
  isAudit?: boolean;
}

export const INQUIRY_PREFILL_EVENT = 'polished:prefill-inquiry';

export function triggerInquiry(detail?: InquiryPrefillDetail) {
  if (detail) {
    window.dispatchEvent(new CustomEvent(INQUIRY_PREFILL_EVENT, { detail }));
  }
  const el = document.getElementById('contact');
  if (el) {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(el, { duration: 1.8, offset: -20 });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
