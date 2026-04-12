import type { TargetHubExtractionDraft } from "../shared/types";

export function createExtractionSettingsFormState(
	extractionDraft: TargetHubExtractionDraft,
) {
	return {
		apertureSize: extractionDraft.apertureSize.toString(),
		waveMinUm: extractionDraft.waveMinUm.toString(),
		waveMaxUm: extractionDraft.waveMaxUm.toString(),
	};
}
