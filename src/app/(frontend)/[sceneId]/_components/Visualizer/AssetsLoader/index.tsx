import { Assets } from 'pixi.js';
import { useState, type FunctionComponent, type ReactNode } from 'react';
import { useDeepCompareEffect } from 'react-use';
import LoadingOverlay from '../../LoadingOverlay';
import type { Texture } from 'pixi.js';

interface AssetsLoaderProps {
  assets: Array<{
    src: string;
    alias: string;
  }>;
  children: ReactNode;
}

const AssetsLoader: FunctionComponent<AssetsLoaderProps> = ({
  assets,
  children
}) => {
  const [assetLoaded, setAssetLoaded] = useState(false);

  useDeepCompareEffect(() => {
    const loadAssets = async () => {
      await Promise.all(
        assets.map((asset) => {
          if (!Assets.cache.has(asset.alias)) {
            return Assets.load<Texture>(asset);
          }
        })
      );
      setAssetLoaded(true);
    };

    loadAssets();

    return () => {
      assets.forEach((asset) => {
        if (Assets.cache.has(asset.alias)) {
          Assets.unload(asset.alias);
        }
      });
      setAssetLoaded(false);
    };
  }, [assets]);

  if (!assetLoaded) return <LoadingOverlay title='Downloading assets...' />;

  return children;
};

export default AssetsLoader;
