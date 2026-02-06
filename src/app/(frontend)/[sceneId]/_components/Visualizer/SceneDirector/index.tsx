import { useApplication } from '@pixi/react';
import { Assets } from 'pixi.js';
import { useDeepCompareEffect } from 'react-use';
import { PASS_TEXTURE_NAMES } from '../constants';
import useSceneTransform from '../useScreenSize';
import Marker from './Marker';
import SceneToolbar from './SceneToolbar';
import SegmentDirector from './SegmentDirector';
import type { SceneSegments } from '@/payload-types';
import type { Texture } from 'pixi.js';
import type { FunctionComponent } from 'react';

interface SceneDirectorProps {
  sceneScaleFactor: number;
  segments: SceneSegments;
  sceneWidthPx: number;
  sceneHeightPx: number;
  onSurfaceSelect: (surfaceId: string) => void;
  activeSurfaceId: string;
  isAssetsLoading: boolean;
  setIsAssetsLoading: (isAssetsLoading: boolean) => void;
  sceneAssets: Array<{
    src: string;
    alias: string;
  }>;
}

const SceneDirector: FunctionComponent<SceneDirectorProps> = ({
  segments,
  sceneScaleFactor,
  sceneWidthPx,
  sceneHeightPx,
  onSurfaceSelect,
  activeSurfaceId,
  isAssetsLoading,
  setIsAssetsLoading,
  sceneAssets
}) => {
  const { isInitialised } = useApplication();
  const { offsetX, offsetY, scale } = useSceneTransform(
    sceneWidthPx,
    sceneHeightPx
  );

  useDeepCompareEffect(() => {
    const loadAssets = async () => {
      await Promise.all(
        sceneAssets.map((asset) => {
          if (!Assets.cache.has(asset.alias)) {
            return Assets.load<Texture>(asset);
          }
        })
      );
      setIsAssetsLoading(false);
    };

    loadAssets();

    return () => {
      setIsAssetsLoading(true);
      sceneAssets.forEach((asset) => {
        if (Assets.cache.has(asset.alias)) {
          Assets.unload(asset.alias);
        }
      });
    };
  }, [sceneAssets, setIsAssetsLoading]);

  if (!isInitialised || isAssetsLoading) return null;

  return (
    <pixiContainer
      label='container'
      x={offsetX}
      y={offsetY}
      visible={!isAssetsLoading}
    >
      <pixiContainer scale={scale} label='scene'>
        <pixiSprite
          eventMode='none'
          texture={Assets.get(PASS_TEXTURE_NAMES.static)}
          label='base'
        />
        {segments.map((segment) => (
          <SegmentDirector
            key={`segment-${segment.id}`}
            segment={segment}
            sceneScaleFactor={sceneScaleFactor}
          />
        ))}
        <pixiSprite
          eventMode='none'
          texture={Assets.get(PASS_TEXTURE_NAMES.shadow)}
          blendMode='multiply'
          label='shadow'
        />
      </pixiContainer>
      <pixiContainer label='interactions'>
        <SceneToolbar sceneWidth={sceneWidthPx} scale={scale} />
        {segments.map((segment) => (
          <Marker
            key={`marker-${segment.id}`}
            marker={segment.marker}
            sceneWidth={sceneWidthPx}
            sceneHeight={sceneHeightPx}
            scale={scale}
            isActive={activeSurfaceId === segment.id}
            onClick={() => onSurfaceSelect(segment.id as string)}
          />
        ))}
      </pixiContainer>
    </pixiContainer>
  );
};

export default SceneDirector;
