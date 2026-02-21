import type { ScaleLinear } from "d3-scale";
import { useMemo, useState } from "react";
import { useColorModeValue } from "@/components/ui/color-mode";
import type { Spectrum1D } from "@/utils/util-types";
import { findNearestWavelengthIndex } from "@/utils/wavelength";
import type { TooltipData } from "./types";

interface Spectrum1DHoverLayerProps {
	spectrum1D: Spectrum1D[];
	width: number;
	height: number;
	xScale: ScaleLinear<number, number>;
	yScale: ScaleLinear<number, number>;
	onHover: (data: TooltipData | null) => void;
}

export default function Spectrum1DHoverLayer(props: Spectrum1DHoverLayerProps) {
	const { spectrum1D, width, height, xScale, yScale, onHover } = props;
	const pointFill = useColorModeValue(
		"var(--chakra-colors-blue-600)",
		"var(--chakra-colors-cyan-300)",
	);
	const pointStroke = useColorModeValue(
		"var(--chakra-colors-white)",
		"var(--chakra-colors-gray-900)",
	);
	const crosshairStroke = useColorModeValue(
		"var(--chakra-colors-gray-400)",
		"var(--chakra-colors-cyan-600)",
	);
	const waveArray = useMemo(
		() => spectrum1D.map((d) => d.wavelength),
		[spectrum1D],
	);
	const [activeData, setActiveData] = useState<TooltipData | null>(null);

	const handleMouseMove = (
		event: React.MouseEvent<SVGRectElement, MouseEvent>,
	) => {
		if (spectrum1D.length === 0) {
			setActiveData(null);
			onHover(null);
			return;
		}
		const bounds = event.currentTarget.getBoundingClientRect();
		const pointerX = event.clientX - bounds.left;
		const pointerY = event.clientY - bounds.top;
		if (pointerX < 0 || pointerX > width || pointerY < 0 || pointerY > height) {
			setActiveData(null);
			onHover(null);
			return;
		}
		const waveAtPointer = xScale.invert(pointerX);
		const nearest = findNearestWavelengthIndex(waveArray, waveAtPointer);
		if (nearest === null) {
			setActiveData(null);
			onHover(null);
			return;
		}
		const dataPoint = spectrum1D[nearest.index];
		const axisX = xScale(dataPoint.wavelength) ?? 0;
		const axisY = yScale(dataPoint.flux) ?? 0;
		const tooltipData: TooltipData = {
			wavelength: dataPoint.wavelength,
			flux: dataPoint.flux,
			error: dataPoint.error,
			axisX: axisX,
			axisY: axisY,
			pointerX: pointerX,
			pointerY: pointerY,
		};
		setActiveData(tooltipData);
		onHover(tooltipData);
	};
	const handleMouseLeave = () => {
		setActiveData(null);
		onHover(null);
	};

	return (
		<>
			<rect
				x={0}
				y={0}
				width={width}
				height={height}
				fill="transparent"
				pointerEvents={"all"}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
			/>
			{activeData && (
				<g pointerEvents="none">
					<circle
						cx={activeData.axisX}
						cy={activeData.axisY}
						r={4}
						fill={pointFill}
						stroke={pointStroke}
						strokeWidth={2}
					/>
					<line
						x1={activeData.pointerX}
						x2={activeData.pointerX}
						y1={0}
						y2={height}
						stroke={crosshairStroke}
						strokeWidth={1}
						strokeDasharray="4 4"
					/>
					<line
						x1={0}
						x2={width}
						y1={activeData.pointerY}
						y2={activeData.pointerY}
						stroke={crosshairStroke}
						strokeWidth={1}
						strokeDasharray="4 4"
					/>
				</g>
			)}
		</>
	);
}
