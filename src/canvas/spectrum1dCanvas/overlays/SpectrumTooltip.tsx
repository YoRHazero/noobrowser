import { Box, Text, useSlotRecipe } from "@chakra-ui/react";
import { spectrum1DCanvasRecipe } from "../Spectrum1DCanvas.recipe";
import type { Spectrum1DCanvasTooltipViewModel } from "../shared/types";

export function SpectrumTooltip({
	tooltip,
}: {
	tooltip: Spectrum1DCanvasTooltipViewModel | null;
}) {
	const recipe = useSlotRecipe({ recipe: spectrum1DCanvasRecipe });
	const styles = recipe();

	if (!tooltip) {
		return null;
	}

	return (
		<Box
			role="tooltip"
			css={styles.tooltip}
			left={`${tooltip.left}px`}
			top={`${tooltip.top}px`}
		>
			<Text css={styles.tooltipTitle}>{tooltip.wavelengthText}</Text>
			<Text css={styles.tooltipBody}>{tooltip.fluxText}</Text>
			<Text css={styles.tooltipMutedBody}>{tooltip.errorText}</Text>
		</Box>
	);
}
