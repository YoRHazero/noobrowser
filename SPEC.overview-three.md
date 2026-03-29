# SPEC: Overview Three Phase 7 Target List Selection, Rename, And Delete

## Goal

Phase 6 established the target add workflow:

1. a real `Targets` tab with an add form
2. right-click coordinate fill from `cursorWorldCoordinate`
3. committed targets rendered on the globe
4. valid draft coordinates rendered as a draft preview

Phase 7 builds on that baseline and turns the committed target list into a manageable working surface.

This phase must deliver:

1. multi-selection from the `Target List`
2. inline label rename inside the list
3. direct target deletion from the list
4. selected committed targets rendered on the globe with a distinct selected color

This is still not a target hover phase, not a target fly-to phase, and not a canvas-driven selection phase.

## Scope

### Selection Contract

- target selection originates only from the `Target List`
- clicking a target card toggles that target in the shared selected set
- clicking an already selected card deselects it
- multiple committed targets may be selected at the same time
- selection is UI-only and does not persist across refresh
- canvas markers do not become interactive in this phase

### Inline Rename Contract

- rename happens only inside the `Target List`
- do not reuse the top `Add Target` form for rename
- only one target may be in editing mode at a time
- clicking `Edit` switches that card into inline edit mode
- edit mode replaces the label text with an input and shows `Save` and `Cancel`
- `Save` rules:
  - use `trim()`
  - empty labels are invalid
  - errors stay local to the list card
  - valid labels update the existing committed target via `updateManualTarget`
- `Cancel` rules:
  - discard the local edit value
  - clear the local error
  - exit edit mode
- rename must not clear or change the selection state

### Delete Contract

- delete happens directly from the list card
- no confirmation dialog
- no browser `confirm`
- deleting a committed target must:
  - remove the target from the committed target collection
  - remove its canvas marker immediately
  - remove its id from the shared selected set if present
- delete does not affect the `Add Target` draft fields

### Canvas Display Contract

- committed target markers keep the Phase 6 billboard/sprite implementation
- draft preview keeps the Phase 6 billboard/sprite implementation
- a third committed marker visual state is added for selected targets
- marker variants are:
  - `committed`: bright green
  - `selected`: bright cyan
  - `draft`: near-white
- selected targets only change color in this phase
- do not change marker size, labels, tooltips, hover, or click behavior
- draft preview never enters the selected state
- footprint selection and target selection remain independent

## Store And Data Boundaries

### Targets Slice

- committed target persistence remains unchanged:
  - persist `manualTargets`
  - persist `nextTargetSequence`
- draft state remains unchanged and non-persisted:
  - `targetDraftLabel`
  - `targetDraftRa`
  - `targetDraftDec`
  - `targetDraftFocusToken`
- add new UI-only selection state:
  - `selectedTargetIds: string[]`
- add new selection actions:
  - `toggleSelectedTarget`
  - `clearSelectedTargets`
- `selectedTargetIds` must not be persisted
- `removeManualTarget` must also remove the target id from `selectedTargetIds`

### Sidebar Component Boundary

- `TargetsSection.tsx` continues to own:
  - add-form validation errors
  - inline rename editing state
  - inline rename validation errors
- keep rename UI local to the list component:
  - `editingTargetId`
  - `editingLabelValue`
  - `editingLabelError`
- do not move list editing state into Zustand

### Canvas Boundary

- `OverviewCanvas.tsx` consumes the shared selected ids
- `ManualTargetsLayer.tsx` decides whether each committed target uses:
  - `committed`
  - `selected`
- `DraftTargetLayer.tsx` stays separate and continues to render only draft preview state
- canvas remains display-only for target markers in this phase

## Target Files

```text
SPEC.overview-three.md

src/features/overview/sidebar/
  TargetsSection.tsx
  OverviewSidebar.tsx

src/features/overview/canvas/
  OverviewCanvas.tsx
  layers/
    ManualTargetsLayer.tsx
    DraftTargetLayer.tsx
  objects/
    ManualTargetMarker.tsx

src/stores/overview/
  targetsSlice.ts
  index.ts
```

## Non-goals

- canvas marker click selection
- target hover state
- target marker tooltip UI
- target fly-to
- camera choreography
- rename of RA/Dec
- delete confirmation or undo
- backend persistence
- bulk import
- legacy `src/features/footprint/` replacement work
- `/wfss` route replacement

## Build Check

- the only automated verification step for this phase is:
  - `npm run build`
- this phase is not complete if either `vite build` or `tsc` fails
