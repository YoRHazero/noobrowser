import { Box, Button, Text, useSlotRecipe } from "@chakra-ui/react";
import type { OverviewUiTooltipMode } from "../../../../store";
import { tooltipModeControlRecipe } from "./TooltipModeControl.recipe";

export interface TooltipModeControlProps {
	tooltipMode: OverviewUiTooltipMode;
	onTooltipModeChange: (mode: OverviewUiTooltipMode) => void;
}

export function TooltipModeControl({
	tooltipMode,
	onTooltipModeChange,
}: TooltipModeControlProps) {
	const recipe = useSlotRecipe({ recipe: tooltipModeControlRecipe });
	const styles = recipe();

	return (
		<Box css={styles.root}>
			<Text css={styles.label}>Tooltip Mode</Text>
			<Box css={styles.segmentGroup}>
				<Button
					type="button"
					variant="plain"
					css={styles.segmentButton}
					data-active={tooltipMode === "footprint" ? "true" : undefined}
					aria-pressed={tooltipMode === "footprint"}
					onClick={() => onTooltipModeChange("footprint")}
				>
					Footprint
				</Button>
				<Button
					type="button"
					variant="plain"
					css={styles.segmentButton}
					data-active={tooltipMode === "coordinate" ? "true" : undefined}
					aria-pressed={tooltipMode === "coordinate"}
					onClick={() => onTooltipModeChange("coordinate")}
				>
					Coordinate
				</Button>
			</Box>
		</Box>
	);
}
