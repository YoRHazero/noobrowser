import type {
	ColorMap,
	Frame,
	ImagePointerEvent,
	MaskMapEntry,
	Model,
	Point,
	RasterStyle,
	Rect,
	ReferenceMode,
	SourceAnnotation,
} from "../api";

export type ImageCanvasLayerRole = "base" | "reference" | "mask";
export type ImageCanvasTexturePart = "data" | "error";
export type ImageCanvasViewKind = "main" | "roi";

export interface WorldBounds {
	left: number;
	right: number;
	bottom: number;
	top: number;
	width: number;
	height: number;
	centerX: number;
	centerY: number;
}

export interface CollapsedSpectrumBin {
	index: number;
	angstrom: number;
	value: number;
	error?: number;
}

export interface CollapsedSpectrumViewModel {
	sumAxis: "x" | "y";
	angstromPerPixel: number;
	bins: CollapsedSpectrumBin[];
	valueMin: number;
	valueMax: number;
}

export interface ResolvedImageCanvasViewModel {
	model: Model;
	baseFrames: Frame[];
	baseFrame: Frame | null;
	referenceFrames: Frame[];
	referenceFrame: Frame | null;
	maskFrames: Frame[];
	maskFrame: Frame | null;
	baseStyle: RasterStyle;
	referenceStyle: RasterStyle | null;
	referenceOpacity: number;
	referenceMode: ReferenceMode;
	maskMap: MaskMapEntry[];
	roi: Rect | null;
	lockROI: boolean;
	collapseWindow: Rect | null;
	collapseWindowWorld: Rect | null;
	sources: SourceAnnotation[];
	worldBounds: WorldBounds;
	collapsedSpectrum: CollapsedSpectrumViewModel | null;
	onCollapseWindowChange: (window: Rect) => void;
	onImagePointer: ((event: ImagePointerEvent) => void) | undefined;
}

export interface ImagePointerBuildParams {
	phase: ImagePointerEvent["phase"];
	point: Point;
	target: ImagePointerEvent["target"];
	button: number;
	shiftKey: boolean;
	metaKey: boolean;
	ctrlKey: boolean;
	altKey: boolean;
}

export type ResolvedColorMap = ColorMap;
