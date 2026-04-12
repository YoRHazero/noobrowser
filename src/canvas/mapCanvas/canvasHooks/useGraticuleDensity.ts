import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import {
	MAP_CANVAS_DEFAULT_GRATICULE_MERIDIAN_STEP_DEG,
	MAP_CANVAS_GRATICULE_DENSITY_LEVELS,
} from "../shared/constants";

export interface UseGraticuleDensityParams {
	radius: number;
}

export interface UseGraticuleDensityResult {
	meridianStepDeg: number;
	parallelStepDeg: number;
}

function resolveStepDeg(gap: number) {
	const matchedLevel = MAP_CANVAS_GRATICULE_DENSITY_LEVELS.find(
		(level) => gap <= level.maxGap,
	);

	return (
		matchedLevel?.stepDeg ?? MAP_CANVAS_DEFAULT_GRATICULE_MERIDIAN_STEP_DEG
	);
}

export function useGraticuleDensity({
	radius,
}: UseGraticuleDensityParams): UseGraticuleDensityResult {
	const { camera } = useThree();
	const initialStepDeg = resolveStepDeg(
		Math.max(0, camera.position.length() - radius),
	);
	const [density, setDensity] = useState<UseGraticuleDensityResult>({
		meridianStepDeg: initialStepDeg,
		parallelStepDeg: initialStepDeg,
	});
	const stepRef = useRef<number>(initialStepDeg);

	useFrame(() => {
		const gap = Math.max(0, camera.position.length() - radius);
		const nextStepDeg = resolveStepDeg(gap);

		if (stepRef.current === nextStepDeg) {
			return;
		}

		stepRef.current = nextStepDeg;
		setDensity({
			meridianStepDeg: nextStepDeg,
			parallelStepDeg: nextStepDeg,
		});
	});

	return density;
}
