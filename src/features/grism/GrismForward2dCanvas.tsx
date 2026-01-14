import { Box } from "@chakra-ui/react";
import { Application, extend, useApplication } from "@pixi/react";
import { RenderLayer } from "pixi.js";
import { useEffect, useRef } from "react";
import CanvasWithToolbar from "@/components/layout/CanvasWithToolbar";
import Viewport from "@/components/pixi/Viewport";
import { useColorModeValue } from "@/components/ui/color-mode";
import GrismForwardToolbar from "@/features/grism/spectrum2d/GrismForwardToolbar";
import type { RenderLayerInstance } from "@/types/pixi-react";

extend({ RenderLayer });

import CollapseWindowLayer from "@/features/grism/spectrum2d/GrismForwardCollapseWindowLayer";
import GrismForwardImage from "@/features/grism/spectrum2d/GrismForwardImage";

export default function GrismForward2dCanvas() {
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
					<GrismForwardImage layerRef={imageLayerRef} />
					<CollapseWindowLayer layerRef={helperLayerRef} />
				</Viewport>
			</Application>
		</Box>
	);

	return (
		<CanvasWithToolbar
			canvas={canvas}
			toolbar={<GrismForwardToolbar />}
			width="100%"
		/>
	);
}

function PixiBackground({ color }: { color: number }) {
	const { app } = useApplication();
	useEffect(() => {
		const renderer = app?.renderer;
		if (!renderer) return;
		if ("background" in renderer && renderer.background) {
			renderer.background.color = color;
		} else {
			(renderer as { backgroundColor?: number }).backgroundColor = color;
		}
	}, [app, color]);
	return null;
}
