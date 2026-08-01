import { useState } from 'react';
import PremiumSkeleton from '@/components/landing/Skeleton';
import { cn } from '@/lib/utils';

type BaseImgProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>;

interface PremiumImageProps extends BaseImgProps {
  src: string;
  alt: string;
  /** Classes for the positioned wrapper (must control the box size). */
  containerClassName?: string;
  /** Skeleton tone to match the surrounding surface. */
  tone?: 'navy' | 'light';
  /** Extra styles forwarded to the <img>. */
  imgStyle?: React.CSSProperties;
  fadeDuration?: number;
}

/**
 * Smooth image: reserves its box, shows a pure-CSS shimmer while the asset
 * downloads, then cross-fades the bitmap in. No Framer Motion, no main-thread
 * work — only compositor-friendly `opacity` transitions.
 */
export default function PremiumImage({
  src,
  alt,
  className,
  containerClassName,
  tone = 'navy',
  imgStyle,
  fadeDuration = 0.6,
  onLoad,
  loading = 'lazy',
  decoding = 'async',
  ...imgProps
}: PremiumImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn('relative overflow-hidden isolate', containerClassName)}>
      <div
        aria-hidden
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-500 ease-out"
        style={{ opacity: loaded ? 0 : 1 }}
      >
        <PremiumSkeleton tone={tone} className="w-full h-full" rounded="rounded-none" />
      </div>

      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        onError={() => setLoaded(true)}
        className={cn('relative z-10 block w-full h-full will-change-[opacity]', className)}
        style={{
          opacity: loaded ? 1 : 0,
          transition: `opacity ${fadeDuration}s ease-out`,
          ...imgStyle,
        }}
        draggable={false}
        {...imgProps}
      />
    </div>
  );
}
