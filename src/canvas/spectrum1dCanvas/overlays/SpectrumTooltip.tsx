import { Box, Text, useSlotRecipe } from "@chakra-ui/react";
import { spectrum1DCanvasRecipe } from "../Spectrum1DCanvas.recipe";
import { SPECTRUM_1D_CANVAS_TOOLTIP_OFFSET_PX } from "../shared/constants";
import type {
	ScreenAnchor,
	Spectrum1DCanvasTooltipData,
} from "../shared/types";

function formatFlux(value: number) {
	return Number.isFinite(value) ? value.toFixed(4) : "n/a";
}

export function SpectrumTooltip({
	tooltip,
	anchor,
	wavelengthDisplay,
}: {
	tooltip: Spectrum1DCanvasTooltipData | null;
	anchor: ScreenAnchor;
	wavelengthDisplay: {
		format: (observedWavelengthUm: number) => string;
	};
}) {
	const recipe = useSlotRecipe({ recipe: spectrum1DCanvasRecipe });
	const styles = recipe();

	if (!tooltip) {
		return null;
	}

	const left =
		anchor.left + tooltip.pointer.x + SPECTRUM_1D_CANVAS_TOOLTIP_OFFSET_PX;
	const top =
		anchor.top + tooltip.pointer.y + SPECTRUM_1D_CANVAS_TOOLTIP_OFFSET_PX;

	return (
		<Box
			role="tooltip"
			css={styles.tooltip}
			left={`${left}px`}
			top={`${top}px`}
		>
			<Text css={styles.tooltipTitle}>
				{wavelengthDisplay.format(tooltip.point.wavelengthUm)}
			</Text>
			<Text css={styles.tooltipBody}>
				Flux {formatFlux(tooltip.point.flux)}
			</Text>
			<Text css={styles.tooltipMutedBody}>
				Error {formatFlux(tooltip.point.error)}
			</Text>
		</Box>
	);
}
