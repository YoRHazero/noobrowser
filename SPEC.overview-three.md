# SPEC: Overview Three Phase 4 Hover-First Interaction

## Goal

Move the `overview` module from a renderable Phase 3 scene into the first usable interactive canvas.

This phase must deliver:

1. formal footprint hover interaction
2. a lightweight DOM tooltip for hovered footprints
3. continued click selection alongside hover
4. stable coexistence of hover state and selected state

This phase is still not a sidebar phase, not a legacy migration phase, and not a camera UX phase.

## Scope

### Baseline

- Assume the Phase 3 renderable scene is already the baseline.
- Assume `src/features/overview/canvas/README.md` remains the source of truth for folder boundaries and dependency rules.
- Keep the current public names unchanged:
  - `useGrismFootprints`
  - `useClearImageFilters`
  - `useOverviewFootprints`
  - `useOverviewStore`
- `useQueryAxiosGet` remains a low-level query primitive and must only be used under `src/hooks/query/**`.
- `OverviewCanvas.tsx` must continue to read Zustand state directly with `useOverviewStore(useShallow(...))`.
- Do not introduce `useOverviewSelection.ts` or any equivalent Zustand pass-through wrapper hook.

### Interaction Scope

Phase 4 is a hover-first canvas interaction phase.

- hover applies only to **footprints**
- click selection remains active and must coexist with hover
- manual targets remain render-only in this phase
- tooltip is a lightweight DOM overlay rendered by `OverviewCanvas.tsx`
- tooltip uses a **screen-space anchor**
- tooltip anchor continues to use `OverviewHoverAnchor = { x, y }`
- tooltip anchor comes from the canvas-level pointer path
- tooltip does not use world-point projection as the primary Phase 4 strategy
- `useTooltipProjection.ts` may remain in the codebase, but it is not a primary Phase 4 delivery target
- footprint hover and click are resolved from the projected polygon area rather than the rendered outline line
- overlapping footprints must prefer the later-entered footprint as the active hover target

### Tooltip Content

Tooltip content is fixed in this phase and must not be redesigned per implementation:

- line 1: `Footprint {id}`
- line 2: `{included_files.length} files`
- line 3:
  - show the first 2 filenames from `included_files`
  - if more than 2 exist, end with `+N more`
- if `included_files` is missing or empty, omit line 3
- do not add a richer metadata panel in this phase

### Store And Query Boundary

`src/stores/overview/` and `src/hooks/query/overview/` remain baseline dependencies, not the primary delivery surface.

- `src/stores/overview/footprintSlice.ts`
  - remains the shared source of selected and hovered footprint state
  - `hoveredFootprintAnchor` becomes a formal Phase 4 data path rather than future-only plumbing
- `src/features/overview/hooks/useOverviewFootprints.ts`
  - continues to normalize query data only
  - must not move remote footprint payload into Zustand
- `src/hooks/query/overview/`
  - remains the only place where overview-specific query hooks directly use `useQueryAxiosGet`
  - `useClearImageFilters` remains prepared-only and unused by feature or UI flow in this phase

## Non-goals

This phase must explicitly avoid the following:

- sidebar or any sidebar shell
- legacy `src/features/footprint/` migration or replacement
- modification of `src/stores/footprints.ts`
- clear image filters UI integration
- manual target CRUD UI
- manual target hover interaction
- manual target tooltip UI
- high-precision picking
- world-projected tooltip following
- camera fly-to
- polished camera choreography
- filled footprint mesh rendering
- triangulation or production footprint geometry pipelines
- introducing `useOverviewSelection.ts`
- direct `useQueryAxiosGet` usage from `src/features/overview/hooks/`
- changing the public names `useGrismFootprints`, `useClearImageFilters`, `useOverviewFootprints`, or `useOverviewStore`

## Target Files

### Primary Phase 4 Implementation Surface

```text
src/features/overview/canvas/
  OverviewCanvas.tsx

  layers/
    FootprintsLayer.tsx

  objects/
    FootprintMesh.tsx

  hooks/
    useFootprintEvents.ts
    useFootprintInteractionResolver.ts
    useTooltipProjection.ts

src/stores/overview/
  footprintSlice.ts
```

### Baseline Dependency Surface

```text
src/features/overview/hooks/
  useOverviewFootprints.ts

src/features/overview/canvas/
  core/
    CameraRig.tsx
    SceneEnvironment.tsx
    constants.ts

  layers/
    GlobeLayer.tsx
    GraticuleLayer.tsx
    ManualTargetsLayer.tsx

  objects/
    GlobeSphere.tsx
    AtmosphereSphere.tsx
    GraticuleLines.tsx
    ManualTargetMarker.tsx

src/features/overview/utils/
  types.ts
  constant.ts
  celestial.ts
  graticule.ts
  footprintGeometry.ts

src/hooks/query/overview/
  useGrismFootprints.ts
  useClearImageFilters.ts

src/stores/overview/
  targetsSlice.ts
  viewerSlice.ts
  index.ts
  types.ts
```

These baseline files may be adjusted only when required to support Phase 4 hover, tooltip, and selection flow.

## Responsibilities

### `src/features/overview/canvas/OverviewCanvas.tsx`

- remain the scene shell and composition root
- read store state locally with `useOverviewStore(useShallow(...))`
- read normalized footprint data from `useOverviewFootprints`
- derive the hovered footprint record from normalized footprints plus `hoveredFootprintId`
- render the tooltip as a DOM sibling outside the `Canvas`
- keep the shell safe under loading, empty, and partial-data conditions
- do not fetch data directly with low-level query primitives
- do not host sidebar logic

### `src/features/overview/canvas/layers/FootprintsLayer.tsx`

- receive normalized footprints plus selected or hovered identifiers
- map those values into `FootprintMesh` props
- preserve the layer-level bridge from feature data to render objects
- do not own tooltip DOM rendering
- do not own polygon hit testing

### `src/features/overview/canvas/objects/FootprintMesh.tsx`

- remain outline-only
- receive all render state through props
- remain props-only
- do not access Zustand or query hooks directly
- do not own hover or click hit testing

### `src/features/overview/canvas/hooks/useFootprintInteractionResolver.ts`

- resolve footprint hover and click from projected screen-space polygons
- own canvas-level pointer tracking and polygon hit testing
- update hover state using `hoveredFootprintId` and `hoveredFootprintAnchor`
- prefer the later-entered footprint when multiple projected polygons overlap
- clear hover state when the pointer leaves the canvas or no polygon remains under the pointer
- keep hit resolution out of `FootprintMesh.tsx`

### `src/features/overview/canvas/hooks/useFootprintEvents.ts`

- become the store bridge used by the canvas-level interaction resolver
- write `selectedFootprintId`, `hoveredFootprintId`, and `hoveredFootprintAnchor` through provided store actions
- support click selection and hover state updates without object-level pointer handlers
- clearing hover must not clear selection state

### `src/features/overview/canvas/hooks/useTooltipProjection.ts`

- may remain available, but is not the primary tooltip strategy in this phase
- must not become the required path for Phase 4 tooltip positioning

### `src/stores/overview/footprintSlice.ts`

- continue to own:
  - `selectedFootprintId`
  - `hoveredFootprintId`
  - `hoveredFootprintAnchor`
- no new slice should be introduced for tooltip state
- keep the store shape minimal and interaction-focused

### `src/features/overview/hooks/useOverviewFootprints.ts`

- continue as the feature-level normalization hook
- keep `included_files` available in normalized metadata so tooltip rendering does not need to look at raw query payload
- do not change the query/store layering

## Step-by-step Plan

1. Formalize hover data flow.
   - Treat `hoveredFootprintId` and `hoveredFootprintAnchor` as first-class Phase 4 state.
   - Ensure the canvas-level interaction bridge writes both values through the existing footprint slice.

2. Upgrade footprint event handling.
   - Resolve hover and click from projected polygon hit areas instead of the rendered outline line.
   - Keep selection and hover independent enough that hover exit does not clear selection.
   - Prefer the later-entered footprint when projected polygons overlap.

3. Finalize hover-aware footprint rendering.
   - Pass hover and selected state through `FootprintsLayer.tsx` into `FootprintMesh.tsx`.
   - Preserve outline-only rendering while allowing hover-specific styling differences.
   - Keep `FootprintMesh.tsx` visual-only.

4. Add DOM tooltip rendering.
   - In `OverviewCanvas.tsx`, derive the currently hovered footprint record from normalized data.
   - Render a lightweight DOM tooltip as a sibling to the `Canvas`.
   - Position it from `hoveredFootprintAnchor`.

5. Lock tooltip content.
   - Render `Footprint {id}`.
   - Render the file count from `included_files`.
   - Render up to 2 filenames and `+N more` when applicable.
   - Omit the filename line when no filenames are available.

6. Preserve existing scene behavior.
   - Keep globe, graticule, footprint outline, and manual target marker rendering intact.
   - Keep manual targets out of hover and tooltip behavior in this phase.

7. Verify boundaries and build health.
   - Run `npm run build`.
   - Confirm no changes to legacy `src/features/footprint/` or `src/stores/footprints.ts`.
   - Confirm `useClearImageFilters` remains prepared-only.
   - Use the current `/test` route as the default manual validation sandbox, but do not make that route itself a Phase 4 target.

## Acceptance Criteria

- Hovering a footprint shows a tooltip.
- The tooltip is positioned from a screen-space anchor near the pointer.
- Tooltip line 1 is `Footprint {id}`.
- Tooltip line 2 shows the number of files.
- Tooltip line 3 shows at most 2 filenames and `+N more` when applicable.
- If no filenames are available, the tooltip omits the filename line.
- Moving the pointer out of all projected footprint polygons hides the tooltip and clears hover state.
- Clicking a footprint updates selection state and selection highlighting remains intact.
- Footprint hover and click do not depend on the rendered line object receiving pointer events.
- In overlapping regions, the later-entered footprint becomes the active hover target.
- Hover exit does not clear the selected footprint.
- Globe, graticule, footprint outline, and manual target marker rendering remain functional.
- Manual targets do not gain hover or tooltip behavior in this phase.
- `useClearImageFilters` remains available in `src/hooks/query/overview/` but is not integrated into feature or UI flow.
- `useOverviewSelection.ts` is not introduced.
- `useQueryAxiosGet` is not called from `src/features/overview/hooks/`.
- `src/features/footprint/` remains untouched.
- `src/stores/footprints.ts` remains untouched.
- `npm run build` passes.
