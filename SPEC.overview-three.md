# SPEC: Overview Three Phase 5 Sidebar Footprint Cards

## Goal

Move the `overview` module from an interactive canvas-first implementation into the first sidebar-backed feature shell.

This phase must deliver:

1. a feature-level sidebar beside the existing overview canvas
2. a footprint card list sourced from normalized overview footprint data
3. shared selection between canvas and sidebar through the existing overview store
4. a target section placeholder only, with no target workflow implementation

This phase is still not a target workflow phase, not a legacy migration phase, and not a camera UX phase.

## Scope

### Baseline

- Assume the current interactive `overview` canvas is already the baseline.
- Assume `src/features/overview/canvas/README.md` remains the source of truth for folder boundaries and dependency rules.
- Keep the current public names unchanged:
  - `useGrismFootprints`
  - `useClearImageFilters`
  - `useOverviewFootprints`
  - `useOverviewStore`
- `useQueryAxiosGet` remains a low-level query primitive and must only be used under `src/hooks/query/**`.
- `OverviewCanvas.tsx` must continue to read Zustand state directly with `useOverviewStore(useShallow(...))`.
- Do not introduce `useOverviewSelection.ts`, `useOverviewSidebarState.ts`, or any equivalent Zustand pass-through wrapper hook.

### Sidebar Scope

Phase 5 is a sidebar shell phase.

- the sidebar lives outside `src/features/overview/canvas/`
- the sidebar is composed at the feature level by `src/features/overview/index.tsx`
- the sidebar contains exactly 2 top-level sections in this phase:
  - `Footprints`
  - `Targets`
- the `Footprints` section renders one card per normalized footprint
- card highlighting is driven only by `selectedFootprintId`
- hover remains a canvas concern and does not drive sidebar highlight state in this phase
- clicking an unselected card selects that footprint
- clicking the selected card clears selection
- clicking a different card switches selection to that footprint
- canvas selection and sidebar selection must stay synchronized because they share the same store state
- the `Targets` section is a placeholder shell only in this phase

### Footprint Card Content

Footprint card content is intentionally lightweight in this phase:

- line 1: `Footprint {id}`
- line 2: `Center: ({ra}°, {dec}°)`
- line 3: `{included_files.length} files`
- optional supporting line:
  - show up to the first 2 filenames from `included_files`
  - if no filenames exist, omit that line
- do not add per-card action menus, filter controls, badges, or dense metadata panels in this phase

### Target Section Scope

The target section is present only as a future-facing entry point.

- render the section shell and title
- render placeholder copy indicating that target list and target actions are not implemented yet
- do not render target cards or target rows
- do not wire target add, edit, remove, select, hover, or fly-to behavior

### Store And Query Boundary

`src/stores/overview/` and `src/hooks/query/overview/` remain baseline dependencies, not the primary delivery surface.

- `src/stores/overview/footprintSlice.ts`
  - remains the shared source of `selectedFootprintId`
  - continues to own hover state, but hover is not a sidebar concern in this phase
- `src/stores/overview/targetsSlice.ts`
  - remains baseline-only plumbing
  - its mutation actions must not be surfaced in the sidebar UI in this phase
- `src/features/overview/hooks/useOverviewFootprints.ts`
  - continues to normalize query data only
  - must not move remote footprint payload into Zustand
- `src/hooks/query/overview/`
  - remains the only place where overview-specific query hooks directly use `useQueryAxiosGet`
  - `useClearImageFilters` remains prepared-only and unused by the sidebar flow in this phase
- sidebar components may read `useOverviewStore(useShallow(...))` and `useOverviewFootprints` directly at the call site
- do not add feature hooks whose only purpose is forwarding Zustand selectors or actions

## Non-goals

This phase must explicitly avoid the following:

- target list implementation
- manual target CRUD UI
- target hover interaction
- target tooltip UI
- target selection state
- target fly-to
- camera fly-to choreography
- camera control redesign
- graticule UX redesign
- viewer HUD migration or redesign
- clear image filters UI integration
- overview search, filter, sort, or pagination controls
- virtualized list behavior
- moving remote footprint payload into Zustand
- introducing `useOverviewSelection.ts` or equivalent pass-through hooks
- direct `useQueryAxiosGet` usage from `src/features/overview/**`
- editing legacy code under `src/features/footprint/`
- replacing `/wfss` or any legacy route wiring in this phase

## Target Files

### Primary Phase 5 Implementation Surface

```text
src/features/overview/
  index.tsx

  sidebar/
    OverviewSidebar.tsx
    FootprintsSection.tsx
    OverviewFootprintCard.tsx
    TargetsSection.tsx
```

### Baseline Dependency Surface

```text
src/features/overview/canvas/
  OverviewCanvas.tsx
  README.md

src/features/overview/hooks/
  useOverviewFootprints.ts

src/hooks/query/overview/
  useGrismFootprints.ts
  useClearImageFilters.ts

src/stores/overview/
  footprintSlice.ts
  targetsSlice.ts
  viewerSlice.ts
  index.ts
  types.ts

src/features/overview/controls/
  OverviewViewerHud.tsx
```

These baseline files may be adjusted only when required to support the new feature-level layout and shared selection flow.

## Responsibilities

### `src/features/overview/index.tsx`

- becomes the feature-level layout root
- compose the overview canvas area and the new sidebar area
- keep sidebar UI out of `canvas/`
- preserve the existing overview feature shell behavior outside this new layout responsibility

### `src/features/overview/sidebar/OverviewSidebar.tsx`

- remain the sidebar composition root
- structure the `Footprints` and `Targets` sections
- read only the state and data needed for sidebar rendering
- keep the sidebar focused on page-level UI rather than scene logic

### `src/features/overview/sidebar/FootprintsSection.tsx`

- read normalized footprint data from `useOverviewFootprints`
- read `selectedFootprintId` and `setSelectedFootprintId` from the overview store
- render loading, empty, and populated states safely
- map footprint records into `OverviewFootprintCard` props
- own the simple card click-to-toggle selection behavior
- do not fetch data with low-level query primitives

### `src/features/overview/sidebar/OverviewFootprintCard.tsx`

- remain props-only
- remain visual-only
- render the lightweight card content defined above
- reflect selected versus unselected styling
- do not access Zustand or query hooks directly

### `src/features/overview/sidebar/TargetsSection.tsx`

- render a stable section shell and placeholder copy only
- do not render target list rows
- do not own target mutations or target workflow behavior

### `src/features/overview/canvas/OverviewCanvas.tsx`

- remain the scene shell and composition root for canvas behavior
- continue to use the shared store so canvas-side selection stays synchronized with sidebar-side selection
- do not absorb sidebar responsibilities

### `src/features/overview/hooks/useOverviewFootprints.ts`

- continue as the feature-level normalization hook
- keep card-friendly metadata available from normalized records
- do not change the query/store layering

## Step-by-step Plan

1. Add the feature-level sidebar shell.
   - Update `src/features/overview/index.tsx` so overview is no longer only `canvas + HUD`.
   - Keep the sidebar outside `canvas/`.

2. Add the footprint cards section.
   - Read normalized footprint data from `useOverviewFootprints`.
   - Render one lightweight card per footprint.

3. Wire shared selection.
   - Use the existing `selectedFootprintId` store path.
   - Toggle selection on card click without introducing new selection state.

4. Add the targets placeholder section.
   - Render section framing and placeholder copy only.
   - Do not wire target mutations or target workflow actions.

5. Verify shared behavior and build health.
   - Confirm canvas and sidebar stay synchronized through the shared store.
   - Confirm the phase does not break existing overview canvas behavior.
