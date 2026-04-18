import { useEffect, useMemo } from "react";
import type {
	Spectrum2DCanvasColorMap,
	Spectrum2DCanvasInterpolation,
	Spectrum2DCanvasNorm,
	Spectrum2DCanvasRasterModel,
} from "../api";
import { useSpectrum2DColorMapTexture } from "../canvasHooks/useSpectrum2DColorMapTexture";
import { useSpectrum2DTexture } from "../canvasHooks/useSpectrum2DTexture";
import type { Spectrum2DCanvasWorldBounds } from "../shared/types";
import Spectrum2DRasterMaterial from "./Spectrum2DRasterMaterial";

function getNormUniforms(norm: Spectrum2DCanvasNorm): {
	uNormKind: number;
	uNormMin: number;
	uNormMax: number;
	uLogFloor: number;
	uAsinhSoftness: number;
} {
	switch (norm.kind) {
		case "linear":
			return {
				uNormKind: 0,
				uNormMin: norm.min,
				uNormMax: norm.max,
				uLogFloor: 1e-6,
				uAsinhSoftness: 1,
			};
		case "log":
			return {
				uNormKind: 1,
				uNormMin: norm.min,
				uNormMax: norm.max,
				uLogFloor: norm.floor ?? 1e-6,
				uAsinhSoftness: 1,
			};
		case "asinh":
			return {
				uNormKind: 2,
				uNormMin: norm.min,
				uNormMax: norm.max,
				uLogFloor: 1e-6,
				uAsinhSoftness: norm.softness ?? 1,
			};
	}
}

export interface Spectrum2DRasterProps {
	raster: Spectrum2DCanvasRasterModel;
	colorMap: Spectrum2DCanvasColorMap;
	interpolation: Spectrum2DCanvasInterpolation;
	norm: Spectrum2DCanvasNorm;
	worldBounds: Spectrum2DCanvasWorldBounds;
}

export function Spectrum2DRaster({
	raster,
	colorMap,
	interpolation,
	norm,
	worldBounds,
}: Spectrum2DRasterProps) {
	const texture = useSpectrum2DTexture({
		raster,
		interpolation,
	});
	const colorMapTexture = useSpectrum2DColorMapTexture(colorMap);
	const normUniforms = useMemo(() => getNormUniforms(norm), [norm]);
	const material = useMemo(() => {
		const nextMaterial = new Spectrum2DRasterMaterial();
		nextMaterial.transparent = true;
		return nextMaterial;
	}, []);

	useEffect(() => {
		return () => {
			material.dispose();
		};
	}, [material]);

	useEffect(() => {
		material.uniforms.uRaster.value = texture;
		material.uniforms.uColorMap.value = colorMapTexture;
		material.uniforms.uNormKind.value = normUniforms.uNormKind;
		material.uniforms.uNormMin.value = normUniforms.uNormMin;
		material.uniforms.uNormMax.value = normUniforms.uNormMax;
		material.uniforms.uLogFloor.value = normUniforms.uLogFloor;
		material.uniforms.uAsinhSoftness.value = normUniforms.uAsinhSoftness;
	}, [colorMapTexture, material, normUniforms, texture]);

	return (
		<mesh
			position={[worldBounds.centerX, worldBounds.centerY, 0]}
			renderOrder={0}
		>
			<planeGeometry args={[worldBounds.width, worldBounds.height]} />
			<primitive object={material} attach="material" />
		</mesh>
	);
}
