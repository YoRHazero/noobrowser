import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { type OverviewUiTooltipMode, useOverviewUiStore } from "../../store";

export interface UseHudResult {
	open: boolean;
	setOpen: (open: boolean) => void;
	showGrid: boolean;
	tooltipMode: OverviewUiTooltipMode;
	targetCoordinatePrecision: number;
	setShowGrid: (show: boolean) => void;
	setTooltipMode: (mode: OverviewUiTooltipMode) => void;
	setTargetCoordinatePrecision: (precision: number) => void;
	triggerTransitionDelay: string;
}

export function useHud(): UseHudResult {
	const [open, setOpen] = useState(false);
	const {
		showGrid,
		tooltipMode,
		targetCoordinatePrecision,
		setShowGrid,
		setTooltipMode,
		setTargetCoordinatePrecision,
	} = useOverviewUiStore(
		useShallow((state) => ({
			showGrid: state.showGrid,
			tooltipMode: state.tooltipMode,
			targetCoordinatePrecision: state.targetCoordinatePrecision,
			setShowGrid: state.setShowGrid,
			setTooltipMode: state.setTooltipMode,
			setTargetCoordinatePrecision: state.setTargetCoordinatePrecision,
		})),
	);

	return {
		open,
		setOpen,
		showGrid,
		tooltipMode,
		targetCoordinatePrecision,
		setShowGrid,
		setTooltipMode,
		setTargetCoordinatePrecision,
		triggerTransitionDelay: open ? "0ms" : "140ms",
	};
}
