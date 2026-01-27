export type GrismImageBuffer = {
	buffer: ArrayBuffer;
	width: number;
	height: number;
};

export type GrismData = GrismImageBuffer;
export type GrismErr = GrismImageBuffer;

export type GrismOffset = {
	group_id: number;
	basename: string;
	dx: number;
	dy: number;
	description: string;
};

export type EmissionMaskData = {
	buffer: ArrayBuffer;
	width: number;
	height: number;
	xStart: number;
	yStart: number;
	maxValue: number;
};

export type EmissionMaskRegion = {
	center_x: number;
	center_y: number;
	max_value: number;
	area: number;
};

export type EmissionMaskRegionsResponse = {
	group_id: number;
	regions: EmissionMaskRegion[];
};
