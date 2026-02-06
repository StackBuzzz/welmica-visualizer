import { useInfiniteQuery } from '@tanstack/react-query';
import { payloadSDK } from '@/payload/sdk';
import type { Where } from 'payload';

interface ProductQueryArgs {
  collections: number[];
  series: number[];
  search: string;
}

const PAGE_SIZE = 20;
const INITIAL_PAGE = 1;

export const useProductQuery = ({
  collections,
  series,
  search
}: ProductQueryArgs) => {
  const queryObj: Where = {};

  if (search.trim()) queryObj.label = { like: search.trim() };

  if (collections.length > 0) {
    queryObj['details.collection'] = { in: collections };
  }

  if (series.length > 0) {
    queryObj['details.series'] = { in: series };
  }

  return useInfiniteQuery({
    queryKey: ['products', { collections, series, search }],
    queryFn: async ({ pageParam = INITIAL_PAGE }) => {
      return payloadSDK.find({
        collection: 'products',
        where: queryObj,
        select: {
          label: true,
          slug: true,
          details: true,
          media: true,
          properties: true
        },
        page: pageParam,
        limit: PAGE_SIZE
      });
    },
    initialPageParam: INITIAL_PAGE,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? (lastPage.page ?? 1) + 1 : undefined
  });
};
