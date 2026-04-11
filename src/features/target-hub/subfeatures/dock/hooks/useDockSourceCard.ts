"use client";

import { useShallow } from "zustand/react/shallow";
import { useSourceStore } from "@/stores/source";
import { formatDockCoordinate } from "../utils";

const EMPTY_DOCK_COLOR = "rgba(148, 163, 184, 0.92)";

export interface DockSourceCardViewModel {
	title: string;
	raText: string;
	decText: string;
	refText: string;
	color: string;
	isEmpty: boolean;
}

export function useDockSourceCard(): DockSourceCardViewModel {
	const { sources, activeSourceId } = useSourceStore(
		useShallow((state) => ({
			sources: state.sources,
			activeSourceId: state.activeSourceId,
		})),
	);

	const activeSource =
		sources.find((source) => source.id === activeSourceId) ?? null;

	if (!activeSource) {
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
		title: activeSource.label?.trim() ? activeSource.label : "Current SRC",
		raText: formatDockCoordinate(activeSource.position.ra),
		decText: formatDockCoordinate(activeSource.position.dec),
		refText: activeSource.imageRef.refBasename ?? "—",
		color: activeSource.color,
		isEmpty: false,
	};
}
