import { memo, useEffect, useMemo, useRef } from "react";
import {
	ClampToEdgeWrapping,
	DataTexture,
	HalfFloatType,
	NearestFilter,
	RedFormat,
} from "three";
import "@/components/three/GrismMaterial";
import type GrismMaterial from "@/components/three/GrismMaterial";

type GrismMaterialType = InstanceType<typeof GrismMaterial>;
const GrismImageLayer = memo(function GrismImageLayer({
	buffer,
	width,
	height,
	dx,
	dy,
	vmin,
	vmax,
	isVisible,
}: {
	buffer: ArrayBuffer;
	width: number;
	height: number;
	dx: number;
	dy: number;
	vmin: number;
	vmax: number;
	isVisible: boolean;
}) {
	const materialRef = useRef<GrismMaterialType>(null);
	const texture = useMemo(() => {
		const dataView = new Uint16Array(buffer);
		const textureInThree = new DataTexture(
			dataView,
			width,
			height,
			RedFormat,
			HalfFloatType,
		);
		textureInThree.minFilter = NearestFilter;
		textureInThree.magFilter = NearestFilter;
		textureInThree.wrapS = ClampToEdgeWrapping;
		textureInThree.wrapT = ClampToEdgeWrapping;
		textureInThree.flipY = true;
		textureInThree.needsUpdate = true;
		return textureInThree;
	}, [buffer, width, height]);

	// Cleanup texture on unmount
	useEffect(() => {
		return () => {
			texture.dispose();
		};
	}, [texture]);

	useEffect(() => {
		if (materialRef.current) {
			materialRef.current.uniforms.uVmin.value = vmin;
			materialRef.current.uniforms.uVmax.value = vmax;
		}
	}, [vmin, vmax]);
	if (!isVisible) {
		return null;
	}
	const meshX = dx + width / 2;
	const meshY = -dy - height / 2;
	return (
		<mesh position={[meshX, meshY, 0]}>
			<planeGeometry args={[width, height]} />
			<grismMaterial ref={materialRef} uTexture={texture} />
		</mesh>
	);
});
export default GrismImageLayer;
