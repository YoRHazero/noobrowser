import type { StateCreator } from "zustand";
import type { SourceStore } from ".";
import type {
	Source,
	SourceCreateInput,
	SourceImageRef,
	SourcePosition,
	SourceSpectrumExtractionParams,
	SourceSpectrumState,
	SourceSpectrumStatus,
	SourceVisibility,
	SourceVisibilityKey,
} from "./types";
import { generateColor, generateSourceId } from "./utils";

type SourceMutablePatch = {
	label?: string;
	position?: Partial<Pick<SourcePosition, "x" | "y">>;
	imageRef?: Partial<SourceImageRef>;
	z?: number | null;
	visibility?: Partial<SourceVisibility>;
	spectrum?: Partial<SourceSpectrumState>;
};

function updateSourceSources(
	sources: Source[],
	sourceId: string,
	patch: SourceMutablePatch,
): Source[] | null {
	const sourceIndex = sources.findIndex((source) => source.id === sourceId);
	if (sourceIndex === -1) {
		return null;
	}

	const nextSources = [...sources];
	const currentSource = nextSources[sourceIndex];
	nextSources[sourceIndex] = {
		...currentSource,
		...patch,
		position: patch.position
			? {
					...currentSource.position,
					...patch.position,
				}
			: currentSource.position,
		imageRef: patch.imageRef
			? {
					...currentSource.imageRef,
					...patch.imageRef,
				}
			: currentSource.imageRef,
		visibility: patch.visibility
			? {
					...currentSource.visibility,
					...patch.visibility,
				}
			: currentSource.visibility,
		spectrum: patch.spectrum
			? {
					...currentSource.spectrum,
					...patch.spectrum,
				}
			: currentSource.spectrum,
	};

	return nextSources;
}

const DEFAULT_SOURCE_SPECTRUM_STATE: SourceSpectrumState = {
	status: "idle",
	extractionParams: null,
};

export interface SourceEntitiesSlice {
	sources: Source[];
	createSource: (input: SourceCreateInput) => Source;
	deleteSource: (sourceId: string) => void;
	setSourceLabel: (sourceId: string, label: string | undefined) => void;
	setSourceZ: (sourceId: string, z: number | null) => void;
	setSourcePosition: (
		sourceId: string,
		position: Pick<SourcePosition, "x" | "y">,
	) => void;
	setSourceVisibility: (
		sourceId: string,
		key: SourceVisibilityKey,
		visible: boolean,
	) => void;
	setSourceImageRef: (sourceId: string, imageRef: SourceImageRef) => void;
	commitSourceSpectrumExtraction: (
		sourceId: string,
		extractionParams: SourceSpectrumExtractionParams,
	) => void;
	setSourceSpectrumStatus: (
		sourceId: string,
		status: SourceSpectrumStatus,
	) => void;
}

export const createSourceEntitiesSlice: StateCreator<
	SourceStore,
	[],
	[],
	SourceEntitiesSlice
> = (set, get) => ({
	sources: [],
	createSource: (input) => {
		const { sources } = get();
		const id = generateSourceId(
			input.position.ra,
			input.position.dec,
			sources.map((source) => source.id),
		);
		const nextSource: Source = {
			id,
			label: input.label?.trim() || undefined,
			color: generateColor(id),
			createdAt: new Date().toISOString(),
			position: {
				...input.position,
			},
			imageRef: {
				...input.imageRef,
			},
			z: null,
			visibility: {
				...input.visibility,
			},
			spectrum: {
				...DEFAULT_SOURCE_SPECTRUM_STATE,
			},
		};

		set((state) => ({
			sources: [...state.sources, nextSource],
			activeSourceId: nextSource.id,
		}));

		return nextSource;
	},
	deleteSource: (sourceId) =>
		set((state) => ({
			sources: state.sources.filter((source) => source.id !== sourceId),
			activeSourceId:
				state.activeSourceId === sourceId ? null : state.activeSourceId,
		})),
	setSourceLabel: (sourceId, label) =>
		set((state) => {
			const nextSources = updateSourceSources(state.sources, sourceId, {
				label,
			});
			if (!nextSources) {
				return state;
			}

			return {
				sources: nextSources,
			};
		}),
	setSourceZ: (sourceId, z) =>
		set((state) => {
			const nextSources = updateSourceSources(state.sources, sourceId, {
				z,
			});
			if (!nextSources) {
				return state;
			}

			return {
				sources: nextSources,
			};
		}),
	setSourcePosition: (sourceId, position) =>
		set((state) => {
			const nextSources = updateSourceSources(state.sources, sourceId, {
				position,
			});
			if (!nextSources) {
				return state;
			}

			return {
				sources: nextSources,
			};
		}),
	setSourceVisibility: (sourceId, key, visible) =>
		set((state) => {
			const nextSources = updateSourceSources(state.sources, sourceId, {
				visibility: {
					[key]: visible,
				},
			});
			if (!nextSources) {
				return state;
			}

			return {
				sources: nextSources,
			};
		}),
	setSourceImageRef: (sourceId, imageRef) =>
		set((state) => {
			const nextSources = updateSourceSources(state.sources, sourceId, {
				imageRef,
			});
			if (!nextSources) {
				return state;
			}

			return {
				sources: nextSources,
			};
		}),
	commitSourceSpectrumExtraction: (sourceId, extractionParams) =>
		set((state) => {
			const nextSources = updateSourceSources(state.sources, sourceId, {
				spectrum: {
					status: "committed",
					extractionParams,
				},
			});
			if (!nextSources) {
				return state;
			}

			return {
				sources: nextSources,
			};
		}),
	setSourceSpectrumStatus: (sourceId, status) =>
		set((state) => {
			const nextSources = updateSourceSources(state.sources, sourceId, {
				spectrum: {
					status,
				},
			});
			if (!nextSources) {
				return state;
			}

			return {
				sources: nextSources,
			};
		}),
});
