import merge from 'lodash/merge';
import type { UploadField } from 'payload';

export const staticImageField = (
  overrides: Partial<UploadField> = {}
): UploadField =>
  merge(
    {
      name: 'image',
      type: 'upload',
      relationTo: 'static_media',
      filterOptions: {
        mimeType: {
          contains: 'image'
        }
      }
    } as UploadField,
    overrides
  );
