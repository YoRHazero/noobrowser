import type { Source } from "@/stores/source";

const EMPTY_DOCK_COLOR = "rgba(148, 163, 184, 0.92)";

export interface DockSourceCardViewModel {
	title: string;
	raText: string;
	decText: string;
	refText: string;
	color: string;
	isEmpty: boolean;
}

export function formatDockCoordinate(value: number | null | undefined) {
	return typeof value === "number" ? value.toFixed(6) : "—";
}

export function getDockSourceCardViewModel(
	source: Source | null,
): DockSourceCardViewModel {
	if (!source) {
		return {
			title: "No Active Source",
			raText: "—",
			decText: "—",
			refText: "—",
			color: EMPTY_DOCK_COLOR,
			isEmpty: true,
		};
	}

	return {
		title: source.label?.trim() ? source.label : "Current SRC",
		raText: formatDockCoordinate(source.position.ra),
		decText: formatDockCoordinate(source.position.dec),
		refText: source.imageRef.refBasename ?? "—",
		color: source.color,
		isEmpty: false,
	};
}
