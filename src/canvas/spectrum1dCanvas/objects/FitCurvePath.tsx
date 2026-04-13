import { curveLinear } from "@visx/curve";
import { LinePath } from "@visx/shape";
import type { ScaleLinear } from "d3-scale";
import type { Spectrum1DCanvasSampledPoint } from "../shared/types";

export function FitCurvePath({
	points,
	xScale,
	yScale,
	stroke,
}: {
	points: Spectrum1DCanvasSampledPoint[];
	xScale: ScaleLinear<number, number>;
	yScale: ScaleLinear<number, number>;
	stroke: string;
}) {
	if (points.length < 2) {
		return null;
	}

	return (
		<LinePath<Spectrum1DCanvasSampledPoint>
			data={points}
			x={(point) => xScale(point.wavelengthUm)}
			y={(point) => yScale(point.flux)}
			stroke={stroke}
			strokeWidth={1.5}
			fill="none"
			curve={curveLinear}
		/>
	);
}
