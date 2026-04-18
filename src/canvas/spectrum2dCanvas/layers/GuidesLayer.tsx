import { HorizontalGuideLine } from "../objects/HorizontalGuideLine";
import { SPECTRUM_2D_CANVAS_GUIDE_COLOR } from "../shared/constants";
import type { Spectrum2DCanvasWorldBounds } from "../shared/types";

export interface GuidesLayerProps {
	worldBounds: Spectrum2DCanvasWorldBounds;
	worldY: number;
	showSpatialCenterLine: boolean;
}

export function GuidesLayer({
	worldBounds,
	worldY,
	showSpatialCenterLine,
}: GuidesLayerProps) {
	if (!showSpatialCenterLine) {
		return null;
	}

	return (
		<HorizontalGuideLine
			leftX={worldBounds.left}
			rightX={worldBounds.right}
			worldY={worldY}
			color={SPECTRUM_2D_CANVAS_GUIDE_COLOR}
		/>
	);
}
