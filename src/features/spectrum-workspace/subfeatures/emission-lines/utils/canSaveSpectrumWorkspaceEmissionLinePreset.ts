import { areEmissionLineIdSetsEqual } from "./areEmissionLineIdSetsEqual";

export function canSaveSpectrumWorkspaceEmissionLinePreset({
	draftName,
	selectedPresetName,
	selectedLineIds,
	presetLineIds,
}: {
	draftName: string;
	selectedPresetName: string | null;
	selectedLineIds: readonly string[];
	presetLineIds: readonly string[];
}): boolean {
	const nextName = draftName.trim();
	if (!nextName) {
		return false;
	}

	if (selectedPresetName === null) {
		return true;
	}

	return (
		nextName !== selectedPresetName ||
		!areEmissionLineIdSetsEqual(selectedLineIds, presetLineIds)
	);
}
