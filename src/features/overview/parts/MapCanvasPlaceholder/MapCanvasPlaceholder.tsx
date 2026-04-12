import { Box, Button, Text, useSlotRecipe } from "@chakra-ui/react";
import { mapCanvasPlaceholderRecipe } from "./MapCanvasPlaceholder.recipe";

export interface MapCanvasPlaceholderProps {
	onShowMapCanvas: () => void;
}

export function MapCanvasPlaceholder({
	onShowMapCanvas,
}: MapCanvasPlaceholderProps) {
	const recipe = useSlotRecipe({ recipe: mapCanvasPlaceholderRecipe });
	const styles = recipe();

	return (
		<Box css={styles.root}>
			<Box css={styles.panel}>
				<Text css={styles.eyebrow}>GPU Paused</Text>
				<Text css={styles.title}>Map canvas is unloaded</Text>
				<Text css={styles.description}>
					Use the footprint list on the right for selection, or restore the 3D
					map when spatial context is needed.
				</Text>
				<Button
					type="button"
					css={styles.actionButton}
					onClick={onShowMapCanvas}
				>
					Show map
				</Button>
			</Box>
		</Box>
	);
}
