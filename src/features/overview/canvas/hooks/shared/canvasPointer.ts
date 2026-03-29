import type { ScreenPoint } from "@/features/overview/utils/types";

export interface CanvasPointerState {
	client: ScreenPoint;
	local: ScreenPoint;
}

export function readCanvasPointerState(
	event: Pick<PointerEvent, "clientX" | "clientY">,
	element: Pick<Element, "getBoundingClientRect">,
): CanvasPointerState {
	const rect = element.getBoundingClientRect();

	return {
		client: {
			x: event.clientX,
			y: event.clientY,
		},
		local: {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top,
		},
	};
}
