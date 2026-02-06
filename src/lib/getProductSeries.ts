import { getPayloadServerApi } from './getPayloadServerApi';

export const getProductSeries = async () => {
  const payload = await getPayloadServerApi();

  const { docs } = await payload.find({
    collection: 'series',
    overrideAccess: true,
    disableErrors: true,
    select: {
      name: true,
      slug: true
    },
    pagination: false,
    sort: '_order'
  });

  return docs;
};
