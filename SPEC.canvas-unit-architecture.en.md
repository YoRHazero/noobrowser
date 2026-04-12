# Canvas Unit Architecture Spec

## Purpose

This document defines the architecture rules for reusable canvas / WebGL / Three.js visualization units under `src/canvas/*`.

Canvas rendering has its own structure: scene infrastructure, layers, renderable objects, camera behavior, pointer resolution, and hit testing. These concepts should not be forced into the normal `parts/` / `components/` model used by feature components.

A Canvas Unit owns rendering mechanics. A parent feature owns business data composition.

## Relationship To Feature Units

Canvas Units are not Feature Units.

Feature Units live under:

```text
src/features/<feature>/
```

Canvas Units live under:

```text
src/canvas/<canvasUnit>/
```

Do not put reusable Canvas Units under:

```text
src/features/canvas/
```

`canvas` is a rendering layer, not a business feature.

## Naming

Canvas Unit directories and root components should end with `Canvas`.

Example:

```text
src/canvas/mapCanvas/
  MapCanvas.tsx
  useMapCanvas.ts
```

The suffix is intentional. It signals that this unit follows Canvas Unit rules, not Feature Component rules.

## Standard Structure

```text
src/canvas/<canvasUnit>/
  index.tsx
  api.ts
  <CanvasUnit>.tsx
  <CanvasUnit>.recipe.ts
  use<CanvasUnit>.ts

  shared/
    constants.ts
    types.ts

  core/
    CameraRig.tsx
    SceneEnvironment.tsx

  layers/
    FootprintsLayer.tsx
    SourcesLayer.tsx
    GraticuleLayer.tsx

  objects/
    FootprintMesh.tsx
    SourceMarker.tsx
    GraticuleLines.tsx

  overlays/
    CoordinateTooltip.tsx
    FootprintTooltip.tsx
    GraticuleTooltip.tsx

  hooks/
    useOverlayState.ts
    useTooltipViewModel.ts

  canvasHooks/
    useCameraFlight.ts
    usePointerResolver.ts
    useLayerHoverResolver.ts

  utils/
    index.ts
    projection.ts
    geometry.ts

  store/
    index.ts
    interactionSlice.ts
```

Required files:

- `index.tsx`
- `api.ts`
- `<CanvasUnit>.tsx`
- `use<CanvasUnit>.ts`

Optional files / directories:

- `<CanvasUnit>.recipe.ts`
- `shared/`
- `core/`
- `layers/`
- `objects/`
- `overlays/`
- `hooks/`
- `canvasHooks/`
- `utils/`
- `store/`

Do not create empty directories preemptively.

## Public Entry

`index.tsx` is the only public import boundary for a Canvas Unit.

Rules:

- `index.tsx` should directly export or render `<CanvasUnit />`.
- `index.tsx` should re-export public API types from `api.ts`.
- `index.tsx` must not call `use<CanvasUnit>()`.
- `index.tsx` must not create, transform, or inject scene models.
- Consumers import only from the Canvas Unit public entry.

Allowed:

```ts
import MapCanvas, {
  type MapCanvasActions,
  type MapCanvasModel,
} from "@/canvas/mapCanvas";
```

Forbidden:

```ts
import { FootprintsLayer } from "@/canvas/mapCanvas/layers/FootprintsLayer";
import type { MapCanvasModel } from "@/canvas/mapCanvas/api";
```

`api.ts` defines the public contract, but external callers should receive that contract through `index.tsx`.

## `api.ts`

`api.ts` contains the Canvas Unit public contract.

Allowed:

- `<CanvasUnit>Model`
- `<CanvasUnit>Actions`
- model item types used by `<CanvasUnit>Model`
- action parameter types used by `<CanvasUnit>Actions`
- public enum / union types used by the model or actions

Example:

```ts
export interface MapCanvasModel {
  footprints: MapCanvasFootprintModel[];
  sources: MapCanvasSourceModel[];
  selectedFootprintId: string | null;
  showGrid: boolean;
  tooltipMode: MapCanvasTooltipMode;
  coordinatePrecision: number;
}

export interface MapCanvasActions {
  selectFootprint: (id: string | null) => void;
}

export interface MapCanvasFootprintModel {
  id: string;
  vertices: MapCanvasSkyCoordinate[];
  center: MapCanvasSkyCoordinate;
  files: string[];
}

export interface MapCanvasSourceModel {
  id: string;
  label?: string;
  coordinate: MapCanvasSkyCoordinate;
  color: string;
  visible: boolean;
}

export interface MapCanvasSkyCoordinate {
  ra: number;
  dec: number;
}

export interface MapCanvasScreenPoint {
  x: number;
  y: number;
}

export type MapCanvasTooltipMode = "footprint" | "coordinate";
```

Rules:

- Any type that appears in `<CanvasUnit>Model` or `<CanvasUnit>Actions` must be defined or re-exported from `api.ts`.
- `api.ts` must not import feature stores.
- `api.ts` must not import query hooks.
- `api.ts` must not import Canvas Unit private store types.
- `api.ts` should not expose internal render-only types that parents do not need.

## Props Boundary

Canvas Units may receive business data through props, but only through typed `model` and `actions` objects.

Allowed:

```tsx
<MapCanvas model={mapCanvasModel} actions={mapCanvasActions} />
```

Forbidden:

```tsx
<MapCanvas
  footprints={footprints}
  sources={sources}
  selectedFootprintId={selectedFootprintId}
  showGrid={showGrid}
  tooltipMode={tooltipMode}
  coordinatePrecision={coordinatePrecision}
  onSelectFootprint={setSelectedFootprintId}
/>
```

Do not pass scattered business props. Group scene data into `model` and event callbacks into `actions`.

Allowed config props are limited to identity or mounting configuration that is not business data:

```tsx
<MapCanvas model={model} actions={actions} viewportRole="overview" />
```

Avoid config props unless they are truly stable and generic.

## External Data Boundary

Canvas Units must not directly read external business stores or query hooks.

Forbidden inside `src/canvas/<canvasUnit>/`:

```ts
useSourceStore(...)
useGrismStore(...)
useOverviewStore(...)
useOverviewUiStore(...)
useQuery(...)
useGrismFootprints(...)
```

The parent feature owns business data composition.

Example:

```text
src/features/overview/useOverview.ts
  -> reads query hooks and stores
  -> creates MapCanvasModel and MapCanvasActions
  -> passes them to <MapCanvas model={model} actions={actions} />
```

The Canvas Unit owns rendering behavior only.

## Private Store

Canvas Units may have a private `store/`.

Canvas Unit store is only for internal rendering / interaction state whose lifecycle is bounded by the Canvas Unit.

Allowed examples:

```ts
cameraMode
currentZoomLevel
isDragging
hoveredObjectId
pointerAnchor
renderDebugEnabled
transientSelectionId
```

Forbidden examples:

```ts
sources
footprints
selectedFootprintId
activeSourceId
query result data
fit job state
overview sidebar state
```

Rules:

- `store/` is private to the Canvas Unit.
- Only files inside `src/canvas/<canvasUnit>/` may import `src/canvas/<canvasUnit>/store`.
- Parent features must not import Canvas Unit store.
- Other Canvas Units must not import this store.
- Do not mirror external business store state into Canvas Unit store.
- Do not copy TanStack Query data into Canvas Unit store.

## `shared/`

`shared/` contains Canvas Unit internal shared definitions.

Allowed:

```text
shared/
  constants.ts
  types.ts
```

`shared/types.ts` is internal to the Canvas Unit. External callers should not import it.

Allowed content:

- internal coordinate types
- internal render object types
- layer-private-but-shared types
- internal geometry / projection types
- aliases derived from `api.ts` when useful

Example:

```ts
import type {
  MapCanvasScreenPoint,
  MapCanvasSkyCoordinate,
} from "../api";

export type SkyCoordinate = MapCanvasSkyCoordinate;
export type ScreenPoint = MapCanvasScreenPoint;

export interface CartesianCoordinate {
  x: number;
  y: number;
  z: number;
}
```

Forbidden:

- component props
- hook result types
- query response types
- feature store types imported from `src/features/*`
- public model/action contract types that are not exported from `api.ts`

## `utils/`

`utils/` contains pure functions only.

Rules:

- One utility concern per file.
- `index.ts` re-exports public utilities.
- No React hooks.
- No store reads.
- No query calls.
- No module-level mutable runtime state.
- No component prop types.
- No business constants or types defined inside `utils/`.
- Utilities may import only native types, `api.ts` public contract types when needed, and Canvas Unit `shared/types.ts` / `shared/constants.ts`.

## `hooks/`

`hooks/` contains Canvas Unit internal hooks that do not depend on the active Canvas renderer context.

Allowed:

- overlay state hooks
- tooltip view-model hooks
- renderer-context-free derived state hooks
- pure React lifecycle hooks that can safely run outside `<Canvas>`

Forbidden:

- any hook that requires the active Canvas renderer context, including renderer-specific hooks such as R3F's `useThree`, `useFrame`, `useLoader`, or `useGraph`
- importing renderer context hooks, for example R3F context hooks from `@react-three/fiber`
- external business store reads
- query hooks
- mutation hooks
- feature hooks from `src/features/*`
- app-level workflow orchestration
- cross-feature synchronization

Hooks may read the Canvas Unit private store.

Hooks may receive scene model slices as parameters from `use<CanvasUnit>.ts`.

If a hook can only work when a component is mounted under `<Canvas>`, it must not live in `hooks/`; put it in `canvasHooks/`.

## `canvasHooks/`

`canvasHooks/` contains hooks that require the active Canvas renderer context or are semantically tied to the Canvas render lifecycle.

Allowed:

- camera lifecycle hooks that need Canvas context
- pointer event hooks that read `gl.domElement`, camera, viewport, or renderer state
- hit testing hooks that use renderer camera / viewport / frame lifecycle
- projection / viewport hooks that need React or renderer lifecycle
- RAF loop hooks
- internal animation state hooks tied to the Canvas render loop

Rules:

- `canvasHooks/` is the only place where Canvas Unit code may define hooks that call renderer Canvas-context hooks, for example R3F's `useThree`, `useFrame`, `useLoader`, or `useGraph`.
- `canvasHooks/` hooks may only be called by components mounted inside `<Canvas>` or by hooks in the same Canvas-internal call chain.
- `<CanvasUnit>.tsx` must not call `canvasHooks/` hooks when it executes outside `<Canvas>`.
- `use<CanvasUnit>.ts` must not call `canvasHooks/` hooks when it executes outside `<Canvas>`.
- If Canvas-internal state must be shown by an overlay outside `<Canvas>`, a Canvas-internal component should publish that state through callbacks or the Canvas Unit private store.
- Shared state types used by both outer overlay hooks and `canvasHooks/` must live in `shared/types.ts`, not inside `canvasHooks/`.

Forbidden:

- external business store reads
- query hooks
- mutation hooks
- feature hooks from `src/features/*`
- parent feature orchestration

## `core/`

`core/` contains scene infrastructure.

Allowed examples:

```text
CameraRig.tsx
SceneEnvironment.tsx
RendererConfig.tsx
ControlsRig.tsx
```

Rules:

- `core/` is not a business layer.
- `core/` may use Canvas Unit `hooks/` and `canvasHooks/`.
- `core/` may receive props derived from the scene model.
- `core/` must not read external business stores or query hooks.
- `core/` must not import parent feature internals.

## `layers/`

`layers/` contains scene-level render layers.

Allowed examples:

```text
GlobeLayer.tsx
GraticuleLayer.tsx
FootprintsLayer.tsx
SourcesLayer.tsx
```

Rules:

- A layer composes objects.
- A layer receives data through props from `<CanvasUnit>.tsx`.
- A layer must not read external business stores or query hooks.
- A layer must not import sibling layers.
- A layer may import objects, Canvas Unit `hooks/`, Canvas Unit `canvasHooks/`, Canvas Unit utils, and Canvas Unit shared types/constants.
- A layer may contain layer-specific render logic, but should avoid owning broad business workflows.

## `objects/`

`objects/` contains low-level renderable objects.

Allowed examples:

```text
GlobeSphere.tsx
FootprintMesh.tsx
SourceMarker.tsx
GraticuleLines.tsx
```

Rules:

- Objects receive all data through props.
- Objects must not read stores.
- Objects must not call queries or mutations.
- Objects must not import parent feature code.
- Objects may import Canvas Unit public API types, shared types/constants, and utils.
- Objects may call `canvasHooks/` hooks only when the effect is intrinsic to the object's rendering behavior.
- Objects must not define or import renderer Canvas-context hooks directly, for example R3F's `useThree` / `useFrame`; context-bound hook logic belongs in `canvasHooks/`.
- Objects should stay reusable within the Canvas Unit.

## `overlays/`

`overlays/` contains Canvas-owned DOM UI that is rendered above or around the canvas surface.

Allowed examples:

```text
CoordinateTooltip.tsx
FootprintTooltip.tsx
GraticuleTooltip.tsx
SelectionHud.tsx
```

Rules:

- Overlays are still part of the Canvas Unit, not parent feature UI.
- Overlays receive display-ready data through props from `<CanvasUnit>.tsx` or `use<CanvasUnit>.ts`.
- Overlay view-model derivation belongs in `use<CanvasUnit>.ts` or `hooks/`, not inside overlay TSX.
- Pure formatting, coordinate conversion, tooltip positioning math, and truncation helpers belong in `utils/`, not inline in `<CanvasUnit>.tsx`.
- DOM measurement needed by overlays, such as container rect reads, belongs in `hooks/`, not inline in `<CanvasUnit>.tsx`.
- Overlays must not read external business stores or query hooks.
- Overlays must not import parent feature internals.
- Overlays must not call `canvasHooks/` or any renderer Canvas-context hook.
- If an overlay needs static DOM/CSS styling beyond the root recipe, it may own a sibling recipe file using the same recipe rules.

## `<CanvasUnit>.tsx`

`<CanvasUnit>.tsx` owns render tree composition.

Allowed:

- call `use<CanvasUnit>()`
- render the canvas root
- assemble `core/`, `layers/`, and `overlays/`
- pass scene model slices and actions to layers / core components
- use `<CanvasUnit>.recipe.ts` for directly owned root layout styles

Forbidden:

- inline tooltip / overlay view-model derivation
- inline coordinate formatting or tooltip positioning helpers
- inline DOM measurement for overlay layout, such as direct `getBoundingClientRect()` reads
- directly call external business stores
- directly call query hooks
- implement parent feature workflows
- import parent feature internals
- become a broad business view-model builder

## `use<CanvasUnit>.ts`

`use<CanvasUnit>.ts` composes the Canvas Unit view model from props and internal canvas state.

Allowed:

- receive `model` and `actions` props
- derive layer props
- call Canvas Unit `hooks/` hooks
- read Canvas Unit private store
- prepare callbacks passed to layers / objects

Forbidden:

- calling `canvasHooks/` hooks when `use<CanvasUnit>.ts` executes outside `<Canvas>`
- directly or indirectly calling renderer Canvas-context hooks outside `<Canvas>`, for example R3F's `useThree` / `useFrame`
- direct external business store reads
- query hooks / mutation hooks
- copying query results into Canvas Unit store
- parent feature orchestration
- direct long-lived lifecycle logic that belongs in `hooks/` or `canvasHooks/`

## Recipes

Canvas Units follow the same recipe rules as Feature Units.

Rules:

- Do not create a `recipes/` directory.
- `<CanvasUnit>.tsx` may use sibling `<CanvasUnit>.recipe.ts`.
- A layer or object may own a sibling recipe only when it has significant static DOM/CSS styling.
- Pure Three.js material / geometry values do not need recipe files.
- TSX may pass runtime values such as coordinates, transforms, material colors, or CSS variables inline when they are rendering data.
- Static DOM/CSS visual rules should live in recipes.

## Parent Feature Integration

A parent feature integrates a Canvas Unit by building `model` and `actions`.

Example:

```text
src/features/overview/
  useOverview.ts
  Overview.tsx
```

```tsx
<MapCanvas model={mapCanvasModel} actions={mapCanvasActions} />
```

Rules:

- Parent feature owns business query/store composition.
- Parent feature must not import Canvas Unit internals.
- Canvas Unit must not import parent feature internals.
- Communication is through `model` and `actions` props only.

## Migration Rule For Old Concepts

Do not carry old business names into a new Canvas Unit unless the concept still exists.

Examples:

- If the real object is now `Source`, use `SourceMarker` / `SourcesLayer`, not `ManualTargetMarker`.
- If the concept is only an overview-local draft marker, use `DraftMarker`, not `ManualTarget`.
- If the concept is a cursor coordinate preview, use `CursorCoordinateMarker`, not `DraftTarget`.

## Review Checklist

- Is the unit under `src/canvas/<canvasUnit>/`, not `src/features/canvas/`?
- Does the directory and root component end with `Canvas`?
- Does `index.tsx` only expose the public entry and re-export API types?
- Are public model/action types defined in `api.ts`?
- Are business data and callbacks grouped into `model` and `actions` props?
- Does the Canvas Unit avoid direct imports from feature stores, global business stores, query hooks, and parent feature hooks?
- Is any Canvas Unit store private and limited to rendering / interaction state?
- Are constants and internal types in `shared/`, not `utils/`?
- Are public contract types in `api.ts`, not only in `shared/types.ts`?
- Are renderer Canvas-context hooks isolated under `canvasHooks/`?
- Does `hooks/` avoid renderer Canvas-context hooks, including R3F hooks such as `useThree`, `useFrame`, `useLoader`, and `useGraph`?
- Does outer `use<CanvasUnit>.ts` avoid calling `canvasHooks/` when it runs outside `<Canvas>`?
- Are utilities pure and exported through `utils/index.ts`?
- Are scene infrastructure files in `core/`?
- Are scene-level compositions in `layers/`?
- Are low-level renderable objects in `objects/`?
- Are canvas-owned DOM overlays in `overlays/`, not inline inside `<CanvasUnit>.tsx`?
- Are overlay view-model derivations in `use<CanvasUnit>.ts` or `hooks/`?
- Are formatting and tooltip positioning helpers in `utils/`, not inline inside `<CanvasUnit>.tsx`?
- Is DOM measurement for overlay layout handled in `hooks/`, not inline inside `<CanvasUnit>.tsx`?
- Do layers avoid importing sibling layers?
- Do objects avoid reading stores or calling queries?
- Does `<CanvasUnit>.tsx` call `use<CanvasUnit>()` internally?
- Does `use<CanvasUnit>.ts` avoid business store/query reads?
- Were stale business names avoided when the concept changed?
