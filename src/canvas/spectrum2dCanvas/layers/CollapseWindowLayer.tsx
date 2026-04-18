import { RectangleOutline } from "../objects/RectangleOutline";
import { SPECTRUM_2D_CANVAS_COLLAPSE_OUTLINE_COLOR } from "../shared/constants";
import type { Spectrum2DCanvasResolvedCollapseWindow } from "../shared/types";

export interface CollapseWindowLayerProps {
	collapseWindow: Spectrum2DCanvasResolvedCollapseWindow | null;
}

export function CollapseWindowLayer({
	collapseWindow,
}: CollapseWindowLayerProps) {
	if (!collapseWindow?.outlineVisible) {
		return null;
	}

	return (
		<RectangleOutline
			leftX={collapseWindow.worldLeftX}
			rightX={collapseWindow.worldRightX}
			topY={collapseWindow.worldTopY}
			bottomY={collapseWindow.worldBottomY}
			color={SPECTRUM_2D_CANVAS_COLLAPSE_OUTLINE_COLOR}
		/>
	);
}
