
import { useApplication } from "@pixi/react";
import { useQuery } from "@tanstack/react-query";
import { Graphics, Texture } from "pixi.js";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import type { ExtractedSpectrum } from "@/hooks/query/source/schemas";
import { useGrismStore } from "@/stores/image";
import { getWavelengthSliceIndices } from "@/utils/extraction";

export function useCollapseOverlays() {
	const {
		apertureSize,
		collapseWindow,
		showTraceOnSpectrum2D,
		spectrumQueryKey,
	} = useGrismStore(
		useShallow((state) => ({
			apertureSize: state.apertureSize,
			collapseWindow: state.collapseWindow,
			showTraceOnSpectrum2D: state.showTraceOnSpectrum2D,
			spectrumQueryKey: state.spectrumQueryKey,
		})),
	);

	const { app } = useApplication();

	const { data: extractSpectrumData } = useQuery<ExtractedSpectrum | undefined>({
		queryKey: spectrumQueryKey ?? ["extract_spectrum", "empty"],
		queryFn: async () => undefined,
		enabled: false,
	});

	const waveArray = extractSpectrumData?.wavelength || [];
	const { waveMin, waveMax, spatialMin, spatialMax } = collapseWindow;
	const { startIdx, endIdx } = getWavelengthSliceIndices(
		waveArray,
		waveMin,
		waveMax,
	);

	// Draw collapse window rectangle
	const [textureRect, setTextureRect] = useState<Texture>(Texture.EMPTY);
	useEffect(() => {
		if (waveArray.length === 0) {
			return;
		}
		const graphics = new Graphics();
		const width = endIdx - startIdx;
		const height = spatialMax - spatialMin;
		graphics.rect(0, 0, width, height).stroke({ color: 0xee0000, width: 1 });
		const texture = app.renderer.generateTexture(graphics);
		setTextureRect((prev) => {
			if (prev && !prev.destroyed) {
				prev.destroy(true);
			}
			return texture;
		});
	}, [
		endIdx,
		startIdx,
		spatialMin,
		spatialMax,
		waveArray,
		app.renderer.generateTexture,
	]);

	// Draw trace dashed line
	const [traceTexture, setTraceTexture] = useState<Texture>(Texture.EMPTY);
	useEffect(() => {
		if (waveArray.length === 0) return;
		const graphics = new Graphics();
		const dashLength = 15;
		const gapLength = 15;
		const totalLength = waveArray.length;
		let x = 0;
		let drawDash = true;
		while (x < totalLength) {
			const thisDashLength = Math.min(
				drawDash ? dashLength : gapLength,
				totalLength - x,
			);
			if (drawDash) {
				graphics.moveTo(x, 0);
				graphics
					.lineTo(x + thisDashLength, 0)
					.stroke({ color: 0xee0000, width: 1 });
			}
			x += thisDashLength;
			drawDash = !drawDash;
		}
		const texture = app.renderer.generateTexture(graphics);
		setTraceTexture((prev) => {
			if (prev && !prev.destroyed) {
				prev.destroy(true);
			}
			return texture;
		});
	}, [waveArray, app.renderer.generateTexture]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			setTextureRect((prev) => {
				if (prev && !prev.destroyed) {
					prev.destroy(true);
				}
				return Texture.EMPTY;
			});
			setTraceTexture((prev) => {
				if (prev && !prev.destroyed) {
					prev.destroy(true);
				}
				return Texture.EMPTY;
			});
		};
	}, []);

	return {
		textureRect,
		traceTexture,
		showTraceOnSpectrum2D,
		startIdx,
		spatialMin,
		apertureSize,
		hasData: !!extractSpectrumData,
	};
}
