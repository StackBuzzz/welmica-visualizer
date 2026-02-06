import useBakedTexture from './useBakedTexture';
import useProductData from './useProductData';
import type { SceneSegments } from '@/payload-types';
import type { FunctionComponent } from 'react';

interface SegmentDirectorProps {
  segment: SceneSegments[number];
  sceneScaleFactor: number;
}

const SegmentDirector: FunctionComponent<SegmentDirectorProps> = ({
  segment,
  sceneScaleFactor
}) => {
  const { textureUrls, productId, properties } = useProductData(
    segment.id as string
  );

  const bakedTexture = useBakedTexture({
    segment,
    productTextureUrls: textureUrls,
    productProperties: properties,
    sceneScaleFactor,
    productId
  });

  return <pixiSprite texture={bakedTexture} />;
};

export default SegmentDirector;
