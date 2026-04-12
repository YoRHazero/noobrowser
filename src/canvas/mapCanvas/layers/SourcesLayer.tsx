import type { MapCanvasSourceModel } from "../api";
import { SourceMarker } from "../objects/SourceMarker";

export interface SourcesLayerProps {
	sources: MapCanvasSourceModel[];
	radius: number;
}

export function SourcesLayer({ sources, radius }: SourcesLayerProps) {
	const visibleSources = sources.filter((source) => source.visible);

	if (visibleSources.length === 0) {
		return null;
	}

	return (
		<>
			{visibleSources.map((source) => (
				<SourceMarker
					key={source.id}
					source={source}
					radius={radius}
					active={source.active}
				/>
			))}
		</>
	);
}
