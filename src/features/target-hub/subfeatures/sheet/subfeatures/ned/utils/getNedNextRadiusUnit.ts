import { NED_RADIUS_UNIT_SEQUENCE } from "../shared/constants";
import type { NedRadiusUnit } from "../shared/types";

export function getNedNextRadiusUnit(unit: NedRadiusUnit) {
	const currentIndex = NED_RADIUS_UNIT_SEQUENCE.indexOf(unit);
	return NED_RADIUS_UNIT_SEQUENCE[
		(currentIndex + 1) % NED_RADIUS_UNIT_SEQUENCE.length
	];
}
