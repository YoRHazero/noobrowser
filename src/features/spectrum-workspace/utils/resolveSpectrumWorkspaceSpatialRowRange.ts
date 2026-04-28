export function resolveSpectrumWorkspaceSpatialRowRange({
	rowCount,
	spatialMin,
	spatialMax,
}: {
	rowCount: number;
	spatialMin: number;
	spatialMax: number;
}): { startIndex: number; endIndex: number } | null {
	if (rowCount <= 0) {
		return null;
	}

	const upperBound = rowCount - 1;
	const startValue = Math.min(
		Math.max(Math.min(spatialMin, spatialMax), 0),
		upperBound,
	);
	const endValue = Math.min(
		Math.max(Math.max(spatialMin, spatialMax), 0),
		upperBound,
	);

	return {
		startIndex: Math.floor(startValue),
		endIndex: Math.ceil(endValue),
	};
}
