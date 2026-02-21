
// @/features/grism/spectrum2d/index.tsx
import { Box } from "@chakra-ui/react";
import { Application, extend } from "@pixi/react";
import { RenderLayer } from "pixi.js";
import { useRef } from "react";
import CanvasWithToolbar from "@/components/layout/CanvasWithToolbar";
import Viewport from "@/components/pixi/Viewport";
import { useColorModeValue } from "@/components/ui/color-mode";
import type { RenderLayerInstance } from "@/types/pixi-react";
import Spectrum2DCollapseWindowLayer from "./Spectrum2DCollapseWindowLayer";
import Spectrum2DImageLayer from "./Spectrum2DImageLayer";
import Spectrum2DToolbar from "./Spectrum2DToolbar";
import { PixiBackground } from "./components/PixiBackground";

extend({ RenderLayer });

export default function Spectrum2DView() {
	const parentRef = useRef<HTMLDivElement | null>(null);
	const imageLayerRef = useRef<RenderLayerInstance | null>(null);
	const helperLayerRef = useRef<RenderLayerInstance | null>(null);
	const backgroundColor = useColorModeValue(0xf2f2f2, 0x050510);
	const canvas = (
		<Box ref={parentRef} height="120px" width="100%">
			<Application
				resizeTo={parentRef}
				backgroundColor={backgroundColor}
				resolution={1}
				antialias={true}
				autoDensity={true}
			>
				<PixiBackground color={backgroundColor} />
				<Viewport passiveWheel={false}>
					<pixiRenderLayer ref={imageLayerRef} />
					<pixiRenderLayer ref={helperLayerRef} />
					<Spectrum2DImageLayer layerRef={imageLayerRef} />
					<Spectrum2DCollapseWindowLayer layerRef={helperLayerRef} />
				</Viewport>
			</Application>
		</Box>
	);

	return (
		<CanvasWithToolbar
			canvas={canvas}
			toolbar={<Spectrum2DToolbar />}
			width="100%"
		/>
	);
}
