import { getPayloadServerApi } from './getPayloadServerApi';

export const getSceneConfigsById = async (sceneId: string) => {
  const payload = await getPayloadServerApi();

  const { docs } = await payload.find({
    collection: 'scenes',
    where: {
      id: { equals: sceneId },
      _status: { equals: 'published' }
    },
    pagination: false,
    overrideAccess: true,
    draft: false,
    disableErrors: true,
    depth: 2,
    select: {
      passes: true,
      segments: true
    }
  });

  return docs[0];
};
