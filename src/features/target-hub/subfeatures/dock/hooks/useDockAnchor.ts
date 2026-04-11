import { useEffect, useState } from "react";
import { BEACON_EDGE_INSET, DOCK_HEIGHT } from "../../../shared/constants";
import { useAnchorStore } from "../../../store/useAnchorStore";

const clampTop = (top: number, viewportHeight: number) =>
	Math.min(
		viewportHeight - DOCK_HEIGHT - BEACON_EDGE_INSET,
		Math.max(BEACON_EDGE_INSET, top),
	);

export function useDockAnchor() {
	const anchorYRatio = useAnchorStore((state) => state.anchorYRatio);
	const dockOffsetYFromAnchor = useAnchorStore(
		(state) => state.dockOffsetYFromAnchor,
	);
	const [viewportHeight, setViewportHeight] = useState(() =>
		typeof window === "undefined" ? 900 : window.innerHeight,
	);

	useEffect(() => {
		const handleResize = () => {
			setViewportHeight(window.innerHeight);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return clampTop(
		anchorYRatio * viewportHeight + dockOffsetYFromAnchor,
		viewportHeight,
	);
}
