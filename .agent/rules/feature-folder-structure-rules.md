---
trigger: manual
---

# Feature Folder Structure Rules

## Applicability
Apply this structure when creating, refactoring, or organizing **Feature Modules** (typically located in `src/features/*/` or `src/components/*/`).
This pattern promotes High Cohesion and Single Responsibility.

## Directory Structure
A feature folder (e.g., `src/features/grism/forwardfit`) MUST follow this structure:

```text
feature-name/
├── index.tsx          # (REQUIRED) Public Entry Point & Container
├── components/        # (OPTIONAL) Private Sub-components (Dumb/UI only)
├── hooks/             # (OPTIONAL) Logic, State (Zustand), Data Fetching
├── recipes/           # (OPTIONAL) Panda CSS or Style Recipes
└── types.ts           # (OPTIONAL) Feature-specific Type Definitions
```

## detailed Responsibilities

### 1. `index.tsx` (The Controller)
- **Role**: acts as the **Public API** of the module.
- **Responsibility**:
    - Exports the main React component.
    - Orchestrates data fetching (via Hooks) and passes data to presentational components.
    - **Avoids** containing complex inner component definitions; move them to `components/`.
- **Exports**: `export default function FeatureName() { ... }`

### 2. `components/` (The View)
- **Role**: Contains **Presentational / Dumb Components**.
- **Responsibility**:
    - Focus on rendering UI based on props.
    - Should NOT contain complex business logic or direct store access (pass data via props from `index.tsx` or specialized hooks).
- **Naming**: PascalCase (e.g., `ModelCard.tsx`, `ConfigurationList.tsx`).

### 3. `hooks/` (The Logic)
- **Role**: Contains **Business Logic & State Management**.
- **Responsibility**:
    - Interacting with Global Stores (Zustand).
    - Handling Data Fetching (React Query).
    - Calculating derived state.
- **Naming**: `useFeatureName.ts` or specific like `useEmissionLines.ts`.

### 4. `recipes/` (The Style)
- **Role**: Contains **Style Logic** for **Chakra UI / DOM Components**.
- **Responsibility**:
    - Panda CSS recipes or slot recipes.
    - Keeping `index.tsx` clean of massive styling objects.
- **Exclusion**: NOT applicable for **Three.js / R3F components** (which usually use standard CSS modules, styled-components, or no styling files).

### 5. `types.ts` (The Contract)
- **Role**: Definitions of types shared *within* the feature.
- **Note**: Global types should go to `src/types/` or store definitions, but types specific to this feature's UI state belong here.

## Import Rules
- **Internal Imports**: Use relative paths (e.g., `import Header from "./components/Header"`).
- **External Imports**: The rest of the app should import ONLY from the feature root (e.g., `import ForwardFit from "@/features/grism/forwardfit"`), NOT deep internal files if possible.
