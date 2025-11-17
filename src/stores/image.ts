import { create } from 'zustand';

export type CutoutParams = {
    cutoutPmin: number;
    cutoutPmax: number;
    x0: number;
    y0: number;
    width: number;
    height: number;
}

export type CounterpartPosition = {
    x0: number;
    y0: number;
    width: number;
    height: number;
};

interface CounterpartState {
    availableFilters: string[];
    filterRGB: { r: string; g: string; b: string };
    normParams: { pmin: number; pmax: number };
    cutoutParams: CutoutParams;
    counterpartPosition: CounterpartPosition;
    showCutout: boolean;
    setAvailableFilters: (filters: string[]) => void;
    setFilterRGB: (patch: Partial<{ r: string; g: string; b: string }>) => void;
    setNormParams: (params: { pmin: number; pmax: number }) => void;
    setCounterpartPosition: (patch: Partial<CounterpartPosition>) => void;
    setCutoutParams: (patch: Partial<CutoutParams>) => void;
    setShowCutout: (show: boolean) => void;
}

export const useCounterpartStore = create<CounterpartState>()((set) => ({
    availableFilters: [],
    filterRGB: { r: '', g: '', b: '' },
    normParams: { pmin: 1, pmax: 99 },
    counterpartPosition: { x0: 0, y0: 0, width: 3000, height: 0 },
    cutoutParams: { cutoutPmin: 1, cutoutPmax: 99, x0: 0, y0: 0, width: 100, height: 100 },
    showCutout: false,
    setAvailableFilters: (filters) => set({ availableFilters: filters }),
    setFilterRGB: (patch) => set((state) => ({ filterRGB: { ...state.filterRGB, ...patch } })),
    setNormParams: (params) => set({ normParams: params }),
    setCounterpartPosition: (patch) => set((state) => ({ counterpartPosition: { ...state.counterpartPosition, ...patch } })),
    setCutoutParams: (patch) => set((state) => ({ cutoutParams: { ...state.cutoutParams, ...patch } })),
    setShowCutout: (show) => set({ showCutout: show }),
}));