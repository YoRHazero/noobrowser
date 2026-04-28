"use client";

import type { StateCreator } from "zustand";
import type { SpectrumWorkspaceStore } from "../../../store";
import {
	DEFAULT_EMISSION_LINE_PRESETS,
	DEFAULT_EMISSION_LINES,
	DEFAULT_SELECTED_EMISSION_LINE_IDS,
	DEFAULT_SELECTED_EMISSION_LINE_PRESET_NAME,
} from "../shared/constants";
import type {
	SpectrumWorkspaceEmissionLine,
	SpectrumWorkspaceEmissionLinePreset,
} from "../shared/types";
import { createEmissionLineId, normalizeEmissionLineIds } from "../utils";

function sanitizeEmissionLineName(name: string): string {
	return name.trim().replace(/\s+/g, " ");
}

function normalizePresetLineIds(
	lineIds: readonly string[],
	emissionLines: Record<string, SpectrumWorkspaceEmissionLine>,
): string[] {
	return normalizeEmissionLineIds(
		lineIds.filter((lineId) => Object.hasOwn(emissionLines, lineId)),
	);
}

function upsertPreset(
	presets: readonly SpectrumWorkspaceEmissionLinePreset[],
	name: string,
	lineIds: string[],
): SpectrumWorkspaceEmissionLinePreset[] {
	const nextPreset = { name, lineIds };
	const presetIndex = presets.findIndex((preset) => preset.name === name);

	if (presetIndex === -1) {
		const nextPresets = [...presets, nextPreset];
		nextPresets.sort((left, right) => left.name.localeCompare(right.name));
		return nextPresets;
	}

	return presets.map((preset, index) =>
		index === presetIndex ? nextPreset : preset,
	);
}

export interface EmissionLineSlice {
	emissionLines: Record<string, SpectrumWorkspaceEmissionLine>;
	selectedEmissionLineIds: string[];
	emissionLinePresets: SpectrumWorkspaceEmissionLinePreset[];
	selectedEmissionLinePresetName: string | null;
	addEmissionLine: (name: string, restWavelengthUm: number) => void;
	deleteEmissionLine: (lineId: string) => void;
	selectEmissionLine: (lineId: string) => void;
	deselectEmissionLine: (lineId: string) => void;
	toggleEmissionLineSelection: (lineId: string) => void;
	setSelectedEmissionLineIds: (lineIds: string[]) => void;
	selectEmissionLinePreset: (name: string | null) => void;
	saveEmissionLinePreset: (name: string) => void;
	deleteEmissionLinePreset: (name: string) => void;
}

export const createEmissionLineSlice: StateCreator<
	SpectrumWorkspaceStore,
	[],
	[],
	EmissionLineSlice
> = (set, get) => ({
	emissionLines: { ...DEFAULT_EMISSION_LINES },
	selectedEmissionLineIds: DEFAULT_SELECTED_EMISSION_LINE_IDS,
	emissionLinePresets: DEFAULT_EMISSION_LINE_PRESETS,
	selectedEmissionLinePresetName: DEFAULT_SELECTED_EMISSION_LINE_PRESET_NAME,
	addEmissionLine: (name, restWavelengthUm) => {
		const nextName = sanitizeEmissionLineName(name);
		if (
			!nextName ||
			!Number.isFinite(restWavelengthUm) ||
			restWavelengthUm <= 0
		) {
			return;
		}

		set((state) => {
			const lineId = createEmissionLineId(
				nextName,
				restWavelengthUm,
				Object.keys(state.emissionLines),
			);

			return {
				emissionLines: {
					...state.emissionLines,
					[lineId]: {
						id: lineId,
						name: nextName,
						restWavelengthUm,
					},
				},
				selectedEmissionLineIds: normalizeEmissionLineIds([
					...state.selectedEmissionLineIds,
					lineId,
				]),
			};
		});
	},
	deleteEmissionLine: (lineId) =>
		set((state) => {
			if (!Object.hasOwn(state.emissionLines, lineId)) {
				return state;
			}

			const nextEmissionLines = { ...state.emissionLines };
			delete nextEmissionLines[lineId];

			return {
				emissionLines: nextEmissionLines,
				selectedEmissionLineIds: state.selectedEmissionLineIds.filter(
					(selectedLineId) => selectedLineId !== lineId,
				),
				emissionLinePresets: state.emissionLinePresets.map((preset) => ({
					...preset,
					lineIds: normalizePresetLineIds(
						preset.lineIds.filter((presetLineId) => presetLineId !== lineId),
						nextEmissionLines,
					),
				})),
			};
		}),
	selectEmissionLine: (lineId) =>
		set((state) => {
			if (!Object.hasOwn(state.emissionLines, lineId)) {
				return state;
			}

			return {
				selectedEmissionLineIds: normalizeEmissionLineIds([
					...state.selectedEmissionLineIds,
					lineId,
				]),
			};
		}),
	deselectEmissionLine: (lineId) =>
		set((state) => ({
			selectedEmissionLineIds: state.selectedEmissionLineIds.filter(
				(selectedLineId) => selectedLineId !== lineId,
			),
		})),
	toggleEmissionLineSelection: (lineId) => {
		const isSelected = get().selectedEmissionLineIds.includes(lineId);

		if (isSelected) {
			get().deselectEmissionLine(lineId);
			return;
		}

		get().selectEmissionLine(lineId);
	},
	setSelectedEmissionLineIds: (lineIds) =>
		set((state) => ({
			selectedEmissionLineIds: normalizePresetLineIds(
				lineIds,
				state.emissionLines,
			),
		})),
	selectEmissionLinePreset: (name) =>
		set((state) => {
			if (name === null) {
				return {
					selectedEmissionLinePresetName: null,
				};
			}

			const preset = state.emissionLinePresets.find(
				(currentPreset) => currentPreset.name === name,
			);
			if (!preset) {
				return {
					selectedEmissionLinePresetName: null,
				};
			}

			return {
				selectedEmissionLinePresetName: preset.name,
				selectedEmissionLineIds: normalizePresetLineIds(
					preset.lineIds,
					state.emissionLines,
				),
			};
		}),
	saveEmissionLinePreset: (name) => {
		const nextName = name.trim();
		if (!nextName) {
			return;
		}

		set((state) => {
			const lineIds = normalizePresetLineIds(
				state.selectedEmissionLineIds,
				state.emissionLines,
			);

			return {
				emissionLinePresets: upsertPreset(
					state.emissionLinePresets,
					nextName,
					lineIds,
				),
				selectedEmissionLinePresetName: nextName,
			};
		});
	},
	deleteEmissionLinePreset: (name) =>
		set((state) => ({
			emissionLinePresets: state.emissionLinePresets.filter(
				(preset) => preset.name !== name,
			),
			selectedEmissionLinePresetName:
				state.selectedEmissionLinePresetName === name
					? null
					: state.selectedEmissionLinePresetName,
		})),
});
