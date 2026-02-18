import { useCatalogStore } from "../../store/catalog-store";
import { useShallow } from "zustand/react/shallow";
import { useCatalogSourceDetail, type SourceCatalogBase } from "@/hooks/query/catalog";
import { useUpdateCatalogEntry } from "@/hooks/query/catalog/useUpdateCatalogEntry";
import { useDeleteCatalogEntry } from "@/hooks/query/catalog/useDeleteCatalogEntry";
import { useEffect } from "react";

export function useSourceMetadata() {
  /* -------------------------------------------------------------------------- */
  /*                                Access Store                                */
  /* -------------------------------------------------------------------------- */
  const { selectedSourceId, clearSelection, syncSelectedSource } = useCatalogStore(
    useShallow((state) => ({
      selectedSourceId: state.selectedSourceId,
      clearSelection: state.clearSelection,
      syncSelectedSource: state.syncSelectedSource,
    }))
  );

  /* -------------------------------------------------------------------------- */
  /*                              Mutations/Query                               */
  /* -------------------------------------------------------------------------- */
  const query = useCatalogSourceDetail(selectedSourceId ?? "");
  const updateMutation = useUpdateCatalogEntry();
  const deleteMutation = useDeleteCatalogEntry();

  /* -------------------------------------------------------------------------- */
  /*                                   Effects                                  */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (query.data) {
      syncSelectedSource(query.data);
    }
  }, [query.data, syncSelectedSource]);

  /* -------------------------------------------------------------------------- */
  /*                                   Handle                                   */
  /* -------------------------------------------------------------------------- */
  const handleUpdate = (fields: Partial<SourceCatalogBase>) => {
    if (selectedSourceId) {
      updateMutation.mutate({ sourceId: selectedSourceId, body: fields });
    }
  };

  const handleDelete = () => {
    if (selectedSourceId) {
      deleteMutation.mutate(selectedSourceId, {
        onSuccess: () => {
          clearSelection();
        },
      });
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Return                                   */
  /* -------------------------------------------------------------------------- */
  return {
    source: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    handleUpdate,
    handleDelete,
    isDeleting: deleteMutation.isPending,
  };
}
