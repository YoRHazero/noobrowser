import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import {
	BEACON_DRAG_THRESHOLD,
	BEACON_EDGE_INSET,
	DOCK_HEIGHT,
} from "../../../shared/constants";
import { useAnchorStore } from "../../../store/useAnchorStore";

const clampTop = (top: number, viewportHeight: number) =>
	Math.min(
		viewportHeight - DOCK_HEIGHT - BEACON_EDGE_INSET,
		Math.max(BEACON_EDGE_INSET, top),
	);

const getAnchorRatioFromDockTop = (
	top: number,
	dockOffsetYFromAnchor: number,
	viewportHeight: number,
) =>
	Math.min(
		1,
		Math.max(0, (top - dockOffsetYFromAnchor) / Math.max(viewportHeight, 1)),
	);

export function useDockDrag(anchorTop: number) {
	const dockOffsetYFromAnchor = useAnchorStore(
		(state) => state.dockOffsetYFromAnchor,
	);
	const isAnchorDragging = useAnchorStore((state) => state.isAnchorDragging);
	const startAnchorDrag = useAnchorStore((state) => state.startAnchorDrag);
	const markAnchorDragStarted = useAnchorStore(
		(state) => state.markAnchorDragStarted,
	);
	const updateAnchorYRatio = useAnchorStore(
		(state) => state.updateAnchorYRatio,
	);
	const endAnchorDrag = useAnchorStore((state) => state.endAnchorDrag);

	const dragMetaRef = useRef<{
		startClientY: number;
		startTop: number;
	} | null>(null);
	const dragStartedRef = useRef(false);
	const liveTopRef = useRef<number | null>(null);
	const cleanupRef = useRef<(() => void) | null>(null);
	const [dragTop, setDragTop] = useState<number | null>(null);

	useEffect(() => {
		return () => {
			cleanupRef.current?.();
		};
	}, []);

	const onHandlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();

		const startTop = dragTop ?? anchorTop;
		dragMetaRef.current = {
			startClientY: event.clientY,
			startTop,
		};
		dragStartedRef.current = false;
		liveTopRef.current = startTop;
		cleanupRef.current?.();
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
			}

			liveTopRef.current = nextTop;
			setDragTop(nextTop);
		};

		const finishDrag = () => {
			if (dragStartedRef.current && liveTopRef.current !== null) {
				updateAnchorYRatio(
					getAnchorRatioFromDockTop(
						liveTopRef.current,
						dockOffsetYFromAnchor,
						window.innerHeight,
					),
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

	return {
		top: dragTop ?? anchorTop,
		isAnchorDragging,
		onHandlePointerDown,
	};
}
