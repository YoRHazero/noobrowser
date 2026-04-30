"use client";

import type { LayerModel, RasterStyle } from "@/canvas/imageCanvas";
import { useBaseLayerCanvasData } from "./useBaseLayerCanvasData";
import { useReferenceLayerCanvasData } from "./useReferenceLayerCanvasData";

export interface ImageInspectorCanvasData {
	baseLayer: LayerModel | null;
	referenceLayer: LayerModel | null;
	baseStyle: RasterStyle;
	referenceStyle: RasterStyle;
	errorMessage: string | null;
}

export function useImageInspectorCanvasData(): ImageInspectorCanvasData {
	const baseLayerCanvasData = useBaseLayerCanvasData();
	const referenceLayerCanvasData = useReferenceLayerCanvasData();

	return {
		baseLayer: baseLayerCanvasData.baseLayer,
		referenceLayer: referenceLayerCanvasData.referenceLayer,
		baseStyle: baseLayerCanvasData.baseStyle,
		referenceStyle: referenceLayerCanvasData.referenceStyle,
		errorMessage:
			baseLayerCanvasData.errorMessage ?? referenceLayerCanvasData.errorMessage,
	};
}
