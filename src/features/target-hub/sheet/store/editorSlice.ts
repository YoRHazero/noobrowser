import type { StateCreator } from "zustand";
import type { SourceImageRef, SourceVisibilityKey } from "@/stores/source";
import type {
	TargetHubCreateDraft,
	TargetHubEditorMode,
	TargetHubExtractionDraft,
} from "../../shared/types";
import type { TargetHubStore } from "../../store";

const DEFAULT_SOURCE_IMAGE_REF: SourceImageRef = {
	refBasename: null,
	footprintId: null,
};

const DEFAULT_CREATE_DRAFT: TargetHubCreateDraft = {
	label: "",
	position: {
		ra: "",
		dec: "",
		x: null,
		y: null,
	},
	imageRef: {
		...DEFAULT_SOURCE_IMAGE_REF,
	},
	visibility: {
		overview: true,
		inspector: true,
	},
};

const DEFAULT_EXTRACTION_DRAFT: TargetHubExtractionDraft = {
	apertureSize: 100,
	waveMinUm: 3.8,
	waveMaxUm: 5.0,
};

export interface TargetHubSheetEditorSlice {
	editorMode: TargetHubEditorMode;
	createDraft: TargetHubCreateDraft;
	extractionDraft: TargetHubExtractionDraft;
	setEditorMode: (mode: TargetHubEditorMode) => void;
	enterCreateMode: () => void;
	returnToDetailMode: () => void;
	setCreateDraftField: (field: "label" | "ra" | "dec", value: string) => void;
	setCreateDraftPosition: (x: number | null, y: number | null) => void;
	setCreateDraftImageRef: (imageRef: SourceImageRef) => void;
	toggleCreateDraftVisibility: (key: SourceVisibilityKey) => void;
	resetCreateDraft: () => void;
	setExtractionDraft: (patch: Partial<TargetHubExtractionDraft>) => void;
}

export const createSheetEditorSlice: StateCreator<
	TargetHubStore,
	[],
	[],
	TargetHubSheetEditorSlice
> = (set) => ({
	editorMode: "create",
	createDraft: DEFAULT_CREATE_DRAFT,
	extractionDraft: DEFAULT_EXTRACTION_DRAFT,
	setEditorMode: (mode) => set({ editorMode: mode }),
	enterCreateMode: () =>
		set({
			editorMode: "create",
			createDraft: DEFAULT_CREATE_DRAFT,
		}),
	returnToDetailMode: () => set({ editorMode: "detail" }),
	setCreateDraftField: (field, value) =>
		set((state) => {
			if (field === "label") {
				return {
					createDraft: {
						...state.createDraft,
						label: value,
					},
				};
			}

			return {
				createDraft: {
					...state.createDraft,
					position: {
						...state.createDraft.position,
						[field]: value,
					},
				},
			};
		}),
	setCreateDraftPosition: (x, y) =>
		set((state) => ({
			createDraft: {
				...state.createDraft,
				position: {
					...state.createDraft.position,
					x,
					y,
				},
			},
		})),
	setCreateDraftImageRef: (imageRef) =>
		set((state) => ({
			createDraft: {
				...state.createDraft,
				imageRef,
			},
		})),
	toggleCreateDraftVisibility: (key) =>
		set((state) => ({
			createDraft: {
				...state.createDraft,
				visibility: {
					...state.createDraft.visibility,
					[key]: !state.createDraft.visibility[key],
				},
			},
		})),
	resetCreateDraft: () =>
		set({
			createDraft: DEFAULT_CREATE_DRAFT,
		}),
	setExtractionDraft: (patch) =>
		set((state) => ({
			extractionDraft: {
				...state.extractionDraft,
				...patch,
			},
		})),
});

export const sheetEditorLocalDefaults = {
	DEFAULT_CREATE_DRAFT,
	DEFAULT_EXTRACTION_DRAFT,
	DEFAULT_SOURCE_IMAGE_REF,
};
