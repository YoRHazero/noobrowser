import { useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import type { CartesianCoordinate, ScreenPoint } from "@/features/overview/utils/types";

type TooltipProjectionInput = CartesianCoordinate | [number, number, number] | null;

export interface UseTooltipProjectionResult {
	projectWorldPoint: (point: TooltipProjectionInput) => ScreenPoint | null;
}

export function useTooltipProjection(): UseTooltipProjectionResult {
	const { camera, size } = useThree();

	return {
		projectWorldPoint: (point: TooltipProjectionInput): ScreenPoint | null => {
			if (!point) return null;

			const vector = Array.isArray(point)
				? new Vector3(point[0], point[1], point[2])
				: new Vector3(point.x, point.y, point.z);

			vector.project(camera);

			return {
				x: ((vector.x + 1) / 2) * size.width,
				y: ((1 - vector.y) / 2) * size.height,
			};
		},
	};
}
