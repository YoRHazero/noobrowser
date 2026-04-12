import { NED_MAX_RADIUS_ARCSEC } from "../shared/constants";

export function getNedDraftValidationReason(draftArcsec: number | null) {
	if (draftArcsec === null) {
		return "NED radius must be a finite number greater than 0 and less than 10 degrees.";
	}

	if (draftArcsec <= 0) {
		return "NED radius must be greater than 0 arcsec.";
	}

	if (draftArcsec >= NED_MAX_RADIUS_ARCSEC) {
		return "NED radius must be strictly less than 10 degrees.";
	}

	return null;
}
