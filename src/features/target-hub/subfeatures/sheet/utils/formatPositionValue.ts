export function formatPositionValue(
	value: number | null | undefined,
	precision: number,
) {
	return typeof value === "number" ? value.toFixed(precision) : "—";
}
