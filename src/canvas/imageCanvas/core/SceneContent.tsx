import type { ImageTextureCache } from "../hooks/useImageTextureCache";
import { AnnotationLayer } from "../layers/AnnotationLayer";
import { BaseLayer, MaskLayer, ReferenceLayer } from "../layers/RasterLayers";
import { IMAGE_CANVAS_BACKGROUND } from "../shared/constants";
import type {
	ImageCanvasViewKind,
	ResolvedImageCanvasViewModel,
} from "../shared/types";
import { CameraRig } from "./CameraRig";

export function SceneContent({
	view,
	textureCache,
	viewKind,
}: {
	view: ResolvedImageCanvasViewModel;
	textureCache: ImageTextureCache;
	viewKind: ImageCanvasViewKind;
}) {
	return (
		<>
			<color attach="background" args={[IMAGE_CANVAS_BACKGROUND]} />
			<CameraRig view={view} viewKind={viewKind} />
			<BaseLayer view={view} textureCache={textureCache} />
			<ReferenceLayer view={view} textureCache={textureCache} />
			<MaskLayer view={view} textureCache={textureCache} />
			<AnnotationLayer view={view} viewKind={viewKind} />
		</>
	);
}
