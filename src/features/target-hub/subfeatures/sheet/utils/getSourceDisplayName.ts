import type { Source } from "@/stores/source";

export function getSourceDisplayName(source: Pick<Source, "id" | "label">) {
	const trimmed = source.label?.trim();
	return trimmed ? trimmed : source.id;
}
