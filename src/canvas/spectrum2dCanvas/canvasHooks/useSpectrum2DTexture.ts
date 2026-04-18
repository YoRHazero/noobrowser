import { useEffect, useMemo } from "react";
import {
	ClampToEdgeWrapping,
	DataTexture,
	FloatType,
	LinearFilter,
	NearestFilter,
	RedFormat,
} from "three";
import type {
	Spectrum2DCanvasInterpolation,
	Spectrum2DCanvasRasterModel,
} from "../api";

const EMPTY_TEXTURE_DATA = new Float32Array([0]);

export interface UseSpectrum2DTextureParams {
	raster: Spectrum2DCanvasRasterModel;
	interpolation: Spectrum2DCanvasInterpolation;
}

export function useSpectrum2DTexture({
	raster,
	interpolation,
}: UseSpectrum2DTextureParams): DataTexture {
	const texture = useMemo(() => {
		const expectedSampleCount = Math.max(1, raster.width * raster.height);
		const dataSlice =
			raster.data.length >= expectedSampleCount
				? raster.data.subarray(0, expectedSampleCount)
				: EMPTY_TEXTURE_DATA;
		const textureData =
			raster.dataType === "float32" && dataSlice instanceof Float32Array
				? dataSlice
				: Float32Array.from(dataSlice);
		const textureInThree = new DataTexture(
			textureData,
			Math.max(1, raster.width),
			Math.max(1, raster.height),
			RedFormat,
			FloatType,
		);
		const filter = interpolation === "linear" ? LinearFilter : NearestFilter;

		textureInThree.minFilter = filter;
		textureInThree.magFilter = filter;
		textureInThree.wrapS = ClampToEdgeWrapping;
		textureInThree.wrapT = ClampToEdgeWrapping;
		textureInThree.flipY = true;
		textureInThree.generateMipmaps = false;
		textureInThree.needsUpdate = true;
		return textureInThree;
	}, [
		interpolation,
		raster.data,
		raster.dataType,
		raster.height,
		raster.width,
	]);

	useEffect(() => {
		return () => {
			texture.dispose();
		};
	}, [texture]);

	return texture;
}
