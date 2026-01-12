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