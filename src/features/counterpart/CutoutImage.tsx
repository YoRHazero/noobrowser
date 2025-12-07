import { extend, useApplication } from "@pixi/react";
import { Sprite, Texture } from "pixi.js";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useCounterpartCutout } from "@/hook/connection-hook";
import { useGlobeStore } from "@/stores/footprints";
import { useCounterpartStore } from "@/stores/image";
import textureFromData, { sort2DArray } from "@/utils/plot";

extend({
	Sprite,
});

export default function CutoutImage() {
	const spriteRef = useRef<Sprite | null>(null);
	const selectedFootprintId = useGlobeStore((s) => s.selectedFootprintId);
	const {
		cutoutParams,
		cutoutNorm,
		filterRGB,
		cutoutSortedArray,
		setCutoutSortedArray,
	} = useCounterpartStore(
		useShallow((state) => ({
			cutoutParams: state.cutoutParams,
			cutoutNorm: state.cutoutNorm,
			filterRGB: state.filterRGB,
			cutoutSortedArray: state.cutoutSortedArray,
			setCutoutSortedArray: state.setCutoutSortedArray,
		})),
	);
	const { data: cutoutData } = useCounterpartCutout({
		selectedFootprintId,
		filter: filterRGB.r,
		cutoutParams,
		enabled: false,
	});
	// Sort cutout data when it changes
	useEffect(() => {
		if (!cutoutData) {
			setCutoutSortedArray(null);
			return;
		}
		const sortedData = sort2DArray(cutoutData.cutout_data);
		setCutoutSortedArray(sortedData);
	}, [cutoutData, setCutoutSortedArray]);

	const [cutoutTexture, setCutoutTexture] = useState<Texture>(Texture.EMPTY);
	useEffect(() => {
		if (!cutoutData || !cutoutSortedArray) return;
		const texture = textureFromData({
			data: cutoutData.cutout_data,
			width: cutoutParams.width,
			height: cutoutParams.height,
			pmin: cutoutNorm.pmin,
			pmax: cutoutNorm.pmax,
			vmin: cutoutNorm.vmin,
			vmax: cutoutNorm.vmax,
			sortedArray: cutoutSortedArray,
			excludeZero: true,
		});
		setCutoutTexture((prev) => {
			if (prev && !prev.destroyed) {
				prev.destroy(true);
			}
			return texture;
		});
	}, [
		cutoutData,
		cutoutSortedArray,
		cutoutParams.width,
		cutoutParams.height,
		cutoutNorm,
	]);
	// Cleanup on unmount
	useEffect(() => {
		return () => {
			setCutoutTexture((prev) => {
				if (prev && !prev.destroyed) {
					prev.destroy(true);
				}
				return Texture.EMPTY;
			});
		};
	}, []);

	const { app } = useApplication();
	if (!app.renderer) {
		return null;
	}
	const screenWidth = app.renderer.width;
	const screenHeight = app.renderer.height;
	const imageWidth = cutoutParams.width;
	const imageHeight = cutoutParams.height;

	const scale = Math.min(screenWidth / imageWidth, screenHeight / imageHeight);
	const centerX = screenWidth / 2;
	const centerY = screenHeight / 2;
	return (
		cutoutTexture !== Texture.EMPTY && (
			<pixiSprite
				ref={spriteRef}
				texture={cutoutTexture}
				anchor={0.5}
				x={centerX}
				y={centerY}
				scale={scale}
			/>
		)
	);
}
