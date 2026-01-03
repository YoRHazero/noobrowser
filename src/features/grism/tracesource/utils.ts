import type { TraceSource } from "@/stores/stores-types";
import type { GlobalSettings } from "./types";

export function extractSpectrumQueryKey(
	source: Pick<TraceSource, "groupId" | "x" | "y">,
	settings: Pick<GlobalSettings, "apertureSize">,
) {
	return [
		"extract_spectrum",
		source.groupId,
		Math.round(source.x),
		Math.round(source.y),
		settings.apertureSize,
	] as const;
}
