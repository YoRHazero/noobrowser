"use client";

import { useFitJobActions } from "../../hooks";
import { useShellStore } from "../../store/useShellStore";
import { useDockAnchor } from "./hooks/useDockAnchor";
import { useDockCollapse } from "./hooks/useDockCollapse";
import { useDockDrag } from "./hooks/useDockDrag";
import { useDockSourceCard } from "./hooks/useDockSourceCard";

export function useDock() {
	const openSheet = useShellStore((state) => state.openSheet);
	const { openFitJob } = useFitJobActions();
	const { isClosing, onCollapse } = useDockCollapse();
	const sourceCard = useDockSourceCard();
	const anchorTop = useDockAnchor();
	const { top, isAnchorDragging, onHandlePointerDown } = useDockDrag(anchorTop);

	return {
		top,
		isAnchorDragging,
		isClosing,
		sourceCard,
		onHandlePointerDown,
		onOpenSheet: openSheet,
		onOpenFitJob: openFitJob,
		onCollapse,
	};
}
