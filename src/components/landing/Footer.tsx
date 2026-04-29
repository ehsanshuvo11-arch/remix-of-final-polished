import { useLanguage } from '@/contexts/LanguageContext';
import type { FooterContent } from '@/types/database';

interface FooterProps {
  footer: FooterContent | null;
}

export default function Footer({ footer }: FooterProps) {
  const { t } = useLanguage();
  const brand = footer?.brandName ?? 'POLISHED';
  const year = footer?.year ?? '2025';
  const rightsTextEn = footer?.rightsTextEn ?? 'All rights reserved.';
  const rightsTextBn = footer?.rightsTextBn ?? 'সর্বস্বত্ব সংরক্ষিত।';

  return (
    <footer className="bg-[#0f1e4a] py-10 md:py-8 px-6 sm:px-8 md:px-14 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-3 text-center md:text-left">
      <span className="font-heading text-base tracking-[4px] text-primary-foreground/40">
        {brand}<span className="text-accent">.</span>
      </span>
      <p className="text-[11px] text-primary-foreground/20 tracking-wider">
        © {year} {brand}. {t(rightsTextEn, rightsTextBn)}
      </p>
    </footer>
  );
}
