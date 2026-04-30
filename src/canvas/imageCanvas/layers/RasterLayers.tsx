import { useMemo } from "react";
import type { Frame } from "../api";
import type { ImageTextureCache } from "../hooks/useImageTextureCache";
import { BitmapReferenceFrameMesh } from "../objects/BitmapReferenceFrameMesh";
import { MaskFrameMesh } from "../objects/MaskFrameMesh";
import { RasterFrameMesh } from "../objects/RasterFrameMesh";
import type { ResolvedImageCanvasViewModel } from "../shared/types";

function BaseLayerFrame({
	frame,
	view,
	textureCache,
}: {
	frame: Frame;
	view: ResolvedImageCanvasViewModel;
	textureCache: ImageTextureCache;
}) {
	const texture = useMemo(
		() => textureCache.getTexture("base", "data", frame, "linear"),
		[frame, textureCache],
	);

	if (!texture) {
		return null;
	}

	return (
		<RasterFrameMesh
			frame={frame}
			texture={texture}
			style={view.baseStyle}
			opacity={1}
			renderOrder={0}
		/>
	);
}

export function BaseLayer({
	view,
	textureCache,
}: {
	view: ResolvedImageCanvasViewModel;
	textureCache: ImageTextureCache;
}) {
	if (!view.baseFrame) {
		return null;
	}

	return (
		<BaseLayerFrame
			frame={view.baseFrame}
			view={view}
			textureCache={textureCache}
		/>
	);
}

function ReferenceLayerFrame({
	frame,
	view,
	textureCache,
}: {
	frame: Frame;
	view: ResolvedImageCanvasViewModel;
	textureCache: ImageTextureCache;
}) {
	const texture = useMemo(
		() => textureCache.getTexture("reference", "data", frame, "linear"),
		[frame, textureCache],
	);

	if (!texture) {
		return null;
	}

	if (frame.data.kind === "bitmap") {
		return (
			<BitmapReferenceFrameMesh
				frame={frame}
				texture={texture}
				mode={view.referenceMode}
				opacity={view.referenceOpacity}
				renderOrder={1}
			/>
		);
	}

	return (
		<RasterFrameMesh
			frame={frame}
			texture={texture}
			style={view.referenceStyle ?? view.baseStyle}
			opacity={view.referenceOpacity}
			renderOrder={1}
		/>
	);
}

export function ReferenceLayer({
	view,
	textureCache,
}: {
	view: ResolvedImageCanvasViewModel;
	textureCache: ImageTextureCache;
}) {
	if (!view.referenceFrame) {
		return null;
	}

	return (
		<ReferenceLayerFrame
			frame={view.referenceFrame}
			view={view}
			textureCache={textureCache}
		/>
	);
}

function MaskLayerFrame({
	frame,
	view,
	textureCache,
}: {
	frame: Frame;
	view: ResolvedImageCanvasViewModel;
	textureCache: ImageTextureCache;
}) {
	const texture = useMemo(
		() => textureCache.getTexture("mask", "data", frame, "nearest"),
		[frame, textureCache],
	);

	if (!texture) {
		return null;
	}

	return (
		<MaskFrameMesh
			frame={frame}
			texture={texture}
			maskMap={view.maskMap}
			renderOrder={2}
		/>
	);
}

export function MaskLayer({
	view,
	textureCache,
}: {
	view: ResolvedImageCanvasViewModel;
	textureCache: ImageTextureCache;
}) {
	if (!view.maskFrame) {
		return null;
	}

	return (
		<MaskLayerFrame
			frame={view.maskFrame}
			view={view}
			textureCache={textureCache}
		/>
	);
}
