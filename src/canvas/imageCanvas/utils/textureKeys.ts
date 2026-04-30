import type { Frame, LayerModel } from "../api";
import type {
	ImageCanvasLayerRole,
	ImageCanvasTexturePart,
} from "../shared/types";

export function getTextureCacheKey(
	layer: ImageCanvasLayerRole,
	part: ImageCanvasTexturePart,
	frameId: string,
): string {
	return `${layer}:${part}:${frameId}`;
}

function addFrameKeys(
	keys: Set<string>,
	layer: ImageCanvasLayerRole,
	frame: Frame,
): void {
	keys.add(getTextureCacheKey(layer, "data", frame.id));
	if (frame.error && layer !== "mask") {
		keys.add(getTextureCacheKey(layer, "error", frame.id));
	}
}

export function getLayerRetainTextureKeys(
	layer: ImageCanvasLayerRole,
	model: LayerModel | undefined,
): Set<string> {
	const keys = new Set<string>();
	if (!model) {
		return keys;
	}

	for (const frame of model.frames) {
		addFrameKeys(keys, layer, frame);
	}

	return keys;
}

export function getModelRetainTextureKeys({
	baseLayer,
	referenceLayer,
	maskLayer,
}: {
	baseLayer: LayerModel;
	referenceLayer?: LayerModel;
	maskLayer?: LayerModel;
}): Set<string> {
	return new Set([
		...getLayerRetainTextureKeys("base", baseLayer),
		...getLayerRetainTextureKeys("reference", referenceLayer),
		...getLayerRetainTextureKeys("mask", maskLayer),
	]);
}
