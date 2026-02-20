export type WaveFrame = "observe" | "rest";

export type WaveUnit = "µm" | "Å";

export type RaDec = {
	ra: number;
	dec: number;
};

export type XY = {
	x: number;
	y: number;
};

export interface EmissionLine {
	id: string;
	name: string;
	wavelength: number; // microns
}

export type RGBSet = { r: string; g: string; b: string };

export type WaveRange = { min: number; max: number };

export type NormParams = {
	pmin: number;
	pmax: number;
	vmin?: number;
	vmax?: number;
};
