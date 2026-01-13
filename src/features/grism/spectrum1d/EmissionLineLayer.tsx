import type { ScaleLinear } from "d3-scale";
import { memo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useGrismStore } from "@/stores/image";

interface EmissionLineLayerProps {
	xScale: ScaleLinear<number, number>;
	chartHeight: number;
}

const EmissionLineLayer = memo(function EmissionLineLayer(
	props: EmissionLineLayerProps,
) {
	const { xScale, chartHeight } = props;
	const { selectedEmissionLines, zRedshift } = useGrismStore(
		useShallow((state) => ({
			selectedEmissionLines: state.selectedEmissionLines,
			zRedshift: state.zRedshift,
		})),
	);
	const lineColor = useColorModeValue(
		"var(--chakra-colors-red-600)",
		"var(--chakra-colors-pink-300)",
	);
	const [waveMin, waveMax] = xScale.domain() as [number, number];
	return (
		<g pointerEvents={"none"}>
			{Object.entries(selectedEmissionLines).map(([lineName, lineWave]) => {
				const lineWaveObs = lineWave * (1 + zRedshift);
				if (lineWaveObs < waveMin || lineWaveObs > waveMax) {
					return null;
				}
				const xPos = xScale(lineWaveObs);
				return (
					<g key={lineName}>
						<line
							x1={xPos}
							x2={xPos}
							y1={0}
							y2={chartHeight}
							stroke={lineColor}
							strokeWidth={1}
						/>
						<text
							x={xPos}
							y={chartHeight + 20}
							textAnchor="middle"
							fontSize={12}
							fill={lineColor}
						>
							{lineName}
						</text>
					</g>
				);
			})}
		</g>
	);
});

export default EmissionLineLayer;
