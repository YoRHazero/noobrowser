export interface SourcePosition {
	x: number;
	y: number;
	ra: number;
	dec: number;
	ra_hms: string;
	dec_dms: string;
	ref_basename: string;
	group_id?: string;
}

export interface ExtractedSpectrum {
	covered: boolean;
	wavelength: number[];
	spectrum_2d: number[][];
	error_2d: number[][];
}

export interface DispersionTrace {
	group_id: number | null;
	basename: string | null;
	input_x: number;
	input_y: number;
	wavelengths: number[];
	trace_xs: number[];
	trace_ys: number[];
	mean_pixel_scale: number;
}
