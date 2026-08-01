import { cn } from '@/lib/utils';

interface PremiumSkeletonProps {
  className?: string;
  /** 'navy' for dark surfaces, 'light' for off-white surfaces */
  tone?: 'navy' | 'light';
  rounded?: string;
}

/**
 * Quiet-luxury skeleton.
 * A calm translucent base with a slow, wide gradient wave drifting across it —
 * reads as a deliberate ambient animation rather than a "loading" state.
 */
export default function PremiumSkeleton({
  className,
  tone = 'navy',
  rounded = 'rounded-sm',
}: PremiumSkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden isolate',
        rounded,
        tone === 'navy' ? 'bg-primary/[0.08]' : 'bg-primary-foreground/[0.06]',
        className,
      )}
    >
      <div
        className={cn(
          'absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent to-transparent',
          tone === 'navy' ? 'via-primary/[0.12]' : 'via-primary-foreground/[0.14]',
        )}
      />
    </div>
  );
}

/** Skeleton stand-in for the portfolio list while projects resolve. */
export function PortfolioSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex gap-4 overflow-hidden -mx-6 px-6 mt-10 md:mx-0 md:px-0 md:mt-14 md:flex-col md:gap-24">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-4 min-w-[85vw] max-w-[85vw] shrink-0 md:min-w-0 md:max-w-none">
          <PremiumSkeleton className="h-[110px] sm:h-[260px] md:h-[260px] w-full" />
          <PremiumSkeleton className="h-4 w-2/3" />
          <div className="flex gap-4">
            <PremiumSkeleton className="h-9 w-40" />
            <PremiumSkeleton className="h-9 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Skeleton stand-in for the three pricing tier cards. */
export function PricingSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden -mx-6 px-6 mt-10 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-8 md:mt-14">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-5 p-6 md:p-10 border border-primary-foreground/10 min-w-[85vw] max-w-[85vw] shrink-0 md:min-w-0 md:max-w-none"
        >
          <PremiumSkeleton tone="light" className="h-3 w-24" />
          <PremiumSkeleton tone="light" className="h-7 w-3/4" />
          <PremiumSkeleton tone="light" className="h-24 w-full" />
          <PremiumSkeleton tone="light" className="h-11 w-full" />
        </div>
      ))}
    </div>
  );
}

