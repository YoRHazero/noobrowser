import { useFrame, useThree } from "@react-three/fiber";
import type { RefObject } from "react";
import type { Group, OrthographicCamera } from "three";

export function useOrthographicPixelScale({
	groupRef,
	sizePx,
}: {
	groupRef: RefObject<Group | null>;
	sizePx: number;
}) {
	const { camera } = useThree();

	useFrame(() => {
		const group = groupRef.current;
		if (!group || !("zoom" in camera)) {
			return;
		}

		const orthographicCamera = camera as OrthographicCamera;
		const scale = sizePx / Math.max(orthographicCamera.zoom, 1e-6);
		group.scale.set(scale, scale, 1);
	});
}
