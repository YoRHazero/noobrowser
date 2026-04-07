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

export interface TargetHubSheetLocalSlice {
	editorMode: TargetHubEditorMode;
	jobsDrawerOpen: boolean;
	createDraft: TargetHubCreateDraft;
	extractionDraft: TargetHubExtractionDraft;
	setEditorMode: (mode: TargetHubEditorMode) => void;
	enterCreateMode: () => void;
	returnToDetailMode: () => void;
	openJobsDrawer: () => void;
	closeJobsDrawer: () => void;
	setCreateDraftField: (field: "label" | "ra" | "dec", value: string) => void;
	setCreateDraftImageRef: (imageRef: SourceImageRef) => void;
	toggleCreateDraftVisibility: (key: SourceVisibilityKey) => void;
	resetCreateDraft: () => void;
	setExtractionDraft: (patch: Partial<TargetHubExtractionDraft>) => void;
}

export const createSheetLocalSlice: StateCreator<
	TargetHubStore,
	[],
	[],
	TargetHubSheetLocalSlice
> = (set) => ({
	editorMode: "create",
	jobsDrawerOpen: false,
	createDraft: DEFAULT_CREATE_DRAFT,
	extractionDraft: DEFAULT_EXTRACTION_DRAFT,
	setEditorMode: (mode) => set({ editorMode: mode }),
	enterCreateMode: () =>
		set({
			editorMode: "create",
			createDraft: DEFAULT_CREATE_DRAFT,
		}),
	returnToDetailMode: () => set({ editorMode: "detail" }),
	openJobsDrawer: () => set({ jobsDrawerOpen: true }),
	closeJobsDrawer: () => set({ jobsDrawerOpen: false }),
	setCreateDraftField: (field, value) =>
		set((state) => ({
			createDraft: {
				...state.createDraft,
				...(field === "label"
					? {
							label: value,
						}
					: {
							position: {
								...state.createDraft.position,
								[field]: value,
							},
						}),
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

export const targetHubSheetLocalDefaults = {
	DEFAULT_CREATE_DRAFT,
	DEFAULT_EXTRACTION_DRAFT,
	DEFAULT_SOURCE_IMAGE_REF,
};
