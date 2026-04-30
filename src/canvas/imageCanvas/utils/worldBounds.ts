import type { Frame, Rect, SourceAnnotation } from "../api";
import type { WorldBounds } from "../shared/types";
import { frameToRect } from "./rect";

function createBounds(
	left: number,
	right: number,
	bottom: number,
	top: number,
) {
	const width = Math.max(1, right - left);
	const height = Math.max(1, top - bottom);

	return {
		left,
		right,
		bottom,
		top,
		width,
		height,
		centerX: left + width / 2,
		centerY: bottom + height / 2,
	};
}

function includeRect(
	bounds: { left: number; right: number; bottom: number; top: number } | null,
	rect: Rect,
) {
	const next = bounds ?? {
		left: rect.x,
		right: rect.x + rect.width,
		bottom: rect.y,
		top: rect.y + rect.height,
	};

	next.left = Math.min(next.left, rect.x);
	next.right = Math.max(next.right, rect.x + rect.width);
	next.bottom = Math.min(next.bottom, rect.y);
	next.top = Math.max(next.top, rect.y + rect.height);

	return next;
}

export function getWorldBounds({
	frames,
	roi,
	sources,
}: {
	frames: Array<Frame | null>;
	roi: Rect | null;
	sources: SourceAnnotation[];
}): WorldBounds {
	let bounds: {
		left: number;
		right: number;
		bottom: number;
		top: number;
	} | null = null;

	for (const frame of frames) {
		if (frame && frame.width > 0 && frame.height > 0) {
			bounds = includeRect(bounds, frameToRect(frame));
		}
	}

	if (roi) {
		bounds = includeRect(bounds, roi);
	}

	for (const source of sources) {
		if (source.visible === false) {
			continue;
		}

		bounds = includeRect(bounds, {
			x: source.x - 1,
			y: source.y - 1,
			width: 2,
			height: 2,
		});
	}

	if (!bounds) {
		return createBounds(0, 1, 0, 1);
	}

	return createBounds(bounds.left, bounds.right, bounds.bottom, bounds.top);
}
