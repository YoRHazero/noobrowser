import type { NedRadiusUnit } from "../shared/types";
import { formatNedRadiusValue } from "./formatNedRadiusValue";

export function createNedDraftState(
	radiusArcsec: number,
	unit: NedRadiusUnit = "arcsecond",
) {
	return {
		value: formatNedRadiusValue(radiusArcsec, unit),
		unit,
	};
}
