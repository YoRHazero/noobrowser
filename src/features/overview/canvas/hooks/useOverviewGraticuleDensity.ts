import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";

export interface UseOverviewGraticuleDensityParams {
	radius: number;
}

export interface UseOverviewGraticuleDensityResult {
	meridianStepDeg: number;
	parallelStepDeg: number;
}

interface GraticuleDensityLevel {
	maxGap: number;
	stepDeg: number;
}

const GRATICULE_DENSITY_LEVELS: GraticuleDensityLevel[] = [
	{ maxGap: 0.08, stepDeg: 2 },
	{ maxGap: 0.35, stepDeg: 5 },
	{ maxGap: 1, stepDeg: 10 },
	{ maxGap: 2.5, stepDeg: 15 },
];

const DEFAULT_GRATICULE_DENSITY: UseOverviewGraticuleDensityResult = {
	meridianStepDeg: 30,
	parallelStepDeg: 30,
};

function resolveStepDeg(gap: number) {
	const matchedLevel = GRATICULE_DENSITY_LEVELS.find(
		(level) => gap <= level.maxGap,
	);

	return matchedLevel?.stepDeg ?? DEFAULT_GRATICULE_DENSITY.meridianStepDeg;
}

export function useOverviewGraticuleDensity({
	radius,
}: UseOverviewGraticuleDensityParams): UseOverviewGraticuleDensityResult {
	const { camera } = useThree();
	const initialStepDeg = resolveStepDeg(
		Math.max(0, camera.position.length() - radius),
	);
	const [density, setDensity] = useState<UseOverviewGraticuleDensityResult>(
		{
			meridianStepDeg: initialStepDeg,
			parallelStepDeg: initialStepDeg,
		},
	);
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
