import { Text, useSlotRecipe } from "@chakra-ui/react";
import { mapCanvasRecipe } from "../MapCanvas.recipe";
import type { FootprintTooltipViewModel } from "../shared/types";
import { TooltipShell } from "./TooltipShell";

export interface FootprintTooltipProps {
	tooltip: FootprintTooltipViewModel | null;
}

export function FootprintTooltip({ tooltip }: FootprintTooltipProps) {
	const recipe = useSlotRecipe({ recipe: mapCanvasRecipe });
	const styles = recipe();

	if (!tooltip) {
		return null;
	}

	return (
		<TooltipShell anchorPosition={tooltip.position}>
			<Text css={styles.tooltipTitle}>Footprint {tooltip.footprintId}</Text>
			<Text css={styles.tooltipBody}>Center: ({tooltip.centerText})</Text>
			<Text css={styles.tooltipBody}>{tooltip.filesCountText}</Text>
			{tooltip.previewFilesText ? (
				<Text css={styles.tooltipMutedBody}>
					{tooltip.previewFilesText}
					{tooltip.overflowFilesText ? ` ${tooltip.overflowFilesText}` : ""}
				</Text>
			) : null}
		</TooltipShell>
	);
}
