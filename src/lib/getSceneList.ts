import { getPayloadServerApi } from './getPayloadServerApi';
import type { Where } from 'payload';

interface GetSceneListOptions {
  ambienceSlug?: string;
}

export const getSceneList = async (options?: GetSceneListOptions) => {
  const payload = await getPayloadServerApi();

  const where: Where = {};

  if (options?.ambienceSlug) {
    where['general.ambience.slug'] = {
      equals: options.ambienceSlug
    };
  }

  const { docs } = await payload.find({
    collection: 'scenes',
    pagination: false,
    draft: true,
    overrideAccess: false,
    disableErrors: true,
    depth: 1,
    sort: '_order',
    select: {
      general: { thumbnail: true }
    },
    where
  });

  return docs;
};
