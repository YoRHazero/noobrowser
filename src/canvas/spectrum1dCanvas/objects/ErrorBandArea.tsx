import { curveStep } from "@visx/curve";
import { AreaClosed } from "@visx/shape";
import type { ScaleLinear } from "d3-scale";
import type { Spectrum1DCanvasPoint } from "../api";
import { getFluxLowerBound } from "../utils/getFluxLowerBound";
import { getFluxUpperBound } from "../utils/getFluxUpperBound";

export function ErrorBandArea({
	points,
	xScale,
	yScale,
	fill,
}: {
	points: Spectrum1DCanvasPoint[];
	xScale: ScaleLinear<number, number>;
	yScale: ScaleLinear<number, number>;
	fill: string;
}) {
	if (points.length < 2) {
		return null;
	}

	return (
		<AreaClosed<Spectrum1DCanvasPoint>
			yScale={yScale}
			data={points}
			x={(point) => xScale(point.wavelengthUm)}
			y={(point) => yScale(getFluxUpperBound(point))}
			y0={(point) => yScale(getFluxLowerBound(point))}
			curve={curveStep}
			fill={fill}
			fillOpacity={0.2}
			stroke="none"
		/>
	);
}
