import type { ScaleLinear } from "d3-scale";
import { memo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useGrismStore } from "@/stores/image";

interface EmissionLineLayerProps {
	xScale: ScaleLinear<number, number>;
	chartHeight: number;
}

const Spectrum1DEmissionLineLayer = memo(function Spectrum1DEmissionLineLayer(
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
			{Object.entries(selectedEmissionLines).map(([lineId, line]) => {
				const lineWaveObs = line.wavelength * (1 + zRedshift);
				if (lineWaveObs < waveMin || lineWaveObs > waveMax) {
					return null;
				}
				const xPos = xScale(lineWaveObs);
				return (
					<g key={lineId}>
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
							{line.name}
						</text>
					</g>
				);
			})}
		</g>
	);
});

export default Spectrum1DEmissionLineLayer;
