export function formatDockCoordinate(value: number | null | undefined) {
	return typeof value === "number" ? value.toFixed(6) : "—";
}
