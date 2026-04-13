import type { ScaleLinear } from "d3-scale";
import type { Spectrum1DCanvasPoint } from "../api";
import { SpectrumLinePath } from "../objects/SpectrumLinePath";
import type { ScreenAnchor } from "../shared/types";

export function OverviewSpectrumLayer({
	points,
	xScale,
	yScale,
	anchor,
}: {
	points: Spectrum1DCanvasPoint[];
	xScale: ScaleLinear<number, number>;
	yScale: ScaleLinear<number, number>;
	anchor: ScreenAnchor;
}) {
	return (
		<g transform={`translate(${anchor.left}, ${anchor.top})`}>
			<SpectrumLinePath
				points={points}
				xScale={xScale}
				yScale={yScale}
				stroke="var(--spectrum-1d-overview-line-color)"
				strokeWidth={1.5}
			/>
		</g>
	);
}
