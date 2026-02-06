# StackBuzzz Room Visualizer - Expert Code Review

## 📋 Executive Summary

**Overall Assessment: 🟡 Beta Quality - Approaching Production Ready**

The implementation demonstrates solid architectural decisions and follows React/TypeScript best practices. However, there are some areas that need refinement before production deployment.

| Category             | Score | Notes                                                        |
| -------------------- | ----- | ------------------------------------------------------------ |
| **Architecture**     | 8/10  | Clean separation of concerns, good layered approach          |
| **Type Safety**      | 9/10  | Strong TypeScript usage with proper payload type integration |
| **State Management** | 7/10  | URL persistence is good, but needs product cache persistence |
| **Performance**      | 7/10  | Good memoization, but potential memory leaks in some hooks   |
| **Error Handling**   | 5/10  | Minimal error boundaries, no user-facing error states        |
| **Accessibility**    | 4/10  | Limited keyboard navigation, no ARIA labels on canvas        |
| **Testing**          | 0/10  | No tests present                                             |

---

## 🏗️ Architecture Overview

### Component Hierarchy

```
page.tsx (Server Component)
└── Main (Client Component - State Orchestrator)
    ├── Scene
    │   └── RoomCanvas (Dynamic Import, SSR: false)
    │       └── SceneDirector
    │           ├── sprite (Base Layer)
    │           ├── DynamicSurface[] (Per-surface rendering)
    │           │   ├── Pattern MeshPlane
    │           │   ├── Reflection Sprite
    │           │   └── Active Highlight
    │           ├── sprite (Shadow Layer)
    │           └── MarkerOverlay
    │               └── Marker[] (Checkbox graphics)
    │
    └── ProductSelector
        ├── Search/Filter Controls
        └── ProductCard[] or ProductCardSkeleton[]
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                          SERVER                                      │
│  getSceneConfigsById() → PopulatedScene → page.tsx → Main           │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Main)                               │
│                                                                      │
│  URL State: ?products=segId1:prodId1,segId2:prodId2                 │
│       │                                                              │
│       ▼                                                              │
│  parseAppliedProductsFromUrl() → appliedProductIds                  │
│       │                                                              │
│       ▼                                                              │
│  productCache (Product data stored on selection)                     │
│       │                                                              │
│       ├──────────────────────────┬───────────────────────────────┐  │
│       ▼                          ▼                               ▼  │
│  transformSceneToVisualizerData  transformProductToVisualizerData   │
│       │                          │                                   │
│       ▼                          ▼                                   │
│  SceneData ─────────────────► Visualizer ◄────── AppliedProductsMap │
└─────────────────────────────────────────────────────────────────────┘
```

---

## ✅ Strengths

### 1. **Clean Separation of Concerns**

- `types.ts` - Centralized type definitions
- `mappers.ts` - Pure data transformation functions
- `Main` - State orchestration only
- `Scene/Visualizer/*` - Pure rendering logic

### 2. **URL State Persistence**

- Applied products survive page refresh
- Shareable URLs enable collaboration
- Uses Next.js `useSearchParams` correctly

### 3. **Performance Optimizations**

- Heavy `transformSceneToVisualizerData` is memoized
- Dynamic import for PixiJS (SSR-incompatible)
- `useCallback` for handlers to prevent child re-renders
- `usePatternTexture` properly cleans up textures on unmount

### 4. **Layered Rendering Architecture**

The "Hybrid Sandwich" approach is well-implemented:

```
Layer 5: MarkerOverlay (UI)
Layer 4: Shadow (Multiply blend)
Layer 3: Reflection (Screen blend per surface)
Layer 2: Pattern Mesh (Warped, masked)
Layer 1: Base Scene (Static JPEG)
```

### 5. **Type Safety**

- PopulatedScene/PopulatedProduct types match actual API response shape
- Generic utility functions (`getBestImageUrl`, `getThumbnailUrl`)
- Proper type imports with `type` keyword

---

## ⚠️ Issues & Recommendations

### 1. **Critical: Product Cache Not Persisted on Page Reload**

**Problem:** When page refreshes, `productCache` is empty but `appliedProductIds` from URL has values. The visualizer won't show products until they're re-selected.

**Solution:** Either:

- **Option A:** Store product data in URL (but increases URL length)
- **Option B:** Fetch products on mount based on URL IDs
- **Option C:** Use `localStorage` for product cache

**Recommended Fix (Option B):**

```typescript
// In Main component, add:
useEffect(() => {
  const productIdsToFetch = Object.values(appliedProductIds).filter(
    (id): id is number => id !== null && !productCache[id]
  );

  if (productIdsToFetch.length > 0) {
    // Fetch products by IDs and populate cache
    fetchProductsByIds(productIdsToFetch).then((products) => {
      setProductCache((prev) => ({
        ...prev,
        ...Object.fromEntries(products.map((p) => [p.id, p]))
      }));
    });
  }
}, [appliedProductIds]);
```

### 2. **SceneDirector Shadow Layer Placement**

**Problem:** Global shadow is rendered above ALL dynamic surfaces, which means shadows from the base layer might not align with product placement.

**Per Architecture Spec Issue:** The spec states "Shadow layer should be HIDDEN if no product applied to avoid double shadows." Currently it's always visible.

**Fix:**

```typescript
// In SceneDirector, conditionally render shadow:
const hasAnyProduct = Object.keys(appliedProducts).length > 0;

{hasAnyProduct && (
  <sprite texture={shadowTex} blendMode='multiply' alpha={0.8} />
)}
```

### 3. **Missing Error Boundaries**

**Problem:** No React Error Boundaries exist. A failure in PixiJS could crash the entire page.

**Fix:** Add `ErrorBoundary` around `RoomCanvas`:

```typescript
// Scene/index.tsx
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary fallback={<CanvasErrorFallback />}>
  <RoomCanvas ... />
</ErrorBoundary>
```

### 4. **Missing Loading State in `getSceneConfigsById`**

**Problem:** If scene fetch fails (404, network error), `notFound()` is called, but user sees no feedback.

**Fix:** Add proper error handling and loading UI in page.tsx.

### 5. **usePatternTexture Memory Leak Risk**

**Problem:** The hook creates textures in a `useEffect` but if the component unmounts during async texture loading, cleanup may not happen properly.

**Current Code:**

```typescript
let isMounted = true;
// ... async work
return () => { isMounted = false; ... cleanup };
```

**This is correct** but the cleanup only destroys `currentRenderTexture` and `currentLoadedTextures`. If the effect re-runs before completion of previous run, there could be orphaned textures.

**Improvement:** Use AbortController pattern for fetch cancellation.

### 6. **No Accessibility for Canvas**

**Problem:** PixiJS canvas is not accessible. Screen readers cannot navigate surfaces.

**Partial Fix:** Add ARIA labels to the container:

```tsx
<div
  className={styles.canvasWrapper}
  role="application"
  aria-label="Room Visualizer - Click surfaces to apply products"
>
```

### 7. **ProductSelector Filter Logic**

**Minor Issue:** When `applicationAreaId` is null (no surface selected), all products are shown unfiltered. This might be intentional but should be documented.

---

## 🔧 Refactoring Recommendations

### 1. Extract Custom Hooks from Main

**Current:** Main has ~200 lines with URL parsing, caching, and transformation logic inline.

**Recommended:** Extract into custom hooks:

```typescript
// hooks/useAppliedProducts.ts
export function useAppliedProducts(segmentIds: string[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const appliedProductIds = useMemo(...);
  const [productCache, setProductCache] = useState(...);

  const setProductForSurface = useCallback((surfaceId, product) => {
    // Update cache and URL
  }, [...]);

  const visualizerProducts = useMemo(...);

  return { appliedProductIds, visualizerProducts, setProductForSurface, productCache };
}
```

### 2. Create Dedicated Marker Component

**Current:** `MarkerOverlay` has both Marker and MarkerOverlay in same file.

**Recommended:** Split into:

- `Marker/index.tsx` - Single marker with draw logic
- `MarkerOverlay/index.tsx` - Container that maps surfaces to markers

### 3. Constants File for Visualizer

**Current:** Magic numbers scattered across files (MARKER_SIZE, PIXEL_SCALE, etc.)

**Recommended:** Consolidate in `Visualizer/constants.ts`:

```typescript
export const VISUALIZER_CONSTANTS = {
  PIXEL_SCALE: 20,
  MARKER_SIZE: 24,
  MARKER_BORDER_WIDTH: 2,
  DEFAULT_SHADOW_ALPHA: 0.8
  // ...
} as const;
```

---

## 📐 Visualizer Component Roles Explained

### Page Flow

1. **`page.tsx`** (Server Component)
   - Fetches scene data from PayloadCMS
   - Validates scene exists (404 if not)
   - Passes `PopulatedScene` to Main

2. **`Main`** (Client Component - Orchestrator)
   - Manages URL state for applied products
   - Maintains product cache (to avoid re-fetching)
   - Transforms CMS data → Visualizer data
   - Coordinates Scene and ProductSelector

3. **`Scene`** (Wrapper)
   - Provides header UI (Change Environment button)
   - Dynamically imports RoomCanvas (SSR unsafe)

4. **`RoomCanvas`** (Pixi Application Container)
   - Initializes PixiJS Application
   - Registers custom elements (extend())
   - Provides SSR fallback

5. **`SceneDirector`** (Render Orchestrator)
   - Loads global textures (base, shadow, reflection)
   - Controls layer order (z-index)
   - Maps surfaces to DynamicSurface components

6. **`DynamicSurface`** (Per-Surface Renderer)
   - Generates procedural pattern from product faces
   - Applies perspective warp via MeshPlane
   - Handles masking, reflection, highlight

7. **`MarkerOverlay`** (UI Layer)
   - Draws checkbox markers at surface centroids
   - Handles click events for surface selection

8. **`ProductSelector`** (Product Browser)
   - Fetches products client-side (infinite scroll)
   - Provides search and filter controls
   - Shows loading skeletons during fetch

### Rendering Pipeline (Per Frame)

```
1. RoomCanvas renders Application
   │
   ├─ SceneDirector loads base/shadow/reflection textures (once)
   │
   ├─ For each surface with applied product:
   │   │
   │   ├─ usePatternTexture generates tiled pattern
   │   │   └─ Creates RenderTexture from tile faces
   │   │
   │   ├─ DynamicSurface renders:
   │   │   ├─ Masked MeshPlane with warped pattern
   │   │   ├─ Reflection overlay (screen blend)
   │   │   └─ Active highlight (if selected)
   │   │
   │   └─ Texture cleanup on product change
   │
   ├─ Shadow layer (multiply blend)
   │
   └─ MarkerOverlay draws checkbox graphics
```

---

## 🚀 Production Readiness Checklist

| Requirement               | Status | Action Needed                                    |
| ------------------------- | ------ | ------------------------------------------------ |
| TypeScript errors fixed   | ✅     | Done                                             |
| Dead code removed         | ✅     | Done (FilterButton, ShareDropdown, getLinkProps) |
| Product cache persistence | ✅     | useProductsByIds hook fetches products on mount  |
| Error boundaries          | ✅     | VisualizerErrorBoundary added                    |
| Loading states            | ✅     | Skeletons implemented                            |
| Shadow layer logic        | ✅     | Hidden when no products applied                  |
| Accessibility             | ✅     | ARIA labels added to canvas wrapper              |
| Unit tests                | ❌     | Add tests for mappers, hooks, components         |
| E2E tests                 | ❌     | Add Playwright tests for main flow               |
| Memory leak audit         | ⚠️     | Review usePatternTexture cleanup                 |
| Performance profiling     | ❌     | Profile with React DevTools + Pixi Inspector     |
| Mobile testing            | ❌     | Test touch interactions on devices               |

---

## 🎯 Priority Actions

### P0 (Critical - Before Launch)

1. Fix product cache not persisting on page reload
2. Add Error Boundary around RoomCanvas

### P1 (Important)

3. Conditionally hide shadow layer when no products applied
4. Add basic unit tests for `mappers.ts` functions

### P2 (Nice to Have)

5. Extract `useAppliedProducts` hook from Main
6. Add ARIA labels for accessibility
7. Profile and optimize usePatternTexture
