import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { isExpandedDoc } from '@/utils/isExpandedDoc';
import { PRODUCT_IMAGE_SIZE_LABEL } from '../../constants';
import { getResponsiveImageUrl } from '../../helpers';
import { getProductDataBySlug, getProductIdFromParams } from './helpers';
import type { ResponsiveMedia } from '@/payload-types';

interface ProductData {
  textureUrls: string[];
  properties:
    | NonNullable<
        Awaited<ReturnType<typeof getProductDataBySlug>>
      >['properties']
    | null;
  productId: string | null;
}

const initialProductData: ProductData = {
  textureUrls: [],
  properties: null,
  productId: null
};

const useProductData = (segmentId: string): ProductData => {
  const searchParams = useSearchParams();
  const productSlug = getProductIdFromParams(searchParams, segmentId);

  const { data: product, isFetched } = useQuery({
    queryKey: ['product', productSlug],
    queryFn: () => getProductDataBySlug(productSlug as string),
    enabled: !!productSlug
  });

  if (!isFetched) return initialProductData;

  if (!product) {
    console.error(`Product with slug ${productSlug} cannot be found.`);
    return initialProductData;
  }

  const {
    media: { images },
    properties,
    id
  } = product;

  if (!images.every(isExpandedDoc<ResponsiveMedia>)) {
    console.error('Product media doc is not populated');
    return initialProductData;
  }

  const productTextureUrls = images.map((image) =>
    getResponsiveImageUrl(image, PRODUCT_IMAGE_SIZE_LABEL)
  );

  if (!productTextureUrls.every((url) => typeof url === 'string')) {
    console.error('Product texture url is not available');
    return initialProductData;
  }

  return {
    textureUrls: productTextureUrls,
    properties,
    productId: String(id)
  };
};

export default useProductData;
