import { getPayloadServerApi } from './getPayloadServerApi';

export const getAmbiances = async () => {
  const payload = await getPayloadServerApi();

  const { docs } = await payload.find({
    collection: 'ambiences',
    pagination: false,
    disableErrors: true,
    depth: 0,
    sort: '_order'
  });

  return docs;
};
