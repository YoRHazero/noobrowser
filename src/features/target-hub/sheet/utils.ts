import type { Source } from "@/stores/source";

export function getSourceDisplayName(source: Pick<Source, "id" | "label">) {
	const trimmed = source.label?.trim();
	return trimmed ? trimmed : source.id;
}

export function formatPositionValue(
	value: number | null | undefined,
	precision: number,
) {
	return typeof value === "number" ? value.toFixed(precision) : "—";
}
