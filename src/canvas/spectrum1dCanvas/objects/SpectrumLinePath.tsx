import { curveStep } from "@visx/curve";
import { LinePath } from "@visx/shape";
import type { ScaleLinear } from "d3-scale";
import type { Spectrum1DCanvasPoint } from "../api";

export function SpectrumLinePath({
	points,
	xScale,
	yScale,
	stroke,
	strokeWidth = 2,
}: {
	points: Spectrum1DCanvasPoint[];
	xScale: ScaleLinear<number, number>;
	yScale: ScaleLinear<number, number>;
	stroke: string;
	strokeWidth?: number;
}) {
	if (points.length < 2) {
		return null;
	}

	return (
		<LinePath<Spectrum1DCanvasPoint>
			data={points}
			x={(point) => xScale(point.wavelengthUm)}
			y={(point) => yScale(point.flux)}
			stroke={stroke}
			strokeWidth={strokeWidth}
			fill="none"
			curve={curveStep}
		/>
	);
}
