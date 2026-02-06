import type { Collection, Product, Series } from '@/payload-types';
import type { TransformDataWithSelect } from 'payload';

export type ProductView = 'list' | 'grid';

export interface ProductFilters {
  collections: number[];
  series: number[];
  slug: string;
  debouncedSlug: string;
}

export interface FilterData {
  collections: TransformDataWithSelect<
    Collection,
    {
      name: true;
      slug: true;
    }
  >[];
  series: TransformDataWithSelect<
    Series,
    {
      name: true;
      slug: true;
    }
  >[];
}

export type ProductDoc = Pick<
  Product,
  'id' | 'details' | 'properties' | 'media' | 'label' | 'slug'
>;
