import { create } from "zustand";
import type {
  CatalogItemListResponse,
  CatalogSourceDetailResponse,
} from "@/hooks/query/catalog";

interface CatalogStoreState {
  // Selection State
  selectedSourceId: string | null;
  selectedSource: CatalogItemListResponse | CatalogSourceDetailResponse | null;
  selectedFitJobId: string | null;
  selectedModelName: string | null;

  // List View State
  page: number;
  pageSize: number;
  sortDesc: boolean;
  user: string | null;

  // Actions
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSortDesc: (sortDesc: boolean) => void;
  setUser: (user: string | null) => void;

  setSelectedSource: (
    source: CatalogItemListResponse | CatalogSourceDetailResponse | null,
  ) => void;
  toggleSelectedSource: (
    source: CatalogItemListResponse | CatalogSourceDetailResponse,
  ) => void;
  clearSelection: () => void;

  setSelectedFitJobId: (jobId: string | null) => void;
  setSelectedModelName: (modelName: string | null) => void;
  syncSelectedSource: (
    source: CatalogItemListResponse | CatalogSourceDetailResponse,
  ) => void;
}

export const useCatalogStore = create<CatalogStoreState>()((set, get) => ({
  selectedSourceId: null,
  selectedSource: null,
  selectedFitJobId: null,
  selectedModelName: null,

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
      selectedModelName: null,
    }),

  toggleSelectedSource: (source) =>
    set((state) => {
      if (state.selectedSourceId === source.id) {
        return {
          selectedSource: null,
          selectedSourceId: null,
          selectedFitJobId: null,
          selectedModelName: null,
        };
      }
      return {
        selectedSource: source,
        selectedSourceId: source.id,
        selectedFitJobId: null,
        selectedModelName: null,
      };
    }),

  clearSelection: () =>
    set({
      selectedSource: null,
      selectedSourceId: null,
      selectedFitJobId: null,
      selectedModelName: null,
    }),

  setSelectedFitJobId: (jobId) =>
    set((state) => {
      if (state.selectedFitJobId === jobId) return state;
      return {
        selectedFitJobId: jobId,
        selectedModelName: null,
      };
    }),

  setSelectedModelName: (modelName) =>
    set({ selectedModelName: modelName }),

  syncSelectedSource: (source) => {
    const { selectedSourceId } = get();
    // Only update if we are still looking at the same source ID
    // (e.g. detailed view data came in to enrich the list item data)
    if (!selectedSourceId || selectedSourceId !== source.id) return;
    set({ selectedSource: source });
  },
}));
