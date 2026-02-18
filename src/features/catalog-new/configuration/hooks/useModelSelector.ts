import { createListCollection, Select } from "@chakra-ui/react";
import { useCatalogStore } from "../../store/catalog-store";
import { useShallow } from "zustand/react/shallow";
import { useFitResultDetail } from "@/hooks/query/catalog/useFitResultDetail";
import { useEffect } from "react";

export function useModelSelector() {
  /* -------------------------------------------------------------------------- */
  /*                                Access Store                                */
  /* -------------------------------------------------------------------------- */
  const { selectedModelName, setSelectedModelName, selectedFitJobId } = useCatalogStore(
    useShallow((state) => ({
      selectedModelName: state.selectedModelName,
      setSelectedModelName: state.setSelectedModelName,
      selectedFitJobId: state.selectedFitJobId,
    })),
  );

  /* -------------------------------------------------------------------------- */
  /*                              Mutations/Query                               */
  /* -------------------------------------------------------------------------- */
  const { data, isLoading } = useFitResultDetail(selectedFitJobId ?? "", !!selectedFitJobId);

  /* -------------------------------------------------------------------------- */
  /*                               Derived Values                               */
  /* -------------------------------------------------------------------------- */
  const modelNames = data?.model_results?.map((r) => r.model_name) ?? [];
  
  const collection = createListCollection({
    items: modelNames.map((name) => ({ label: name, value: name })),
  });

  const value = selectedModelName ? [selectedModelName] : [];

  /* -------------------------------------------------------------------------- */
  /*                                   Effects                                  */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (modelNames.length > 0) {
      if (!selectedModelName || !modelNames.includes(selectedModelName)) {
        // Prefer "best" model if available, otherwise first
        const bestModel = data?.best_model_name;
        if (bestModel && modelNames.includes(bestModel)) {
          setSelectedModelName(bestModel);
        } else {
            setSelectedModelName(modelNames[0]);
        }
      }
    } else if (selectedModelName && modelNames.length === 0 && !isLoading) {
        // Clear selection if no models found (and not loading)
        setSelectedModelName(null);
    }
  }, [modelNames, selectedModelName, data?.best_model_name, setSelectedModelName, isLoading]);

  /* -------------------------------------------------------------------------- */
  /*                                   Handle                                   */
  /* -------------------------------------------------------------------------- */
  const handleSelectionChange = (e: Select.ValueChangeDetails) => {
    setSelectedModelName(e.value[0]);
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Return                                   */
  /* -------------------------------------------------------------------------- */
  return {
    collection,
    value,
    isLoading,
    handleSelectionChange,
    hasModels: modelNames.length > 0,
  };
}
