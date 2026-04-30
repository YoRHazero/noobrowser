import type { Frame, Rect } from "../api";
import {
	IMAGE_CANVAS_DEFAULT_COLLAPSE_WINDOW,
	IMAGE_CANVAS_MIN_COLLAPSE_SIZE,
} from "../shared/constants";
import { clampValue } from "./clampValue";

export function normalizeRect(rect: Rect): Rect | null {
	if (
		!Number.isFinite(rect.x) ||
		!Number.isFinite(rect.y) ||
		!Number.isFinite(rect.width) ||
		!Number.isFinite(rect.height) ||
		rect.width <= 0 ||
		rect.height <= 0
	) {
		return null;
	}

	return rect;
}

export function clampRectToBounds(rect: Rect, bounds: Rect): Rect {
	const width = clampValue(rect.width, 0, bounds.width);
	const height = clampValue(rect.height, 0, bounds.height);
	const x = clampValue(rect.x, bounds.x, bounds.x + bounds.width - width);
	const y = clampValue(rect.y, bounds.y, bounds.y + bounds.height - height);

	return { x, y, width, height };
}

export function clampRoiLocalRect(rect: Rect, roi: Rect): Rect {
	return clampRectToBounds(rect, {
		x: 0,
		y: 0,
		width: roi.width,
		height: roi.height,
	});
}

export function createDefaultCollapseWindow(roi: Rect): Rect {
	const width = Math.min(IMAGE_CANVAS_DEFAULT_COLLAPSE_WINDOW.width, roi.width);
	const height = Math.min(
		IMAGE_CANVAS_DEFAULT_COLLAPSE_WINDOW.height,
		roi.height,
	);

	return clampRoiLocalRect(
		{
			x: roi.width / 2 - IMAGE_CANVAS_DEFAULT_COLLAPSE_WINDOW.width / 2,
			y: roi.height / 2 - IMAGE_CANVAS_DEFAULT_COLLAPSE_WINDOW.height / 2,
			width,
			height,
		},
		roi,
	);
}

export function resolveCollapseWindow({
	roi,
	collapseWindow,
}: {
	roi: Rect | null;
	collapseWindow?: Rect;
}): Rect | null {
	if (!roi) {
		return null;
	}

	return collapseWindow
		? clampRoiLocalRect(collapseWindow, roi)
		: createDefaultCollapseWindow(roi);
}

export function roiLocalRectToWorldRect(roi: Rect, rect: Rect): Rect {
	return {
		x: roi.x + rect.x,
		y: roi.y + rect.y,
		width: rect.width,
		height: rect.height,
	};
}

export function frameToRect(frame: Frame): Rect {
	return {
		x: frame.x,
		y: frame.y,
		width: frame.width,
		height: frame.height,
	};
}

export function getFrameUnionRect(
	frames: readonly Frame[],
	margin = 0,
): Rect | null {
	let left = Number.POSITIVE_INFINITY;
	let right = Number.NEGATIVE_INFINITY;
	let bottom = Number.POSITIVE_INFINITY;
	let top = Number.NEGATIVE_INFINITY;

	for (const frame of frames) {
		if (frame.width <= 0 || frame.height <= 0) {
			continue;
		}

		left = Math.min(left, frame.x);
		right = Math.max(right, frame.x + frame.width);
		bottom = Math.min(bottom, frame.y);
		top = Math.max(top, frame.y + frame.height);
	}

	if (
		!Number.isFinite(left) ||
		!Number.isFinite(right) ||
		!Number.isFinite(bottom) ||
		!Number.isFinite(top)
	) {
		return null;
	}

	return {
		x: left - margin,
		y: bottom - margin,
		width: right - left + margin * 2,
		height: top - bottom + margin * 2,
	};
}

export function resizeRoiLocalRect({
	rect,
	roi,
	mode,
	dx,
	dy,
}: {
	rect: Rect;
	roi: Rect;
	mode: "move" | "left" | "right" | "bottom" | "top";
	dx: number;
	dy: number;
}): Rect {
	let next = { ...rect };

	if (mode === "move") {
		next.x += dx;
		next.y += dy;
		return clampRoiLocalRect(next, roi);
	}

	if (mode === "left") {
		const right = rect.x + rect.width;
		const x = clampValue(
			rect.x + dx,
			0,
			right - IMAGE_CANVAS_MIN_COLLAPSE_SIZE,
		);
		next = { ...next, x, width: right - x };
	}

	if (mode === "right") {
		const right = clampValue(
			rect.x + rect.width + dx,
			rect.x + IMAGE_CANVAS_MIN_COLLAPSE_SIZE,
			roi.width,
		);
		next = { ...next, width: right - rect.x };
	}

	if (mode === "bottom") {
		const top = rect.y + rect.height;
		const y = clampValue(rect.y + dy, 0, top - IMAGE_CANVAS_MIN_COLLAPSE_SIZE);
		next = { ...next, y, height: top - y };
	}

	if (mode === "top") {
		const top = clampValue(
			rect.y + rect.height + dy,
			rect.y + IMAGE_CANVAS_MIN_COLLAPSE_SIZE,
			roi.height,
		);
		next = { ...next, height: top - rect.y };
	}

	return clampRoiLocalRect(next, roi);
}
