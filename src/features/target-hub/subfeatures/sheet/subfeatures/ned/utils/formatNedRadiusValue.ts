import { NED_RADIUS_UNIT_OPTIONS } from "../shared/constants";
import type { NedRadiusUnit } from "../shared/types";

export function formatNedRadiusValue(
	radiusArcsec: number,
	unit: NedRadiusUnit,
) {
	return (radiusArcsec / NED_RADIUS_UNIT_OPTIONS[unit]).toString();
}
