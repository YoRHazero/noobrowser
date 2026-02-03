---
trigger: always_on
---

# Component Hook Structure Rules

## Applicability
Apply this structure when creating or modifying **Component Hooks** (custom React hooks designed to power specific UI components, typically located in `features/*/hooks/`).

## Section Order & Hierarchy
You MUST organize the code inside the hook in the following **STRICT ORDER**.
All sections are **OPTIONAL** (except `Return`), but if they exist, they **MUST** appear in this sequence.

1.  **Access Store**: Zustand/Context selectors.
2.  **Local State**: React local state (`useState`, `useRef`).
3.  **Derived Values**: Computed values (`useMemo`) or simple derived variables.
4.  **Mutations/Query**: async side-effects, API calls, or mutations.
5.  **Effects**: `useEffect`, `useLayoutEffect`.
6.  **Handle**: Event handlers and interaction logic functions.
7.  **Return**: The object returned by the hook (REQUIRED).

## Formatting Requirements
1.  Each section MUST be separated by the specific **Comment Banner** style shown below.
2.  Do NOT create a banner for a section if it is empty.

## Code Template

```typescript
export function useComponentName() {
  /* -------------------------------------------------------------------------- */
  /*                                Access Store                                */
  /* -------------------------------------------------------------------------- */
  const { data } = useFitStore(useShallow(state => ({ data: state.data })));

  /* -------------------------------------------------------------------------- */
  /*                                 Local State                                */
  /* -------------------------------------------------------------------------- */
  const [isOpen, setIsOpen] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                               Derived Values                               */
  /* -------------------------------------------------------------------------- */
  const isEnabled = useMemo(() => !!data, [data]);

  /* -------------------------------------------------------------------------- */
  /*                              Mutations/Query                               */
  /* -------------------------------------------------------------------------- */
  const { mutate } = useMutation();

  /* -------------------------------------------------------------------------- */
  /*                                   Effects                                  */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    // Effect logic here
  }, [isEnabled]);

  /* -------------------------------------------------------------------------- */
  /*                                   Handle                                   */
  /* -------------------------------------------------------------------------- */
  const handleClick = () => { /* ... */ };

  /* -------------------------------------------------------------------------- */
  /*                                   Return                                   */
  /* -------------------------------------------------------------------------- */
  return {
    data,
    isOpen,
    isEnabled,
    handleClick,
  };
}