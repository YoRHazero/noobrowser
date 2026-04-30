import { useCallback, useMemo } from "react";
import type { CanvasProps, Frame, Rect } from "./api";
import { useImageTextureCache } from "./hooks/useImageTextureCache";
import { useResolvedCollapseWindow } from "./hooks/useResolvedCollapseWindow";
import { IMAGE_CANVAS_DEFAULT_REFERENCE_OPACITY } from "./shared/constants";
import type { ResolvedImageCanvasViewModel } from "./shared/types";
import {
	extractCollapsedSpectrum,
	getWorldBounds,
	isScalarDataValid,
	normalizeRect,
	roiLocalRectToWorldRect,
} from "./utils";

function isRenderableFrame(
	frame: Frame | null,
	scalarOnly: boolean,
): frame is Frame {
	if (!frame || frame.width <= 0 || frame.height <= 0) {
		return false;
	}

	if (scalarOnly && frame.data.kind !== "scalar") {
		return false;
	}

	if (frame.data.kind === "scalar") {
		return isScalarDataValid(frame.data, frame.width * frame.height);
	}

	return !scalarOnly;
}

function getRenderableFrames(
	layer: CanvasProps["model"]["baseLayer"] | undefined,
	scalarOnly: boolean,
): Frame[] {
	if (!layer) {
		return [];
	}

	return layer.frames.filter((frame) => isRenderableFrame(frame, scalarOnly));
}

function getActiveRenderableFrame(
	layer: CanvasProps["model"]["baseLayer"] | undefined,
	frames: Frame[],
): Frame | null {
	if (!layer) {
		return null;
	}

	return (
		frames.find((frame) => frame.id === layer.activeId) ?? frames[0] ?? null
	);
}

export function useImageCanvas({ model, actions }: CanvasProps): {
	view: ResolvedImageCanvasViewModel;
	textureCache: ReturnType<typeof useImageTextureCache>;
} {
	const roi = useMemo(
		() =>
			model.annotationLayer?.roi
				? normalizeRect(model.annotationLayer.roi)
				: null,
		[model.annotationLayer?.roi],
	);
	const textureCache = useImageTextureCache(model);
	const { collapseWindow, setCollapseWindow } = useResolvedCollapseWindow({
		roi,
		controlledWindow: model.annotationLayer?.collapseWindow,
		onChange: actions?.onCollapseWindowChange,
	});

	const baseFrames = useMemo(
		() => getRenderableFrames(model.baseLayer, true),
		[model.baseLayer],
	);
	const baseFrame = useMemo(
		() => getActiveRenderableFrame(model.baseLayer, baseFrames),
		[baseFrames, model.baseLayer],
	);
	const referenceFrames = useMemo(
		() => getRenderableFrames(model.referenceLayer, false),
		[model.referenceLayer],
	);
	const referenceFrame = useMemo(
		() => getActiveRenderableFrame(model.referenceLayer, referenceFrames),
		[model.referenceLayer, referenceFrames],
	);
	const maskFrames = useMemo(
		() => getRenderableFrames(model.maskLayer, true),
		[model.maskLayer],
	);
	const maskFrame = useMemo(
		() => getActiveRenderableFrame(model.maskLayer, maskFrames),
		[maskFrames, model.maskLayer],
	);
	const sources = model.annotationLayer?.sources ?? [];
	const collapseWindowWorld = useMemo(
		() =>
			roi && collapseWindow
				? roiLocalRectToWorldRect(roi, collapseWindow)
				: null,
		[collapseWindow, roi],
	);
	const worldBounds = useMemo(
		() =>
			getWorldBounds({
				frames: [baseFrame, referenceFrame, maskFrame],
				roi,
				sources,
			}),
		[baseFrame, maskFrame, referenceFrame, roi, sources],
	);
	const collapsedSpectrum = useMemo(
		() =>
			extractCollapsedSpectrum({
				frame: baseFrame,
				roi,
				collapseWindow,
				model: model.collapsedSpectrum,
			}),
		[baseFrame, collapseWindow, model.collapsedSpectrum, roi],
	);
	const onCollapseWindowChange = useCallback(
		(window: Rect) => {
			setCollapseWindow(window);
		},
		[setCollapseWindow],
	);

	return {
		textureCache,
		view: {
			model,
			baseFrames,
			baseFrame,
			referenceFrames,
			referenceFrame,
			maskFrames,
			maskFrame,
			baseStyle: model.baseStyle,
			referenceStyle: model.referenceStyle ?? model.baseStyle,
			referenceOpacity:
				model.referenceOpacity ?? IMAGE_CANVAS_DEFAULT_REFERENCE_OPACITY,
			referenceMode: model.referenceMode ?? "rgb",
			maskMap: model.maskMap ?? [],
			roi,
			lockROI: model.camera?.lockROI ?? false,
			collapseWindow,
			collapseWindowWorld,
			sources,
			worldBounds,
			collapsedSpectrum,
			onCollapseWindowChange,
			onImagePointer: actions?.onImagePointer,
		},
	};
}
