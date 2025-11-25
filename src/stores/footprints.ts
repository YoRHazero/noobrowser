import { create } from "zustand";
import { clamp, wrapDeg360 } from "@/utils/projection";

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

type BackgroundState = {
  centerX: number;
  centerY: number;
  initialRadius: number;
}

type GridState = {
  showGrid: boolean;
  meridianStep: number;
  parallelStep: number;
}

interface GlobeState {
  footprints: Footprint[];
  view: ViewState;
  globeBackground: BackgroundState;
  globeGrid: GridState;
  hoveredFootprintId: string | null;
  hoveredFootprintMousePosition: { x: number; y: number } | null;
  selectedFootprintId: string | null;
  setView: (patch: Partial<ViewState>) => void;
  setGlobeBackground: (background: BackgroundState) => void;
  setGlobeGrid: (patch: Partial<GridState>) => void;
  setFootprints: (footprints: Footprint[]) => void;
  setHoveredFootprintId: (id: string | null) => void;
  setHoveredFootprintMousePosition: (
    position: { x: number; y: number } | null,
  ) => void;
  setSelectedFootprintId: (id: string | null) => void;
  setFootprintMeta: (id: string, key: string, value: any) => void;
}

export const useGlobeStore = create<GlobeState>()((set) => ({
  footprints: [],
  view: { yawDeg: 0, pitchDeg: 0, scale: 1 },
  globeBackground: { centerX: 200, centerY: 200, initialRadius: 200 },
  globeGrid: { showGrid: true, meridianStep: 90, parallelStep: 30 },
  hoveredFootprintId: null,
  hoveredFootprintMousePosition: null,
  selectedFootprintId: null,
  setView: (patch) =>
    set((state) => {
      let newYaw = patch.yawDeg ?? state.view.yawDeg;
      newYaw = wrapDeg360(newYaw);
      
      let newPitch = patch.pitchDeg ?? state.view.pitchDeg;
      newPitch = clamp(newPitch, -90, 90);
      return {
        view: { ...state.view, ...patch, yawDeg: newYaw, pitchDeg: newPitch },
      }
    }),
  setGlobeBackground: (background) => set({ globeBackground: background }),
  setGlobeGrid: (patch) =>
    set((state) => ({ globeGrid: { ...state.globeGrid, ...patch } })),
  setFootprints: (footprints) => set({ footprints }),
  setHoveredFootprintId: (id) => set({ hoveredFootprintId: id }),
  setHoveredFootprintMousePosition: (position) =>
    set({ hoveredFootprintMousePosition: position }),
  setSelectedFootprintId: (id) => set({ selectedFootprintId: id }),
  setFootprintMeta: (id, key, value) =>
    set(
      (state) => ({
        footprints: state.footprints.map((fp) =>
          fp.id === id 
            ? { ...fp, meta: { ...(fp.meta || {}), [key]: value } }
            : fp
        ),
      })
    )
}));
