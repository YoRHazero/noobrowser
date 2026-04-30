import { useEffect, useMemo } from "react";
import { DoubleSide, type Texture } from "three";
import type { Frame, RasterStyle, ScalarDataType } from "../api";
import { useColorMapTexture } from "../hooks/useColorMapTexture";
import RasterMaterial from "./RasterMaterial";

function getScalarKind(dataType: ScalarDataType): number {
	switch (dataType) {
		case "float16":
		case "float32":
			return 0;
		case "uint8":
			return 1;
		case "uint16":
			return 2;
		case "uint32":
			return 3;
	}
}

function getStretchKind(stretch: RasterStyle["norm"]["stretch"]): number {
	switch (stretch) {
		case "sqrt":
			return 1;
		case "log":
			return 2;
		case "asinh":
			return 3;
		default:
			return 0;
	}
}

export function RasterFrameMesh({
	frame,
	texture,
	style,
	opacity,
	renderOrder,
}: {
	frame: Frame;
	texture: Texture;
	style: RasterStyle;
	opacity: number;
	renderOrder: number;
}) {
	const colorMapTexture = useColorMapTexture(style.colorMap ?? "gray");
	const material = useMemo(() => {
		const nextMaterial = new RasterMaterial();
		nextMaterial.transparent = opacity < 1;
		nextMaterial.depthWrite = false;
		nextMaterial.side = DoubleSide;
		return nextMaterial;
	}, [opacity]);

	useEffect(() => {
		return () => {
			material.dispose();
		};
	}, [material]);

	useEffect(() => {
		if (frame.data.kind !== "scalar") {
			return;
		}

		material.transparent = opacity < 1;
		material.uniforms.uTexture.value = texture;
		material.uniforms.uColorMap.value = colorMapTexture;
		material.uniforms.uScalarKind.value = getScalarKind(frame.data.dataType);
		material.uniforms.uStretchKind.value = getStretchKind(style.norm.stretch);
		material.uniforms.uVmin.value = style.norm.vmin;
		material.uniforms.uVmax.value = style.norm.vmax;
		material.uniforms.uOpacity.value = opacity;
	}, [colorMapTexture, frame.data, material, opacity, style.norm, texture]);

	if (frame.data.kind !== "scalar") {
		return null;
	}

	return (
		<mesh
			position={[
				frame.x + frame.width / 2,
				frame.y + frame.height / 2,
				renderOrder,
			]}
			renderOrder={renderOrder}
		>
			<planeGeometry args={[frame.width, frame.height]} />
			<primitive object={material} attach="material" />
		</mesh>
	);
}
