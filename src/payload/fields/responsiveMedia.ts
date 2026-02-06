import merge from 'lodash/merge';
import type { UploadField } from 'payload';

export const responsiveMediaField = (
  overrides: Partial<UploadField> = {}
): UploadField =>
  merge(
    {
      name: 'image',
      type: 'upload',
      relationTo: 'responsive_media'
    } as UploadField,
    overrides
  );
