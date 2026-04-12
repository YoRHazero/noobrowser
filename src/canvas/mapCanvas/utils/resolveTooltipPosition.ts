import type { MapCanvasScreenPoint } from "../api";
import { MAP_CANVAS_COORDINATE_TOOLTIP_OFFSET_PX } from "../shared/constants";
import type { TooltipPosition } from "../shared/types";

export function resolveTooltipPosition(
	anchor: MapCanvasScreenPoint | null | undefined,
	containerRect: Pick<DOMRectReadOnly, "left" | "top"> | null,
	offsetPx = MAP_CANVAS_COORDINATE_TOOLTIP_OFFSET_PX,
): TooltipPosition | null {
	if (!anchor) {
		return null;
	}

	return {
		left: anchor.x - (containerRect?.left ?? 0) + offsetPx,
		top: anchor.y - (containerRect?.top ?? 0) + offsetPx,
	};
}
