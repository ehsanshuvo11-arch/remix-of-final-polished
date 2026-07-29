import { useState } from 'react';
import { motion } from 'framer-motion';
import PremiumSkeleton from '@/components/landing/Skeleton';
import { cn } from '@/lib/utils';

type BaseImgProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd' | 'src' | 'alt'
>;

interface PremiumImageProps extends BaseImgProps {
  src: string;
  alt: string;
  /** Classes for the positioned wrapper (must control the box size). */
  containerClassName?: string;
  /** Skeleton tone to match the surrounding surface. */
  tone?: 'navy' | 'light';
  /** Extra motion styles forwarded to the <img>. */
  imgStyle?: React.CSSProperties;
  fadeDuration?: number;
}


/**
 * Smooth image: reserves its box, shows the quiet-luxury shimmer while the
 * asset downloads, then cross-fades the bitmap in. No layout shift, no pop.
 */
export default function PremiumImage({
  src,
  alt,
  className,
  containerClassName,
  tone = 'navy',
  imgStyle,
  fadeDuration = 0.8,
  onLoad,
  ...imgProps
}: PremiumImageProps) {
  const [loaded, setLoaded] = useState(false);


  return (
    <div className={cn('relative overflow-hidden isolate', containerClassName)}>
      <motion.div
        className="absolute inset-0 z-0"
        initial={false}
        animate={{ opacity: loaded ? 0 : 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ pointerEvents: 'none' }}
      >
        <PremiumSkeleton tone={tone} className="w-full h-full" rounded="rounded-none" />
      </motion.div>

      <motion.img
        src={src}
        alt={alt}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}

        onError={() => setLoaded(true)}
        initial={false}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: fadeDuration, ease: 'easeOut' }}
        className={cn('relative z-10 block w-full h-full will-change-[opacity]', className)}
        style={imgStyle}
        draggable={false}
        {...imgProps}
      />
    </div>
  );
}
