import { Box } from "@chakra-ui/react";

import { scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { LinePath, AreaClosed } from "@visx/shape";
import { curveStep } from "@visx/curve";
import { localPoint } from "@visx/event";
import { useTooltip, useTooltipInPortal } from "@visx/tooltip";

import type { Spectrum1D } from "@/utils/extraction";
import { findNearestWavelengthIndex } from "@/utils/wavelength";
import { useCallback, useMemo } from "react";

export type Margin = {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export default function Spectrum1DChart({
    spectrum1D,
    width,
    height,
    margin,
}: {
    spectrum1D: Spectrum1D[];
    width: number;
    height: number;
    margin: Margin;
}) {
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const { 
        tooltipData, 
        tooltipLeft, 
        tooltipTop, 
        showTooltip, 
        hideTooltip 
    } = useTooltip<Spectrum1D>();

    const { containerRef, TooltipInPortal } = useTooltipInPortal({
        detectBounds: true,
        scroll: true,
    });

    const { xScale, yScale } = useMemo(() => {
        if (spectrum1D.length === 0 || innerWidth <= 0 || innerHeight <= 0) {
            const xScale = scaleLinear<number>({
                domain: [0, 1],
                range: [0, innerWidth],
            });
            const yScale = scaleLinear<number>({
                domain: [0, 1],
                range: [innerHeight, 0],
            });
            return { xScale, yScale };
        }
        const xs = spectrum1D.map((d) => d.wavelength);
        const yMinusErrs = spectrum1D.map((d) => d.fluxMinusErr);
        const yPlusErrs = spectrum1D.map((d) => d.fluxPlusErr);
        let yMin = Math.min(...yMinusErrs);
        let yMax = Math.max(...yPlusErrs);
        // Add some padding
        const yPadding = (yMax - yMin) * 0.1;
        yMin -= yPadding;
        yMax += yPadding;

        const xScale = scaleLinear<number>({
            domain: [Math.min(...xs), Math.max(...xs)],
            range: [0, innerWidth],
        });
        const yScale = scaleLinear<number>({
            domain: [yMin, yMax],
            range: [innerHeight, 0],
        });
        return { xScale, yScale };
    }, [spectrum1D, innerWidth, innerHeight]);

    const handleMouseMove = useCallback((event: React.MouseEvent<SVGRectElement, MouseEvent>) => {
        if (spectrum1D.length === 0) return;
        const point = localPoint(event);
        if (!point) return;
        const xInChart = point.x - margin.left;
        const yInChart = point.y - margin.top;

        if (xInChart < 0 || xInChart > innerWidth || yInChart < 0 || yInChart > innerHeight) {
            hideTooltip();
            return;
        }

        const waveVal = xScale.invert(xInChart);
        const nearest = findNearestWavelengthIndex(
            spectrum1D.map((d) => d.wavelength),
            waveVal,
        );
        if (nearest === null) return;

        const d = spectrum1D[nearest.index];
        const xPos = xScale(d.wavelength) + margin.left;
        const yPos = yScale(d.flux) + margin.top;

        showTooltip({
            tooltipData: d,
            tooltipLeft: xPos,
            tooltipTop: yPos,
        });

    }, [spectrum1D, xScale, yScale, innerWidth, innerHeight, margin.left, margin.top, showTooltip, hideTooltip]);

    const handleMouseLeave = useCallback(() => {
        hideTooltip();
    }, [hideTooltip]);

    if (width <= 0 || height <= 0) {
        return null;
    }
    if (spectrum1D.length === 0) {
        return (
            <Box
                ref={containerRef}
                width={width}
                height={height}
                border="1px solid"
                borderColor="gray.200"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                No data
            </Box>
        );
    }
    
    return (
        <Box
            ref={containerRef}
            width={width}
            height={height}
            border="1px solid"
            position={"relative"}
        >
            <svg width={width} height={height}>
                <Group left={margin.left} top={margin.top}>
                    <AxisLeft
                        scale={yScale}
                        numTicks={5}
                    />
                    <AxisBottom
                        top={innerHeight}
                        scale={xScale}
                        numTicks={6}
                        label="Wavelength"
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
                    {/* Transparent rect for capturing mouse events */}
                    <rect
                        x={0}
                        y={0}
                        width={innerWidth}
                        height={innerHeight}
                        fill="transparent"
                        pointerEvents="all"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    />
                </Group>
                {/* Tooltip */}
                {tooltipData && tooltipLeft != null && tooltipTop != null && (
                    <Group>
                        <line
                            x1={tooltipLeft}
                            x2={tooltipLeft}
                            y1={margin.top}
                            y2={margin.top + innerHeight}
                            stroke="red"
                            strokeDasharray="4 2"
                            strokeWidth={1}
                        />
                        <line
                            x1={margin.left}
                            x2={margin.left + innerWidth}
                            y1={tooltipTop}
                            y2={tooltipTop}
                            stroke="red"
                            strokeDasharray="4 2"
                            strokeWidth={1}
                        />
                    </Group>
                )}
            </svg>
            {tooltipData && tooltipLeft != null && tooltipTop != null && (
                <TooltipInPortal
                    top={tooltipTop}
                    left={tooltipLeft}
                >
                    <Box fontSize={"xs"}>
                        <Box>λ: {tooltipData.wavelength.toFixed(5)}</Box>
                        <Box>Flux: {tooltipData.flux.toFixed(5)}</Box>
                        <Box>Err: {tooltipData.error.toFixed(5)}</Box>
                    </Box>
                </TooltipInPortal>
            )}
        </Box>
    )

}