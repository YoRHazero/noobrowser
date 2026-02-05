import { useCatalogStore } from "../store/catalog-store";

export function useCatalogSelection() {
	const selectedSourceId = useCatalogStore((state) => state.selectedSourceId);
	const selectedSource = useCatalogStore((state) => state.selectedSource);
	const toggleSelectedSource = useCatalogStore(
		(state) => state.toggleSelectedSource,
	);
	const setSelectedSource = useCatalogStore((state) => state.setSelectedSource);
	const clearSelection = useCatalogStore((state) => state.clearSelection);
	const syncSelectedSource = useCatalogStore(
		(state) => state.syncSelectedSource,
	);

	return {
		selectedSourceId,
		selectedSource,
		toggleSelectedSource,
		setSelectedSource,
		clearSelection,
		syncSelectedSource,
	};
}
