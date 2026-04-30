import { useThree } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import type { OrthographicCamera } from "three";
import type { Rect } from "../api";
import { IMAGE_CANVAS_CAMERA_Z } from "../shared/constants";

export function useLockedRoiCamera(roi: Rect | null) {
	const { camera } = useThree();

	useLayoutEffect(() => {
		if (!roi || roi.width <= 0 || roi.height <= 0) {
			return;
		}

		const orthographicCamera = camera as OrthographicCamera;
		const centerX = roi.x + roi.width / 2;
		const centerY = roi.y + roi.height / 2;
		orthographicCamera.position.set(centerX, centerY, IMAGE_CANVAS_CAMERA_Z);
		orthographicCamera.lookAt(centerX, centerY, 0);
		orthographicCamera.left = -roi.width / 2;
		orthographicCamera.right = roi.width / 2;
		orthographicCamera.bottom = -roi.height / 2;
		orthographicCamera.top = roi.height / 2;
		orthographicCamera.zoom = 1;
		orthographicCamera.near = 0.1;
		orthographicCamera.far = 1000;
		orthographicCamera.updateProjectionMatrix();
		orthographicCamera.updateMatrixWorld();
	}, [camera, roi]);
}
