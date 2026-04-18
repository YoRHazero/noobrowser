import type {
	Spectrum2DCanvasColorMap,
	Spectrum2DCanvasInterpolation,
	Spectrum2DCanvasLabelsModel,
} from "../api";

type Spectrum2DCanvasColorStop = readonly [offset: number, color: string];

export const SPECTRUM_2D_CANVAS_BACKGROUND = "#050505";
export const SPECTRUM_2D_CANVAS_CAMERA_Z = 100;
export const SPECTRUM_2D_CANVAS_MIN_ZOOM = 0.25;
export const SPECTRUM_2D_CANVAS_MAX_ZOOM = 64;
export const SPECTRUM_2D_CANVAS_CAMERA_PADDING = 0.08;
export const SPECTRUM_2D_CANVAS_LINE_WIDTH = 1.5;
export const SPECTRUM_2D_CANVAS_GUIDE_COLOR = "#bf1a1a";
export const SPECTRUM_2D_CANVAS_COLLAPSE_OUTLINE_COLOR = "#ff6b6b";
export const SPECTRUM_2D_CANVAS_EMISSION_LINE_COLOR = "#7dd3fc";
export const SPECTRUM_2D_CANVAS_EMISSION_LABEL_OFFSET = -6;
export const SPECTRUM_2D_CANVAS_EMISSION_LABEL_SIZE = 10;
export const SPECTRUM_2D_CANVAS_DEFAULT_INTERPOLATION: Spectrum2DCanvasInterpolation =
	"nearest";
export const SPECTRUM_2D_CANVAS_DEFAULT_LABELS: Required<Spectrum2DCanvasLabelsModel> =
	{
		accessibilityLabel: "2D spectrum canvas",
		wavelengthAxis: "Observed Wavelength (um)",
		spatialAxis: "Spatial",
	};

export const SPECTRUM_2D_CANVAS_COLOR_MAP_STOPS: Record<
	Spectrum2DCanvasColorMap,
	readonly Spectrum2DCanvasColorStop[]
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
