import { create } from "zustand";

export type RaDec = {
  ra: number;
  dec: number;
};

export type Footprint = {
  id: string;
  vertices: RaDec[];
  meta?: Record<string, any>;
};

type ViewState = {
    yawDeg: number;
    pitchDeg: number;
    scale: number;
};

interface GlobeState {
    footprints: Footprint[];
    view: ViewState;
    setView: (patch: Partial<ViewState>) => void;
    setFootprints: (footprints: Footprint[]) => void;
};

export const useGlobeStore = create<GlobeState>()(
    (set) => ({
        footprints: [],
        view: { yawDeg: 0, pitchDeg: 0, scale: 1 },
        setView: (patch) => set((state) => ({ view: { ...state.view, ...patch } })),
        setFootprints: (footprints) => set(() => ({ footprints: footprints })),
    })
);
