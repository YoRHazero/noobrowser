import { useCallback, useEffect, useState } from "react";
import type { MapCanvasContainerRect } from "../shared/types";

export interface UseMapCanvasContainerRectResult {
	containerRef: (element: HTMLDivElement | null) => void;
	containerRect: MapCanvasContainerRect | null;
}

function readContainerRect(element: HTMLElement): MapCanvasContainerRect {
	const { left, top } = element.getBoundingClientRect();

	return { left, top };
}

function isSameContainerRect(
	left: MapCanvasContainerRect | null,
	right: MapCanvasContainerRect,
) {
	return left?.left === right.left && left?.top === right.top;
}

export function useMapCanvasContainerRect(): UseMapCanvasContainerRectResult {
	const [containerElement, setContainerElement] =
		useState<HTMLDivElement | null>(null);
	const [containerRect, setContainerRect] =
		useState<MapCanvasContainerRect | null>(null);
	const containerRef = useCallback((element: HTMLDivElement | null) => {
		setContainerElement(element);
	}, []);

	useEffect(() => {
		if (!containerElement) {
			setContainerRect(null);
			return;
		}

		const syncContainerRect = () => {
			const nextRect = readContainerRect(containerElement);
			setContainerRect((currentRect) =>
				isSameContainerRect(currentRect, nextRect) ? currentRect : nextRect,
			);
		};

		syncContainerRect();

		const resizeObserver =
			typeof ResizeObserver === "undefined"
				? null
				: new ResizeObserver(syncContainerRect);

		resizeObserver?.observe(containerElement);
		window.addEventListener("resize", syncContainerRect);
		window.addEventListener("scroll", syncContainerRect, true);

		return () => {
			resizeObserver?.disconnect();
			window.removeEventListener("resize", syncContainerRect);
			window.removeEventListener("scroll", syncContainerRect, true);
		};
	}, [containerElement]);

	return { containerRef, containerRect };
}
