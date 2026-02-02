# Noobrowser Project Documentation

## 1. Overview
**Noobrowser** is a scientific data visualization application built with **TypeScript** and **React**, deployed as a web application.
- **Primary stack**: React 19, Vite 7, TypeScript.
- **Deployment target**: Web (primary).
- **Tauri**: Can be ignored. It is a thin wrapper for desktop builds; no business logic exists in `src-tauri`.
- **Backend**: Separated service (not in this repo).

## 2. Directory Structure & Status

### `src/routes` (Application Entry Points)
File-based routing via **TanStack Router**.
- `inspector.tsx` (**Active/Main**): The core analysis view. Inspects Grism and Footprint data.
- `index.tsx`: Landing page.
- `catalog.tsx`: Catalog browsing view.
- `test.tsx`: **Internal Testing**. Ignore for feature development.
- `__root.tsx`: Global layout and providers (QueryClient, Toaster, DevTools).

### `src/features` (Domain Logic)
This is where the bulk of the application resides.

#### `src/features/grism` (Spectral Analysis)
This module is **under active refactoring**. The architecture is hybrid:
- **Legacy/Glue Code**: Top-level `*.tsx` files in this folder often act as "old" container components or bridges.
- **Refactored Code**: The `backward` subdirectory represents the new, modular architecture.

| Path | Status | Description |
| :--- | :--- | :--- |
| `grism/backward/` | **⭐ ACTIVE (Refactored)** | **The "New" Architecture**. Contains the Grism Backward View. Logic is split into `hooks/` and UI into `layers/`. **Write new code here.** |
| `grism/backwardtoolbar/` | **Active** | Toolbar components for the backward view. |
| `grism/spectrum2d/` | **Active** | 2D Spectrum rendering components (Forward view). |
| `grism/spectrum1d/` | **Active** | 1D Spectrum rendering components (Forward view). |
| `grism/forwardcontrol/` | **Active** | Controls for "Extraction" tab in Forward view. |
| `grism/forwardfit/` | **Active** | Logic and UI for the "Fit" tab in Forward view. |
| `grism/forwardsource/` | **Active** | logic and UI for the "Sources" tab in Forward view. |
| `grism/forwardprior/` | **Active** | Prior configuration components (used by Source settings). |
| `grism/tracesource/` | **Legacy/Transitional** | Source drawing logic (used by `GrismTraceSourceDrawer` in Backward view). |
| `grism/fitjob/` | **Active** | Extraction settings configuration. |
| `grism/GrismBackward.tsx` | **Glue** | Entry point for Backward view. |
| `grism/GrismForward.tsx` | **Glue** | Entry point for Forward view. |

#### `src/features/footprint` (Spatial Visualization)
**Status**: Active.
- `FootprintCanvas.tsx`: 3D/2D visualization canvas.
- `FootprintPanel.tsx`: Data grid/panel.
- `FootprintToolkit.tsx`: Interactive tools.

#### `src/features/catalog` (Data Catalog)
**Status**: Active.
- Manages source catalogs.

### `src/stores` (Global State)
State management using **Zustand**.
- `image.ts`: **Core**. Manages loaded images, normalization, and UI state for rendering.
- `footprints.ts`: Manages footprint selections and data.
- `fit.ts`: 1D fitting state.
- `sources.ts`: Source catalog state.
- `connection.ts`: Backend connection status/config.
- `stores-types.ts`: Type definitions for stores.

### `src/components` (Shared UI)
- `components/layout`: Generic layout blocks (Title, Header, etc.).
- `components/ui`: Chakra UI wrappers/custom components.
- `components/three`: Shared Three.js components (e.g., `GrismImageLayer`, `RoiComponent`).
- `components/pixi`: Shared PixiJS components.

### `src/hooks` (Global Hooks)
- `hotkey-hook.ts`: Keyboard interactions.
- `connection-hook.ts`: React Query wrappers for data fetching.

### `src/deprecated`
- **Dead Code**. Anything in this folder should be ignored or deleted.

## 3. Key Concepts for Agents

1.  **Architecture Transition**:
    -   The project is moving *from* monolithic components *to* a `hooks` + `layers` (logic + view separation) pattern.
    -   **Example**: `GrismBackwardMainCanvas.tsx` orchestrates the view, but the actual drawing is delegated to layers in `backward/layers/` (e.g., `EmissionMaskLayer`). State logic is pulled from `backward/hooks/`.

2.  **Coordinates & Rendering**:
    -   **Three.js** is used for the "Backward" view (`GrismBackwardMainCanvas`).
    -   **PixiJS** is used for the "Forward" 2D view (`GrismForward2dCanvas`).
    -   **Visx** is used for 1D charts (`Grism1DCanvas`, `GrismBackward1DChart`).

3.  **Data Flow**:
    -   Backend -> `hooks/query` (TanStack Query) -> `stores/*` (Zustand) -> Components.

## 4. Backend Requirements

### Emission Mask (Bitmask Support) [NEW]
To support efficient per-frame toggling of emission masks without re-fetching data, the backend endpoint `/wfss/emission_mask/<group_id>` must be updated.

**Response Headers:**
-   `x-mask-format`: Specifies the data type of the binary response. Must be one of:
    -   `'uint8'` (1-8 frames)
    -   `'uint16'` (9-16 frames)
    -   `'uint32'` (17-32 frames)
-   `x-mask-frames`: Integer. The total number of frames included in the mask (e.g., `8`). The bits in the pixel value correspond to these frames (Bit 0 = Frame 0, Bit 1 = Frame 1, etc.).

**Response Body:**
-   **Binary Data**: Raw binary buffer of the specified integer type.
-   **Pixel Interpretation**: Each pixel is an integer where each bit represents the presence of the mask for a specific frame index.
    -   Example: Value `5` (binary `0...0101`) means Frame 0 and Frame 2 have masks at this pixel.
-   **Note**: The data should **not** include any header bytes (like a NumPy header) if possible, or the frontend must be informed of the offset. Raw binary array is preferred.
