import { produce } from "immer";
import { create } from "zustand";
import type { Source } from "./types";
import { generateColor } from "./utils";

interface SourceState {
	traceMode: boolean;
	sources: Source[];
	mainSourceId: string | null;
	displayedSourceId: string | null;
	setTraceMode: (mode: boolean) => void;
	addSource: (
		id: string,
		x: number,
		y: number,
		ra: number,
		dec: number,
		groupId: string | null
	) => void;
	updateSource: (id: string, patch: Partial<Source>) => void;
	updateMainSource: (patch: Partial<Source>) => void;
	setMainSource: (id: string | null) => void;
	setDisplayedSource: (id: string | null) => void;
	removeSource: (id: string) => void;
	reassignSourceColor: () => void;
	clearSources: () => void;
}

export const useSourceStore = create<SourceState>()((set, get) => ({
	traceMode: false,
	sources: [],
	mainSourceId: null,
	displayedSourceId: null,
	setTraceMode: (mode) => set({ traceMode: mode }),
	addSource: (id, x, y, ra, dec, groupId) =>
		set(
			produce((state: SourceState) => {
				const newSource: Source = {
					id,
					x,
					y,
					ra,
					dec,
					groupId,
					color: generateColor(state.sources.length),
					spectrumReady: false,
				};
				state.sources.push(newSource);
				state.mainSourceId = newSource.id;
			}),
		),
	updateSource: (id, patch) =>
		set(
			produce((state: SourceState) => {
				const source = state.sources.find((source) => source.id === id);
				if (source) {
					Object.assign(source, patch);
				}
			}),
		),
	updateMainSource: (patch) => {
		const mainId = get().mainSourceId;
		if (mainId) {
			get().updateSource(mainId, patch);
		}
	},
	setMainSource: (id) => set({ mainSourceId: id }),
	setDisplayedSource: (id) => set({ displayedSourceId: id }),
	removeSource: (id) =>
		set(
			produce((state: SourceState) => {
				state.sources = state.sources.filter(
					(source) => source.id !== id,
				);
				if (state.mainSourceId === id) {
					state.mainSourceId =
						state.sources.length > 0 ? state.sources[0].id : null;
				}
				get().reassignSourceColor();
			}),
		),
	reassignSourceColor: () =>
		set(
			produce((state: SourceState) => {
				state.sources.forEach((source, index) => {
					source.color = generateColor(index);
				});
			}),
		),
	clearSources: () => set({ sources: [], mainSourceId: null }),
}));
