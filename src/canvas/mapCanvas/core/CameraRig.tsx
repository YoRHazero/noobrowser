import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useRef } from "react";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import { useLinearZoom } from "../canvasHooks/useLinearZoom";
import { useRotateSpeed } from "../canvasHooks/useRotateSpeed";
import {
	MAP_CANVAS_CAMERA_FAR,
	MAP_CANVAS_CAMERA_FOV,
	MAP_CANVAS_CAMERA_NEAR,
	MAP_CANVAS_CAMERA_POSITION,
	MAP_CANVAS_MAX_CAMERA_DISTANCE,
	MAP_CANVAS_MIN_CAMERA_DISTANCE,
} from "../shared/constants";

export function CameraRig() {
	const controlRef = useRef<OrbitControlsType | null>(null);

	useLinearZoom({
		controlRef,
	});
	useRotateSpeed({
		controlRef,
	});

	return (
		<>
			<PerspectiveCamera
				makeDefault
				position={MAP_CANVAS_CAMERA_POSITION}
				fov={MAP_CANVAS_CAMERA_FOV}
				near={MAP_CANVAS_CAMERA_NEAR}
				far={MAP_CANVAS_CAMERA_FAR}
			/>
			<OrbitControls
				ref={controlRef}
				makeDefault
				enablePan={false}
				enableZoom={false}
				enableDamping={true}
				minDistance={MAP_CANVAS_MIN_CAMERA_DISTANCE}
				maxDistance={MAP_CANVAS_MAX_CAMERA_DISTANCE}
			/>
		</>
	);
}
