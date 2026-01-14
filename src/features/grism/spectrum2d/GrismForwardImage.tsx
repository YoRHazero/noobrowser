import { extend } from "@pixi/react";
import { useQuery } from "@tanstack/react-query";
import { Sprite, Texture } from "pixi.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import type { ExtractedSpectrum } from "@/hooks/query/source/schemas";
import { useGrismStore } from "@/stores/image";
import type { RenderLayerInstance } from "@/types/pixi-react";
import { getWavelengthSliceIndices } from "@/utils/extraction";
import textureFromData, { sort2DArray } from "@/utils/plot";

extend({ Sprite });

export default function GrismForwardImage({
	layerRef,
}: {
	layerRef: React.RefObject<RenderLayerInstance | null>;
}) {
	const spriteRef = useRef<Sprite | null>(null);
	const {
		grismNorm,
		extractedSpecSortedArray,
		normInWindow,
		collapseWindow,
		setExtractedSpecSortedArray,
		spectrumQueryKey,
	} = useGrismStore(
		useShallow((state) => ({
			grismNorm: state.grismNorm,
			normInWindow: state.normInWindow,
			collapseWindow: state.collapseWindow,
			extractedSpecSortedArray: state.extractedSpecSortedArray,
			setExtractedSpecSortedArray: state.setExtractedSpecSortedArray,
			spectrumQueryKey: state.spectrumQueryKey,
		})),
	);
	const { data: extractSpectrumData } = useQuery<ExtractedSpectrum | undefined>(
		{
			queryKey: spectrumQueryKey ?? ["extract_spectrum", "empty"],
			queryFn: async () => undefined,
			enabled: false,
		},
	);

	/* -------------------------------------------------------------------------- */
	/*                           Update the sorted array                          */
	/* -------------------------------------------------------------------------- */

	const fullSorted = useMemo(() => {
		if (!extractSpectrumData || !extractSpectrumData.covered) return null;
		return sort2DArray(extractSpectrumData.spectrum_2d);
	}, [extractSpectrumData]);

	const windowSorted = useMemo(() => {
		if (!extractSpectrumData || !extractSpectrumData.covered) return null;
		if (!normInWindow) return null;
		const spec2D = extractSpectrumData.spectrum_2d;
		const wavelength = extractSpectrumData.wavelength;
		const { startIdx: colStart, endIdx: colEnd } = getWavelengthSliceIndices(
			wavelength,
			collapseWindow.waveMin,
			collapseWindow.waveMax,
		);
		const rowStart = Math.floor(collapseWindow.spatialMin);
		const rowEnd = Math.ceil(collapseWindow.spatialMax);
		const sliced2D = spec2D
			.slice(rowStart, rowEnd + 1)
			.map((row) => row.slice(colStart, colEnd + 1));
		return sort2DArray(sliced2D);
	}, [extractSpectrumData, normInWindow, collapseWindow]);

	useEffect(() => {
		if (normInWindow) {
			setExtractedSpecSortedArray(windowSorted);
		} else {
			setExtractedSpecSortedArray(fullSorted);
		}
	}, [normInWindow, windowSorted, fullSorted, setExtractedSpecSortedArray]);

	const [grismTexture, setGrismTexture] = useState<Texture>(Texture.EMPTY);
	useEffect(() => {
		if (!extractSpectrumData || !extractedSpecSortedArray) return;
		const texture = textureFromData({
			data: extractSpectrumData.spectrum_2d,
			pmin: grismNorm.pmin,
			pmax: grismNorm.pmax,
			sortedArray: extractedSpecSortedArray,
			excludeZero: true,
		});
		setGrismTexture((prev) => {
			if (prev && !prev.destroyed) {
				prev.destroy(true);
			}
			return texture;
		});
	}, [
		extractSpectrumData,
		extractedSpecSortedArray,
		grismNorm.pmin,
		grismNorm.pmax,
	]);
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
