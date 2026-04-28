export function getPercentileValue({
	values,
	percentile,
}: {
	values: number[];
	percentile: number;
}): number | null {
	if (values.length === 0) {
		return null;
	}

	const clampedPercentile = Math.min(Math.max(percentile, 0), 100) / 100;
	if (values.length === 1) {
		return values[0] ?? null;
	}

	const index = Math.round((values.length - 1) * clampedPercentile);
	return values[index] ?? null;
}
