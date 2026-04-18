export function formatFlux(value: number): string {
	return Number.isFinite(value) ? value.toFixed(4) : "n/a";
}
