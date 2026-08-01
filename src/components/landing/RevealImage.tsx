import { m } from 'framer-motion';

interface RevealImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  delay?: number;
  loading?: 'lazy' | 'eager';
}

const LUXURY_EASE = [0.76, 0, 0.24, 1] as const;

/**
 * Cinematic Scroll Masking — Image Reveal
 * Container wipes open via clip-path (bottom → top) over 1.2s.
 * Simultaneously the inner <img> scales 1.15 → 1.0 over 2.0s
 * for a premium "Ken Burns" depth effect. Identical on mobile,
 * with GPU compositing forced on both layers.
 */
export default function RevealImage({
  src,
  alt,
  containerClassName = '',
  className = '',
  delay = 0,
  loading = 'lazy',
}: RevealImageProps) {
  return (
    <m.div
      className={`relative overflow-hidden transform-gpu will-change-transform ${containerClassName}`}
      style={{ backfaceVisibility: 'hidden' }}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '50px' }}
      transition={{ duration: 1.2, delay, ease: LUXURY_EASE as any }}
    >
      <m.img
        src={src}
        alt={alt}
        className={`block w-full h-full transform-gpu will-change-transform ${className}`}
        style={{ backfaceVisibility: 'hidden' }}
        initial={{ scale: 1.15 }}
        whileInView={{ scale: 1.0 }}
        viewport={{ once: true, margin: '50px' }}
        transition={{ duration: 2.0, delay, ease: LUXURY_EASE as any }}
        draggable={false}
        loading={loading}
      />
    </m.div>
  );
}
