import { useApplication } from '@pixi/react';
import { useEffect, useState } from 'react';

interface SceneTransform {
  offsetX: number;
  offsetY: number;
  scale: number;
}

const useSceneTransform = (
  sceneWidth: number,
  sceneHeight: number
): SceneTransform => {
  const { app, isInitialised } = useApplication();

  const [transform, setTransform] = useState<SceneTransform>({
    offsetX: 0,
    offsetY: 0,
    scale: 0
  });

  useEffect(() => {
    if (!isInitialised) return;

    const { renderer, screen } = app;

    const calculateTransform = () => {
      const screenW = screen.width;
      const screenH = screen.height;

      // Calculate scale to fit (contain)
      const scaleX = screenW / sceneWidth;
      const scaleY = screenH / sceneHeight;
      const scale = Math.min(scaleX, scaleY);

      // Center offset
      const scaledW = sceneWidth * scale;
      const scaledH = sceneHeight * scale;
      const offsetX = (screenW - scaledW) / 2;
      const offsetY = (screenH - scaledH) / 2;

      setTransform({ offsetX, offsetY, scale });
    };

    // initial call.
    calculateTransform();

    // Listen for both resize events
    renderer.on('resize', calculateTransform);

    return () => {
      renderer.off('resize', calculateTransform);
    };
  }, [sceneWidth, sceneHeight, isInitialised, app]);

  return transform;
};

export default useSceneTransform;
