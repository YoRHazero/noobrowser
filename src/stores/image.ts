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

export type WaveUnit = 'µm' | 'Å';

export type CollapseWindow = {
    waveMin: number;
    waveMax: number;
    spatialMin: number;
    spatialMax: number;
}

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
    showCutout: true,
    setAvailableFilters: (filters) => set({ availableFilters: filters }),
    setFilterRGB: (patch) => set((state) => ({ filterRGB: { ...state.filterRGB, ...patch } })),
    setNormParams: (params) => set({ normParams: params }),
    setCounterpartPosition: (patch) => set((state) => ({ counterpartPosition: { ...state.counterpartPosition, ...patch } })),
    setCutoutParams: (patch) => set((state) => ({ cutoutParams: { ...state.cutoutParams, ...patch } })),
    setShowCutout: (show) => set({ showCutout: show }),
}));

interface GrismState {
    waveUnit: WaveUnit;
    apertureSize: number;
    zRedshift: number;
    grismNorm: { pmin: number; pmax: number };
    forwardWaveRange: { min: number; max: number };
    slice1DWaveRange: { min: number; max: number };
    collapseWindow: CollapseWindow;
    emissionLines: Record<string, number>;
    selectedEmissionLines: Record<string, number>;
    showTraceOnSpectrum2D: boolean;
    setWaveUnit: (unit: WaveUnit) => void;
    setApertureSize: (size: number) => void;
    setZRedshift: (z: number) => void;
    setGrismNorm: (patch: Partial<{ pmin: number; pmax: number }>) => void;
    setForwardWaveRange: (patch: Partial<{ min: number; max: number }>) => void;
    setSlice1DWaveRange: (patch: Partial<{ min: number; max: number }>) => void;
    setCollapseWindow: (patch: Partial<CollapseWindow>) => void;
    setEmissionLines: (lines: Record<string, number>) => void;
    addEmissionLine: (name: string, wavelength: number) => void;
    removeEmissionLine: (name: string) => void;
    setSelectedEmissionLines: (lines: Record<string, number>) => void;
    switchShowTraceOnSpectrum2D: () => void;
}

export const useGrismStore = create<GrismState>()(
    persist(
        (set) => ({
            waveUnit: 'µm',
            apertureSize: 100,
            zRedshift: 0.0,
            grismNorm: { pmin: 1, pmax: 99 },
            forwardWaveRange: { min: 3.8, max: 5.0 },
            slice1DWaveRange: { min: 3.8, max: 5.0 },
            collapseWindow: {
                waveMin: 3.8,
                waveMax: 5.0,
                spatialMin: 0,
                spatialMax: 100,
            },

            emissionLines: {    // units in microns
                "H⍺": 0.6563, 
                "Hβ": 0.4861,
                "[OIII]λ5007": 0.5007,
                "Paβ": 1.2818,
            },
            selectedEmissionLines: {},
            showTraceOnSpectrum2D: true,
            setWaveUnit: (unit) => set({ waveUnit: unit }),
            setApertureSize: (size) => set({ apertureSize: size }),
            setZRedshift: (z) => set({ zRedshift: z }),
            setGrismNorm: (patch) => set((state) => ({ grismNorm: { ...state.grismNorm, ...patch } })),
            setForwardWaveRange: (patch) => set((state) => ({
                forwardWaveRange: { ...state.forwardWaveRange, ...patch }
            })),
            setSlice1DWaveRange: (patch) => set((state) => ({
                slice1DWaveRange: { ...state.slice1DWaveRange, ...patch }
            })),
            setCollapseWindow: (patch) => set((state) => ({
                collapseWindow: { ...state.collapseWindow, ...patch }
            })),
            setEmissionLines: (lines) => {
                const sortedLines = Object.fromEntries(
                    Object.entries(lines).sort((a, b) => a[1] - b[1])
                );
                set({ emissionLines: sortedLines });
            },
            addEmissionLine: (name, wavelength) => {
                set((state) => {
                    const updatedLines = { ...state.emissionLines, [name]: wavelength };
                    const sortedLines = Object.fromEntries(
                        Object.entries(updatedLines).sort((a, b) => a[1] - b[1])
                    );
                    return { emissionLines: sortedLines };
                });
            },
            removeEmissionLine: (name) => {
                set((state) => {
                    const updatedLines = { ...state.emissionLines };
                    delete updatedLines[name];
                    const {[name]: _, ...restSelectedLines} = state.selectedEmissionLines;
                    return { emissionLines: updatedLines, selectedEmissionLines: restSelectedLines };
                });
            },
            setSelectedEmissionLines: (lines) => set({ selectedEmissionLines: lines }),
            switchShowTraceOnSpectrum2D: () => set((state) => ({ showTraceOnSpectrum2D: !state.showTraceOnSpectrum2D })),
        }),

        {
            name: 'emission-lines-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ 
                emissionLines: state.emissionLines,
                selectedEmissionLines: state.selectedEmissionLines
            }),
        }
    )
)