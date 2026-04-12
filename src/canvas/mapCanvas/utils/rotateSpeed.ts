export interface RotateSpeedCurveConfig {
	minRotateSpeed: number;
	maxRotateSpeed: number;
	gamma: number;
}

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
