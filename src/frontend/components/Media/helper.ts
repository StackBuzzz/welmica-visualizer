import { globalConfigs } from '@/configs';
import { staticDir } from '@/payload/configs';
import type { CollectionSlug } from 'payload';
import type { CSSProperties } from 'react';

const { API_URL, R2_STORATE_ENABLED } = globalConfigs;

const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';

const mediaCollections: CollectionSlug[] = ['static_media', 'responsive_media'];

export const getMediaUrl = (
  filename: string | null | undefined,
  collection: CollectionSlug,
  cacheTag: string = ''
) => {
  if (!filename || !mediaCollections.includes(collection)) return '';

  // In production, use R2 public URL directly
  if (R2_STORATE_ENABLED) {
    switch (collection) {
      case 'static_media':
        return encodeURI(
          `${R2_PUBLIC_URL}/${staticDir.static}/${filename}${cacheTag ? `?${cacheTag}` : ''}`
        );

      case 'responsive_media':
        return encodeURI(
          `${R2_PUBLIC_URL}/${staticDir.responsive}/${filename}${cacheTag ? `?${cacheTag}` : ''}`
        );

      default:
        return '';
    }
  }

  // In development, use local API
  return encodeURI(`${API_URL}/${collection}/file/${filename}?${cacheTag}`);
};

export const getObjectPositionStyles = (
  focalX: number | undefined | null,
  focalY: number | undefined | null
): CSSProperties => {
  if (!focalX || !focalY) return {};

  return {
    objectPosition: `${focalX}% ${focalY}%`
  };
};
