# Feature Component Architecture Spec

## Purpose

This document defines the common architecture rules for features and subfeatures under `src/features/*`.

The goal is to keep business code maintainable as it grows:

- clear business boundaries
- a recursive directory model
- controlled component dependency direction
- explicit separation between UI primitives, view fragments, and business units
- slice organization that can be aggregated under a single store root

## Core Model

All business directories are modeled as a `Unit`:

```text
FeatureUnit = src/features/<feature>
SubfeatureUnit = <parent>/subfeatures/<subfeature>
```

`FeatureUnit` and `SubfeatureUnit` recursively follow the same structure, with two strict differences:

- Only a top-level `FeatureUnit` may own `runtimes/`.
- Only a top-level `FeatureUnit/store/index.ts` may create the real Zustand store. A nested `SubfeatureUnit/store/index.ts` may only aggregate and export slices / selectors.

## Standard Structure

```text
<Unit>/
  index.tsx
  <Unit>.tsx
  use<Unit>.ts

  components/                   optional
  parts/                        optional
  hooks/                        optional
  shared/                       optional
  store/                        optional
  utils/                        optional
  animations/                   optional
  subfeatures/                  optional
```

Only top-level features may additionally own:

```text
src/features/<feature>/
  runtimes/                     optional
```

This is forbidden:

```text
<parent>/subfeatures/<subfeature>/runtimes/
```

## `index.tsx`

`index.tsx` is the only public entry for a Unit.

`index.tsx` only defines the public entry. It does not participate in the Unit's internal composition.

Rules:

- `index.tsx` should directly export or render `<Unit />`.
- `index.tsx` must not call `use<Unit>()`.
- `index.tsx` must not inject Unit view-model props into `<Unit />`.
- `<Unit>.tsx` calls `use<Unit>()` and assembles its own parts / subfeatures.
- `<Unit>.tsx` must not directly import the current Unit's `hooks/`, parent Unit hooks, or child subfeature hooks. Current Unit hook composition belongs in `use<Unit>.ts`.
- `<Unit>.tsx` may import parts / subfeatures / components / recipes, and it may pass the relevant pieces of the view model returned by `use<Unit>()` into them.

Parents may only import a child Unit through its public entry:

```ts
import Ned from "./subfeatures/ned";
```

Parents must not import a child Unit's internal files:

```ts
import { NedView } from "./subfeatures/ned/NedView";
```

If a top-level feature has runtimes, those runtimes must be mounted only by the top-level feature `index.tsx`:

```tsx
// src/features/<feature>/index.tsx
export default function FeatureEntry() {
  return (
    <>
      <FeatureRuntimes />
      <Feature />
    </>
  );
}
```

`<Feature>.tsx`, subfeatures, parts, and components must not mount runtimes directly.

## Simple Unit

When a Unit does not have `subfeatures/`, `<Unit>.tsx` and `use<Unit>.ts` may be the Unit's main business entry, but `use<Unit>.ts` still only composes. Concrete side effects and lifecycle logic belong in `hooks/useXxx.ts`:

```text
ned/
  index.tsx
  Ned.tsx
  useNed.ts
  parts/
  store/
```

## Complex Unit

Once a Unit has `subfeatures/`, `<Unit>.tsx` and `use<Unit>.ts` are reduced to an orchestration layer:

```text
sheet/
  index.tsx
  Sheet.tsx
  useSheet.ts
  parts/
    SheetShell.tsx
  subfeatures/
    editor/
    sources/
    ned/
```

Allowed:

- assemble child subfeatures
- handle the current Unit's own layout and shell
- use the current Unit's `parts/` for layout decomposition
- read parent-level store / hooks for cross-subfeature orchestration

Forbidden:

- implement a child subfeature's internal business behavior
- call queries / mutations that should belong to a child subfeature
- own child-subfeature-private state
- build a large view model spanning many subfeatures
- import sibling subfeature internals

## `components/`

`components/` is only for reusable UI primitives. It is a visual component layer, not a business decomposition layer.

Recommended structure:

```text
components/
  IconChip/
    IconChip.tsx
    IconChip.recipe.ts
    index.ts
```

Strict rules:

- One component owns one corresponding recipe.
- The component recipe lives inside that component directory.
- Components may receive props and callbacks.
- Component props stay in the component file or component directory, not in `shared/types.ts`.
- Components must not read feature stores.
- Components must not call feature hooks, query hooks, mutation hooks, or runtime hooks.
- Components must not import sibling subfeatures.
- Components must not import the current Unit's `parts/`, `store/`, `hooks/`, or `utils/`.
- Components may only depend on `src/components`, the current Unit's `shared/`, and parent Unit `components/`.

Heuristics:

- If a name contains a business term, it usually does not belong in `components/`.
- `NedSettingsPanel`, `ExtractionSettingsPanel`, and `SourceSpectrumPanel` do not belong in `components/`.
- `IconChip`, `MetricRow`, and `InlineField` may belong in `components/`.

## recipe

A recipe owner must be a concrete UI owner, not a technical-type directory.

Forbidden:

- creating a `recipes/` directory
- creating a root `<unit>.recipe.ts` that contains recipes for multiple parts / components
- importing one part / component recipe from another part / component
- building large static `css` objects in TSX
- building style objects in TSX from static visual states such as `tone`, `variant`, `isActive`, or `isDisabled`
- defining hover / focus / disabled visual rules in TSX

Allowed:

- `<Unit>.tsx` may use a sibling `<Unit>.recipe.ts` only when `<Unit>.tsx` directly owns styles.
- `parts/<Part>/<Part>.tsx` may use a colocated `<Part>.recipe.ts` only when that part directly owns styles.
- `components/<Component>/<Component>.tsx` may use a colocated `<Component>.recipe.ts` only when that component directly owns styles.
- TSX may pass semantic state to a recipe, such as `recipe({ tone, size, active })`.
- TSX may pass a small number of runtime dynamic values, such as `style={{ top: `${top}px` }}`.
- TSX may pass runtime dynamic color / size through CSS variables, such as `style={{ "--source-color": color } as CSSProperties }`.

Recommended structure:

```text
parts/
  Shell/
    Shell.tsx
    Shell.recipe.ts
    index.ts

components/
  IconChip/
    IconChip.tsx
    IconChip.recipe.ts
    index.ts
```

Recipes own:

- layout / spacing / size / radius / border
- color tokens / semantic colors
- hover / active / disabled / focus styles
- slot styles
- variant styles
- animation names / transitions and other static visual rules

TSX owns:

- DOM structure
- props-to-recipe-variant mapping
- event handlers
- aria / semantic attributes
- a small number of runtime dynamic styles / CSS variables

## `parts/`

`parts/` is for feature-specific view fragments owned by the current Unit. It is not a business boundary; it only decomposes a view.

Rules:

- A part serves only the nearest owning Unit. In a complex Unit, a parent-owned reusable view fragment may be used by that Unit's direct child subfeatures.
- A part may contain business copy, business field names, and business view-model shapes.
- A part usually receives props / models prepared by its parent.
- A part does not read stores directly.
- A part does not call queries / mutations.
- A part does not own business workflow state.
- A part does not import sibling subfeatures.
- A child subfeature may import only its nearest parent Unit `parts/` public entry. It must not import grandparent `parts/`.
- A child subfeature must not import sibling subfeature `parts/`.
- A parent part reused by child subfeatures must remain a view fragment: behavior comes through props / callbacks only, and it must not read stores, call queries / mutations, or own business workflow state.
- If a part needs a recipe, it must be promoted to its own folder and own a colocated `<Part>.recipe.ts`.
- If a part only serves a child subfeature, it must move into that child subfeature's `parts/`.

Example:

```text
sheet/subfeatures/ned/
  Ned.tsx
  useNed.ts
  parts/
    SettingsPanel.tsx
    ResultsPanel.tsx
```

`Ned` is a subfeature. `SettingsPanel` and `ResultsPanel` are NED-internal parts.

When a parent part is reused by multiple direct child subfeatures, it should stay in the parent `parts/`:

```text
sheet/
  parts/
    ProjectionControls/
      ProjectionControls.tsx
      ProjectionControls.recipe.ts
      index.ts
  subfeatures/
    editor/
    sources/
```

`ProjectionControls` is owned by `sheet` and may be used by `editor` and `sources`. If it only serves `sources`, it must move down into `sources/parts/`.

## `subfeatures/`

`subfeatures/` contains independent visible business capabilities.

Rules:

- Each subfeature is a complete Unit.
- A subfeature may own `use<Subfeature>.ts`, `parts/`, `components/`, `hooks/`, `shared/`, `store/`, `utils/`, and `animations/`.
- A subfeature must not own `runtimes/`.
- Sibling subfeatures must not import each other.
- Sibling subfeatures may only coordinate through parent store / hooks or higher-level shared state.
- The parent Unit assembles subfeatures but must not understand their internal state.

Props rules:

- A subfeature entry should avoid business data props by default.
- Identity / config props are allowed, such as `sourceId`, `placement`, and `mode`.
- If a child needs a full data object and many callbacks, it is usually a `part`, not a subfeature.

`SourceCard` example:

```tsx
<SourceCard source={source} isActive={isActive} onSelect={onSelect} />
```

This is more likely `parts/SourceCard.tsx` or a presentational component.

```tsx
<SourceCard sourceId={source.id} />
```

This may be `subfeatures/sourceCard`, with `useSourceCard(sourceId)` reading parent store.

## `store/`

Every Unit with `store/` must have `store/index.ts`.

Do not create empty `store/` directories preemptively.

A Unit should only own `store/` when it has actual local state slices / selectors.

Top-level feature:

```text
src/features/<feature>/store/index.ts
```

May create the real Zustand store.

Nested Unit:

```text
<Unit>/store/index.ts
```

Must not create a store. It may only:

- export its own slice
- export its own `use<SliceName>Store` selector hook
- re-export child subfeature store aggregations
- provide a stable import surface for the parent

`store/index.ts` is a public aggregation boundary, not a replacement for leaf files.

Keep leaf files that are still genuinely used, such as `<name>Slice.ts` and `use<Name>Store.ts`. Delete a leaf file only when it is truly unused after migration.

Parents import from the child Unit's `store/` entry. Files inside the same `store/` directory may still import local leaf files.

Parents may only import from a child Unit's `store/` public entry:

```ts
import { createNedSlice } from "../subfeatures/ned/store";
```

Forbidden:

```ts
import { createNedSlice } from "../subfeatures/ned/store/nedSlice";
```

## `shared/`

`shared/` only contains low-coupling definitions shared within the current Unit.

Allowed:

- `types.ts`
- `constants.ts`

Forbidden:

- hook input / output types
- component props
- wrapped query result types
- local types that only serve one part / subfeature

## `utils/`

`utils/` only contains pure functions.

Rules:

- One function per file.
- `index.ts` re-exports all public utilities.
- Do not define business types / constants inside utils.
- Utilities may only use native types or current / parent `shared/types.ts` and `shared/constants.ts`.

## `hooks/`

`hooks/` is the current Unit's business hook layer. It contains named behavior hooks owned by the current Unit.

It is not limited to hooks reused by multiple children. If a child hook is only used by `use<Unit>.ts`, but it owns clear business behavior or lifecycle logic, it still belongs in the current Unit's `hooks/`.

Allowed:

- hooks split out from `use<Unit>.ts`, such as `useBeaconDrag.ts` or `useBeaconProximity.ts`
- hooks reused by multiple parts / subfeatures inside the current Unit
- effect / event / timer / observer logic whose lifecycle matches the current visible Unit
- public hooks intentionally provided by the current Unit for child subfeatures
- child subfeature private hooks, but only inside that child Unit's own `hooks/`

Forbidden:

- runtime hooks
- imports from `components/` into the current Unit's `hooks/`
- sibling subfeatures importing each other's `hooks/`
- parent Units importing a child Unit's private hook files

Export rules:

- Hooks not exported from `hooks/index.ts` are private implementation details of the current Unit.
- Export from `hooks/index.ts` only when the current Unit intentionally provides a hook for child subfeatures.
- A child subfeature `use<Child>.ts` may call parent public hooks only through the parent Unit's `hooks/index.ts`; it must not import parent private `hooks/useXxx.ts` files.
- If a child needs an ancestor Unit hook, prefer re-exporting or wrapping it through the nearest parent Unit's own `hooks/index.ts` to avoid coupling the child to ancestor internals.

## `use<Unit>.ts`

`use<Unit>.ts` is the current Unit's composition hook. It only assembles the current Unit's view model.

`use<Unit>.ts` should only be called by the current Unit's `<Unit>.tsx`. It must not be called directly by `index.tsx` or parent Units.

`<Unit>.tsx` must not receive whole Unit model props produced by `use<Unit>.ts`; it should call `use<Unit>()` inside the file. If data needs to be passed to `parts/`, `<Unit>.tsx` decomposes the model and passes the relevant pieces to each part.

`<Unit>.tsx` must not bypass `use<Unit>.ts` by directly importing hooks from `hooks/`. Even if the hook belongs to the same Unit, it must be called through `use<Unit>.ts` so the composition boundary stays explicit.

Allowed:

- call child hooks from the current Unit's `hooks/`
- call hooks publicly exported from the parent Unit's `hooks/index.ts`
- read public store selectors from the current Unit / parent Unit
- compose query hook data and status
- assemble the view model passed to `<Unit>.tsx` / parts / subfeatures
- define very thin event handlers, such as handlers that only call a store action or a method returned by a child hook

Forbidden:

- direct use of `useEffect`, `useLayoutEffect`, or `useInsertionEffect`
- direct `window` / `document` event registration
- direct timer / observer / worker / polling management
- async lifecycle workflows
- growing into a large view model spanning multiple subfeatures
- being called directly by `index.tsx` or parent Units
- importing parent private hook files, such as `../hooks/useParentPrivateHook`

If the logic lifecycle matches the current visible Unit, move it to `hooks/useXxx.ts` in the current Unit.

If the logic lifecycle outlives the visible Unit, promote it to the top-level feature `runtimes/`.

If the logic is a reusable pure function, move it to the current Unit or parent Unit `utils/`.

## `runtimes/`

`runtimes/` is only allowed on top-level features:

```text
src/features/<feature>/runtimes/
```

Use cases:

- backend polling
- lifecycle synchronization
- worker bridges
- task dispatch
- non-UI business processes that must keep running while UI is hidden or switched

Rules:

- Runtimes do not render business UI.
- Runtimes are mounted only by the top-level feature `index.tsx`.
- Subfeatures must not own runtimes.
- `runtimes/index.tsx` is the public aggregation entry for runtimes.
- Runtimes are self-contained by default. Do not split out `use<Runtime>.ts` hooks by default.
- Do not create runtime hooks such as `useFeedbackRuntime.ts` or `useSpectrumRuntime.ts` when they are used by only one runtime.
- If a runtime becomes complex, prefer splitting a private runtime task file in the same directory, such as `SpectrumRuntimeTask.tsx`, instead of splitting a `useRuntime` hook.
- Do not create `hooks/` or `utils/` inside `runtimes/`.
- Only promote logic to the current FeatureUnit sibling `hooks/` or `utils/` when it is reused by multiple runtimes or is genuinely standalone testable pure logic.
- If the logic lifecycle matches a visible subfeature, put it in the subfeature's `hooks/useXxx.ts` or a local component effect, not in runtime.
- If the logic lifecycle outlives a visible subfeature, promote it to the top-level feature `runtimes/`.

## `animations/`

`animations/` stores animation definitions. Always use the plural directory name.

Animations may be used by the current Unit's view / parts / components, but they must not depend on business hooks / stores.

## Query and Store Boundary

- Remote data should stay in TanStack Query by default.
- Zustand store is for local UI state, drafts, selections, and modes.
- Do not copy query results into store merely for convenience.
- Query results, query status, and error state do not belong in store by default.

Good query-owned data:

- API response data
- request status
- cache identity

Good store-owned data:

- current selection
- current mode
- input drafts
- local toggles

## Decision Cheatsheet

- Visible independent business capability: `subfeatures/`.
- Current Unit's business view fragment: `parts/`.
- Business view fragments owned by the current Unit and reused by multiple direct children: parent `parts/`.
- Reusable non-business UI: `components/`.
- Recipes follow concrete UI owners; do not create `recipes/` directories.
- Current Unit lifecycle / behavior split: `hooks/useXxx.ts`.
- Non-UI process with a lifecycle across subfeatures: top-level `runtimes/`.
- Runtimes are self-contained by default; do not split `useRuntime` hooks for a single runtime.
- `use<Unit>.ts` only composes; it must not directly own effects / timers / listeners.
- `index.tsx` is only a public entry; `<Unit>.tsx` calls `use<Unit>()` internally.
- `<Unit>.tsx` does not import `hooks/` directly; current Unit hook composition goes through `use<Unit>.ts`.
- Top-level store creates the store; nested stores only aggregate slices.
- Once `subfeatures/` exists, the root `<Unit>` only orchestrates. It must not become a grab bag.

## Review Checklist

- Was a feature-specific panel placed in `components/`?
- Did a component import the current Unit's `parts/`, `store/`, `hooks/`, or `utils/`?
- Was a `recipes/` directory created, or were multiple UI owners' recipes placed in one Unit recipe file?
- Does TSX build static style objects instead of expressing them through recipe variants?
- Do sibling subfeatures import each other?
- Does a subfeature incorrectly own `runtimes/`?
- Did a runtime split out a `useRuntime` hook that is only used by itself?
- Does `use<Unit>.ts` directly own `useEffect` / timers / listeners / observers?
- Does `index.tsx` call `use<Unit>()` or inject Unit model props into `<Unit />`?
- Does `<Unit>.tsx` directly import `hooks/` instead of going through `use<Unit>.ts`?
- Does `<Unit>.tsx` receive a whole model produced by `use<Unit>.ts` instead of calling `use<Unit>()` itself?
- Was an empty `store/` created preemptively without actual slices / selectors?
- Does every Unit with `store/` have `store/index.ts`?
- Did a nested Unit `store/index.ts` incorrectly create a new store?
- Was `store/index.ts` mistaken for a replacement of leaf slice / selector files, causing still-used leaf files to be deleted?
- Once `subfeatures/` exists, do root `<Unit>.tsx` / `use<Unit>.ts` still contain grab-bag business logic?
- Were query data / query status copied into Zustand store?
- Was a child-subfeature-specific part incorrectly placed in parent `parts/`?
- Did a child subfeature import grandparent `parts/`, or import sibling subfeature `parts/`?
- Did a parent part reused by child subfeatures start reading stores, calling queries / mutations, or owning business workflow state?
