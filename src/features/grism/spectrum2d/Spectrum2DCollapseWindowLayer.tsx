
import { extend } from "@pixi/react";
import { Container, Graphics, Sprite } from "pixi.js";
import { useEffect, useRef } from "react";
import type { RenderLayerInstance } from "@/types/pixi-react";
import { useCollapseOverlays } from "./hooks/useCollapseOverlays";

extend({
	Graphics,
	Container,
	Sprite,
});

export default function Spectrum2DCollapseWindowLayer({
	layerRef,
}: {
	layerRef: React.RefObject<RenderLayerInstance | null>;
}) {
	const {
		textureRect,
		traceTexture,
		showTraceOnSpectrum2D,
		startIdx,
		spatialMin,
		apertureSize,
		hasData,
	} = useCollapseOverlays();

	// Attach to the RenderLayer
	const spriteRef = useRef<Container | null>(null);

	useEffect(() => {
		const layer = layerRef.current;
		const node = spriteRef.current;
		if (!layer || !node) return;
		layer.attach(node);
		return () => {
			layer.detach(node);
		};
	}, [layerRef]);

	if (!hasData) return null;

	return (
		<pixiContainer ref={spriteRef}>
			<pixiSprite
				texture={textureRect}
				x={startIdx}
				y={spatialMin}
				anchor={0}
			/>
			{showTraceOnSpectrum2D && (
				<pixiSprite
					texture={traceTexture}
					x={0}
					y={(apertureSize - 1) / 2}
					anchor={{ x: 0, y: 0.5 }}
				/>
			)}
		</pixiContainer>
	);
}
