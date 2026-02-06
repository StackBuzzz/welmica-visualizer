import type {
  Pass,
  Scene,
  ResponsiveMedia,
  SceneSegments,
  Product
} from '@/payload-types';
import type { TransformDataWithSelect } from 'payload';

export type SceneData = TransformDataWithSelect<
  Scene,
  {
    passes: true;
    segments: true;
  }
>;

export type ProductData = TransformDataWithSelect<
  Product,
  {
    properties: true;
    media: true;
  }
> & {
  media: {
    images: ResponsiveMedia[];
  };
};

export type PassSizeKey = keyof NonNullable<Pass['sizes']>;

export type ResponsiveMediaSizeKey = keyof NonNullable<
  ResponsiveMedia['sizes']
>;

export type SegmentData = Omit<SceneSegments[number], 'mask' | 'id'> & {
  id: string;
  mask: Pass;
};

export type SegmentDataWithProduct = SegmentData & {
  product?: ProductData;
};
