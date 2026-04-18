import { SPECTRUM_1D_CANVAS_TOOLTIP_OFFSET_PX } from "../shared/constants";
import type { ScreenAnchor, ScreenPoint } from "../shared/types";

export function getTooltipPosition({
	anchor,
	pointer,
}: {
	anchor: ScreenAnchor;
	pointer: ScreenPoint;
}): ScreenPoint {
	return {
		x: anchor.left + pointer.x + SPECTRUM_1D_CANVAS_TOOLTIP_OFFSET_PX,
		y: anchor.top + pointer.y + SPECTRUM_1D_CANVAS_TOOLTIP_OFFSET_PX,
	};
}
