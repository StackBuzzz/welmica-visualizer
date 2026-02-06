import { Application, extend } from '@pixi/react';
import {
  Container,
  Sprite,
  Graphics,
  PerspectiveMesh,
  MaskFilter,
  Text
} from 'pixi.js';
import { useEffect, useRef, useState, type FunctionComponent } from 'react';
import { isExpandedDoc } from '@/utils/isExpandedDoc';
import LoadingOverlay from '../LoadingOverlay';
import SceneDirector from './SceneDirector';
import { PASS_TEXTURE_NAMES, SCENE_SIZE_LABEL } from './constants';
import { getMaskTextureAlias, getPassUrl } from './helpers';
import styles from './visualizer.module.scss';
import type { SceneData } from './types';
import type { Pass } from '@/payload-types';

// Register Pixi components for JSX usage
extend({
  Container,
  Sprite,
  Graphics,
  PerspectiveMesh,
  MaskFilter,
  Text
});

interface VisualizerProps {
  sceneData: SceneData;
  activeSurfaceId: string;
  onSurfaceSelect: (surfaceId: string) => void;
}

const Visualizer: FunctionComponent<VisualizerProps> = ({
  sceneData,
  onSurfaceSelect,
  activeSurfaceId
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isAssetsLoading, setIsAssetsLoading] = useState(true);
  const {
    static: staticPass,
    reflection: reflectionPass,
    shadow: shadowPass
  } = sceneData.passes;

  useEffect(() => {
    if (containerRef.current) {
      setIsReady(true);
    }
  }, []);

  if (
    !isExpandedDoc<Pass>(staticPass) ||
    !isExpandedDoc<Pass>(reflectionPass) ||
    !isExpandedDoc<Pass>(shadowPass)
  ) {
    console.error('One or more passes are not populated');
    return null;
  }

  const staticPassUrl = getPassUrl(staticPass, SCENE_SIZE_LABEL);
  const reflectionPassUrl = getPassUrl(reflectionPass, SCENE_SIZE_LABEL);
  const shadowPassUrl = getPassUrl(shadowPass, SCENE_SIZE_LABEL);

  const sceneWidthPx = staticPass.sizes?.[SCENE_SIZE_LABEL]?.width as number;
  const sceneHeightPx = staticPass.sizes?.[SCENE_SIZE_LABEL]?.height as number;

  if (!staticPassUrl || !reflectionPassUrl || !shadowPassUrl) {
    console.error('One or more passes are missing urls');
    return null;
  }

  const sceneSegmentMasks = sceneData.segments.map((segment) => segment.mask);

  if (!sceneSegmentMasks.every((mask) => isExpandedDoc<Pass>(mask))) {
    console.error('One or more segments masks are not populated');
    return null;
  }

  const segmentMaskUrls = sceneSegmentMasks.map((mask) =>
    getPassUrl(mask, SCENE_SIZE_LABEL)
  );

  if (!segmentMaskUrls.every((url) => typeof url === 'string')) {
    console.error('One or more segment masks are missing urls');
    return null;
  }

  const sceneAssets = [
    {
      src: staticPassUrl,
      alias: PASS_TEXTURE_NAMES.static
    },
    {
      src: shadowPassUrl,
      alias: PASS_TEXTURE_NAMES.shadow
    },
    {
      src: reflectionPassUrl,
      alias: PASS_TEXTURE_NAMES.reflection
    },
    ...segmentMaskUrls.map((url, index) => ({
      src: url,
      alias: getMaskTextureAlias(sceneData.segments[index].id as string)
    }))
  ];

  const sceneScaleFactor =
    (staticPass.sizes?.[SCENE_SIZE_LABEL]?.width as number) /
    (staticPass.width as number);

  return (
    <div className={styles.container} ref={containerRef}>
      {isReady && containerRef.current && (
        <Application
          resizeTo={containerRef.current}
          antialias
          backgroundAlpha={0}
          autoDensity
          resolution={window.devicePixelRatio || 1}
        >
          <SceneDirector
            segments={sceneData.segments}
            isAssetsLoading={isAssetsLoading}
            setIsAssetsLoading={setIsAssetsLoading}
            sceneAssets={sceneAssets}
            sceneWidthPx={sceneWidthPx}
            sceneHeightPx={sceneHeightPx}
            sceneScaleFactor={sceneScaleFactor}
            onSurfaceSelect={onSurfaceSelect}
            activeSurfaceId={activeSurfaceId}
          />
        </Application>
      )}
      {isAssetsLoading && (
        <LoadingOverlay
          className={styles.loadingOverlay}
          title='Downloading Assets...'
        />
      )}
    </div>
  );
};

export default Visualizer;
