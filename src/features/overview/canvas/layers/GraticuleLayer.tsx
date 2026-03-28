import { GraticuleLines } from "../objects/GraticuleLines";
import { DEFAULT_GRATICULE_MERIDIAN_STEP_DEG, DEFAULT_GRATICULE_PARALLEL_STEP_DEG } from "@/features/overview/utils/constant";
import { createGraticuleLines } from "@/features/overview/utils/graticule";

export interface GraticuleLayerProps {
	visible: boolean;
	radius: number;
	meridianStepDeg?: number;
	parallelStepDeg?: number;
}

export function GraticuleLayer({
	visible,
	radius,
	meridianStepDeg = DEFAULT_GRATICULE_MERIDIAN_STEP_DEG,
	parallelStepDeg = DEFAULT_GRATICULE_PARALLEL_STEP_DEG,
}: GraticuleLayerProps) {
	if (!visible) return null;

	const lines = createGraticuleLines({
		radius,
		meridianStepDeg,
		parallelStepDeg,
	});

	return <GraticuleLines lines={lines} color="#4f667a" opacity={0.4} />;
}
