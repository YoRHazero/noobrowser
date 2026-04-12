import { NED_RADIUS_UNIT_OPTIONS } from "../shared/constants";
import type { NedRadiusUnit } from "../shared/types";

export function parseNedDraftRadiusToArcsec(
	value: string,
	unit: NedRadiusUnit,
) {
	if (value.trim().length === 0) {
		return null;
	}

	const parsedValue = Number(value);
	if (!Number.isFinite(parsedValue)) {
		return null;
	}

	return parsedValue * NED_RADIUS_UNIT_OPTIONS[unit];
}
