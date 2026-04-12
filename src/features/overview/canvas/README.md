# Overview Canvas

## Folder Roles

- `core/`: scene infrastructure only. Keep camera, controls, environment, and canvas constants here. Do not put footprint business rules or remote data fetching here.
- `layers/`: scene-level composition. A layer may read `src/features/overview/hooks/` and `@/stores/overview`, then pass plain props down to `objects/`.
- `objects/`: reusable single-purpose render objects. They must receive all state through props. They must not access Zustand stores directly and must not run queries.
- `hooks/`: canvas-only behavior hooks. Use them for camera flight, canvas-level polygon hit resolution, pointer handling, and other scene-side interaction helpers. They may use Three or React Three Fiber APIs and may bridge selection or hover state into the overview store, but they do not own remote data fetching or DOM tooltip rendering.

## Dependency Rules

- `core/` stays scene-wide and should not depend on `layers/` or feature-level data hooks.
- `layers/` may depend on `core/`, `objects/`, `canvas/hooks/`, `src/features/overview/hooks/`, `src/features/overview/utils/`, and `@/stores/overview`.
- `objects/` may depend on props, `core/constants.ts`, and pure helpers in `src/features/overview/utils/`. Do not import Zustand stores or query hooks here. Footprint render objects should stay visual-only; canvas-level hooks own polygon hit resolution for hover and click.
- `hooks/` may depend on canvas APIs and pure helpers, but remote data must be fetched in `src/features/overview/hooks/` before it enters `canvas/`.
- `utils/` stays pure. No React, no Zustand, no `@react-three/fiber`.

## Query And Store Rules

- `useQueryAxiosGet` is a low-level primitive. It must only be imported inside `src/hooks/query/**`.
- `src/features/overview/hooks/` must consume concrete overview query hooks from `src/hooks/query/**`; do not import `useQueryAxiosGet` directly there.
- Do not add feature hooks that only wrap Zustand selectors/actions. When a canvas component needs overview store state, use `useOverviewStore(useShallow(...))` directly at the call site.
- Hover state plumbing is allowed, and a phase may render a DOM tooltip from `OverviewCanvas.tsx` or another feature-level shell. Keep `canvas/hooks/` focused on canvas-level event resolution and positioning helpers rather than DOM tooltip UI ownership.

## Utility And Hook Type Rules

- Put reusable utility-level types in `src/features/overview/shared/types.ts`.
- Put reusable utility-level constants in `src/features/overview/shared/constants.ts`.
- If a type is likely to be reused across utils, hooks, layers, or objects, move it to `shared/types.ts`. If it is local to one file, keep it private and do not export it.
- Hook files may only export their public input/output contract types, such as `*Params` and `*Result`.
- Do not export raw API payload types or other private intermediate normalization types from hook files.

## Boundary Rules

- Do not edit legacy code under `src/features/footprint/` unless a later SPEC explicitly requires it.
- Do not move data fetching into `canvas/`.
- Keep `sidebar/` for overview UI outside the Three canvas.
