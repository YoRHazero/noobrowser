import { useFrame, useThree } from "@react-three/fiber";
import { type RefObject, useRef } from "react";
import { MathUtils, type PerspectiveCamera, type Sprite, Vector3 } from "three";

export interface UseScreenPixelSpriteScaleParams {
	spriteRef: RefObject<Sprite | null>;
	sizePx: number;
}

export function useScreenPixelSpriteScale({
	spriteRef,
	sizePx,
}: UseScreenPixelSpriteScaleParams) {
	const { camera, size } = useThree();
	const worldPositionRef = useRef(new Vector3());

	useFrame(() => {
		const sprite = spriteRef.current;
		if (!sprite || !("fov" in camera) || size.height <= 0) {
			return;
		}

		const perspectiveCamera = camera as PerspectiveCamera;
		const worldPosition = worldPositionRef.current;
		sprite.getWorldPosition(worldPosition);
		const distance = camera.position.distanceTo(worldPosition);
		const worldHeight =
			2 * Math.tan(MathUtils.degToRad(perspectiveCamera.fov) / 2) * distance;
		const scale = (sizePx / size.height) * worldHeight;

		sprite.scale.set(scale, scale, 1);
	});
}
