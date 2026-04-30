"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import type { SourceAnnotation } from "@/canvas/imageCanvas";
import { useSourceStore } from "@/stores/source";

function hasFiniteImagePosition(position: {
	x: number | null;
	y: number | null;
}) {
	return (
		typeof position.x === "number" &&
		Number.isFinite(position.x) &&
		typeof position.y === "number" &&
		Number.isFinite(position.y)
	);
}

export function useImageInspectorSourceAnnotations(): SourceAnnotation[] {
	const { sources, activeSourceId } = useSourceStore(
		useShallow((state) => ({
			sources: state.sources,
			activeSourceId: state.activeSourceId,
		})),
	);

	return useMemo<SourceAnnotation[]>(
		() =>
			sources
				.filter(
					(source) =>
						source.visibility.inspector &&
						hasFiniteImagePosition(source.position),
				)
				.map((source) => ({
					id: source.id,
					x: source.position.x ?? 0,
					y: source.position.y ?? 0,
					color: source.color,
					active: source.id === activeSourceId,
					visible: true,
				})),
		[sources, activeSourceId],
	);
}
