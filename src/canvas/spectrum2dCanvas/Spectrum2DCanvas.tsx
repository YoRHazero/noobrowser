import { Box } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import type { Spectrum2DCanvasProps } from "./api";
import { SceneContent } from "./core/SceneContent";
import {
	SPECTRUM_2D_CANVAS_BACKGROUND,
	SPECTRUM_2D_CANVAS_CAMERA_Z,
} from "./shared/constants";
import { useSpectrum2DCanvas } from "./useSpectrum2DCanvas";

export default function Spectrum2DCanvas({
	model,
	actions: _actions,
}: Spectrum2DCanvasProps) {
	const view = useSpectrum2DCanvas({ model });

	return (
		<Box
			position="relative"
			width="100%"
			height="100%"
			overflow="hidden"
			borderRadius="inherit"
			bg={SPECTRUM_2D_CANVAS_BACKGROUND}
			style={{ touchAction: "none" }}
		>
			{view.hasDrawableRaster ? (
				<Canvas
					orthographic
					dpr={[1, 2]}
					camera={{
						position: [
							view.worldBounds.centerX,
							view.worldBounds.centerY,
							SPECTRUM_2D_CANVAS_CAMERA_Z,
						],
						zoom: 1,
						near: 0.1,
						far: 1000,
					}}
					gl={{ antialias: false, alpha: false }}
					role="img"
					aria-label={view.labels.accessibilityLabel}
				>
					<SceneContent view={view} />
				</Canvas>
			) : null}
		</Box>
	);
}
