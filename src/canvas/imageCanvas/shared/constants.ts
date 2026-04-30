import type { ColorMap } from "../api";

type ColorStop = readonly [offset: number, color: string];

export const IMAGE_CANVAS_BACKGROUND = "#050505";
export const IMAGE_CANVAS_CAMERA_Z = 100;
export const IMAGE_CANVAS_MIN_ZOOM = 0.05;
export const IMAGE_CANVAS_MAX_ZOOM = 128;
export const IMAGE_CANVAS_ROI_VIEW_SIZE = 256;
export const IMAGE_CANVAS_DEFAULT_SOURCE_COLOR = "#7dd3fc";
export const IMAGE_CANVAS_ACTIVE_SOURCE_COLOR = "#facc15";
export const IMAGE_CANVAS_SOURCE_MARKER_SIZE_PX = 9;
export const IMAGE_CANVAS_ACTIVE_SOURCE_MARKER_SIZE_PX = 13;
export const IMAGE_CANVAS_SOURCE_BORDER_COLOR = "#000000";
export const IMAGE_CANVAS_ROI_OUTLINE_COLOR = "#ff6b6b";
export const IMAGE_CANVAS_COLLAPSE_OUTLINE_COLOR = "#21d4d4";
export const IMAGE_CANVAS_TRACE_OPACITY = 0.82;
export const IMAGE_CANVAS_TRACE_WIDTH = 1.5;
export const IMAGE_CANVAS_ACTIVE_TRACE_WIDTH = 2.5;
export const IMAGE_CANVAS_ANNOTATION_HIT_Z = 5;
export const IMAGE_CANVAS_COLLAPSE_HIT_THICKNESS = 6;
export const IMAGE_CANVAS_ANNOTATION_HIT_MARGIN = 1000;
export const IMAGE_CANVAS_MIN_COLLAPSE_SIZE = 1;
export const IMAGE_CANVAS_DEFAULT_REFERENCE_OPACITY = 1;
export const IMAGE_CANVAS_MASK_OPACITY = 0.85;
export const IMAGE_CANVAS_MAX_MASK_MAP_ENTRIES = 32;

export const IMAGE_CANVAS_DEFAULT_COLLAPSE_WINDOW = {
	width: 100,
	height: 4,
} as const;

export const IMAGE_CANVAS_COLOR_MAP_STOPS: Record<
	ColorMap,
	readonly ColorStop[]
> = {
	gray: [
		[0, "#000000"],
		[1, "#ffffff"],
	],
	viridis: [
		[0, "#440154"],
		[0.25, "#3b528b"],
		[0.5, "#21918c"],
		[0.75, "#5ec962"],
		[1, "#fde725"],
	],
	magma: [
		[0, "#000004"],
		[0.2, "#3b0f70"],
		[0.45, "#8c2981"],
		[0.7, "#de4968"],
		[0.88, "#fe9f6d"],
		[1, "#fcfdbf"],
	],
	plasma: [
		[0, "#0d0887"],
		[0.25, "#6a00a8"],
		[0.5, "#b12a90"],
		[0.75, "#e16462"],
		[0.9, "#fca636"],
		[1, "#f0f921"],
	],
	inferno: [
		[0, "#000004"],
		[0.2, "#320a5a"],
		[0.4, "#781c6d"],
		[0.6, "#bb3654"],
		[0.8, "#ed6925"],
		[0.92, "#fbb41a"],
		[1, "#fcffa4"],
	],
};
