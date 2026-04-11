import type { MouseEvent, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import {
	BEACON_DRAG_THRESHOLD,
	BEACON_EDGE_INSET,
	BEACON_HEIGHT,
} from "../../../shared/constants";
import { useAnchorStore } from "../../../store/useAnchorStore";
import { useShellStore } from "../../../store/useShellStore";
import { useBeaconStore } from "../store/useBeaconStore";

const clampTop = (top: number, viewportHeight: number) =>
	Math.min(
		viewportHeight - BEACON_EDGE_INSET - BEACON_HEIGHT,
		Math.max(BEACON_EDGE_INSET, top),
	);

const getTopFromRatio = (ratio: number, viewportHeight: number) =>
	clampTop(ratio * viewportHeight, viewportHeight);

const getRatioFromTop = (top: number, viewportHeight: number) =>
	Math.min(1, Math.max(0, top / Math.max(viewportHeight, 1)));

export function useBeaconDrag() {
	const anchorYRatio = useAnchorStore((state) => state.anchorYRatio);
	const startAnchorDrag = useAnchorStore((state) => state.startAnchorDrag);
	const markAnchorDragStarted = useAnchorStore(
		(state) => state.markAnchorDragStarted,
	);
	const updateAnchorYRatio = useAnchorStore(
		(state) => state.updateAnchorYRatio,
	);
	const endAnchorDrag = useAnchorStore((state) => state.endAnchorDrag);
	const setReveal = useBeaconStore((state) => state.setReveal);
	const openDock = useShellStore((state) => state.openDock);

	const dragMetaRef = useRef<{
		startClientY: number;
		startTop: number;
	} | null>(null);
	const dragStartedRef = useRef(false);
	const liveTopRef = useRef<number | null>(null);
	const cleanupRef = useRef<(() => void) | null>(null);
	const skipClickRef = useRef(false);
	const [viewportHeight, setViewportHeight] = useState(() =>
		typeof window === "undefined" ? 900 : window.innerHeight,
	);
	const [dragTop, setDragTop] = useState<number | null>(null);

	useEffect(() => {
		return () => {
			cleanupRef.current?.();
		};
	}, []);

	useEffect(() => {
		const handleResize = () => {
			setViewportHeight(window.innerHeight);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
		event.preventDefault();
		const startTop = dragTop ?? getTopFromRatio(anchorYRatio, viewportHeight);
		dragMetaRef.current = {
			startClientY: event.clientY,
			startTop,
		};
		dragStartedRef.current = false;
		liveTopRef.current = startTop;
		cleanupRef.current?.();
		setReveal("reveal");
		startAnchorDrag();

		const handlePointerMove = (moveEvent: PointerEvent) => {
			if (!dragMetaRef.current) return;
			const deltaY = moveEvent.clientY - dragMetaRef.current.startClientY;
			const nextTop = clampTop(
				dragMetaRef.current.startTop + deltaY,
				window.innerHeight,
			);
			if (Math.abs(deltaY) > BEACON_DRAG_THRESHOLD && !dragStartedRef.current) {
				dragStartedRef.current = true;
				markAnchorDragStarted();
				skipClickRef.current = true;
			}
			liveTopRef.current = nextTop;
			setDragTop(nextTop);
		};

		const finishDrag = () => {
			if (dragStartedRef.current && liveTopRef.current !== null) {
				updateAnchorYRatio(
					getRatioFromTop(liveTopRef.current, window.innerHeight),
				);
			}
			dragMetaRef.current = null;
			dragStartedRef.current = false;
			liveTopRef.current = null;
			setDragTop(null);
			endAnchorDrag();
			window.removeEventListener("pointermove", handlePointerMove);
			window.removeEventListener("pointerup", finishDrag);
			window.removeEventListener("pointercancel", finishDrag);
			cleanupRef.current = null;
		};

		window.addEventListener("pointermove", handlePointerMove);
		window.addEventListener("pointerup", finishDrag);
		window.addEventListener("pointercancel", finishDrag);
		cleanupRef.current = () => {
			window.removeEventListener("pointermove", handlePointerMove);
			window.removeEventListener("pointerup", finishDrag);
			window.removeEventListener("pointercancel", finishDrag);
		};
	};

	const handleClick = (event: MouseEvent<HTMLDivElement>) => {
		if (skipClickRef.current) {
			skipClickRef.current = false;
			event.preventDefault();
			event.stopPropagation();
			return;
		}
		openDock();
	};

	return {
		top: dragTop ?? getTopFromRatio(anchorYRatio, viewportHeight),
		handlePointerDown,
		handleClick,
	};
}
