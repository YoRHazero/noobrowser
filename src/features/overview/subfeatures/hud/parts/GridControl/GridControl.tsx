import { Box, Text, useSlotRecipe } from "@chakra-ui/react";
import { Switch } from "@/components/ui/switch";
import { gridControlRecipe } from "./GridControl.recipe";

export interface GridControlProps {
	showGrid: boolean;
	onShowGridChange: (showGrid: boolean) => void;
}

export function GridControl({ showGrid, onShowGridChange }: GridControlProps) {
	const recipe = useSlotRecipe({ recipe: gridControlRecipe });
	const styles = recipe();

	return (
		<Box css={styles.root}>
			<Text css={styles.label}>Viewer State</Text>
			<Box css={styles.fieldRow}>
				<Text css={styles.rowLabel}>Show Grid</Text>
				<Switch
					colorPalette="cyan"
					size="sm"
					checked={showGrid}
					onCheckedChange={(event) => onShowGridChange(event.checked)}
				/>
			</Box>
		</Box>
	);
}
