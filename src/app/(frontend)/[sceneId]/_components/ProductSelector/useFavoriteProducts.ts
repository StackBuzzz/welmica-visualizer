import { useQuery } from '@tanstack/react-query';
import { payloadSDK } from '@/payload/sdk';

export const useFavoriteProducts = (
  favoriteIds: string[],
  enabled: boolean
) => {
  return useQuery({
    queryKey: ['favorite-products', favoriteIds],
    queryFn: async () => {
      if (favoriteIds.length === 0) return [];

      const response = await payloadSDK.find({
        collection: 'products',
        where: {
          id: { in: favoriteIds.map(Number) }
        },
        select: {
          label: true,
          slug: true,
          details: true,
          media: true,
          properties: true
        },
        limit: 100
      });

      return response.docs;
    },
    enabled: enabled && favoriteIds.length > 0
  });
};
