import { Assets } from 'pixi.js';
import { useCallback, useEffect, useState } from 'react';
import type { Texture } from 'pixi.js';
import type { FunctionComponent } from 'react';

interface IconButtonProps {
  x: number;
  y: number;
  icon: string; // SVG import (url string)
  onClick: () => void;
  disabled?: boolean;
  size?: number;
}

const BUTTON_SIZE = 36;
const BORDER_RADIUS = 4;
const ICON_SIZE = 12;
const BG_COLOR = 0x000000;
const BG_ALPHA = 0.5;
const BG_ALPHA_HOVER = 0.7;

const IconButton: FunctionComponent<IconButtonProps> = ({
  x,
  y,
  icon,
  onClick,
  disabled = false,
  size = BUTTON_SIZE
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [iconTexture, setIconTexture] = useState<Texture | null>(null);

  // Load SVG as texture
  useEffect(() => {
    let cancelled = false;

    const loadTexture = async () => {
      try {
        // Check if already cached
        const cached = Assets.cache.get(icon);
        if (cached) {
          if (!cancelled) setIconTexture(cached);
          return;
        }

        // Load the SVG
        const texture = await Assets.load<Texture>(icon);
        if (!cancelled) setIconTexture(texture);
      } catch (error) {
        console.error('Failed to load icon:', error);
      }
    };

    loadTexture();

    return () => {
      cancelled = true;
    };
  }, [icon]);

  const handlePointerEnter = useCallback(() => {
    if (!disabled) setIsHovered(true);
  }, [disabled]);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled) onClick();
  }, [disabled, onClick]);

  const bgAlpha = isHovered ? BG_ALPHA_HOVER : BG_ALPHA;

  return (
    <pixiContainer
      x={x}
      y={y}
      eventMode={disabled ? 'none' : 'static'}
      cursor={disabled ? 'default' : 'pointer'}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      onTap={handleClick}
      alpha={disabled ? 0.5 : 1}
    >
      {/* Background - square with rounded corners */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.roundRect(-size / 2, -size / 2, size, size, BORDER_RADIUS);
          g.fill({ color: BG_COLOR, alpha: bgAlpha });
        }}
      />
      {/* Icon sprite */}
      {iconTexture && (
        <pixiSprite
          texture={iconTexture}
          anchor={0.5}
          width={ICON_SIZE}
          height={ICON_SIZE}
        />
      )}
    </pixiContainer>
  );
};

export default IconButton;
