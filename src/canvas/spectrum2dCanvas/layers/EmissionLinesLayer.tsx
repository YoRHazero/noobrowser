import { EmissionLineMark } from "../objects/EmissionLineMark";
import type {
	Spectrum2DCanvasEmissionLineViewModel,
	Spectrum2DCanvasWorldBounds,
} from "../shared/types";

export interface EmissionLinesLayerProps {
	emissionLines: Spectrum2DCanvasEmissionLineViewModel[];
	worldBounds: Spectrum2DCanvasWorldBounds;
}

export function EmissionLinesLayer({
	emissionLines,
	worldBounds,
}: EmissionLinesLayerProps) {
	if (emissionLines.length === 0) {
		return null;
	}

	return (
		<group>
			{emissionLines.map((line) => (
				<EmissionLineMark
					key={line.id}
					worldX={line.worldX}
					topY={worldBounds.top}
					bottomY={worldBounds.bottom}
					color={line.color}
					label={line.label}
				/>
			))}
		</group>
	);
}
