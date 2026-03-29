import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useEffect, useRef } from "react";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import { OVERVIEW_CANVAS_CONSTANTS } from "./constants";
import { useCameraFlight } from "../hooks/useCameraFlight";
import { useOverviewLinearZoom } from "../hooks/useOverviewLinearZoom";
import { useOverviewRotateSpeed } from "../hooks/useOverviewRotateSpeed";

export interface CameraRigProps {
	pendingFlyToTargetId: string | null;
}

export function CameraRig({ pendingFlyToTargetId }: CameraRigProps) {
	const controlRef = useRef<OrbitControlsType | null>(null);
	const { hasPendingFlyToTarget } = useCameraFlight({
		pendingFlyToTargetId,
	});

	useOverviewLinearZoom({
		controlRef,
	});
	useOverviewRotateSpeed({
		controlRef,
	});

	useEffect(() => {
		if (!hasPendingFlyToTarget) return;
		// Fly-to choreography is intentionally deferred to the next phase.
	}, [hasPendingFlyToTarget]);

	return (
		<>
			<PerspectiveCamera
				makeDefault
				position={OVERVIEW_CANVAS_CONSTANTS.cameraPosition}
				fov={OVERVIEW_CANVAS_CONSTANTS.cameraFov}
				near={OVERVIEW_CANVAS_CONSTANTS.cameraNear}
				far={OVERVIEW_CANVAS_CONSTANTS.cameraFar}
			/>
			<OrbitControls
				ref={controlRef}
				makeDefault
				enablePan={false}
				enableZoom={false}
				enableDamping={true}
				minDistance={OVERVIEW_CANVAS_CONSTANTS.minCameraDistance}
				maxDistance={OVERVIEW_CANVAS_CONSTANTS.maxCameraDistance}
			/>
		</>
	);
}
