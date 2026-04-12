import { Text, useSlotRecipe } from "@chakra-ui/react";
import { mapCanvasRecipe } from "../MapCanvas.recipe";
import type { GraticuleTooltipViewModel } from "../shared/types";
import { TooltipShell } from "./TooltipShell";

export interface GraticuleTooltipProps {
	tooltip: GraticuleTooltipViewModel | null;
}

export function GraticuleTooltip({ tooltip }: GraticuleTooltipProps) {
	const recipe = useSlotRecipe({ recipe: mapCanvasRecipe });
	const styles = recipe();

	if (!tooltip) {
		return null;
	}

	return (
		<TooltipShell anchorPosition={tooltip.position}>
			<Text css={styles.tooltipTitle}>{tooltip.labelText}</Text>
		</TooltipShell>
	);
}
