import type { StateCreator } from "zustand";
import type { OverviewStoreState } from "./index";
import type { OverviewManualTarget } from "./types";

export interface OverviewTargetsSlice {
	manualTargets: OverviewManualTarget[];
	selectedTargetIds: string[];
	nextTargetSequence: number;
	targetDraftLabel: string;
	targetDraftRa: string;
	targetDraftDec: string;
	targetDraftFocusToken: number;
	addManualTarget: (target: OverviewManualTarget) => void;
	commitManualTarget: (target: OverviewManualTarget) => void;
	updateManualTarget: (
		id: string,
		patch: Partial<OverviewManualTarget>,
	) => void;
	removeManualTarget: (id: string) => void;
	clearManualTargets: () => void;
	toggleSelectedTarget: (id: string) => void;
	clearSelectedTargets: () => void;
	setTargetDraftLabel: (value: string) => void;
	setTargetDraftRa: (value: string) => void;
	setTargetDraftDec: (value: string) => void;
	fillTargetDraftCoordinates: (coordinate: {
		ra: number;
		dec: number;
	}) => void;
	resetTargetDraft: () => void;
}

export const createOverviewTargetsSlice: StateCreator<
	OverviewStoreState,
	[],
	[],
	OverviewTargetsSlice
> = (set) => ({
	manualTargets: [],
	selectedTargetIds: [],
	nextTargetSequence: 1,
	targetDraftLabel: "",
	targetDraftRa: "",
	targetDraftDec: "",
	targetDraftFocusToken: 0,
	addManualTarget: (target) =>
		set((state) => ({
			manualTargets: [...state.manualTargets, target],
			nextTargetSequence: state.nextTargetSequence + 1,
		})),
	commitManualTarget: (target) =>
		set((state) => ({
			manualTargets: [...state.manualTargets, target],
			nextTargetSequence: state.nextTargetSequence + 1,
		})),
	updateManualTarget: (id, patch) =>
		set((state) => ({
			manualTargets: state.manualTargets.map((target) =>
				target.id === id ? { ...target, ...patch } : target,
			),
		})),
	removeManualTarget: (id) =>
		set((state) => ({
			manualTargets: state.manualTargets.filter((target) => target.id !== id),
			selectedTargetIds: state.selectedTargetIds.filter(
				(targetId) => targetId !== id,
			),
		})),
	clearManualTargets: () =>
		set({
			manualTargets: [],
			selectedTargetIds: [],
			nextTargetSequence: 1,
		}),
	toggleSelectedTarget: (id) =>
		set((state) => ({
			selectedTargetIds: state.selectedTargetIds.includes(id)
				? state.selectedTargetIds.filter((targetId) => targetId !== id)
				: [...state.selectedTargetIds, id],
		})),
	clearSelectedTargets: () => set({ selectedTargetIds: [] }),
	setTargetDraftLabel: (value) => set({ targetDraftLabel: value }),
	setTargetDraftRa: (value) => set({ targetDraftRa: value }),
	setTargetDraftDec: (value) => set({ targetDraftDec: value }),
	fillTargetDraftCoordinates: ({ ra, dec }) =>
		set((state) => ({
			targetDraftRa: String(ra),
			targetDraftDec: String(dec),
			targetDraftFocusToken: state.targetDraftFocusToken + 1,
		})),
	resetTargetDraft: () =>
		set({
			targetDraftLabel: "",
			targetDraftRa: "",
			targetDraftDec: "",
		}),
});
