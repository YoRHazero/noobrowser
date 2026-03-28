# SPEC: Overview Three Phase 2 Scaffold

## Goal

Move the `overview` module from Phase 1 bootstrap placeholders to an initial implementation scaffold that a later session can build file-by-file.

This phase must:

1. establish the first usable `src/stores/overview/` scaffolding
2. establish the first usable `src/features/overview/hooks/` scaffolding
3. establish the first usable `src/features/overview/canvas/` shell composition
4. preserve the folder boundaries already defined in `src/features/overview/canvas/README.md`

This phase does not migrate legacy `footprint` code and does not aim for finished Three visuals.

## Scope

### Baseline

- Assume the Phase 1 folder structure already exists.
- Assume `src/features/overview/canvas/README.md` remains the source of truth for folder boundaries.
- Continue using the current naming already present in the repo:
  - `targetsSlice.ts`
  - `manualTargets`
  - `ManualTargetsLayer.tsx`
  - `ManualTargetMarker.tsx`

### Store Scaffolding

Implement the initial overview store scaffolding under `src/stores/overview/`.

- `types.ts`
  - define store-local state and action interfaces only
  - include the initial `OverviewFootprintSlice`, `OverviewTargetsSlice`, `OverviewViewerSlice`, and `OverviewStoreState`
  - include `OverviewHoverAnchor`
  - include `OverviewManualTarget` with:
    - `id: string`
    - `ra: number`
    - `dec: number`
    - `label?: string`
- `footprintSlice.ts`
  - own shared footprint interaction state only
  - state:
    - `selectedFootprintId: string | null`
    - `hoveredFootprintId: string | null`
    - `hoveredFootprintAnchor: OverviewHoverAnchor | null`
  - actions:
    - `setSelectedFootprintId(id: string | null)`
    - `setHoveredFootprint(id: string | null, anchor?: OverviewHoverAnchor | null)`
    - `clearHoveredFootprint()`
    - `clearFootprintSelection()`
- `targetsSlice.ts`
  - own `manualTargets` and their CRUD only
  - do not store remote footprint query payload here
  - state:
    - `manualTargets: OverviewManualTarget[]`
  - actions:
    - `addManualTarget(target: OverviewManualTarget)`
    - `updateManualTarget(id: string, patch: Partial<OverviewManualTarget>)`
    - `removeManualTarget(id: string)`
    - `clearManualTargets()`
  - persistence is allowed for `manualTargets`
- `viewerSlice.ts`
  - own overview-wide viewer flags and fly-to intent only
  - state:
    - `showGrid: boolean`
    - `showAtmosphere: boolean`
    - `pendingFlyToTargetId: string | null`
  - actions:
    - `setShowGrid(show: boolean)`
    - `setShowAtmosphere(show: boolean)`
    - `requestFlyToTarget(id: string | null)`
    - `clearPendingFlyToTarget()`
- `index.ts`
  - compose the three slices using the repo's existing Zustand slice-composition pattern
  - export a single `useOverviewStore`
  - keep the store scoped to shared interactive state and manual targets
  - do not move remote footprint query data into the store

### Feature Hooks Scaffolding

Implement the first feature-level hooks under `src/features/overview/hooks/`.

- `useOverviewFootprints.ts`
  - wrap `useQueryAxiosGet`
  - query path:
    - `/overview/grism_footprints`
  - normalize the response into overview-local records
  - the normalized record shape must include:
    - `id`
    - `vertices`
    - `center`
    - `meta`
  - expose query-derived state needed by Phase 2 shell rendering:
    - `footprints`
    - `isLoading`
    - `isError`
    - `error`
  - keep remote data in the hook layer; do not write footprint payload into Zustand
- `useOverviewSelection.ts`
  - read and write overview selection state through `useOverviewStore`
  - expose minimal bridge helpers needed by canvas layers:
    - selected footprint id
    - hovered footprint id
    - hovered footprint anchor
    - selection/hover setters and clear helpers
  - do not fetch remote data here

### Canvas Shell Scaffolding

Implement the first shell-level canvas composition under `src/features/overview/canvas/`.

- `OverviewCanvas.tsx`
  - create the initial React Three Fiber shell
  - render a `Canvas` tree and compose:
    - `SceneEnvironment`
    - `CameraRig`
    - `GlobeLayer`
    - `GraticuleLayer`
    - `FootprintsLayer`
    - `ManualTargetsLayer`
  - source data from:
    - `useOverviewFootprints`
    - `useOverviewSelection`
    - `useOverviewStore`
  - pass data into layers through props
  - do not place remote data fetching into `canvas/hooks/`
  - do not add sidebar UI here

### Canvas Core, Layers, Objects, Hooks

Implement the first minimal compileable scaffolding for the existing canvas subfolders.

- `core/`
  - `CameraRig.tsx`
    - provide initial camera/controls shell only
    - accept or observe fly-to intent but do not implement polished flight behavior
  - `SceneEnvironment.tsx`
    - provide minimal lighting/background/environment shell only
  - `constants.ts`
    - define canvas-local constants required by the shell, such as globe radius and basic camera distances
- `layers/`
  - `GlobeLayer.tsx`
    - compose `GlobeSphere`
    - conditionally include `AtmosphereSphere` based on viewer flags
  - `GraticuleLayer.tsx`
    - conditionally render graticule content from pure helpers and shell props
  - `FootprintsLayer.tsx`
    - receive normalized footprints and selection/hover handlers
    - map footprint data into `FootprintMesh` props
  - `ManualTargetsLayer.tsx`
    - receive `manualTargets`
    - map manual target data into `ManualTargetMarker` props
- `objects/`
  - `GlobeSphere.tsx`
    - render only a minimal globe shell object
  - `AtmosphereSphere.tsx`
    - render only a minimal optional atmosphere shell object
  - `GraticuleLines.tsx`
    - render only from props or precomputed pure helper output
  - `FootprintMesh.tsx`
    - receive all footprint render state through props
    - do not access store or query hooks directly
  - `ManualTargetMarker.tsx`
    - receive all manual target render state through props
    - do not access store directly
- `canvas/hooks/`
  - `useCameraFlight.ts`
    - define the first shell for fly-to behavior
    - no polished interpolation or scene choreography yet
  - `useFootprintEvents.ts`
    - define the bridge between object events and store selection/hover actions
  - `useTooltipProjection.ts`
    - define the shell for projecting a world position to screen space
    - no high-precision tooltip behavior yet

## Non-goals

This phase must explicitly avoid the following:

- real globe shading, atmosphere effects, or production-quality Three visuals
- full footprint geometry generation or triangulation logic
- precise hover or click picking
- production tooltip placement behavior
- sidebar migration
- routing integration
- deletion or modification of legacy `src/features/footprint/`
- deletion or modification of legacy `src/stores/footprints.ts`
- moving remote footprint payload into Zustand

## Target Files

```text
src/stores/overview/
  types.ts
  footprintSlice.ts
  targetsSlice.ts
  viewerSlice.ts
  index.ts

src/features/overview/hooks/
  useOverviewFootprints.ts
  useOverviewSelection.ts

src/features/overview/canvas/
  OverviewCanvas.tsx

  core/
    CameraRig.tsx
    SceneEnvironment.tsx
    constants.ts

  layers/
    GlobeLayer.tsx
    GraticuleLayer.tsx
    FootprintsLayer.tsx
    ManualTargetsLayer.tsx

  objects/
    GlobeSphere.tsx
    AtmosphereSphere.tsx
    GraticuleLines.tsx
    FootprintMesh.tsx
    ManualTargetMarker.tsx

  hooks/
    useCameraFlight.ts
    useFootprintEvents.ts
    useTooltipProjection.ts
```

## Responsibilities

### `src/stores/overview/`

- hold shared interactive state and manual target state only
- remain the single shared state entrypoint for overview interactions
- avoid storing remote footprint query payload

### `src/features/overview/hooks/`

- own feature-level query and state-bridge logic
- keep remote footprint fetching outside the canvas subtree
- normalize backend data into overview-local shapes before canvas layers consume it

### `src/features/overview/canvas/OverviewCanvas.tsx`

- own top-level scene composition only
- pull together feature hooks, store state, and scene layers
- pass props downward; do not absorb sidebar or unrelated page UI

### `src/features/overview/canvas/core/`

- own scene infrastructure only
- no footprint business rules

### `src/features/overview/canvas/layers/`

- own scene-layer composition
- may read shared store state and feature hooks
- must delegate single-object rendering to `objects/`

### `src/features/overview/canvas/objects/`

- own reusable single render objects only
- receive all state via props
- must not access Zustand stores directly
- must not run remote queries

### `src/features/overview/canvas/hooks/`

- own canvas-only interaction helpers
- may use React Three Fiber APIs
- must not own remote data fetching

## Step-by-step Plan

### Step 1: Tighten Store Types

- expand `types.ts` from placeholder-only types into Phase 2 state and action interfaces
- include the initial action signatures for all three slices
- keep types local to overview store concerns only

### Step 2: Implement Slice Scaffolding

- implement minimal state and action scaffolding in:
  - `footprintSlice.ts`
  - `targetsSlice.ts`
  - `viewerSlice.ts`
- keep logic intentionally shallow and explicit
- wire the slices together in `index.ts`

### Step 3: Implement Feature Hook Scaffolding

- implement `useOverviewFootprints.ts` as the query and normalization entrypoint
- implement `useOverviewSelection.ts` as the store bridge entrypoint
- keep hook outputs stable enough for canvas shell composition

### Step 4: Implement Canvas Shell Composition

- implement `OverviewCanvas.tsx` as the top-level R3F shell
- mount the initial `core/` infrastructure and four scene layers
- pass normalized footprint data, manual target data, and viewer flags into the appropriate layers

### Step 5: Implement Minimal Core, Layer, Object, and Canvas Hook Shells

- implement the first compileable shell behavior for:
  - `core/`
  - `layers/`
  - `objects/`
  - `canvas/hooks/`
- stop at minimal scene composition and simple prop plumbing
- do not continue into final visuals, precise picking, or complete geometry

### Step 6: Validate Boundaries

- confirm `objects/` remain props-only
- confirm `canvas/hooks/` do not fetch remote data
- confirm footprint query data remains owned by `useOverviewFootprints`

### Step 7: Verify Build and Isolation

- run `npm run build`
- verify no changes were made under:
  - `src/features/footprint/`
  - `src/stores/footprints.ts`

## Acceptance Criteria

- the Phase 2 implementation plan is explicit enough that another session can implement it file-by-file without redefining responsibilities
- `src/stores/overview/` has a clear split between:
  - footprint interaction state
  - manual target state
  - viewer flags and fly-to intent
- `manualTargets` are managed in the overview store
- remote footprint query payload remains owned by `useOverviewFootprints`
- `useOverviewSelection` is the bridge to overview selection state
- `OverviewCanvas.tsx` is defined as scene-shell composition only
- `core/`, `layers/`, `objects/`, and `canvas/hooks/` each have a defined Phase 2 implementation boundary
- `objects/` remain props-only and do not access Zustand directly
- sidebar migration is still out of scope
- legacy `footprint` code remains untouched
- verification for the implementation session is:
  - `npm run build` passes
  - no legacy footprint files are modified
