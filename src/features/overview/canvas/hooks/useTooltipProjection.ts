import { useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3 } from "three";
import {
	isProjectedPointVisible,
	isWorldPointFacingCamera,
	ndcToScreenPoint,
} from "@/features/overview/utils/projection";
import type {
	ScreenPoint,
	WorldPointInput,
} from "@/features/overview/utils/types";

type TooltipProjectionInput = WorldPointInput | null;

export interface UseTooltipProjectionResult {
	projectWorldPoint: (point: TooltipProjectionInput) => ScreenPoint | null;
}

export function useTooltipProjection(): UseTooltipProjectionResult {
	const { camera, size } = useThree();
	const cameraPositionRef = useRef(new Vector3());
	const projectedPointRef = useRef(new Vector3());

	return {
		projectWorldPoint: (point: TooltipProjectionInput): ScreenPoint | null => {
			if (!point) return null;

			const cameraDirection = camera
				.getWorldPosition(cameraPositionRef.current)
				.normalize();

			if (!isWorldPointFacingCamera(point, cameraDirection)) {
				return null;
			}

			if (Array.isArray(point)) {
				projectedPointRef.current.set(point[0], point[1], point[2]);
			} else {
				projectedPointRef.current.set(point.x, point.y, point.z);
			}

			projectedPointRef.current.project(camera);

			if (!isProjectedPointVisible(projectedPointRef.current)) {
				return null;
			}

			return ndcToScreenPoint(projectedPointRef.current, size);
		},
	};
}
