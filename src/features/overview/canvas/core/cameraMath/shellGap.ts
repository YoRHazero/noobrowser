import type { FootprintShellGapMetrics } from "./types";

interface ResolveFootprintShellGapMetricsParams {
	globeRadius: number;
	footprintLineRadiusOffset: number;
	minCameraDistance: number;
	maxCameraDistance: number;
}

function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value));
}

function resolveCameraDistanceFromGap(
	gap: number,
	metrics: FootprintShellGapMetrics,
) {
	return metrics.shellRadius + gap;
}

export function resolveFootprintShellGapMetrics({
	globeRadius,
	footprintLineRadiusOffset,
	minCameraDistance,
	maxCameraDistance,
}: ResolveFootprintShellGapMetricsParams): FootprintShellGapMetrics {
	const shellRadius = globeRadius * footprintLineRadiusOffset;

	return {
		shellRadius,
		minGap: minCameraDistance - shellRadius,
		maxGap: maxCameraDistance - shellRadius,
	};
}

export function resolveFootprintShellGap(
	cameraDistance: number,
	metrics: FootprintShellGapMetrics,
) {
	return cameraDistance - metrics.shellRadius;
}

export function resolveNormalizedFootprintShellGap(
	cameraDistance: number,
	metrics: FootprintShellGapMetrics,
) {
	const gap = resolveFootprintShellGap(cameraDistance, metrics);
	const clampedGap = clamp(gap, metrics.minGap, metrics.maxGap);

	if (metrics.maxGap === metrics.minGap) {
		return 0;
	}

	return (clampedGap - metrics.minGap) / (metrics.maxGap - metrics.minGap);
}

export function resolveNextCameraDistanceFromGapDelta(
	cameraDistance: number,
	gapDelta: number,
	metrics: FootprintShellGapMetrics,
) {
	const currentGap = resolveFootprintShellGap(cameraDistance, metrics);
	const nextGap = clamp(currentGap + gapDelta, metrics.minGap, metrics.maxGap);

	return resolveCameraDistanceFromGap(nextGap, metrics);
}
