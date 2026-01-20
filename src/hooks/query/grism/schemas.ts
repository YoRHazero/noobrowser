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
