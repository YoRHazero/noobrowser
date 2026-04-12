import {
	EDITOR_EXTRACTION_APERTURE_INVALID_REASON,
	EDITOR_EXTRACTION_WAVE_RANGE_INVALID_REASON,
} from "../shared/constants";
import type { TargetHubExtractionDraft } from "../shared/types";

export function getExtractionDraftValidationReason(
	extractionDraft: TargetHubExtractionDraft,
): string | null {
	if (extractionDraft.apertureSize <= 0) {
		return EDITOR_EXTRACTION_APERTURE_INVALID_REASON;
	}

	if (extractionDraft.waveMinUm >= extractionDraft.waveMaxUm) {
		return EDITOR_EXTRACTION_WAVE_RANGE_INVALID_REASON;
	}

	return null;
}
