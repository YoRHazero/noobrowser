export function formatLineFitNumber(value: number | null, digits = 4): string {
	if (value === null || !Number.isFinite(value)) {
		return "--";
	}

	return value.toFixed(digits).replace(/\.?0+$/, "");
}
