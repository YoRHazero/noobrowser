import { AnimatedAxis } from "@visx/react-spring";
import type { ScaleLinear } from "d3-scale";
import type {
	Spectrum1DCanvasLabelsModel,
	Spectrum1DCanvasPoint,
} from "../api";
import { ErrorBandArea } from "../objects/ErrorBandArea";
import { SpectrumLinePath } from "../objects/SpectrumLinePath";
import type { ScreenAnchor } from "../shared/types";

const AXIS_TICK_LABEL_PROPS = {
	fill: "var(--spectrum-1d-axis-color)",
	fontSize: 11,
};

const AXIS_LABEL_PROPS = {
	fill: "var(--spectrum-1d-axis-color)",
	fontSize: 12,
};

export function SliceSpectrumLayer({
	points,
	width,
	height,
	xScale,
	yScale,
	anchor,
	labels,
	wavelengthDisplay,
	showErrorBand,
}: {
	points: Spectrum1DCanvasPoint[];
	width: number;
	height: number;
	xScale: ScaleLinear<number, number>;
	yScale: ScaleLinear<number, number>;
	anchor: ScreenAnchor;
	labels: Required<Spectrum1DCanvasLabelsModel>;
	wavelengthDisplay: {
		format: (observedWavelengthUm: number) => string;
	};
	showErrorBand: boolean;
}) {
	const xTickCount = Math.max(2, Math.floor(width / 90));

	return (
		<g transform={`translate(${anchor.left}, ${anchor.top})`}>
			<AnimatedAxis
				orientation="left"
				scale={yScale}
				numTicks={5}
				label={labels.fluxAxis}
				labelOffset={42}
				animationTrajectory="outside"
				tickLabelProps={AXIS_TICK_LABEL_PROPS}
				labelProps={AXIS_LABEL_PROPS}
				stroke="var(--spectrum-1d-axis-color)"
				tickStroke="var(--spectrum-1d-axis-color)"
			/>
			<AnimatedAxis
				orientation="bottom"
				animationTrajectory="outside"
				left={0}
				top={height}
				scale={xScale}
				numTicks={xTickCount}
				label={labels.wavelengthAxis}
				tickFormat={(value) =>
					wavelengthDisplay.format(
						typeof value === "number" ? value : Number(value.valueOf()),
					)
				}
				tickLabelProps={AXIS_TICK_LABEL_PROPS}
				labelProps={AXIS_LABEL_PROPS}
				stroke="var(--spectrum-1d-axis-color)"
				tickStroke="var(--spectrum-1d-axis-color)"
			/>
			{showErrorBand ? (
				<ErrorBandArea
					points={points}
					xScale={xScale}
					yScale={yScale}
					fill="var(--spectrum-1d-error-band-color)"
				/>
			) : null}
			<SpectrumLinePath
				points={points}
				xScale={xScale}
				yScale={yScale}
				stroke="var(--spectrum-1d-slice-line-color)"
			/>
		</g>
	);
}
