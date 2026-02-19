import { useEffect } from "react";
import { useCatalogStore } from "../store/catalog-store";
import { useCatalogSourceDetail } from "@/hooks/query/catalog";
import { useShallow } from "zustand/react/shallow";

export function useCatalogDetail() {
  /* -------------------------------------------------------------------------- */
  /*                                Access Store                                */
  /* -------------------------------------------------------------------------- */
  const {
    selectedSourceId,
    selectedFitJobId,
    setSelectedFitJobId,
    syncSelectedSource,
    clearSelection,
  } = useCatalogStore(
    useShallow((state) => ({
      selectedSourceId: state.selectedSourceId,
      selectedFitJobId: state.selectedFitJobId,
      setSelectedFitJobId: state.setSelectedFitJobId,
      syncSelectedSource: state.syncSelectedSource,
      clearSelection: state.clearSelection,
    }))
  );

  /* -------------------------------------------------------------------------- */
  /*                              Mutations/Query                               */
  /* -------------------------------------------------------------------------- */
  /* -------------------------------------------------------------------------- */
  /*                              Mutations/Query                               */
  /* -------------------------------------------------------------------------- */
  const query = useCatalogSourceDetail(selectedSourceId ?? "");

  /* -------------------------------------------------------------------------- */
  /*                                   Effects                                  */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (query.data) {
      syncSelectedSource(query.data);
    }
  }, [query.data, syncSelectedSource]);

  /* -------------------------------------------------------------------------- */
  /*                                   Return                                   */
  /* -------------------------------------------------------------------------- */
  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    selectedSourceId,
    selectedFitJobId,
    setSelectedFitJobId,
    clearSelection,
  };
}
