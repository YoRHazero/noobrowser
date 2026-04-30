import { useEffect, useMemo } from "react";
import {
	ClampToEdgeWrapping,
	DataTexture,
	LinearFilter,
	RGBAFormat,
	UnsignedByteType,
} from "three";
import type { ColorMap } from "../api";
import { createColorMapLut } from "../utils";

export function useColorMapTexture(colorMap: ColorMap): DataTexture {
	const texture = useMemo(() => {
		const lut = createColorMapLut(colorMap);
		const nextTexture = new DataTexture(
			lut,
			lut.length / 4,
			1,
			RGBAFormat,
			UnsignedByteType,
		);

		nextTexture.minFilter = LinearFilter;
		nextTexture.magFilter = LinearFilter;
		nextTexture.wrapS = ClampToEdgeWrapping;
		nextTexture.wrapT = ClampToEdgeWrapping;
		nextTexture.generateMipmaps = false;
		nextTexture.needsUpdate = true;
		return nextTexture;
	}, [colorMap]);

	useEffect(() => {
		return () => {
			texture.dispose();
		};
	}, [texture]);

	return texture;
}
