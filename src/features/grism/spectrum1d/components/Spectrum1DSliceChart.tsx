import { curveStep } from "@visx/curve";
import { Group } from "@visx/group";
import { AnimatedAxis } from "@visx/react-spring";
import { AreaClosed, LinePath } from "@visx/shape";
import type { ScaleLinear } from "d3-scale";
import { memo } from "react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useWavelengthDisplay } from "@/features/grism/spectrum1d/hooks/useWavelengthDisplay";
import type { Spectrum1D } from "@/utils/util-types";
import type { Anchor, Label } from "../types";

interface Spectrum1DSliceChartProps {
	spectrum1D: Spectrum1D[];
	width: number;
	height: number;
	xScale: ScaleLinear<number, number>;
	yScale: ScaleLinear<number, number>;
	anchor: Anchor;
	label?: Label;
	children?: React.ReactNode;
}

const Spectrum1DSliceChart = memo(function Spectrum1DSliceChart(
	props: Spectrum1DSliceChartProps,
) {
	const { spectrum1D, xScale, yScale, height, anchor, label, children } = props;
	const { label: defaultBottomLabel, formatter } = useWavelengthDisplay();
	const fillColor = useColorModeValue(
		"var(--chakra-colors-gray-600)",
		"var(--chakra-colors-cyan-700)",
	);
	const strokeColor = useColorModeValue(
		"var(--chakra-colors-gray-800)",
		"var(--chakra-colors-cyan-200)",
	);
	return (
		<Group left={anchor.left} top={anchor.top}>
			<AnimatedAxis
				orientation="left"
				scale={yScale}
				numTicks={5}
				label={label?.left ?? "flux"}
				labelOffset={35}
				animationTrajectory="outside"
				tickLabelProps={{
					dx: -10,
					dy: -5,
					fill: strokeColor,
				}}
				labelProps={{ fill: strokeColor }}
				stroke={strokeColor}
				tickStroke={strokeColor}
			/>
			<AnimatedAxis
				orientation="bottom"
				animationTrajectory="outside"
				left={0}
				top={height}
				scale={xScale}
				numTicks={8}
				label={defaultBottomLabel}
				tickFormat={(v) => {
					const n = typeof v === "number" ? v : Number(v.valueOf());
					return formatter(n);
				}}
				tickLabelProps={{ fill: strokeColor }}
				labelProps={{ fill: strokeColor }}
				stroke={strokeColor}
				tickStroke={strokeColor}
			/>
			<AreaClosed<Spectrum1D>
				yScale={yScale}
				data={spectrum1D}
				x={(d) => xScale(d.wavelength) ?? 0}
				y={(d) => yScale(d.fluxPlusErr) ?? 0}
				y0={(d) => yScale(d.fluxMinusErr) ?? 0}
				curve={curveStep}
				fill={fillColor}
				fillOpacity={0.25}
				stroke="none"
			/>
			<LinePath<Spectrum1D>
				data={spectrum1D}
				x={(d) => xScale(d.wavelength) ?? 0}
				y={(d) => yScale(d.flux) ?? 0}
				stroke={strokeColor}
				strokeWidth={2}
				curve={curveStep}
			/>
			{children}
		</Group>
	);
});

export default Spectrum1DSliceChart;
