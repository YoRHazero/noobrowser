"use client";

import { Box, useSlotRecipe } from "@chakra-ui/react";
import ImageCanvas from "@/canvas/imageCanvas";
import { imageInspectorRecipe } from "./ImageInspector.recipe";
import Workspace from "./subfeatures/workspace";
import { useImageInspector } from "./useImageInspector";

export default function ImageInspector() {
	const recipe = useSlotRecipe({ recipe: imageInspectorRecipe });
	const styles = recipe();
	const imageInspector = useImageInspector();

	return (
		<Box css={styles.root}>
			<Box css={styles.canvasSurface}>
				<ImageCanvas
					model={imageInspector.canvas.model}
					actions={imageInspector.canvas.actions}
				/>
			</Box>
			<Workspace />
		</Box>
	);
}
