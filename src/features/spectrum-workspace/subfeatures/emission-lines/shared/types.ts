export interface SpectrumWorkspaceEmissionLine {
	id: string;
	name: string;
	restWavelengthUm: number;
}

export interface SpectrumWorkspaceEmissionLinePreset {
	name: string;
	lineIds: string[];
}
