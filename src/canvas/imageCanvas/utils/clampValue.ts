export function clampValue(value: number, min: number, max: number): number {
	if (min > max) {
		return clampValue(value, max, min);
	}

	return Math.min(max, Math.max(min, value));
}
