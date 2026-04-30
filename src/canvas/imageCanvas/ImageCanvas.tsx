import { Box, useSlotRecipe } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import type { CanvasProps } from "./api";
import { SceneContent } from "./core/SceneContent";
import { imageCanvasRecipe } from "./ImageCanvas.recipe";
import { CollapsedSpectrumPanel } from "./overlays/CollapsedSpectrumPanel";
import { IMAGE_CANVAS_CAMERA_Z } from "./shared/constants";
import { useImageCanvas } from "./useImageCanvas";

export default function ImageCanvas({ model, actions }: CanvasProps) {
	const recipe = useSlotRecipe({ recipe: imageCanvasRecipe });
	const styles = recipe();
	const { view, textureCache } = useImageCanvas({ model, actions });
	const cameraPosition = [0, 0, IMAGE_CANVAS_CAMERA_Z] as [
		number,
		number,
		number,
	];

	return (
		<Box
			css={styles.root}
			onContextMenu={(event) => {
				event.preventDefault();
			}}
		>
			<Box css={styles.body}>
				<Box css={styles.mainView}>
					<Canvas
						orthographic
						dpr={[1, 2]}
						camera={{
							position: cameraPosition,
							zoom: 1,
							near: 0.1,
							far: 1000,
						}}
						gl={{ antialias: false, alpha: false }}
						role="img"
						aria-label="Image canvas main view"
					>
						<SceneContent
							view={view}
							textureCache={textureCache}
							viewKind="main"
						/>
					</Canvas>
				</Box>
				<Box css={styles.sideRail}>
					<Box css={styles.roiView}>
						{view.roi ? (
							<Canvas
								orthographic
								dpr={[1, 2]}
								camera={{
									position: [
										view.roi.x + view.roi.width / 2,
										view.roi.y + view.roi.height / 2,
										IMAGE_CANVAS_CAMERA_Z,
									],
									zoom: 1,
									near: 0.1,
									far: 1000,
								}}
								gl={{ antialias: false, alpha: false }}
								role="img"
								aria-label="Image canvas ROI view"
							>
								<SceneContent
									view={view}
									textureCache={textureCache}
									viewKind="roi"
								/>
							</Canvas>
						) : null}
					</Box>
					<Box css={styles.spectrumPreview}>
						<CollapsedSpectrumPanel spectrum={view.collapsedSpectrum} />
					</Box>
					<Box css={styles.sideRailFiller} />
				</Box>
			</Box>
		</Box>
	);
}
