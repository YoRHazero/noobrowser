import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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

interface GrismState {
    apertureSize: number;
    forwardWaveRange: { min: number; max: number };
    collapseWindow: {
        waveMin: number;
        waveMax: number;
        spatialMin: number;
        spatialMax: number;
    };
    emissionLines: Record<string, number>;
    setApertureSize: (size: number) => void;
    setForwardWaveRange: (patch: Partial<{ min: number; max: number }>) => void;
    setCollapseWindow: (patch: Partial<GrismState['collapseWindow']>) => void;
    setEmissionLines: (lines: Record<string, number>) => void;
    addEmissionLine: (name: string, wavelength: number) => void;
}

export const useGrismStore = create<GrismState>()(
    persist(
        (set) => ({
            apertureSize: 100,
            forwardWaveRange: { min: 3.8, max: 5.0 },
            collapseWindow: {
                waveMin: 3.8,
                waveMax: 5.0,
                spatialMin: 0,
                spatialMax: 100,
            },

            emissionLines: {    // units in microns
                "Ha": 0.6563, 
                "Hb": 0.4861,
                "[OIII]": 0.5007,
                "Pab": 1.2818,
            },
            setApertureSize: (size) => set({ apertureSize: size }),
            setForwardWaveRange: (patch) => set((state) => ({
                forwardWaveRange: { ...state.forwardWaveRange, ...patch }
            })),
            setCollapseWindow: (patch) => set((state) => ({
                collapseWindow: { ...state.collapseWindow, ...patch }
            })),
            setEmissionLines: (lines) => set({ emissionLines: lines }),
            addEmissionLine: (name, wavelength) => set((state) => ({
                emissionLines: { ...state.emissionLines, [name]: wavelength }
            })),

        }),
        {
            name: 'emission-lines-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ emissionLines: state.emissionLines }),
        }
    )
)