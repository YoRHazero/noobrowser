import { Box, useSlotRecipe } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import type { MapCanvasProps } from "./api";
import { SceneContent } from "./core/SceneContent";
import { useMapCanvasContainerRect } from "./hooks/useMapCanvasContainerRect";
import { mapCanvasRecipe } from "./MapCanvas.recipe";
import { CoordinateTooltip } from "./overlays/CoordinateTooltip";
import { FootprintTooltip } from "./overlays/FootprintTooltip";
import { GraticuleTooltip } from "./overlays/GraticuleTooltip";
import { useMapCanvas } from "./useMapCanvas";

export default function MapCanvas({ model, actions }: MapCanvasProps) {
	const recipe = useSlotRecipe({ recipe: mapCanvasRecipe });
	const styles = recipe();
	const { containerRef, containerRect } = useMapCanvasContainerRect();
	const {
		coordinateTooltip,
		footprintTooltip,
		graticuleTooltip,
		setHoveredFootprint,
		setHoveredGraticule,
		setCursorCoordinate,
	} = useMapCanvas({
		model,
		containerRect,
	});

	return (
		<Box ref={containerRef} css={styles.root}>
			<Box css={styles.canvasSurface}>
				<Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: false }}>
					<SceneContent
						model={model}
						actions={actions}
						onHoveredFootprintChange={setHoveredFootprint}
						onHoveredGraticuleChange={setHoveredGraticule}
						onCursorCoordinateChange={setCursorCoordinate}
					/>
				</Canvas>
			</Box>
			<Box css={styles.overlay}>
				<CoordinateTooltip tooltip={coordinateTooltip} />
				<FootprintTooltip tooltip={footprintTooltip} />
				<GraticuleTooltip tooltip={graticuleTooltip} />
			</Box>
		</Box>
	);
}
