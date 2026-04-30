export interface CanvasProps {
	model: Model;
	actions?: Actions;
}

export interface Model {
	baseLayer: LayerModel;
	referenceLayer?: LayerModel;
	maskLayer?: LayerModel;
	annotationLayer?: AnnotationLayerModel;
	camera?: CameraModel;

	baseStyle: RasterStyle;
	referenceStyle?: RasterStyle;
	referenceOpacity?: number;
	referenceMode?: ReferenceMode;

	maskMap?: MaskMapEntry[];

	collapsedSpectrum?: CollapsedSpectrumModel;
}

export interface LayerModel {
	frames: Frame[];
	activeId: string;
}

export interface Frame {
	id: string;

	// Direct array/world mapping; x is column-like, y is row-like.
	// World size === pixel size.
	x: number;
	y: number;
	width: number;
	height: number;

	data: FrameData;

	// only meaningful for scalar frames; shares x/y/width/height with data
	error?: ScalarData;
}

export type FrameData = ScalarData | BitmapData;

export interface ScalarData {
	kind: "scalar";
	array: ScalarArray;
	dataType: ScalarDataType;
}

export type ScalarArray = Float32Array | Uint8Array | Uint16Array | Uint32Array;

export type ScalarDataType =
	| "float16"
	| "float32"
	| "uint8"
	| "uint16"
	| "uint32";

export interface BitmapData {
	kind: "bitmap";
	bitmap: ImageBitmap;
	colorSpace: "srgb" | "linear";
}

export interface RasterStyle {
	norm: Norm;
	colorMap?: ColorMap;
}

export interface Norm {
	vmin: number;
	vmax: number;
	stretch?: "linear" | "sqrt" | "log" | "asinh";
}

export type ColorMap = "gray" | "viridis" | "magma" | "plasma" | "inferno";

export type ReferenceMode = "rgb" | "r" | "g" | "b";

export interface MaskMapEntry {
	value: number;
	color: string;
	opacity?: number;
}

export interface AnnotationLayerModel {
	roi?: Rect;
	collapseWindow?: Rect;
	sources?: SourceAnnotation[];
}

export interface CameraModel {
	lockROI?: boolean;
}

export interface CollapsedSpectrumModel {
	// default "y": sum along y, output spectrum along x
	sumAxis?: "x" | "y";

	// Angstrom represented by one pixel/bin in output spectrum
	angstromPerPixel: number;
}

export interface Rect {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface Point {
	x: number;
	y: number;
}

export interface SourceAnnotation {
	id: string; // target-hub source id

	x: number;
	y: number;

	color?: string;
	active?: boolean;
	visible?: boolean;

	trace?: TraceAnnotation;
}

export interface TraceAnnotation {
	points: Point[];
	width?: number;
	visible?: boolean;
}

export interface Actions {
	onCollapseWindowChange?: (window: Rect) => void;
	onImagePointer?: (event: ImagePointerEvent) => void;
}

export interface ImagePointerEvent {
	phase: "down" | "move" | "up" | "click" | "contextmenu";

	point: Point;

	target:
		| { kind: "image" }
		| { kind: "source"; sourceId: string }
		| { kind: "trace"; sourceId: string };

	button: 0 | 1 | 2;

	shiftKey: boolean;
	metaKey: boolean;
	ctrlKey: boolean;
	altKey: boolean;
}
