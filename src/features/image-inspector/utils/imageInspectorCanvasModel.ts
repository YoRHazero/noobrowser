import type {
	LayerModel,
	Model,
	RasterStyle,
	Rect,
	ReferenceMode,
	SourceAnnotation,
} from "@/canvas/imageCanvas";
import { IMAGE_INSPECTOR_PLACEHOLDER_BASE_LAYER } from "./imageInspectorPlaceholderFrames";

export interface ImageInspectorCanvasModelInput {
	baseLayer: LayerModel | null;
	referenceLayer: LayerModel | null;
	baseStyle: RasterStyle;
	referenceStyle: RasterStyle;
	referenceOpacity: number;
	referenceMode: ReferenceMode;
	roi: Rect;
	lockROI: boolean;
	sourceAnnotations: SourceAnnotation[];
}

export function createImageInspectorCanvasModel({
	baseLayer,
	referenceLayer,
	baseStyle,
	referenceStyle,
	referenceOpacity,
	referenceMode,
	roi,
	lockROI,
	sourceAnnotations,
}: ImageInspectorCanvasModelInput): Model {
	return {
		baseLayer: baseLayer ?? IMAGE_INSPECTOR_PLACEHOLDER_BASE_LAYER,
		referenceLayer: referenceLayer ?? undefined,
		annotationLayer: {
			roi,
			sources: sourceAnnotations,
		},
		camera: {
			lockROI,
		},
		baseStyle,
		referenceStyle,
		referenceOpacity,
		referenceMode,
		collapsedSpectrum: {
			sumAxis: "y",
			angstromPerPixel: 42,
		},
	};
}
