import type { PassSizeKey, ResponsiveMediaSizeKey } from './types';
import type { Pass, ResponsiveMedia } from '@/payload-types';

export const getPassUrl = (pass: Pass, size?: PassSizeKey): string | null => {
  if (size) {
    return pass.sizes?.[size]?.url || pass.url || null;
  }
  return pass.url || null;
};

export const getResponsiveImageUrl = (
  image: ResponsiveMedia,
  size?: ResponsiveMediaSizeKey
): string | null => {
  if (size) {
    return image.sizes?.[size]?.url || image.url || null;
  }
  return image.url || null;
};

export const getMaskTextureAlias = (segmentId: string): string => {
  return `mask-${segmentId}`;
};
