import { useEffect, useMemo } from "react";
import {
	ClampToEdgeWrapping,
	DataTexture,
	LinearFilter,
	RGBAFormat,
	UnsignedByteType,
} from "three";
import type { Spectrum2DCanvasColorMap } from "../api";
import { createColorMapLut } from "../utils/createColorMapLut";

export function useSpectrum2DColorMapTexture(
	colorMap: Spectrum2DCanvasColorMap,
): DataTexture {
	const texture = useMemo(() => {
		const lut = createColorMapLut(colorMap);
		const lutTexture = new DataTexture(
			lut,
			lut.length / 4,
			1,
			RGBAFormat,
			UnsignedByteType,
		);

		lutTexture.minFilter = LinearFilter;
		lutTexture.magFilter = LinearFilter;
		lutTexture.wrapS = ClampToEdgeWrapping;
		lutTexture.wrapT = ClampToEdgeWrapping;
		lutTexture.generateMipmaps = false;
		lutTexture.needsUpdate = true;
		return lutTexture;
	}, [colorMap]);

	useEffect(() => {
		return () => {
			texture.dispose();
		};
	}, [texture]);

	return texture;
}
