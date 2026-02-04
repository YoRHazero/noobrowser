import { curveStep } from "@visx/curve";
import { Group } from "@visx/group";
import { LinePath } from "@visx/shape";
import type { ScaleLinear } from "d3-scale";
import { memo } from "react";
import { useColorModeValue } from "@/components/ui/color-mode";
import type { Spectrum1D } from "@/utils/util-types";
import type { Anchor } from "../types";

interface Spectrum1DAllChartProps {
	spectrum1D: Spectrum1D[];
	xScale: ScaleLinear<number, number>;
	yScale: ScaleLinear<number, number>;
	anchor: Anchor;
	children?: React.ReactNode;
}

const Spectrum1DAllChart = memo(function Spectrum1DAllChart(
	props: Spectrum1DAllChartProps,
) {
	const { spectrum1D, xScale, yScale, anchor, children } = props;
	const strokeColor = useColorModeValue(
		"var(--chakra-colors-gray-700)",
		"var(--chakra-colors-cyan-400)",
	);
	return (
		<Group left={anchor.left} top={anchor.top}>
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

export default Spectrum1DAllChart;
