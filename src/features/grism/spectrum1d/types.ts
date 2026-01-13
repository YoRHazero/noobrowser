export type Anchor = {
	top: number;
	left: number;
};

export type Label = {
	top?: string;
	right?: string;
	bottom?: string;
	left?: string;
};

export interface TooltipData {
	wavelength: number;
	flux: number;
	error: number;
	axisX: number;
	axisY: number;
	pointerX: number;
	pointerY: number;
}
