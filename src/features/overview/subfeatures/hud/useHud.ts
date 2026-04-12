import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { type OverviewUiTooltipMode, useOverviewUiStore } from "../../store";

export interface UseHudResult {
	open: boolean;
	setOpen: (open: boolean) => void;
	mapCanvasMounted: boolean;
	showGrid: boolean;
	tooltipMode: OverviewUiTooltipMode;
	targetCoordinatePrecision: number;
	setMapCanvasMounted: (mounted: boolean) => void;
	setShowGrid: (show: boolean) => void;
	setTooltipMode: (mode: OverviewUiTooltipMode) => void;
	setTargetCoordinatePrecision: (precision: number) => void;
	triggerTransitionDelay: string;
}

export function useHud(): UseHudResult {
	const [open, setOpen] = useState(false);
	const {
		mapCanvasMounted,
		showGrid,
		tooltipMode,
		targetCoordinatePrecision,
		setMapCanvasMounted,
		setShowGrid,
		setTooltipMode,
		setTargetCoordinatePrecision,
	} = useOverviewUiStore(
		useShallow((state) => ({
			mapCanvasMounted: state.mapCanvasMounted,
			showGrid: state.showGrid,
			tooltipMode: state.tooltipMode,
			targetCoordinatePrecision: state.targetCoordinatePrecision,
			setMapCanvasMounted: state.setMapCanvasMounted,
			setShowGrid: state.setShowGrid,
			setTooltipMode: state.setTooltipMode,
			setTargetCoordinatePrecision: state.setTargetCoordinatePrecision,
		})),
	);

	return {
		open,
		setOpen,
		mapCanvasMounted,
		showGrid,
		tooltipMode,
		targetCoordinatePrecision,
		setMapCanvasMounted,
		setShowGrid,
		setTooltipMode,
		setTargetCoordinatePrecision,
		triggerTransitionDelay: open ? "0ms" : "140ms",
	};
}
