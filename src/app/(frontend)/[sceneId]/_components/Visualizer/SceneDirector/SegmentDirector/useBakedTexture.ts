/* eslint-disable react-hooks/exhaustive-deps */
import { useApplication } from '@pixi/react';
import { Assets, Container, PerspectiveMesh, Sprite, Texture } from 'pixi.js';
import { useEffect, useMemo, useState } from 'react';
import { PASS_TEXTURE_NAMES } from '../../constants';
import { getMaskTextureAlias } from '../../helpers';
import useTextures from '../../useTextures';
import { getGridTexture } from './helpers';
import type { Product, SceneSegments } from '@/payload-types';

interface UseBakedTextureProps {
  segment: SceneSegments[number];
  productTextureUrls: string[];
  productProperties: Product['properties'] | null;
  productId: string | null;
  sceneScaleFactor: number;
}

const PX_PER_CM = 3;
const DEFAULT_GROOVE_COLOR = 0;
const PERSPECTIVE_MESH_VERTICES = 25;
const GRID_TEXTURE_RESOLUTION = 1;
const BAKED_TEXTURE_RESOLUTION = 1;

const useBakedTexture = ({
  sceneScaleFactor,
  productId,
  productTextureUrls,
  ...props
}: UseBakedTextureProps) => {
  const segmentConfigs = useMemo(
    () => props.segment,
    [props.segment.id as string]
  );
  const productConfigs = useMemo(() => props.productProperties, [productId]);
  const { app, isInitialised } = useApplication();
  const productTextures = useTextures(productTextureUrls);
  const [bakedTexture, setBakedTexture] = useState<Texture>(Texture.EMPTY);

  useEffect(() => {
    if (
      !productConfigs ||
      !productTextures.every((texture) => !!texture) ||
      !app.renderer ||
      !isInitialised
    ) {
      return;
    }

    const reflectionTexture = Assets.get(
      PASS_TEXTURE_NAMES.reflection
    ) as Texture | null;

    if (!reflectionTexture) {
      console.error('Reflection texture is not available');
      return;
    }

    const grooveSizeMM = productConfigs.groove?.thickness || 0;
    const grooveSizeCM = grooveSizeMM / 10;

    const gridTexture = getGridTexture({
      area: {
        width_cm: segmentConfigs.dimension.width,
        height_cm: segmentConfigs.dimension.height,
        gravity: segmentConfigs.gravity
      },
      tile: {
        width_cm: productConfigs.width,
        height_cm: productConfigs.height,
        textures: productTextures
      },
      groove: {
        thickness_cm: grooveSizeCM,
        color: {
          r: productConfigs.groove?.r ?? DEFAULT_GROOVE_COLOR,
          g: productConfigs.groove?.g ?? DEFAULT_GROOVE_COLOR,
          b: productConfigs.groove?.b ?? DEFAULT_GROOVE_COLOR
        }
      },
      configs: {
        px_per_cm: PX_PER_CM,
        resolution: GRID_TEXTURE_RESOLUTION,
        app
      }
    });

    const container = new Container();

    // apply perspective to baked texture.
    const { topLeft, topRight, bottomLeft, bottomRight } =
      segmentConfigs.coordinates;
    const perspectiveMesh = new PerspectiveMesh({
      texture: gridTexture,
      verticesX: PERSPECTIVE_MESH_VERTICES,
      verticesY: PERSPECTIVE_MESH_VERTICES,
      x0: topLeft.x * sceneScaleFactor,
      y0: topLeft.y * sceneScaleFactor,
      x1: topRight.x * sceneScaleFactor,
      y1: topRight.y * sceneScaleFactor,
      x2: bottomRight.x * sceneScaleFactor,
      y2: bottomRight.y * sceneScaleFactor,
      x3: bottomLeft.x * sceneScaleFactor,
      y3: bottomLeft.y * sceneScaleFactor
    });

    container.addChild(perspectiveMesh);

    // add reflection.
    const reflectionSprite = new Sprite(reflectionTexture);
    reflectionSprite.blendMode = 'screen';
    reflectionSprite.alpha = productConfigs.glossyness;
    container.addChild(reflectionSprite);

    // Create mask sprite - must be a child for generateTexture to work, but set invisible so it doesn't draw its own texture
    const maskSprite = new Sprite(
      Assets.get(getMaskTextureAlias(segmentConfigs.id as string))
    );
    maskSprite.renderable = false;
    container.addChild(maskSprite);
    container.mask = maskSprite;

    // generate texture.
    const bakedTexture = app.renderer.generateTexture({
      target: container,
      resolution: BAKED_TEXTURE_RESOLUTION
    });

    setBakedTexture(bakedTexture);

    // Cleanup render resources (not the baked texture which we're returning)
    container.destroy({ children: true });
    gridTexture.destroy();

    // Cleanup texture when hook unmounts or deps change
    return () => {
      setBakedTexture(Texture.EMPTY);
      bakedTexture.destroy();
    };
  }, [
    segmentConfigs,
    productConfigs,
    sceneScaleFactor,
    productTextures,
    app,
    isInitialised
  ]);

  return bakedTexture;
};

export default useBakedTexture;
