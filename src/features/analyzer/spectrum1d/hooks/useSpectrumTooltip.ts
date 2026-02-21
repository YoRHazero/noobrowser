import { useTooltip, useTooltipInPortal } from "@visx/tooltip";
import { useCallback } from "react";
import type { TooltipData } from "../types";

export function useSpectrumTooltip(params: {
	anchor: { left: number; top: number };
	tooltipOffset?: number;
}) {
	const { anchor, tooltipOffset = 5 } = params;
	const {
		tooltipOpen,
		tooltipData,
		tooltipLeft,
		tooltipTop,
		showTooltip,
		hideTooltip,
	} = useTooltip<TooltipData>();

	const { containerRef, TooltipInPortal } = useTooltipInPortal({
		detectBounds: true,
		scroll: true,
	});

	const handleHover = useCallback(
		(data: TooltipData | null) => {
			if (!data) {
				hideTooltip();
				return;
			}
			showTooltip({
				tooltipData: data,
				tooltipLeft: data.pointerX + anchor.left + tooltipOffset,
				tooltipTop: data.pointerY + anchor.top + tooltipOffset,
			});
		},
		[anchor.left, anchor.top, hideTooltip, showTooltip, tooltipOffset],
	);

	return {
		tooltipOpen,
		tooltipData,
		tooltipLeft,
		tooltipTop,
		TooltipInPortal,
		containerRef,
		handleHover,
	};
}
