export interface SourcePosition {
	x: number | null;
	y: number | null;
	ra: number | null;
	dec: number | null;
}

export interface SourceImageRef {
	refBasename: string | null;
	footprintId: string | null;
}

export interface SourceVisibility {
	overview: boolean;
	inspector: boolean;
}

export type SourceSpectrumStatus =
	| "idle"
	| "committed"
	| "pending"
	| "ready"
	| "error"
	| "uncovered";

export interface SourceSpectrumExtractionParams {
	apertureSize: number;
	waveMinUm: number;
	waveMaxUm: number;
}

export interface SourceSpectrumState {
	status: SourceSpectrumStatus;
	extractionParams: SourceSpectrumExtractionParams | null;
}

export type SourceVisibilityKey = keyof SourceVisibility;

export interface Source {
	id: string;
	label?: string;
	color: string;
	createdAt: string;
	position: SourcePosition;
	imageRef: SourceImageRef;
	z: number | null;
	visibility: SourceVisibility;
	spectrum: SourceSpectrumState;
}

export interface SourceCreateInput {
	label?: string;
	position: Omit<SourcePosition, "ra" | "dec"> & {
		ra: number;
		dec: number;
	};
	imageRef: SourceImageRef;
	visibility: SourceVisibility;
}
