"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import type { Actions, Model } from "@/canvas/imageCanvas";
import { useSourceStore } from "@/stores/source";
import { useImageInspectorBaseLayerHotkeys } from "./hooks/useImageInspectorBaseLayerHotkeys";
import { useImageInspectorCanvasData } from "./hooks/useImageInspectorCanvasData";
import { useImageInspectorRoiHotkeys } from "./hooks/useImageInspectorRoiHotkeys";
import { useImageInspectorSourceAnnotations } from "./hooks/useImageInspectorSourceAnnotations";
import { useImageInspectorStore } from "./store";
import { createImageInspectorCanvasModel } from "./utils/imageInspectorCanvasModel";

export interface ImageInspectorViewModel {
	canvas: {
		model: Model;
		actions: Actions;
	};
}

export function useImageInspector(): ImageInspectorViewModel {
	const setActiveSourceId = useSourceStore((state) => state.setActiveSourceId);
	useImageInspectorBaseLayerHotkeys();
	useImageInspectorRoiHotkeys();
	const { referenceMode, referenceOpacity, roi, lockROI } =
		useImageInspectorStore(
			useShallow((state) => ({
				referenceMode: state.referenceMode,
				referenceOpacity: state.referenceOpacity,
				roi: state.annotationLayerRoi,
				lockROI: state.lockROI,
			})),
		);
	const canvasData = useImageInspectorCanvasData();
	const sourceAnnotations = useImageInspectorSourceAnnotations();

	const model = useMemo<Model>(
		() =>
			createImageInspectorCanvasModel({
				baseLayer: canvasData.baseLayer,
				referenceLayer: canvasData.referenceLayer,
				baseStyle: canvasData.baseStyle,
				referenceStyle: canvasData.referenceStyle,
				referenceOpacity,
				referenceMode,
				roi,
				lockROI,
				sourceAnnotations,
			}),
		[
			canvasData.baseLayer,
			canvasData.baseStyle,
			canvasData.referenceLayer,
			canvasData.referenceStyle,
			lockROI,
			referenceMode,
			referenceOpacity,
			roi,
			sourceAnnotations,
		],
	);

	const actions = useMemo<Actions>(
		() => ({
			onImagePointer: (event) => {
				if (event.phase === "click" && event.target.kind === "source") {
					setActiveSourceId(event.target.sourceId);
				}
			},
		}),
		[setActiveSourceId],
	);

	return {
		canvas: {
			model,
			actions,
		},
	};
}
