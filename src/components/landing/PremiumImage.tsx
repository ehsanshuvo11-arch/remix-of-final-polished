import { useState } from 'react';
import PremiumSkeleton from '@/components/landing/Skeleton';
import { cn } from '@/lib/utils';
import { buildSrcSet, isTransformable, transformedUrl, DEFAULT_WIDTHS } from '@/lib/image';

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
  /** Candidate widths for the generated srcset. */
  widths?: readonly number[];
  /** `sizes` attribute — tell the browser how wide the image renders. */
  sizes?: string;
}

/**
 * Smooth image: reserves its box, shows a pure-CSS shimmer while the asset
 * downloads, then cross-fades the bitmap in. No Framer Motion, no main-thread
 * work — only compositor-friendly `opacity` transitions.
 *
 * When the source lives in Supabase Storage it also serves a resized,
 * automatically WebP/AVIF-negotiated `srcset` so mobile downloads a fraction
 * of the desktop payload. Any failure silently falls back to the original.
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
  widths = DEFAULT_WIDTHS,
  sizes = '(max-width: 767px) 92vw, 600px',
  ...imgProps
}: PremiumImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [useOriginal, setUseOriginal] = useState(false);

  const optimize = !useOriginal && isTransformable(src);
  const srcSet = optimize ? buildSrcSet(src, widths) : undefined;
  const resolvedSrc = optimize ? transformedUrl(src, widths[widths.length - 1]) : src;

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
        key={optimize ? 'opt' : 'orig'}
        src={resolvedSrc}
        srcSet={srcSet}
        sizes={srcSet ? sizes : undefined}
        alt={alt}
        loading={loading}
        decoding={decoding}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        onError={() => {
          // Transformations unavailable → retry once with the raw object URL.
          if (optimize) {
            setUseOriginal(true);
            return;
          }
          setLoaded(true);
        }}
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
