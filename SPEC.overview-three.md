# SPEC: Overview Three Phase 2 Scaffold

## Goal

Move the `overview` module from Phase 1 bootstrap placeholders to an initial implementation scaffold that a later session can build file-by-file.

This phase must:

1. establish the first usable `src/stores/overview/` scaffolding
2. establish the first usable overview query and feature hook scaffolding
3. establish the first usable `src/features/overview/canvas/` shell composition
4. preserve the folder boundaries already defined in `src/features/overview/canvas/README.md`

This phase does not migrate legacy `footprint` code and does not aim for finished Three visuals.

## Scope

### Baseline

- Assume the Phase 1 folder structure already exists.
- Assume `src/features/overview/canvas/README.md` remains the source of truth for folder boundaries.
- `useQueryAxiosGet` is a low-level query primitive and must only be used under `src/hooks/query/**`.
- Continue using the current naming already present in the repo:
  - `targetsSlice.ts`
  - `manualTargets`
  - `ManualTargetsLayer.tsx`
  - `ManualTargetMarker.tsx`

### Store Scaffolding

Implement the initial overview store scaffolding under `src/stores/overview/`.

- `types.ts`
  - define store-internal shared types only
  - include `OverviewHoverAnchor`
  - include `OverviewManualTarget` with:
    - `id: string`
    - `ra: number`
    - `dec: number`
    - `label?: string`
  - do not place slice state/action interfaces here
- `footprintSlice.ts`
  - own shared footprint interaction state only
  - define the `OverviewFootprintSlice` interface in this file
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
  - define the `OverviewTargetsSlice` interface in this file
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
  - define the `OverviewViewerSlice` interface in this file
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
  - define and export `OverviewStoreState` as the composition of the three slice interfaces
  - export a single `useOverviewStore`
  - keep the store scoped to shared interactive state and manual targets
  - do not move remote footprint query data into the store

### Query And Feature Hook Scaffolding

Implement the overview query hook under `src/hooks/query/overview/` and the feature-level hook under `src/features/overview/hooks/`.

- `src/hooks/query/overview/useGrismFootprints.ts`
  - be the overview-specific concrete query hook for `/overview/grism_footprints`
  - be the only overview-specific location allowed to call `useQueryAxiosGet` for grism footprints
  - query path:
    - `/overview/grism_footprints`
  - expose the raw query result in a concrete overview query hook
- `src/hooks/query/overview/useClearImageFilters.ts`
  - be the overview-specific concrete query hook for `/overview/clear_image_filters`
  - call `useQueryAxiosGet` directly inside the query layer
  - expose the raw clear image filter response
- `src/features/overview/hooks/useOverviewFootprints.ts`
  - consume `src/hooks/query/overview/useGrismFootprints.ts`
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
  - do not import `useQueryAxiosGet` directly
- do not add `src/features/overview/hooks/useOverviewSelection.ts`
  - components that need overview selection state must read `useOverviewStore` directly with `useShallow`
  - do not add feature hooks whose only job is to wrap Zustand selectors and actions

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
    - `useOverviewStore`
  - read store state and actions locally with `useOverviewStore(useShallow(...))`
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

### Utility Layout And Type Rules

Implement shared utility contracts under `src/features/overview/utils/`.

- `types.ts`
  - hold reusable utility-level types shared by multiple utils, hooks, layers, or objects
  - move broadly reusable geometry and coordinate types here
  - examples of likely shared types:
    - equatorial coordinates
    - cartesian coordinates
    - projected screen points
- `constant.ts`
  - hold reusable utility-level constants needed by multiple utils or canvas files
  - do not duplicate shared numeric constants across utility files
- other files under `utils/`
  - import shared types from `utils/types.ts`
  - import shared constants from `utils/constant.ts`
  - if a type is only local to one file and unlikely to be reused, keep it private in that file and do not export it

### Hook Export Rules

- hooks may only export their public input/output contract types
- allowed exported hook types are limited to:
  - `*Params`
  - `*Result`
  - equivalent public handler/props contract types when they are the hook output contract
- do not export raw API payload types, normalization-only shapes, or other private intermediate types from hook files
- when a hook needs a reusable shared type, first source it from `src/features/overview/utils/types.ts`
- if the type is broadly reusable, add it to `utils/types.ts`; otherwise keep it private inside the hook file
- do not export private hook-local types

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
- direct `useQueryAxiosGet` usage from `src/features/overview/hooks/`
- adding Zustand pass-through wrapper hooks such as `useOverviewSelection.ts`

## Target Files

```text
src/hooks/query/overview/
  useGrismFootprints.ts
  useClearImageFilters.ts

src/stores/overview/
  types.ts
  footprintSlice.ts
  targetsSlice.ts
  viewerSlice.ts
  index.ts

src/features/overview/hooks/
  useOverviewFootprints.ts

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

src/features/overview/utils/
  types.ts
  constant.ts
  celestial.ts
  graticule.ts
  footprintGeometry.ts
```

## Responsibilities

### `src/stores/overview/`

- hold shared interactive state and manual target state only
- remain the single shared state entrypoint for overview interactions
- avoid storing remote footprint query payload

### `src/hooks/query/overview/`

- own overview-specific concrete query hooks
- be the only overview layer that directly uses `useQueryAxiosGet`
- return backend-facing query results to higher-level feature hooks

### `src/features/overview/hooks/`

- own feature-level orchestration and normalization logic
- consume concrete query hooks from `src/hooks/query/**`
- must not import `useQueryAxiosGet` directly
- must not exist solely to wrap Zustand selectors/actions
- normalize backend data into overview-local shapes before canvas layers consume it

### `src/features/overview/canvas/OverviewCanvas.tsx`

- own top-level scene composition only
- pull together feature hooks, direct store selectors, and scene layers
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

### `src/features/overview/utils/`

- keep shared utility contracts in `types.ts` and `constant.ts`
- keep file-local helper types private unless they are reused elsewhere
- remain pure and framework-free

## Step-by-step Plan

### Step 1: Tighten Store Types

- reduce `types.ts` to shared store-internal types only
- define slice state and action interfaces in their corresponding slice files
- define `OverviewStoreState` where the slices are composed

### Step 2: Add Shared Utility Contracts

- create `src/features/overview/utils/types.ts`
- create `src/features/overview/utils/constant.ts`
- move reusable utility-level types and constants into these files before expanding other utils or hooks

### Step 3: Implement Slice Scaffolding

- implement minimal state and action scaffolding in:
  - `footprintSlice.ts`
  - `targetsSlice.ts`
  - `viewerSlice.ts`
- keep logic intentionally shallow and explicit
- wire the slices together in `index.ts`

### Step 4: Implement Query And Feature Hook Scaffolding

- implement `src/hooks/query/overview/useGrismFootprints.ts` as the overview-specific concrete query hook for grism footprints
- implement `src/hooks/query/overview/useClearImageFilters.ts` as the overview-specific concrete query hook for clear image filters
- implement `src/features/overview/hooks/useOverviewFootprints.ts` as the normalization entrypoint on top of that query hook
- do not add `useOverviewSelection.ts`
- keep hook outputs stable enough for canvas shell composition
- keep hook exports limited to public params/result contract types

### Step 5: Implement Canvas Shell Composition

- implement `OverviewCanvas.tsx` as the top-level R3F shell
- mount the initial `core/` infrastructure and four scene layers
- use `useOverviewStore(useShallow(...))` directly where store data is needed
- pass normalized footprint data, manual target data, and viewer flags into the appropriate layers

### Step 6: Implement Minimal Core, Layer, Object, and Canvas Hook Shells

- implement the first compileable shell behavior for:
  - `core/`
  - `layers/`
  - `objects/`
  - `canvas/hooks/`
- stop at minimal scene composition and simple prop plumbing
- do not continue into final visuals, precise picking, or complete geometry

### Step 7: Validate Boundaries

- confirm `objects/` remain props-only
- confirm `canvas/hooks/` do not fetch remote data
- confirm `useQueryAxiosGet` is only used under `src/hooks/query/**`
- confirm footprint query data remains owned by the query + feature hook layers
- confirm no Zustand pass-through wrapper hook was introduced under `src/features/overview/hooks/`

### Step 8: Verify Build and Isolation

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
- `src/hooks/query/overview/` owns direct `useQueryAxiosGet` usage for overview
- `src/features/overview/hooks/` do not directly use `useQueryAxiosGet`
- `manualTargets` are managed in the overview store
- remote footprint query payload remains outside Zustand and is accessed through the overview query + feature hook layers
- no `useOverviewSelection.ts` or equivalent Zustand pass-through wrapper hook is introduced
- `OverviewCanvas.tsx` is defined as scene-shell composition only
- `OverviewCanvas.tsx` and other consumers use `useOverviewStore(useShallow(...))` directly when selecting store state
- `core/`, `layers/`, `objects/`, and `canvas/hooks/` each have a defined Phase 2 implementation boundary
- `objects/` remain props-only and do not access Zustand directly
- `src/features/overview/utils/types.ts` and `src/features/overview/utils/constant.ts` exist and are the shared utility contract entrypoints
- hook files export only public params/result contract types; private intermediate types are not exported
- sidebar migration is still out of scope
- legacy `footprint` code remains untouched
- verification for the implementation session is:
  - `npm run build` passes
  - no legacy footprint files are modified
