import { memo, type ReactNode } from 'react';
import MotionReveal from '@/components/landing/MotionReveal';
import WordReveal from '@/components/landing/WordReveal';

export interface SectionHeaderProps {
  /** Small eyebrow label rendered in brand orange */
  subHeading: string;
  /** Main heading line */
  heading: string;
  /** Optional second heading line, rendered italic (accent emphasis) */
  headingEm?: string;
  /** Optional supporting copy below the heading */
  description?: string;
  /** Switches text colors for navy / dark sections */
  isDarkBackground?: boolean;
  /** Bengali locale — swaps fonts and type scale */
  isBn?: boolean;
  className?: string;
  children?: ReactNode;
}

const EN_FONT = { fontFamily: "'DM Sans', sans-serif" } as const;
const BN_FONT = { fontFamily: "'Noto Serif Bengali', serif" } as const;

/**
 * Unified section header used across every landing section.
 * Strictly centered to match the Signature Work layout.
 */
function SectionHeader({
  subHeading,
  heading,
  headingEm,
  description,
  isDarkBackground = false,
  isBn = false,
  className = '',
  children,
}: SectionHeaderProps) {
  const headingColor = isDarkBackground ? 'text-primary-foreground' : 'text-primary';
  const descColor = isDarkBackground ? 'text-primary-foreground/60' : 'text-muted-foreground';

  return (
    <div
      className={`flex flex-col items-center text-center mx-auto max-w-[820px] mb-12 md:mb-16 ${className}`}
    >
      <MotionReveal>
        <p
          lang={isBn ? 'bn' : 'en'}
          style={isBn ? BN_FONT : EN_FONT}
          className={
            isBn
              ? 'text-[14px] tracking-[2px] text-accent mb-4 font-medium leading-[1]'
              : 'text-[10px] tracking-[4px] uppercase text-accent mb-4 font-medium'
          }
        >
          {subHeading}
        </p>
      </MotionReveal>

      <MotionReveal delay={0.1}>
        <h2
          lang={isBn ? 'bn' : 'en'}
          className={`font-heading font-normal ${headingColor} leading-[1.1] ${
            isBn
              ? 'text-[clamp(22px,5.2vw,32px)] md:text-[clamp(30px,4.2vw,50px)]'
              : 'text-[clamp(32px,5vw,60px)]'
          }`}
        >
          <WordReveal delay={0.1}>{heading}</WordReveal>
          {headingEm ? (
            <>
              <br />
              <em className="italic">
                <WordReveal delay={0.25}>{headingEm}</WordReveal>
              </em>
            </>
          ) : null}
        </h2>
      </MotionReveal>

      {description ? (
        <MotionReveal delay={0.2}>
          <p
            lang={isBn ? 'bn' : 'en'}
            style={isBn ? BN_FONT : EN_FONT}
            className={`mt-6 max-w-[640px] mx-auto ${descColor} ${
              isBn ? 'text-[14px] leading-[1.9]' : 'text-[15px] leading-[1.85]'
            }`}
          >
            {description}
          </p>
        </MotionReveal>
      ) : null}

      {children}
    </div>
  );
}

export default memo(SectionHeader);
