import type { ScaleLinear } from "d3-scale";
import type { Spectrum1DCanvasEmissionLineModel } from "../api";
import { EmissionLineMark } from "../objects/EmissionLineMark";
import type { ScreenAnchor } from "../shared/types";

export function EmissionLineLayer({
	emissionLines,
	xScale,
	height,
	anchor,
	showLabels = false,
}: {
	emissionLines: readonly (Spectrum1DCanvasEmissionLineModel & {
		observedWavelengthUm: number;
	})[];
	xScale: ScaleLinear<number, number>;
	height: number;
	anchor: ScreenAnchor;
	showLabels?: boolean;
}) {
	const [waveMin, waveMax] = xScale.domain();

	return (
		<g
			transform={`translate(${anchor.left}, ${anchor.top})`}
			pointerEvents="none"
		>
			{emissionLines.map((line) => {
				if (
					line.observedWavelengthUm < waveMin ||
					line.observedWavelengthUm > waveMax
				) {
					return null;
				}

				return (
					<EmissionLineMark
						key={line.id}
						x={xScale(line.observedWavelengthUm)}
						height={height}
						label={line.label}
						color={line.color ?? "var(--spectrum-1d-emission-line-color)"}
						showLabel={showLabels}
					/>
				);
			})}
		</g>
	);
}
