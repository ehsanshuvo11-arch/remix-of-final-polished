/**
 * Responsive image helpers.
 *
 * Supabase Storage can transform images on the fly (resize + automatic
 * WebP/AVIF negotiation via the Accept header) through the
 * `/storage/v1/render/image/public/` endpoint. We build a `srcset` from that
 * so phones download a ~640–828px asset instead of the full-size mockup.
 *
 * If transformations aren't available the <img> onError handler falls back to
 * the untouched original URL, so this can never break rendering.
 */

const OBJECT_PATH = '/storage/v1/object/public/';
const RENDER_PATH = '/storage/v1/render/image/public/';

export const DEFAULT_WIDTHS = [480, 640, 828, 1080, 1440] as const;

export function isTransformable(src: string | undefined | null): boolean {
  return !!src && src.includes(OBJECT_PATH);
}

export function transformedUrl(src: string, width: number, quality = 72): string {
  if (!isTransformable(src)) return src;
  const base = src.split('?')[0].replace(OBJECT_PATH, RENDER_PATH);
  return `${base}?width=${width}&quality=${quality}&resize=contain`;
}

export function buildSrcSet(
  src: string,
  widths: readonly number[] = DEFAULT_WIDTHS,
  quality = 72,
): string | undefined {
  if (!isTransformable(src)) return undefined;
  return widths.map((w) => `${transformedUrl(src, w, quality)} ${w}w`).join(', ');
}
