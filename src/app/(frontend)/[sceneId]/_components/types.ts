/**
 * Shared types for the Scene Visualizer page
 */

import type {
  Scene,
  Pass,
  ResponsiveMedia,
  ApplicationArea,
  Product
} from '@/payload-types';
import type { TransformDataWithSelect } from 'payload';

/** Segment with populated relations */
export interface PopulatedSegment {
  id: string;
  gravity: Scene['segments'][number]['gravity'];
  applicationArea: ApplicationArea;
  mask: Pass;
  dimension: {
    width: number;
    height: number;
  };
  marker: {
    label: string;
    position: {
      x: number;
      y: number;
    };
  };
  coordinates: {
    topLeft: { x: number; y: number };
    topRight: { x: number; y: number };
    bottomLeft: { x: number; y: number };
    bottomRight: { x: number; y: number };
  };
}

export type SegmentProductMap = Record<string, string | null>;

/** Scene with all passes and segments populated */
export interface PopulatedScene {
  id: number;
  passes: {
    static: Pass;
    shadow: Pass;
    reflection: Pass;
  };
  segments: PopulatedSegment[];
}

/** Product with populated media and details */
export type PopulatedProduct = TransformDataWithSelect<
  Product,
  {
    properties: {
      width: true;
      height: true;
      glossyness: true;
      roughness: true;
      groove: true;
    };
    media: {
      images: true;
    };
  }
> & {
  media: {
    images: ResponsiveMedia[];
  };
};

// ============================================================================
// State Types
// ============================================================================

/** Map of surface/segment IDs to applied product IDs */
export type AppliedProductsState = Record<string, number | null>;

/** Filter option for dropdowns */
export interface FilterOption {
  id: number;
  label: string;
  slug: string;
}

// ============================================================================
// Utility Functions
// ============================================================================
