import { Box, Text, useSlotRecipe } from "@chakra-ui/react";
import { Switch } from "@/components/ui/switch";
import { mapCanvasMountControlRecipe } from "./MapCanvasMountControl.recipe";

export interface MapCanvasMountControlProps {
	mapCanvasMounted: boolean;
	onMapCanvasMountedChange: (mounted: boolean) => void;
}

export function MapCanvasMountControl({
	mapCanvasMounted,
	onMapCanvasMountedChange,
}: MapCanvasMountControlProps) {
	const recipe = useSlotRecipe({ recipe: mapCanvasMountControlRecipe });
	const styles = recipe();

	return (
		<Box css={styles.root}>
			<Text css={styles.label}>Rendering</Text>
			<Box css={styles.fieldRow}>
				<Text css={styles.rowLabel}>Map Canvas</Text>
				<Switch
					colorPalette="cyan"
					size="sm"
					checked={mapCanvasMounted}
					onCheckedChange={(event) => onMapCanvasMountedChange(event.checked)}
				/>
			</Box>
			<Text css={styles.hint}>
				Turn this off to unload the WebGL map while keeping the footprint list
				available.
			</Text>
		</Box>
	);
}
