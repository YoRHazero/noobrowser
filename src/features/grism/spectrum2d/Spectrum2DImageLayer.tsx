
import { extend } from "@pixi/react";
import { Sprite, Texture } from "pixi.js";
import { useEffect, useRef } from "react";
import type { RenderLayerInstance } from "@/types/pixi-react";
import { useSpectrum2DImage } from "./hooks/useSpectrum2DImage";

extend({ Sprite });

export default function Spectrum2DImageLayer({
	layerRef,
}: {
	layerRef: React.RefObject<RenderLayerInstance | null>;
}) {
	const spriteRef = useRef<Sprite | null>(null);
	const { grismTexture } = useSpectrum2DImage();

	// Attach to the RenderLayer
	useEffect(() => {
		if (!layerRef || grismTexture === Texture.EMPTY) return;
		const layer = layerRef.current;
		const node = spriteRef.current;
		if (!layer || !node) return;
		layer.attach(node);
		return () => {
			layer.detach(node);
		};
	}, [layerRef, grismTexture]);

	return (
		grismTexture !== Texture.EMPTY && (
			<pixiSprite
				ref={spriteRef}
				texture={grismTexture}
				anchor={0}
				x={0}
				y={0}
			/>
		)
	);
}
