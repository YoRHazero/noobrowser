import type { ScaleLinear } from "d3-scale";
import type { Spectrum1DCanvasFitModel } from "../api";
import { FitCurvePath } from "../objects/FitCurvePath";
import type {
	ScreenAnchor,
	Spectrum1DCanvasSampledPoint,
} from "../shared/types";

export function FitCurveLayer({
	samples,
	xScale,
	yScale,
	anchor,
}: {
	samples: readonly {
		model: Spectrum1DCanvasFitModel;
		points: Spectrum1DCanvasSampledPoint[];
	}[];
	xScale: ScaleLinear<number, number>;
	yScale: ScaleLinear<number, number>;
	anchor: ScreenAnchor;
}) {
	return (
		<g
			transform={`translate(${anchor.left}, ${anchor.top})`}
			pointerEvents="none"
		>
			{samples.map((sample) => (
				<FitCurvePath
					key={`fit-curve-${sample.model.id}`}
					points={sample.points}
					xScale={xScale}
					yScale={yScale}
					stroke={sample.model.color}
				/>
			))}
		</g>
	);
}
