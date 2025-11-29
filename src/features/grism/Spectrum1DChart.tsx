import { Box } from "@chakra-ui/react";
import { scaleLinear, type ScaleLinear } from "d3-scale";
import { AnimatedAxis } from "@visx/react-spring";
import { Group } from "@visx/group";
import { LinePath, AreaClosed } from "@visx/shape";
import { curveStep } from "@visx/curve";
import type { Spectrum1D } from "@/utils/extraction";
import {  useMemo, useState } from "react";
import { findNearestWavelengthIndex } from "@/utils/wavelength";
import {
  useTooltip,
  useTooltipInPortal,
  defaultStyles,
} from '@visx/tooltip';
import {
    type Bounds,
    type BrushHandleRenderProps,
    Brush,
} from "@visx/brush";
import { useGrismStore } from "@/stores/image";
import { useShallow } from "zustand/react/shallow";
import { getWavelengthSliceIndices } from "@/utils/extraction";
import { useWavelengthDisplay } from "@/hook/transformation-hook";


type Anchor = {
    top: number;
    left: number;
}
type Label = {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
}
interface TooltipData {
    wavelength: number;
    flux: number;
    error: number;
    axisX: number;
    axisY: number;
    pointerX: number;
    pointerY: number;
}

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

export function Spectrum1DSliceChart(props: Spectrum1DSliceChartProps) {
    const { spectrum1D, xScale, yScale, width, height, anchor, label, children } = props;
    const { label: defaultBottomLabel, formatter } = useWavelengthDisplay();
    return (
        <Group left={anchor.left} top={anchor.top}>
            <AnimatedAxis
                orientation="left"
                scale={yScale}
                numTicks={5}
                label={label?.left ?? "flux"}
                labelOffset={35}
                tickLabelProps={{
                    dx: -10,
                    dy: -5
                }}
                animationTrajectory="outside"
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
            />
            {/* Area for error bars */}
            <AreaClosed<Spectrum1D>
                yScale={yScale}
                data={spectrum1D}
                x={(d) => xScale(d.wavelength) ?? 0}
                y={(d) => yScale(d.fluxPlusErr) ?? 0}
                y0={(d) => yScale(d.fluxMinusErr) ?? 0}
                curve={curveStep}
                fill="#999"
                fillOpacity={0.25}
                stroke="none"
            />
            {/* Line for flux */}
            <LinePath<Spectrum1D>
                data={spectrum1D}
                x={(d) => xScale(d.wavelength) ?? 0}
                y={(d) => yScale(d.flux) ?? 0}
                stroke="#000"
                strokeWidth={2}
                curve={curveStep}
            />
            {children}
        </Group>
    )
}

interface Spectrum1DHoverLayerProps {
    spectrum1D: Spectrum1D[];
    width: number;
    height: number;
    xScale: ScaleLinear<number, number>;
    yScale: ScaleLinear<number, number>;
    onHover: (data: TooltipData | null) => void;
}
export function Spectrum1DHoverLayer(props: Spectrum1DHoverLayerProps) {
    const { spectrum1D, width, height, xScale, yScale, onHover } = props;
    const waveArray = useMemo(() => spectrum1D.map(d => d.wavelength), [spectrum1D]);
    const [activeData, setActiveData] = useState<TooltipData | null>(null);

    const handleMouseMove = (event: React.MouseEvent<SVGRectElement, MouseEvent>) => {
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
            <g 
                pointerEvents="none"
            >
            <circle
                cx={activeData.axisX}
                cy={activeData.axisY}
                r={4}
                fill="#ff0000"
                stroke="#ffffff"
                strokeWidth={2}
            />
            {/* cross line */}
            <line
                x1={activeData.pointerX}
                x2={activeData.pointerX}
                y1={0}
                y2={height}
                stroke="#666"
                strokeWidth={1}
                strokeDasharray="4 4"
            />
            <line
                x1={0}
                x2={width}
                y1={activeData.pointerY}
                y2={activeData.pointerY}
                stroke="#666"
                strokeWidth={1}
                strokeDasharray="4 4"
            />
            </g>
        )}
        </>
    );
}


interface Spectrum1DAllChartProps {
    spectrum1D: Spectrum1D[];
    xScale: ScaleLinear<number, number>;
    yScale: ScaleLinear<number, number>;
    anchor: Anchor;
    children?: React.ReactNode;
}
export function Spectrum1DAllChart(props: Spectrum1DAllChartProps) {
    const { spectrum1D, xScale, yScale, anchor, children } = props;
    const yBottom = yScale.range()[0];
    return (
        <Group left={anchor.left} top={anchor.top}>
            {/* Area for all fluxes */}
            <LinePath<Spectrum1D>
                data={spectrum1D}
                x={(d) => xScale(d.wavelength) ?? 0}
                y={(d) => yScale(d.flux) ?? 0}
                stroke="#111"
                strokeWidth={2}
                curve={curveStep}
            />
            {children}
        </Group>
    )
}

export function BrushHandle({
    x, height, isBrushActive=true
}: BrushHandleRenderProps) {
    const handleWidth = 8;
    const handleHeight = 15;
    if (!isBrushActive) {
        return null;
    }
    return (
        <Group left={x + handleWidth/2} top={(height - handleHeight) / 2}>
            <path
                fill="#f2f2f2"
                d = "M -4.5 0.5 L 3.5 0.5 L 3.5 15.5 L -4.5 15.5 L -4.5 0.5 M -1.5 4 L -1.5 12 M 0.5 4 L 0.5 12"
                stroke="#999999"
                strokeWidth={1}
                style={{cursor: "ew-resize"}}
            />
        </Group>
    )
}

interface EmissionLineLayerProps {
    xScale: ScaleLinear<number, number>;
    chartHeight: number;
}
export function EmissionLineLayer(props: EmissionLineLayerProps) {
    const { xScale, chartHeight } = props;
    const {
        selectedEmissionLines,
        zRedshift,
    } = useGrismStore(
        useShallow((state) => ({
            selectedEmissionLines: state.selectedEmissionLines,
            zRedshift: state.zRedshift,
        }))
    );
    const [waveMin, waveMax] = xScale.domain() as [number, number];
    return (
    <g pointerEvents={"none"}>
        {Object.entries(selectedEmissionLines).map(([lineName, lineWave]) => {
            // rest -> obs
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
                        stroke="#e53e3e"
                        strokeWidth={1}
                    />
                    <text
                        x={xPos}
                        y={chartHeight + 20}
                        textAnchor="middle"
                        fontSize={12}
                        fill="#e53e3e"
                    >
                        {lineName}
                    </text>
                </g>
            );
        })}
    </g>
    );
}

interface Spectrum1DBrushChartProps {
    spectrum1D: Spectrum1D[];
    width: number;
    height: number;
    hRatio?: { top: number; bottom: number; gap: number }
    margin?: { top: number; right: number; bottom: number; left: number };
}
const DEFAULT_HRATIO = { top: 0.15, bottom: 0.8, gap: 0.05 };
const DEFAULT_MARGIN = { top: 20, bottom: 50, left: 100, right: 30 };
export default function Spectrum1DChart(props: Spectrum1DBrushChartProps) {
    // Chart parameters setup
    const { spectrum1D, width, height, hRatio, margin } = props;
    const waveArray = useMemo(() => spectrum1D.map(d => d.wavelength), [spectrum1D]);
    const finalHRatio = useMemo(() => {
        const ratio = hRatio ?? DEFAULT_HRATIO;
        const total = ratio.top + ratio.bottom + ratio.gap;
        if (total !== 1) {
            return {
                top: ratio.top / total,
                bottom: ratio.bottom / total,
                gap: ratio.gap / total,
            }
        }
        return ratio;
    }, [hRatio]);
    const finalMargin = margin ?? DEFAULT_MARGIN;

    // Calculate chart dimensions
    const chartHeightTotal = height - finalMargin.top - finalMargin.bottom;
    const chartWidth = width - finalMargin.left - finalMargin.right;
    const chartHeightTop = chartHeightTotal * finalHRatio.top;
    const chartHeightBottom = chartHeightTotal * finalHRatio.bottom;
    const gapHeight = chartHeightTotal * finalHRatio.gap;
    const chartAnchorTop = { left: finalMargin.left, top: finalMargin.top };
    const chartAnchorBottom = {
        left: finalMargin.left,
        top: finalMargin.top + chartHeightTop + gapHeight,
    };

    // Scales
    // Brush xScale use entire wavelength range
    const chartBrushHeight = chartHeightTop
    const xScaleBrush = useMemo(() => {
        const waveMin = Math.min(...waveArray);
        const waveMax = Math.max(...waveArray);
        const scale = scaleLinear()
            .domain([waveMin, waveMax])
            .range([0, chartWidth])
        return scale;
    }, [waveArray, chartWidth]);
    const yScaleBrush = useMemo(() => {
        const fluxMin = Math.min(...spectrum1D.map(d => d.fluxMinusErr));
        const fluxMax = Math.max(...spectrum1D.map(d => d.fluxPlusErr));
        const scale = scaleLinear()
            .domain([fluxMin, fluxMax])
            .range([chartBrushHeight, 0])
        return scale;
    }, [spectrum1D, chartBrushHeight]);

    // Tooltip state
    const {
        tooltipOpen,
        tooltipData,
        tooltipLeft,
        tooltipTop,
        showTooltip,
        hideTooltip,
    } = useTooltip<TooltipData>();

    const { containerRef, TooltipInPortal } = useTooltipInPortal({
        detectBounds: true,
        scroll: true,
    });
    const tooltipOffset = 5;

    const handleHover = (data: TooltipData | null) => {
        if (!data) {
            hideTooltip();
            return;
        }
        showTooltip({
            tooltipData: data,
            tooltipLeft: data.pointerX + chartAnchorBottom.left + tooltipOffset,
            tooltipTop: data.pointerY + chartAnchorBottom.top + tooltipOffset,
        });
    };

    // Brush state
    const {
        slice1DWaveRange,
        setSlice1DWaveRange,
    } = useGrismStore(
        useShallow((state) => ({
            slice1DWaveRange: state.slice1DWaveRange,
            waveUnit: state.waveUnit,
            setSlice1DWaveRange: state.setSlice1DWaveRange,
        }))
    );
    const handleBrushChange = (domain: Bounds | null) => {
        if (!domain) return;
        const { x0, x1 } = domain;
        const [xMin, xMax] = x0 < x1 ? [x0, x1] : [x1, x0];
        if (xMin === xMax) {
            return;
        }
        setSlice1DWaveRange({ min: xMin, max: xMax });
    }

    const {startIdx: waveStartIndex, endIdx: waveEndIndex} = useMemo(() => {
        return getWavelengthSliceIndices(
            waveArray,
            slice1DWaveRange.min,
            slice1DWaveRange.max
        );
    }, [waveArray, slice1DWaveRange]);

    // Slice spectrum 
    const chartHeightSlice = chartHeightBottom;
    const sliceSpectrum = useMemo(() => {
        return spectrum1D.slice(waveStartIndex, waveEndIndex + 1);
    }, [spectrum1D, waveStartIndex, waveEndIndex]);
    const xScaleSlice = useMemo(() => {
        const scale = scaleLinear()
            .domain([slice1DWaveRange.min, slice1DWaveRange.max])
            .range([0, chartWidth])
        return scale;
    }, [slice1DWaveRange, chartWidth]);
    const yScaleSlice = useMemo(() => {
        const fluxMin = Math.min(...sliceSpectrum.map(d => d.fluxMinusErr));
        const fluxMax = Math.max(...sliceSpectrum.map(d => d.fluxPlusErr));
        const fluxPadding = (fluxMax - fluxMin) * 0.05;
        const scale = scaleLinear()
            .domain([fluxMin - fluxPadding, fluxMax + fluxPadding])
            .range([chartHeightSlice, 0])
        return scale;
    }, [spectrum1D, waveArray, slice1DWaveRange, chartHeightSlice]);

    // wavelength converter
    const { formatterWithUnit, formatter} = useWavelengthDisplay();

    return (
        <Box position={"relative"} ref={containerRef} >
            <svg width={width} height={height}>
                <Spectrum1DAllChart
                    spectrum1D={spectrum1D}
                    xScale={xScaleBrush}
                    yScale={yScaleBrush}
                    anchor={chartAnchorTop}
                >
                    <EmissionLineLayer
                        xScale={xScaleBrush}
                        chartHeight={chartBrushHeight}
                    />
                    <Brush
                        xScale={xScaleBrush}
                        yScale={yScaleBrush}
                        width={chartWidth}
                        height={chartHeightTop}
                        margin={{top: 0, bottom: 0, left: 0, right: 0}}
                        handleSize={8}
                        resizeTriggerAreas={["left", "right"]}
                        brushDirection="horizontal"
                        useWindowMoveEvents={true}
                        renderBrushHandle={(props) => <BrushHandle {...props} />}
                        onChange={handleBrushChange}
                        selectedBoxStyle={{
                            fill: `url(#brush-pattern)`,
                            stroke: "#057283",
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
                    <Spectrum1DHoverLayer
                        spectrum1D={sliceSpectrum}
                        width={chartWidth}
                        height={chartHeightBottom}
                        xScale={xScaleSlice}
                        yScale={yScaleSlice}
                        onHover={handleHover}
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
    )
}
