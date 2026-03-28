# Overview Canvas

## Folder Roles

- `core/`: scene infrastructure only. Keep camera, controls, environment, and canvas constants here. Do not put footprint business rules or remote data fetching here.
- `layers/`: scene-level composition. A layer may read `src/features/overview/hooks/` and `@/stores/overview`, then pass plain props down to `objects/`.
- `objects/`: reusable single-purpose render objects. They must receive all state through props. They must not access Zustand stores directly and must not run queries.
- `hooks/`: canvas-only behavior hooks. Use them for camera flight, event bridging, and tooltip projection. They may use Three or React Three Fiber APIs, but they do not own remote data fetching.

## Dependency Rules

- `core/` stays scene-wide and should not depend on `layers/` or feature-level data hooks.
- `layers/` may depend on `core/`, `objects/`, `canvas/hooks/`, `src/features/overview/hooks/`, `src/features/overview/utils/`, and `@/stores/overview`.
- `objects/` may depend on props, `core/constants.ts`, and pure helpers in `src/features/overview/utils/`. Do not import Zustand stores or query hooks here.
- `hooks/` may depend on canvas APIs and pure helpers, but remote data must be fetched in `src/features/overview/hooks/` before it enters `canvas/`.
- `utils/` stays pure. No React, no Zustand, no `@react-three/fiber`.

## Bootstrap Rules

- Do not edit legacy code under `src/features/footprint/` during this bootstrap phase.
- Do not move data fetching into `canvas/`.
- Keep `sidebar/` for overview UI outside the Three canvas.
