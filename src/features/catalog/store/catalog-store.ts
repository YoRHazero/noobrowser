import { create } from "zustand";
import type { CatalogItemResponse } from "@/hooks/query/catalog";

interface CatalogStoreState {
	selectedSourceId: string | null;
	selectedSource: CatalogItemResponse | null;
	selectedFitJobId: string | null;
	page: number;
	pageSize: number;
	sortDesc: boolean;
	user: string | null;
	setPage: (page: number) => void;
	setPageSize: (pageSize: number) => void;
	setSortDesc: (sortDesc: boolean) => void;
	setUser: (user: string | null) => void;
	setSelectedSource: (source: CatalogItemResponse | null) => void;
	toggleSelectedSource: (source: CatalogItemResponse) => void;
	clearSelection: () => void;
	setSelectedFitJobId: (jobId: string | null) => void;
	syncSelectedSource: (source: CatalogItemResponse) => void;
}

export const useCatalogStore = create<CatalogStoreState>()((set, get) => ({
	selectedSourceId: null,
	selectedSource: null,
	selectedFitJobId: null,
	page: 1,
	pageSize: 20,
	sortDesc: true,
	user: null,
	setPage: (page) => set({ page }),
	setPageSize: (pageSize) => set({ pageSize }),
	setSortDesc: (sortDesc) => set({ sortDesc }),
	setUser: (user) => set({ user }),
	setSelectedSource: (source) =>
		set({
			selectedSource: source,
			selectedSourceId: source?.id ?? null,
			selectedFitJobId: null,
		}),
	toggleSelectedSource: (source) =>
		set((state) => {
			if (state.selectedSourceId === source.id) {
				return {
					selectedSource: null,
					selectedSourceId: null,
					selectedFitJobId: null,
				};
			}
			return {
				selectedSource: source,
				selectedSourceId: source.id,
				selectedFitJobId: null,
			};
		}),
	clearSelection: () =>
		set({
			selectedSource: null,
			selectedSourceId: null,
			selectedFitJobId: null,
		}),
	setSelectedFitJobId: (jobId) => set({ selectedFitJobId: jobId }),
	syncSelectedSource: (source) => {
		const { selectedSourceId } = get();
		if (!selectedSourceId || selectedSourceId !== source.id) return;
		set({ selectedSource: source });
	},
}));
