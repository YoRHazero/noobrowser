import { Box } from "@chakra-ui/react";
import { Brush } from "@visx/brush";
import { defaultStyles } from "@visx/tooltip";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useWavelengthDisplay } from "./hooks/useWavelengthDisplay";
import { useFitStore } from "@/stores/fit";
import { useGrismStore } from "@/stores/image";
import type { Spectrum1D } from "@/utils/util-types";
import BrushHandle from "./components/BrushHandle";
import Spectrum1DEmissionLineLayer from "./Spectrum1DEmissionLineLayer";
import { useBrushScales } from "./hooks/useBrushScales";
import { useBrushState } from "./hooks/useBrushState";
import { useChartLayout } from "./hooks/useChartLayout";
import { useSliceIndices } from "./hooks/useSliceIndices";
import { useSliceScales } from "./hooks/useSliceScales";
import { useSliceSpectrum } from "./hooks/useSliceSpectrum";
import { useSpectrumStats } from "./hooks/useSpectrumStats";
import { useSpectrumTooltip } from "./hooks/useSpectrumTooltip";
import Spectrum1DAllChart from "./components/Spectrum1DAllChart";
import Spectrum1DFitHandleLayer from "./Spectrum1DFitHandleLayer";
import Spectrum1DFitLayer from "./Spectrum1DFitLayer";
import Spectrum1DHoverLayer from "./Spectrum1DHoverLayer";
import Spectrum1DSliceChart from "./components/Spectrum1DSliceChart";

interface Spectrum1DBrushChartProps {
	spectrum1D: Spectrum1D[];
	width: number;
	height: number;
	hRatio?: { top: number; bottom: number; gap: number };
	margin?: { top: number; right: number; bottom: number; left: number };
}

export default function Spectrum1DChart(props: Spectrum1DBrushChartProps) {
	const { spectrum1D, width, height, hRatio, margin } = props;
	const { waveArray, waveMin, waveMax, fluxMin, fluxMax } =
		useSpectrumStats(spectrum1D);
	const {
		chartWidth,
		chartHeightTop,
		chartHeightBottom,
		chartBrushHeight,
		chartHeightSlice,
		chartAnchorTop,
		chartAnchorBottom,
	} = useChartLayout({ width, height, hRatio, margin });
	const { xScaleBrush, yScaleBrush } = useBrushScales({
		waveMin,
		waveMax,
		fluxMin,
		fluxMax,
		chartWidth,
		chartBrushHeight,
	});

	const { slice1DWaveRange, setSlice1DWaveRange } = useGrismStore(
		useShallow((state) => ({
			slice1DWaveRange: state.slice1DWaveRange,
			setSlice1DWaveRange: state.setSlice1DWaveRange,
		})),
	);

	const { startIdx: waveStartIndex, endIdx: waveEndIndex } = useSliceIndices(
		waveArray,
		slice1DWaveRange,
	);

	const models = useFitStore((state) => state.models);
	const modelsSubtracted = useMemo(() => {
		return models.filter((model) => model.subtracted && model.active);
	}, [models]);
	const sliceSpectrum = useSliceSpectrum({
		spectrum1D,
		waveStartIndex,
		waveEndIndex,
		modelsSubtracted,
	});

	const { xScaleSlice, yScaleSlice } = useSliceScales({
		sliceSpectrum,
		sliceRange: slice1DWaveRange,
		chartWidth,
		chartHeightSlice,
	});

	const { brushRef, handleBrushChange } = useBrushState({
		waveArray,
		waveStartIndex,
		waveEndIndex,
		xScaleBrush,
		onSliceRangeChange: setSlice1DWaveRange,
	});

	const {
		tooltipOpen,
		tooltipData,
		tooltipLeft,
		tooltipTop,
		TooltipInPortal,
		containerRef,
		handleHover,
	} = useSpectrumTooltip({ anchor: chartAnchorBottom });

	const { formatterWithUnit, formatter } = useWavelengthDisplay();
	const brushStroke = useColorModeValue(
		"var(--chakra-colors-cyan-600)",
		"var(--chakra-colors-cyan-300)",
	);

	return (
		<Box position={"relative"} ref={containerRef}>
			<svg width={width} height={height}>
				<Spectrum1DAllChart
					spectrum1D={spectrum1D}
					xScale={xScaleBrush}
					yScale={yScaleBrush}
					anchor={chartAnchorTop}
				>
					<Spectrum1DEmissionLineLayer
						xScale={xScaleBrush}
						chartHeight={chartBrushHeight}
					/>
					<Brush
						xScale={xScaleBrush}
						yScale={yScaleBrush}
						width={chartWidth}
						height={chartHeightTop}
						innerRef={brushRef}
						margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
						handleSize={8}
						resizeTriggerAreas={["left", "right"]}
						brushDirection="horizontal"
						useWindowMoveEvents={true}
						renderBrushHandle={(props) => <BrushHandle {...props} />}
						onChange={handleBrushChange}
						selectedBoxStyle={{
							fill: `url(#brush-pattern)`,
							stroke: brushStroke,
						}}
					/>
				</Spectrum1DAllChart>
				<Spectrum1DSliceChart
					spectrum1D={sliceSpectrum}
					width={chartWidth}
					height={chartHeightBottom}
					xScale={xScaleSlice}
					yScale={yScaleSlice}
					anchor={chartAnchorBottom}
					label={{ left: "Flux", bottom: "Wavelength" }}
				>
					<Spectrum1DFitLayer xScale={xScaleSlice} yScale={yScaleSlice} />
					<Spectrum1DHoverLayer
						spectrum1D={sliceSpectrum}
						width={chartWidth}
						height={chartHeightBottom}
						xScale={xScaleSlice}
						yScale={yScaleSlice}
						onHover={handleHover}
					/>
					<Spectrum1DFitHandleLayer
						xScale={xScaleSlice}
						yScale={yScaleSlice}
						chartHeight={chartHeightBottom}
						sliceRange={slice1DWaveRange}
					/>
				</Spectrum1DSliceChart>
			</svg>
			{tooltipOpen && tooltipData && (
				<TooltipInPortal
					top={tooltipTop}
					left={tooltipLeft}
					style={{
						...defaultStyles,
						zIndex: 100,
					}}
				>
					<div>{`(${formatter(xScaleSlice.invert(tooltipData.axisX))}, ${yScaleSlice.invert(tooltipData.axisY).toFixed(4)})`}</div>
					<div>
						<strong>Wave:</strong> {formatterWithUnit(tooltipData.wavelength)}
					</div>
					<div>
						<strong>Flux:</strong> {tooltipData.flux.toFixed(4)}
					</div>
					<div>
						<strong>Error:</strong> {tooltipData.error.toFixed(4)}
					</div>
				</TooltipInPortal>
			)}
		</Box>
	);
}
