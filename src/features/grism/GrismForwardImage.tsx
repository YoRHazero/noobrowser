import { extend } from "@pixi/react";
import { Sprite, Texture } from "pixi.js";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useExtractSpectrum } from "@/hook/connection-hook";
import { useGlobeStore } from "@/stores/footprints";
import { useCounterpartStore, useGrismStore } from "@/stores/image";
import type { RenderLayerInstance } from "@/types/pixi-react";
import textureFromData, { sort2DArray } from "@/utils/plot";

extend({ Sprite });

export default function GrismForwardImage({
	layerRef,
}: {
	layerRef: React.RefObject<RenderLayerInstance | null>;
}) {
	const spriteRef = useRef<Sprite | null>(null);
	useEffect(() => {
		if (!layerRef) return;
		const layer = layerRef.current;
		const node = spriteRef.current;
		if (!layer || !node) return;
		console.log("Attaching node to layer", node, layer);
		layer.attach(node);
		return () => {
			layer.detach(node);
		};
	}, [layerRef]);

	const selectedFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);
	const cutoutParams = useCounterpartStore((state) => state.cutoutParams);
	const { forwardWaveRange, apertureSize, grismNorm } = useGrismStore(
		useShallow((state) => ({
			apertureSize: state.apertureSize,
			forwardWaveRange: state.forwardWaveRange,
			grismNorm: state.grismNorm,
		})),
	);
	const { data: extractSpectrumData } = useExtractSpectrum({
		selectedFootprintId,
		waveMin: forwardWaveRange.min,
		waveMax: forwardWaveRange.max,
		cutoutParams,
		apertureSize,
		enabled: false,
	});

	const [sortedSpec2D, setSortedSpec2D] = useState<number[] | null>(null);
	useEffect(() => {
		if (!extractSpectrumData) {
			setSortedSpec2D(null);
			return;
		}
		if (!extractSpectrumData.covered) {
			setSortedSpec2D(null);
			return;
		}
		const sorted = sort2DArray(extractSpectrumData.spectrum_2d);
		setSortedSpec2D(sorted);
	}, [extractSpectrumData]);

	const [grismTexture, setGrismTexture] = useState<Texture>(Texture.EMPTY);
	useEffect(() => {
		if (!extractSpectrumData || !sortedSpec2D) return;
		const texture = textureFromData({
			data: extractSpectrumData.spectrum_2d,
			pmin: grismNorm.pmin,
			pmax: grismNorm.pmax,
			sortedArray: sortedSpec2D,
			excludeZero: true,
		});
		setGrismTexture((prev) => {
			if (prev && !prev.destroyed) {
				prev.destroy(true);
			}
			return texture;
		});
	}, [extractSpectrumData, sortedSpec2D, grismNorm.pmin, grismNorm.pmax]);
	// Cleanup on unmount
	useEffect(() => {
		return () => {
			setGrismTexture((prev) => {
				if (prev && !prev.destroyed) {
					prev.destroy(true);
				}
				return Texture.EMPTY;
			});
		};
	}, []);

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
