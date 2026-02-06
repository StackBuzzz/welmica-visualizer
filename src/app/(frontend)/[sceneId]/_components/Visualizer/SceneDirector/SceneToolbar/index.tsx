import { useApplication } from '@pixi/react';
import { useCallback, useState } from 'react';
import IconButton from '../IconButton';
import downloadIcon from './download.svg';
import fullscreenIcon from './full-screen.svg';
import { downloadSceneJPG, getSceneJPG, viewInFullscreen } from './helper';
import type { FunctionComponent } from 'react';

interface SceneToolbarProps {
  sceneWidth: number;
  scale: number;
}

const BUTTON_SIZE = 36;
const PADDING = 8;
const GAP = 8;

const SceneToolbar: FunctionComponent<SceneToolbarProps> = ({
  sceneWidth,
  scale
}) => {
  const { app, isInitialised } = useApplication();
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!isInitialised || isExporting) return;

    setIsExporting(true);
    try {
      const blob = await getSceneJPG(app);
      if (blob) {
        await downloadSceneJPG(blob);
      }
    } finally {
      setIsExporting(false);
    }
  }, [app, isInitialised, isExporting]);

  const handleFullscreen = useCallback(async () => {
    if (!isInitialised || isExporting) return;

    setIsExporting(true);
    try {
      const blob = await getSceneJPG(app);

      if (!blob) {
        console.error('Failed to create image blob');
        return;
      }

      const url = URL.createObjectURL(blob);

      // Open in Fancybox with proper types and rotate toolbar
      viewInFullscreen(url, () => {
        URL.revokeObjectURL(url);
      });
    } finally {
      setIsExporting(false);
    }
  }, [app, isInitialised, isExporting]);

  // Position at top-right of scaled scene
  const baseX = sceneWidth * scale - PADDING - BUTTON_SIZE / 2;
  const baseY = PADDING + BUTTON_SIZE / 2;

  return (
    <pixiContainer label='toolbar' x={baseX} y={baseY}>
      <IconButton
        x={0}
        y={0}
        icon={fullscreenIcon.src}
        onClick={handleFullscreen}
        disabled={isExporting}
      />
      <IconButton
        x={-(BUTTON_SIZE + GAP)}
        y={0}
        icon={downloadIcon.src}
        onClick={handleDownload}
        disabled={isExporting}
      />
    </pixiContainer>
  );
};

export default SceneToolbar;
