import { extend } from "@pixi/react";
import { Container, Sprite, Texture } from "pixi.js";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useIdSyncCounterpartPosition } from "@/hook/calculation-hook";
import { useCounterpartImage } from "@/hook/connection-hook";
import { useCounterpartStore } from "@/stores/image";
import type { RenderLayerInstance } from "@/types/pixi-react";

extend({
	Sprite,
	Container,
});

export default function CounterpartImageLayer({
	layerRef,
}: {
	layerRef: React.RefObject<RenderLayerInstance | null>;
}) {
	const { counterpartPosition, counterpartNorm } = useCounterpartStore(
		useShallow((state) => ({
			counterpartPosition: state.counterpartPosition,
			counterpartNorm: state.counterpartNorm,
		})),
	);
	const { selectedFootprintId } = useIdSyncCounterpartPosition();
	/* Load counterpart image */
	const counterpartImageQuery = useCounterpartImage({
		selectedFootprintId,
		normParams: counterpartNorm,
	});
	const [counterpartTexture, setCounterpartTexture] = useState<Texture>(
		Texture.EMPTY,
	);
	useEffect(() => {
		if (!counterpartImageQuery.isSuccess || !counterpartImageQuery.data) return;
		const blob = counterpartImageQuery.data;
		let canceled = false;
		const loadTexture = async () => {
			try {
				const bitmap = await createImageBitmap(blob, {
					premultiplyAlpha: "none",
				});
				if (canceled) {
					bitmap.close();
					return;
				}
				const texture = Texture.from(bitmap, true);
				setCounterpartTexture(texture);
			} catch (error) {
				console.error(
					"Failed to create image bitmap for counterpart image:",
					error,
				);
			}
		};
		loadTexture();
		return () => {
			canceled = true;
			setCounterpartTexture((prevTexture) => {
				if (prevTexture !== Texture.EMPTY) {
					prevTexture.destroy(true);
				}
				return Texture.EMPTY;
			});
		};
	}, [counterpartImageQuery.isSuccess, counterpartImageQuery.data]);

	// Attach to the RenderLayer
	const spriteRef = useRef<Sprite | null>(null);
	useEffect(() => {
		if (counterpartTexture === Texture.EMPTY) return;
		const layer = layerRef.current;
		const node = spriteRef.current;
		if (!layer || !node) return;
		layer.zIndex = 0;
		layer.attach(node);
		return () => {
			layer.detach(node);
		};
	}, [layerRef, counterpartTexture]);

	return (
		<pixiContainer>
			{counterpartTexture !== Texture.EMPTY && (
				<pixiSprite
					ref={spriteRef}
					texture={counterpartTexture}
					anchor={0}
					x={counterpartPosition.x0}
					y={counterpartPosition.y0}
					width={counterpartPosition.width}
					height={counterpartPosition.height}
				/>
			)}
		</pixiContainer>
	);
}
