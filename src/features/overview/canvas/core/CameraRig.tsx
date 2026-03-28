import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useEffect } from "react";
import { OVERVIEW_CANVAS_CONSTANTS } from "./constants";
import { useCameraFlight } from "../hooks/useCameraFlight";

export interface CameraRigProps {
	pendingFlyToTargetId: string | null;
}

export function CameraRig({ pendingFlyToTargetId }: CameraRigProps) {
	const { hasPendingFlyToTarget } = useCameraFlight({
		pendingFlyToTargetId,
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
				makeDefault
				enablePan={false}
				enableDamping={true}
				minDistance={OVERVIEW_CANVAS_CONSTANTS.minCameraDistance}
				maxDistance={OVERVIEW_CANVAS_CONSTANTS.maxCameraDistance}
			/>
		</>
	);
}
