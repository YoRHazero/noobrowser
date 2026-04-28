export function normalizeEmissionLineIds(lineIds: readonly string[]): string[] {
	return [...new Set(lineIds.filter((lineId) => lineId.length > 0))].sort(
		(left, right) => left.localeCompare(right),
	);
}
