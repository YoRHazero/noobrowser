import { useEffect, useState } from "react";
import { useBeaconStore } from "../../beacon/store/useBeaconStore";
import { BEACON_EDGE_INSET, DOCK_HEIGHT } from "../../shared/constants";
import { useShellStore } from "../../store/useShellStore";

const clampTop = (top: number, viewportHeight: number) =>
	Math.min(
		viewportHeight - DOCK_HEIGHT - BEACON_EDGE_INSET,
		Math.max(BEACON_EDGE_INSET, top),
	);

export function useDockAnchor() {
	const beaconYRatio = useBeaconStore((state) => state.beaconYRatio);
	const dockAnchorOffsetY = useShellStore((state) => state.dockAnchorOffsetY);
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
		beaconYRatio * viewportHeight + dockAnchorOffsetY,
		viewportHeight,
	);
}
