import { Assets, type UnresolvedAsset, type Texture } from 'pixi.js';
import { useState } from 'react';
import { useDeepCompareEffect } from 'react-use';

const useTextures = (assets: (string | UnresolvedAsset)[]) => {
  const [textures, setTextures] = useState<Texture[] | null[]>(
    assets.map(() => null)
  );

  useDeepCompareEffect(() => {
    const loadTextures = async () => {
      const loadedTextures = await Promise.all(
        assets.map((asset) => Assets.load<Texture>(asset))
      );
      setTextures(loadedTextures);
    };
    loadTextures();

    return () => {
      textures.forEach((texture) => texture?.destroy());
    };
  }, [assets]);

  return textures;
};

export default useTextures;
