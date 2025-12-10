import { Box } from "@chakra-ui/react";
import { Application, extend } from "@pixi/react";
import { RenderLayer } from "pixi.js";
import { useRef } from "react";
import Viewport from "@/components/pixi/Viewport";
import type { RenderLayerInstance } from "@/types/pixi-react";

extend({ RenderLayer });

import CollapseWindowLayer from "@/features/grism/CollapseWindowLayer";
import GrismForwardImage from "@/features/grism/GrismForwardImage";
export default function GrismForwardCanvas() {
	const parentRef = useRef<HTMLDivElement | null>(null);
	const imageLayerRef = useRef<RenderLayerInstance | null>(null);
	const helperLayerRef = useRef<RenderLayerInstance | null>(null);
	return (
		<Box ref={parentRef} height={"120px"} w={900}>
			<Application
				resizeTo={parentRef}
				backgroundColor={0xf2f2f2}
				resolution={1}
				antialias={true}
				autoDensity={true}
			>
				<Viewport passiveWheel={false}>
					<pixiRenderLayer ref={imageLayerRef} />
					<pixiRenderLayer ref={helperLayerRef} />

					<GrismForwardImage layerRef={imageLayerRef} />
					<CollapseWindowLayer layerRef={helperLayerRef} />
				</Viewport>
			</Application>
		</Box>
	);
}
