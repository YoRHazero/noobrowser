import { useCallback, useEffect, useState } from "react";
import type { ChartSize } from "../shared/types";

const EMPTY_SIZE: ChartSize = {
	width: 0,
	height: 0,
};

export function useCanvasSize() {
	const [element, setElement] = useState<HTMLDivElement | null>(null);
	const [size, setSize] = useState<ChartSize>(EMPTY_SIZE);
	const containerRef = useCallback((node: HTMLDivElement | null) => {
		setElement(node);
	}, []);

	useEffect(() => {
		if (!element) {
			setSize(EMPTY_SIZE);
			return;
		}

		const updateSize = (nextSize: ChartSize) => {
			setSize((currentSize) =>
				currentSize.width === nextSize.width &&
				currentSize.height === nextSize.height
					? currentSize
					: nextSize,
			);
		};

		updateSize({
			width: element.clientWidth,
			height: element.clientHeight,
		});

		if (typeof ResizeObserver === "undefined") {
			return;
		}

		const observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (!entry) {
				return;
			}

			updateSize({
				width: entry.contentRect.width,
				height: entry.contentRect.height,
			});
		});
		observer.observe(element);

		return () => observer.disconnect();
	}, [element]);

	return {
		containerRef,
		size,
	};
}
