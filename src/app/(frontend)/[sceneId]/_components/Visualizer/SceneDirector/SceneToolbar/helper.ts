import {
  Fancybox,
  type ToolbarOptions,
  type FancyboxOptions
} from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import type { Application, Container } from 'pixi.js';

/**
 * Extracts the visualizer scene as a JPEG blob
 * @param app - PixiJS Application instance
 * @param resolution - Canvas resolution multiplier (default: 1)
 * @returns Promise resolving to Blob or null if extraction fails
 */
export const getSceneJPG = async (
  app: Application,
  resolution: number = 1
): Promise<Blob | null> => {
  const scene = app.stage.getChildByLabel('scene', true) as Container;

  if (!scene) {
    console.error('Scene container not found');
    return null;
  }

  const canvas = app.renderer.extract.canvas({
    target: scene,
    resolution
  }) as HTMLCanvasElement;

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', 0.8);
  });

  return blob;
};

/**
 * Generates a timestamped filename for scene export
 * @returns Filename string like "scene-20260205-163402.jpg"
 */
const getSceneFilename = (): string => {
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/[:-]/g, '')
    .replace('T', '-')
    .slice(0, 15);
  return `scene-${timestamp}.jpg`;
};

/**
 * Downloads an image blob as a JPG file
 * @param image - Blob to download
 */
export const downloadSceneJPG = async (image: Blob): Promise<void> => {
  const url = URL.createObjectURL(image);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = getSceneFilename();
  anchor.click();
  URL.revokeObjectURL(url);
};

/**
 * Extended Fancybox options with Carousel plugin configurations
 * The base FancyboxOptions type doesn't include Carousel plugin options
 */
interface ExtendedFancyboxOptions extends Partial<FancyboxOptions> {
  Carousel?: {
    Toolbar?: Partial<ToolbarOptions>;
    Fullscreen?: { autoStart: boolean };
  };
}

/**
 * Opens an image URL in Fancybox fullscreen viewer with zoom/pan/rotate
 * @param url - Image URL to display
 * @param onDestroy - Optional callback when Fancybox closes
 */
export const viewInFullscreen = (url: string, onDestroy?: () => void): void => {
  const options: ExtendedFancyboxOptions = {
    Carousel: {
      Fullscreen: { autoStart: true },
      Toolbar: {
        display: {
          left: [],
          middle: [],
          right: ['rotateCCW', 'rotateCW', 'toggle1to1', 'fullscreen', 'close']
        }
      }
    },
    on: {
      destroy: () => {
        onDestroy?.();
      }
    }
  };

  Fancybox.show(
    [{ src: url, type: 'image' as const }],
    options as Partial<FancyboxOptions>
  );
};
