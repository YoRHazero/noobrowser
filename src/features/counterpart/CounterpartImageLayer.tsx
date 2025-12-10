import { extend } from "@pixi/react";
import { Assets, Container, Sprite, Texture } from "pixi.js";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import {
	useCounterpartFootprint,
	useCounterpartImage,
} from "@/hook/connection-hook";
import { useGlobeStore } from "@/stores/footprints";
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
	const {
		counterpartPosition,
		setCounterpartPosition,
		counterpartNorm,
	} = useCounterpartStore(
		useShallow((state) => ({
			counterpartPosition: state.counterpartPosition,
			setCounterpartPosition: state.setCounterpartPosition,
			counterpartNorm: state.counterpartNorm,
		})),
	);
	const selectedFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);
	/* Determine counterpart position */
	const { data: footprintData, isSuccess: isFootprintSuccess } =
		useCounterpartFootprint({
			selectedFootprintId,
		});
	useEffect(() => {
		if (!isFootprintSuccess) return;
		const vertex_marker: Array<[number, number]> =
			footprintData.footprint.vertex_marker;
		setCounterpartPosition({
			x0: vertex_marker[0][0],
			y0: vertex_marker[0][1],
			width: vertex_marker[2][0] - vertex_marker[0][0],
			height: vertex_marker[2][1] - vertex_marker[0][1],
		});
	}, [footprintData, isFootprintSuccess, setCounterpartPosition]);

	/* Load counterpart image */
	const counterpartImageQuery = useCounterpartImage({
		selectedFootprintId,
		normParams: counterpartNorm,
	});
	const [counterpartTexture, setCounterpartTexture] = useState<Texture>(
		Texture.EMPTY,
	);
	useEffect(() => {
		if (!counterpartImageQuery.isSuccess) return;
		const blob = counterpartImageQuery.data;
		const imageUrl = URL.createObjectURL(blob);
		let canceled = false;
		(async () => {
			try {
				const texture = await Assets.load({
					src: imageUrl,
					format: "png",
					parser: "texture",
				});
				if (canceled) {
					Assets.unload(imageUrl);
					return;
				}
				setCounterpartTexture(texture);
			} finally {
				URL.revokeObjectURL(imageUrl);
			}
		})();
		return () => {
			canceled = true;
			Assets.unload(imageUrl);
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
