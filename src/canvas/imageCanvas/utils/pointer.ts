import type { ImagePointerEvent } from "../api";
import type { ImagePointerBuildParams } from "../shared/types";

function normalizeButton(button: number): 0 | 1 | 2 {
	if (button === 1 || button === 2) {
		return button;
	}

	return 0;
}

export function buildImagePointerEvent({
	phase,
	point,
	target,
	button,
	shiftKey,
	metaKey,
	ctrlKey,
	altKey,
}: ImagePointerBuildParams): ImagePointerEvent {
	return {
		phase,
		point,
		target,
		button: normalizeButton(button),
		shiftKey,
		metaKey,
		ctrlKey,
		altKey,
	};
}
