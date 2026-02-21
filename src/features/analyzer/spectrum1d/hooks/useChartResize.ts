
// @/features/grism/spectrum1d/hooks/useChartResize.ts
import { useCallback, useEffect, useState } from "react";

export function useChartResize() {
	/* -------------------------------------------------------------------------- */
	/*                                 Local State                                */
	/* -------------------------------------------------------------------------- */
	const [containerNode, setContainerNode] = useState<HTMLDivElement | null>(
		null,
	);
	const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

	/* -------------------------------------------------------------------------- */
	/*                                   Handle                                   */
	/* -------------------------------------------------------------------------- */
	const containerRef = useCallback((node: HTMLDivElement | null) => {
		setContainerNode(node);
	}, []);

	/* -------------------------------------------------------------------------- */
	/*                                   Effects                                  */
	/* -------------------------------------------------------------------------- */
	useEffect(() => {
		if (!containerNode) return;
		const updateWidth = () => {
			setContainerSize({
				width: containerNode.clientWidth,
				height: containerNode.clientHeight,
			});
		};
		updateWidth();
		const observer = new ResizeObserver(updateWidth);
		observer.observe(containerNode);
		return () => observer.disconnect();
	}, [containerNode]);

	/* -------------------------------------------------------------------------- */
	/*                                   Return                                   */
	/* -------------------------------------------------------------------------- */
	return {
		containerRef,
		width: containerSize.width,
		height: containerSize.height,
	};
}
