import { get } from 'lodash';
import {
  Container,
  Graphics,
  Rectangle,
  Sprite,
  type Texture,
  type Application
} from 'pixi.js';
import { parse } from 'qs-esm';
import { payloadSDK } from '@/payload/sdk';
import { APPLIED_PRODUCT_PARAM } from '../../constants';
import type { SceneSegments } from '@/payload-types';

type Gravity = SceneSegments[number]['gravity'];

const getCroppingOffset = (
  gravity: Gravity,
  source: { width: number; height: number },
  target: { width: number; height: number }
): { x: number; y: number } => {
  const diffX = source.width - target.width;
  const diffY = source.height - target.height;

  switch (gravity) {
    case 'northwest':
      return { x: 0, y: 0 };
    case 'north':
      return { x: -diffX / 2, y: 0 };
    case 'northeast':
      return { x: -diffX, y: 0 };
    case 'west':
      return { x: 0, y: -diffY / 2 };
    case 'center':
    case 'centre':
      return { x: -diffX / 2, y: -diffY / 2 };
    case 'east':
      return { x: -diffX, y: -diffY / 2 };
    case 'southwest':
      return { x: 0, y: -diffY };
    case 'south':
      return { x: -diffX / 2, y: -diffY };
    case 'southeast':
      return { x: -diffX, y: -diffY };
    default:
      return { x: 0, y: 0 };
  }
};

export const getProductIdFromParams = (
  searchParams: URLSearchParams,
  segmentId: string
): string | null => {
  const parsed = parse(searchParams.toString());
  const value = get(parsed, [APPLIED_PRODUCT_PARAM, segmentId], null);

  if (typeof value === 'string' && value.length > 0) {
    return value;
  }
  return null;
};

export const getProductDataBySlug = async (slug: string) => {
  const { docs } = await payloadSDK.find({
    collection: 'products',
    where: {
      slug: { equals: slug }
    },
    select: {
      properties: true,
      media: { images: true }
    },
    depth: 1
  });

  return docs[0];
};

interface GetGridTextureParams {
  area: {
    width_cm: number;
    height_cm: number;
    gravity: Gravity;
  };
  tile: {
    width_cm: number;
    height_cm: number;
    textures: Texture[];
  };
  groove: {
    thickness_cm: number;
    color: { r: number; g: number; b: number };
  };
  configs: {
    px_per_cm: number;
    resolution: number;
    app: Application;
  };
}

export const getGridTexture = ({
  area,
  tile,
  groove,
  configs
}: GetGridTextureParams): Texture => {
  const { px_per_cm } = configs;
  const area_width_px = area.width_cm * px_per_cm;
  const area_height_px = area.height_cm * px_per_cm;

  const tile_width_px = tile.width_cm * px_per_cm;
  const tile_height_px = tile.height_cm * px_per_cm;

  const groove_thickness_px = groove.thickness_cm * px_per_cm;

  const cols = Math.ceil(area_width_px / tile_width_px);
  const rows = Math.ceil(area_height_px / tile_height_px);

  const container = new Container();

  // add bg color for groove
  if (groove_thickness_px > 0 && (cols > 1 || rows > 1)) {
    const background = new Graphics()
      .rect(0, 0, area_width_px, area_height_px)
      .fill([groove.color.r, groove.color.g, groove.color.b]);
    container.addChild(background);
  }

  // calculate offset for crop.
  const gridWidth = cols * tile_width_px + (cols - 1) * groove_thickness_px;
  const gridHeight = rows * tile_height_px + (rows - 1) * groove_thickness_px;
  const { x: startOffsetX, y: startOffsetY } = getCroppingOffset(
    area.gravity,
    { width: gridWidth, height: gridHeight },
    { width: area_width_px, height: area_height_px }
  );

  // create tiles grid.
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const randomFace =
        tile.textures[Math.floor(Math.random() * tile.textures.length)];
      if (!randomFace) continue;

      const sprite = new Sprite(randomFace);

      // Scale sprite to match product dimensions (assuming 1 unit = 1 px for baking)
      sprite.setSize(tile_width_px, tile_height_px);

      sprite.position.set(
        x * (tile_width_px + groove_thickness_px) + startOffsetX,
        y * (tile_height_px + groove_thickness_px) + startOffsetY
      );

      container.addChild(sprite);
    }
  }

  // Generate texture with explicit frame bounds
  const gridTexture = configs.app.renderer.generateTexture({
    target: container,
    resolution: configs.resolution,
    frame: new Rectangle(0, 0, area_width_px, area_height_px)
  });

  container.destroy({ children: true });

  return gridTexture;
};
