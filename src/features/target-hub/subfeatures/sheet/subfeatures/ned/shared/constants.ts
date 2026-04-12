import type { NedRadiusUnit } from "./types";

export const NED_MAX_RADIUS_ARCSEC = 36000;
export const NED_RADIUS_EPSILON = 1e-9;

export const NED_RADIUS_UNIT_OPTIONS: Record<NedRadiusUnit, number> = {
	degree: 3600,
	arcminute: 60,
	arcsecond: 1,
};

export const NED_RADIUS_UNIT_LABELS: Record<NedRadiusUnit, string> = {
	degree: "°",
	arcminute: "′",
	arcsecond: "″",
};

export const NED_RADIUS_UNIT_SEQUENCE: readonly NedRadiusUnit[] = [
	"arcsecond",
	"arcminute",
	"degree",
];
