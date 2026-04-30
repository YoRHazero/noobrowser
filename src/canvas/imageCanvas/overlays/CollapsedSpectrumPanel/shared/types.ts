import type { CollapsedSpectrumBin } from "../../../shared/types";

export interface SpectrumPanelPoint {
	bin: CollapsedSpectrumBin;
	velocityKmS: number;
	value: number;
	error?: number;
}

export interface SpectrumPanelScales {
	xMin: number;
	xMax: number;
	yMin: number;
	yMax: number;
	innerWidth: number;
	innerHeight: number;
	xForVelocity: (velocityKmS: number) => number;
	yForValue: (value: number) => number;
	velocityForX: (x: number) => number;
}
