import type { SceneSegments } from '@/payload-types';
import type { FunctionComponent } from 'react';

interface MarkerProps {
  marker: SceneSegments[number]['marker'];
  sceneWidth: number;
  sceneHeight: number;
  scale: number;
  isActive: boolean;
  onClick: () => void;
}

const PILL_HEIGHT = 24;
const PILL_PADDING_X = 8;
const PILL_RADIUS = PILL_HEIGHT / 2;

const Marker: FunctionComponent<MarkerProps> = ({
  marker,
  sceneWidth,
  sceneHeight,
  scale,
  isActive,
  onClick
}) => {
  // Apply scale to position since markers container is not scaled
  const x = (marker.position.x / 100) * sceneWidth * scale;
  const y = (marker.position.y / 100) * sceneHeight * scale;

  // Estimate text width (approximate: 7px per character)
  const textWidth = marker.label.length * 7.5;
  const pillWidth = textWidth + PILL_PADDING_X * 2;

  return (
    <pixiContainer
      x={x}
      y={y}
      eventMode={isActive ? 'none' : 'static'}
      cursor={isActive ? 'default' : 'pointer'}
      onClick={isActive ? undefined : onClick}
      onTap={isActive ? undefined : onClick}
      label={`marker-${marker.label}`}
    >
      {/* Drop shadow */}
      <pixiGraphics
        x={0}
        y={3}
        draw={(g) => {
          g.clear();
          g.roundRect(
            -pillWidth / 2 - 2,
            -PILL_HEIGHT / 2,
            pillWidth + 4,
            PILL_HEIGHT + 2,
            PILL_RADIUS
          );
          g.fill({ color: 0x000000, alpha: 0.15 });
        }}
      />
      {/* Pill background */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          if (isActive) {
            // Active: solid blue with subtle inner glow
            g.roundRect(
              -pillWidth / 2,
              -PILL_HEIGHT / 2,
              pillWidth,
              PILL_HEIGHT,
              PILL_RADIUS
            );
            g.fill({ color: 0x2563eb });
          } else {
            // Inactive: clean white pill
            g.roundRect(
              -pillWidth / 2,
              -PILL_HEIGHT / 2,
              pillWidth,
              PILL_HEIGHT,
              PILL_RADIUS
            );
            g.fill({ color: 0xffffff });
          }
        }}
      />
      {/* Label text */}
      <pixiText
        text={marker.label}
        x={0}
        y={0}
        anchor={0.5}
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 12,
          fontWeight: '400',
          fill: isActive ? 0xffffff : 0x334155
        }}
      />
    </pixiContainer>
  );
};

export default Marker;
