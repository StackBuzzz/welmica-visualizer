import { getPayloadServerApi } from './getPayloadServerApi';

export const getSceneConfigsById = async (sceneId: string) => {
  const payload = await getPayloadServerApi();

  return payload.findByID({
    collection: 'scenes',
    id: sceneId,
    overrideAccess: true,
    disableErrors: true,
    depth: 5,
    select: {
      passes: true,
      segments: true
    }
  });
};
