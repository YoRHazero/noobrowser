import { create } from "zustand";
import type { CatalogItemListResponse, CatalogSourceDetailResponse } from "@/hooks/query/catalog";

interface CatalogStoreState {
	selectedSourceId: string | null;
	selectedSource: CatalogItemListResponse | CatalogSourceDetailResponse | null;
	selectedFitJobId: string | null;
	selectedPlotModelName: string | null;
	subtractModelList: string[] | null;
	page: number;
	pageSize: number;
	sortDesc: boolean;
	user: string | null;
	setPage: (page: number) => void;
	setPageSize: (pageSize: number) => void;
	setSortDesc: (sortDesc: boolean) => void;
	setUser: (user: string | null) => void;
	setSelectedSource: (source: CatalogItemListResponse | CatalogSourceDetailResponse | null) => void;
	toggleSelectedSource: (source: CatalogItemListResponse | CatalogSourceDetailResponse) => void;
	clearSelection: () => void;
	setSelectedFitJobId: (jobId: string | null) => void;
	setSelectedPlotModelName: (modelName: string | null) => void;
	setSubtractModelList: (modelNames: string[] | null) => void;
	syncSelectedSource: (source: CatalogItemListResponse | CatalogSourceDetailResponse) => void;
}

export const useCatalogStore = create<CatalogStoreState>()((set, get) => ({
	selectedSourceId: null,
	selectedSource: null,
	selectedFitJobId: null,
	selectedPlotModelName: null,
	subtractModelList: null,
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
			selectedPlotModelName: null,
			subtractModelList: null,
		}),
	toggleSelectedSource: (source) =>
		set((state) => {
			if (state.selectedSourceId === source.id) {
				return {
					selectedSource: null,
					selectedSourceId: null,
					selectedFitJobId: null,
					selectedPlotModelName: null,
					subtractModelList: null,
				};
			}
			return {
				selectedSource: source,
				selectedSourceId: source.id,
				selectedFitJobId: null,
				selectedPlotModelName: null,
				subtractModelList: null,
			};
		}),
	clearSelection: () =>
		set({
			selectedSource: null,
			selectedSourceId: null,
			selectedFitJobId: null,
			selectedPlotModelName: null,
			subtractModelList: null,
		}),
	setSelectedFitJobId: (jobId) =>
		set((state) => {
			if (state.selectedFitJobId === jobId) return state;
			return {
				selectedFitJobId: jobId,
				selectedPlotModelName: null,
				subtractModelList: null,
			};
		}),
	setSelectedPlotModelName: (modelName) =>
		set({ selectedPlotModelName: modelName }),
	setSubtractModelList: (modelNames) => set({ subtractModelList: modelNames }),
	syncSelectedSource: (source) => {
		const { selectedSourceId } = get();
		if (!selectedSourceId || selectedSourceId !== source.id) return;
		set({ selectedSource: source });
	},
}));
