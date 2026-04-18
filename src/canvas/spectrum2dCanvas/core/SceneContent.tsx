import { CollapseWindowLayer } from "../layers/CollapseWindowLayer";
import { EmissionLinesLayer } from "../layers/EmissionLinesLayer";
import { GuidesLayer } from "../layers/GuidesLayer";
import { RasterLayer } from "../layers/RasterLayer";
import { SPECTRUM_2D_CANVAS_BACKGROUND } from "../shared/constants";
import type { Spectrum2DCanvasViewModel } from "../shared/types";
import { CameraRig } from "./CameraRig";

export interface SceneContentProps {
	view: Spectrum2DCanvasViewModel;
}

export function SceneContent({ view }: SceneContentProps) {
	return (
		<>
			<color attach="background" args={[SPECTRUM_2D_CANVAS_BACKGROUND]} />
			<CameraRig worldBounds={view.worldBounds} />
			<RasterLayer view={view} />
			<CollapseWindowLayer collapseWindow={view.collapseWindow} />
			<GuidesLayer
				worldBounds={view.worldBounds}
				worldY={view.spatialCenterWorldY}
				showSpatialCenterLine={view.showSpatialCenterLine}
			/>
			<EmissionLinesLayer
				emissionLines={view.emissionLines}
				worldBounds={view.worldBounds}
			/>
		</>
	);
}
