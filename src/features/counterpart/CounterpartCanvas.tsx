import { Box } from "@chakra-ui/react";
import { Application, extend } from "@pixi/react";
import { Container, Graphics, RenderLayer } from "pixi.js";
import { useRef } from "react";

import Viewport from "@/components/pixi/Viewport";
import CounterpartImageLayer from "@/features/counterpart/CounterpartImageLayer";
import CutoutLayer from "@/features/counterpart/CutoutLayer";
import type { RenderLayerInstance } from "@/types/pixi-react";

extend({
	Container,
	RenderLayer,
	Graphics,
});

export default function CounterpartCanvas() {
	const parentRef = useRef<HTMLDivElement | null>(null);
	const imageLayerRef = useRef<RenderLayerInstance | null>(null);
	const cutoutLayerRef = useRef<RenderLayerInstance | null>(null);
	return (
		<Box
			ref={parentRef}
			width={"600px"}
			height={"600px"}
			border={"1px solid black"}
		>
			<Application
				resizeTo={parentRef}
				backgroundColor={0x111111}
				resolution={1}
				antialias={true}
				autoDensity={true}
			>
				<Viewport passiveWheel={false}>
					<CounterpartImageLayer layerRef={imageLayerRef} />
					<CutoutLayer layerRef={cutoutLayerRef} />
				</Viewport>
			</Application>
		</Box>
	);
}
