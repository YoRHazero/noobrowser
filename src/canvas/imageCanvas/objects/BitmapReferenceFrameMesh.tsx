import { useEffect, useMemo } from "react";
import { DoubleSide, type Texture } from "three";
import type { Frame, ReferenceMode } from "../api";
import BitmapReferenceMaterial from "./BitmapReferenceMaterial";

function getReferenceMode(mode: ReferenceMode): number {
	switch (mode) {
		case "r":
			return 1;
		case "g":
			return 2;
		case "b":
			return 3;
		case "rgb":
			return 0;
	}
}

export function BitmapReferenceFrameMesh({
	frame,
	texture,
	mode,
	opacity,
	renderOrder,
}: {
	frame: Frame;
	texture: Texture;
	mode: ReferenceMode;
	opacity: number;
	renderOrder: number;
}) {
	const material = useMemo(() => {
		const nextMaterial = new BitmapReferenceMaterial();
		nextMaterial.transparent = true;
		nextMaterial.depthWrite = false;
		nextMaterial.side = DoubleSide;
		return nextMaterial;
	}, []);

	useEffect(() => {
		return () => {
			material.dispose();
		};
	}, [material]);

	useEffect(() => {
		material.uniforms.uTexture.value = texture;
		material.uniforms.uMode.value = getReferenceMode(mode);
		material.uniforms.uOpacity.value = opacity;
	}, [material, mode, opacity, texture]);

	if (frame.data.kind !== "bitmap") {
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
