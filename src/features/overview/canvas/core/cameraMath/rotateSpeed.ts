import type { RotateSpeedCurveConfig } from "./types";

export function resolveRotateSpeedFromNormalizedGap(
	normalizedGap: number,
	config: RotateSpeedCurveConfig,
) {
	return (
		config.minRotateSpeed +
		(config.maxRotateSpeed - config.minRotateSpeed) *
			normalizedGap ** config.gamma
	);
}
