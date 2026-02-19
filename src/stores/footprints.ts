import { create } from "zustand";
import type {
	BackgroundState,
	Footprint,
	GridState,
	ViewState,
	XY,
} from "@/stores/stores-types";
import { clamp, wrapDeg360 } from "@/utils/projection";

interface GlobeState {
	footprints: Footprint[];
	view: ViewState;
	globeBackground: BackgroundState;
	globeGrid: GridState;
	hoveredFootprintId: string | null;
	hoveredFootprintMousePosition: XY | null;
	selectedFootprintId: string | null;
	userPoints: UserPoint[];
	setView: (patch: Partial<ViewState>) => void;
	setGlobeBackground: (background: BackgroundState) => void;
	setGlobeGrid: (patch: Partial<GridState>) => void;
	setFootprints: (footprints: Footprint[]) => void;
	setHoveredFootprintId: (id: string | null) => void;
	setHoveredFootprintMousePosition: (position: XY | null) => void;
	setSelectedFootprintId: (id: string | null) => void;
	setFootprintMeta: (id: string, key: string, value: unknown) => void;
	addUserPoint: (point: UserPoint) => void;
	removeUserPoint: (id: string) => void;
}

export interface UserPoint {
	id: string;
	ra: number;
	dec: number;
	label?: string;
}

import { persist } from "zustand/middleware";

export const useGlobeStore = create<GlobeState>()(
	persist(
		(set, get) => ({
			footprints: [],
			userPoints: [],
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
					};
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
				set((state) => ({
					footprints: state.footprints.map((fp) =>
						fp.id === id
							? { ...fp, meta: { ...(fp.meta || {}), [key]: value } }
							: fp,
					),
				})),
			getBasenameList: (id: string): string[] => {
				const footprint = get().footprints.find((fp) => fp.id === id);
				return footprint?.meta?.included_files ?? [];
			},
			getSelectedBasenameList: (): string[] => {
				const selectedId = get().selectedFootprintId;
				if (!selectedId) return [];
				const footprint = get().footprints.find((fp) => fp.id === selectedId);
				return footprint?.meta?.included_files ?? [];
			},
			addUserPoint: (point) =>
				set((state) => ({ userPoints: [...state.userPoints, point] })),
			removeUserPoint: (id) =>
				set((state) => ({
					userPoints: state.userPoints.filter((p) => p.id !== id),
				})),
		}),
		{
			name: "footprint-storage",
			partialize: (state) => ({ userPoints: state.userPoints }),
		},
	),
);
