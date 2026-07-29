import { m } from 'framer-motion';

interface SectionDividerProps {
  className?: string;
}

/**
 * Quiet-luxury partition: a 1px line that fades from 0% at the edges
 * to a soft off-white in the centre, revealed gently on scroll.
 */
export default function SectionDivider({ className = '' }: SectionDividerProps) {
  return (
    <div className={`bg-primary ${className}`} aria-hidden>
      <div className="max-w-[1200px] mx-auto px-6 md:px-14">
        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-px w-full bg-gradient-to-r from-transparent via-primary-foreground/15 to-transparent"
        />
      </div>
    </div>
  );
}
