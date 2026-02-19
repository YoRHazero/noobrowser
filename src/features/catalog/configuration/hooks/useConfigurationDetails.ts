import { useCatalogStore } from "../../store/catalog-store";
import { useShallow } from "zustand/react/shallow";

export function useConfigurationDetails() {
  /* -------------------------------------------------------------------------- */
  /*                                Access Store                                */
  /* -------------------------------------------------------------------------- */
  const {
    selectedFitJobId,
    selectedModelName,
  } = useCatalogStore(
    useShallow((state) => ({
      selectedFitJobId: state.selectedFitJobId,
      selectedModelName: state.selectedModelName,
    })),
  );

  /* -------------------------------------------------------------------------- */
  /*                                   Return                                   */
  /* -------------------------------------------------------------------------- */
  return {
    selectedFitJobId,
    selectedModelName,
  };
}
