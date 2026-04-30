import { useEffect, useMemo } from "react";
import { DoubleSide, type Texture, Vector4 } from "three";
import type { Frame, MaskMapEntry } from "../api";
import {
	IMAGE_CANVAS_MASK_OPACITY,
	IMAGE_CANVAS_MAX_MASK_MAP_ENTRIES,
} from "../shared/constants";
import { createMaskMapUniformEntries } from "../utils";
import MaskMaterial from "./MaskMaterial";

function createEmptyVectorArray(): Vector4[] {
	return Array.from(
		{ length: IMAGE_CANVAS_MAX_MASK_MAP_ENTRIES },
		() => new Vector4(0, 0, 0, 0),
	);
}

function resolveMaskUniforms(maskMap: MaskMapEntry[]) {
	const valueBytes = createEmptyVectorArray();
	const colors = createEmptyVectorArray();
	const entries = createMaskMapUniformEntries(maskMap);

	entries.forEach((entry, index) => {
		valueBytes[index].set(...entry.valueBytes);
		colors[index].set(...entry.color);
	});

	return {
		count: entries.length,
		valueBytes,
		colors,
	};
}

export function MaskFrameMesh({
	frame,
	texture,
	maskMap,
	renderOrder,
}: {
	frame: Frame;
	texture: Texture;
	maskMap: MaskMapEntry[];
	renderOrder: number;
}) {
	const material = useMemo(() => {
		const nextMaterial = new MaskMaterial();
		nextMaterial.transparent = true;
		nextMaterial.depthWrite = false;
		nextMaterial.side = DoubleSide;
		return nextMaterial;
	}, []);
	const maskUniforms = useMemo(() => resolveMaskUniforms(maskMap), [maskMap]);

	useEffect(() => {
		return () => {
			material.dispose();
		};
	}, [material]);

	useEffect(() => {
		material.uniforms.uTexture.value = texture;
		material.uniforms.uMaskCount.value = maskUniforms.count;
		material.uniforms.uMaskValueBytes.value = maskUniforms.valueBytes;
		material.uniforms.uMaskColors.value = maskUniforms.colors;
		material.uniforms.uOpacity.value = IMAGE_CANVAS_MASK_OPACITY;
	}, [maskUniforms, material, texture]);

	if (frame.data.kind !== "scalar" || maskMap.length === 0) {
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
