import { produce } from "immer";

import { create } from "zustand";
import type {
	CollapseWindow,
	RoiState,
	TraceSource,
} from "@/stores/stores-types";
import { generateColor } from "@/stores/stores-utils";

interface SourcesState {
	traceMode: boolean;
	traceSources: TraceSource[];
	mainTraceSourceId: string | null;
	displayedTraceSourceId: string | null;
	setTraceMode: (mode: boolean) => void;
	addTraceSource: (
		id: string,
		x: number,
		y: number,
		ra: number,
		dec: number,
		groupId: string | null,
		roi: { roiState: RoiState; collapseWindow: CollapseWindow },
	) => void;
	updateTraceSource: (id: string, patch: Partial<TraceSource>) => void;
	updateMainTraceSource: (patch: Partial<TraceSource>) => void;
	setMainTraceSource: (id: string | null) => void;
	setDisplayedTraceSource: (id: string | null) => void;
	removeTraceSource: (id: string) => void;
	reassignTraceSourceColor: () => void;
	clearTraceSources: () => void;
	applyRoiToAllTraceSources: (roi: {
		roiState: RoiState;
		collapseWindow: CollapseWindow;
	}) => void;
}

export const useSourcesStore = create<SourcesState>()((set, get) => ({
	traceMode: false,
	traceSources: [],
	mainTraceSourceId: null,
	displayedTraceSourceId: null,
	setTraceMode: (mode) => set({ traceMode: mode }),
	addTraceSource: (id, x, y, ra, dec, groupId, roi) =>
		set(
			produce((state: SourcesState) => {
				const newSource: TraceSource = {
					id,
					x,
					y,
					ra,
					dec,
					groupId: groupId,
					color: generateColor(state.traceSources.length),
					spectrumReady: false,
					roi: {
						roiState: { ...roi.roiState },
						collapseWindow: { ...roi.collapseWindow },
					},
				};
				state.traceSources.push(newSource);
				state.mainTraceSourceId = newSource.id;
			}),
		),
	updateTraceSource: (id, patch) =>
		set(
			produce((state: SourcesState) => {
				const source = state.traceSources.find((source) => source.id === id);
				if (source) {
					Object.assign(source, patch);
				}
			}),
		),
	updateMainTraceSource: (patch) => {
		const mainId = get().mainTraceSourceId;
		if (mainId) {
			get().updateTraceSource(mainId, patch);
		}
	},
	setMainTraceSource: (id) => set({ mainTraceSourceId: id }),
	setDisplayedTraceSource: (id) => set({ displayedTraceSourceId: id }),
	removeTraceSource: (id) =>
		set(
			produce((state: SourcesState) => {
				state.traceSources = state.traceSources.filter(
					(source) => source.id !== id,
				);
				if (state.mainTraceSourceId === id) {
					state.mainTraceSourceId =
						state.traceSources.length > 0 ? state.traceSources[0].id : null;
				}
				get().reassignTraceSourceColor();
			}),
		),
	reassignTraceSourceColor: () =>
		set(
			produce((state: SourcesState) => {
				state.traceSources.forEach((source, index) => {
					source.color = generateColor(index);
				});
			}),
		),
	clearTraceSources: () => set({ traceSources: [], mainTraceSourceId: null }),
	applyRoiToAllTraceSources: (roiData: {
		roiState: RoiState;
		collapseWindow: CollapseWindow;
	}) =>
		set(
			produce((state: SourcesState) => {
				state.traceSources.forEach((source) => {
					source.roi = {
						roiState: { ...roiData.roiState },
						collapseWindow: { ...roiData.collapseWindow },
					};
				});
			}),
		),
}));
