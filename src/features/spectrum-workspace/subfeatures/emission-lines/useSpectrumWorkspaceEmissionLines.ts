"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useSpectrumWorkspaceStore } from "../../store";
import { formatSpectrumWorkspaceDisplayWavelength } from "../../utils";
import { sortSpectrumWorkspaceEmissionLines } from "./utils";

function formatRestWavelength(restWavelengthUm: number): string {
	return `Rest ${restWavelengthUm.toFixed(4).replace(/\.?0+$/, "")} um`;
}

export function useSpectrumWorkspaceEmissionLines() {
	const {
		emissionLines,
		selectedEmissionLineIds,
		emissionLinePresets,
		selectedEmissionLinePresetName,
		redshift,
		wavelengthFrame,
		wavelengthUnit,
		addEmissionLine,
		deleteEmissionLine,
		toggleEmissionLineSelection,
		selectEmissionLinePreset,
		saveEmissionLinePreset,
		deleteEmissionLinePreset,
	} = useSpectrumWorkspaceStore(
		useShallow((state) => ({
			emissionLines: state.emissionLines,
			selectedEmissionLineIds: state.selectedEmissionLineIds,
			emissionLinePresets: state.emissionLinePresets,
			selectedEmissionLinePresetName: state.selectedEmissionLinePresetName,
			redshift: state.redshift,
			wavelengthFrame: state.wavelengthFrame,
			wavelengthUnit: state.wavelengthUnit,
			addEmissionLine: state.addEmissionLine,
			deleteEmissionLine: state.deleteEmissionLine,
			toggleEmissionLineSelection: state.toggleEmissionLineSelection,
			selectEmissionLinePreset: state.selectEmissionLinePreset,
			saveEmissionLinePreset: state.saveEmissionLinePreset,
			deleteEmissionLinePreset: state.deleteEmissionLinePreset,
		})),
	);
	const selectedLineIds = useMemo(
		() => new Set(selectedEmissionLineIds),
		[selectedEmissionLineIds],
	);
	const selectedPreset = useMemo(
		() =>
			emissionLinePresets.find(
				(preset) => preset.name === selectedEmissionLinePresetName,
			) ?? null,
		[emissionLinePresets, selectedEmissionLinePresetName],
	);
	const rows = useMemo(
		() =>
			sortSpectrumWorkspaceEmissionLines(Object.values(emissionLines)).map(
				(line) => ({
					id: line.id,
					name: line.name,
					selected: selectedLineIds.has(line.id),
					restWavelengthLabel: formatRestWavelength(line.restWavelengthUm),
					displayWavelengthLabel: `${
						wavelengthFrame === "observed" ? "Observed" : "Rest"
					} ${formatSpectrumWorkspaceDisplayWavelength(line.restWavelengthUm, {
						redshift,
						wavelengthFrame,
						wavelengthUnit,
					})}`,
					onToggleSelected: toggleEmissionLineSelection,
					onDelete: deleteEmissionLine,
				}),
			),
		[
			deleteEmissionLine,
			emissionLines,
			redshift,
			selectedLineIds,
			toggleEmissionLineSelection,
			wavelengthFrame,
			wavelengthUnit,
		],
	);
	const presetNames = useMemo(
		() =>
			emissionLinePresets
				.map((preset) => preset.name)
				.sort((left, right) => left.localeCompare(right)),
		[emissionLinePresets],
	);

	return {
		addLineRow: {
			onAddEmissionLine: addEmissionLine,
		},
		presetRow: {
			presetNames,
			selectedPresetName: selectedEmissionLinePresetName,
			selectedLineIds: selectedEmissionLineIds,
			presetLineIds: selectedPreset?.lineIds ?? [],
			onSelectPreset: selectEmissionLinePreset,
			onSavePreset: saveEmissionLinePreset,
			onDeletePreset: deleteEmissionLinePreset,
		},
		emissionLineList: {
			rows,
		},
	};
}
