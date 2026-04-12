import { Text, useSlotRecipe } from "@chakra-ui/react";
import { mapCanvasRecipe } from "../MapCanvas.recipe";
import type { CoordinateTooltipViewModel } from "../shared/types";
import { TooltipShell } from "./TooltipShell";

export interface CoordinateTooltipProps {
	tooltip: CoordinateTooltipViewModel | null;
}

export function CoordinateTooltip({ tooltip }: CoordinateTooltipProps) {
	const recipe = useSlotRecipe({ recipe: mapCanvasRecipe });
	const styles = recipe();

	if (!tooltip) {
		return null;
	}

	return (
		<TooltipShell anchorPosition={tooltip.position}>
			<Text css={styles.tooltipTitle}>Cursor Coordinate</Text>
			<Text css={styles.tooltipBody}>RA {tooltip.raText}°</Text>
			<Text css={styles.tooltipBody}>Dec {tooltip.decText}°</Text>
		</TooltipShell>
	);
}
