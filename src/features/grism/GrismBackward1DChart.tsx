import { memo, useState, useMemo } from "react";
import { Box, VStack } from "@chakra-ui/react";
import { scaleLinear } from "@visx/scale";
import type { ScaleLinear } from "d3-scale";
import { ParentSize } from "@visx/responsive";
import { Group } from "@visx/group";
import { AreaClosed, LinePath, Line } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveStep } from "@visx/curve";
import type { Spectrum1D } from "@/utils/util-types";
import { useRoiSpectrum1D } from "@/hook/calculation-hook";
import { useDispersionTrace } from "@/hook/connection-hook";
import { SPEED_OF_LIGHT_KM_S } from "@/utils/wavelength";
import { HorizontalSpec1DParamsSlider } from "@/components/ui/internal-slider";
const MARGIN = { top: 20, right: 20, bottom: 50, left: 50 };
export default function GrismBackward1DChart({ currentBasename }: { currentBasename: string | undefined }) {
    /* -------------------------------------------------------------------------- */
    /*                                 Data Access                                */
    /* -------------------------------------------------------------------------- */    
    const {spectrum1D, roiCollapseWindow} = useRoiSpectrum1D(currentBasename);
    const [refIndex, setRefIndex] = useState<number>(roiCollapseWindow.waveMin);
    const [Lambda0, setLambda0] = useState<number>(40000); // in Angstrom
    const [FWHM, setFWHM] = useState<number>(1000); // in km/s

    // Compute angstrom per pixel scale from dispersion trace
    const { data: dispersionTrace, isSuccess } = useDispersionTrace({enabled: true, waveMin: 4, waveMax:4.8});
    const angstromPerPixel = isSuccess && dispersionTrace ? dispersionTrace.mean_pixel_scale * 10000 : 1; // mean_pixel_scale in micron -> angstrom; default to 1 if no data
    if (spectrum1D.length === 0) {
        return (
            <Box w="100%" h="100%" display="flex" alignItems="center" justifyContent="center" bg="gray.900" color="gray.500">
                No data available
            </Box>
        );
    }
    const kmsPerPixel = (angstromPerPixel *  SPEED_OF_LIGHT_KM_S) / Lambda0;

    return (
        <VStack w="100%" h="100%" gap={1} align="stretch">
            <Box w="100%" h="100%" minH="0px">
                <ParentSize debounceTime={10}>
                    {({ width, height }) => {
                        const innerWidth = width - MARGIN.left - MARGIN.right;
                        const innerHeight = height - MARGIN.top - MARGIN.bottom;
                        
                        /* -------------------------------------------------------------------------- */
                        /*                                 Scales Setup                               */
                        /* -------------------------------------------------------------------------- */
                        const xMin = Math.min(...spectrum1D.map(d => d.wavelength));
                        const xMax = Math.max(...spectrum1D.map(d => d.wavelength));
                        const xScale = scaleLinear<number>({
                            domain: [xMin, xMax],
                            range: [0, innerWidth],
                        });
                        const yMin = Math.min(...spectrum1D.map(d => d.fluxMinusErr));
                        const yMax = Math.max(...spectrum1D.map(d => d.fluxPlusErr));
                        const yPadding = (yMax - yMin) * 0.1;
                        const yScale = scaleLinear<number>({
                            domain: [yMin - yPadding, yMax + yPadding],
                            range: [innerHeight, 0],
                        });
                        /* -------------------------------------------------------------------------- */
                        /*                                 Render View                                */
                        /* -------------------------------------------------------------------------- */
                        return (
                            <svg width={width} height={height}>
                                <Spectrum1DSliceChart
                                    spectrum1D={spectrum1D}
                                    innerWidth={innerWidth}
                                    innerHeight={innerHeight}
                                    xScale={xScale}
                                    yScale={yScale}
                                    refIndex={refIndex}
                                    factor={isSuccess ? kmsPerPixel : undefined}
                                    label={{bottom: isSuccess ? "Δλ (km/s)" : "λ (pixels)"}}
                                    anchor={{ top: MARGIN.top, left: MARGIN.left }}
                                >
                                    <VerticalLine
                                        refIndex={refIndex}
                                        fwhmKms={FWHM}
                                        kmsPerPixel={isSuccess ? kmsPerPixel : undefined}
                                        xScale={xScale}
                                        innerWidth={innerWidth}
                                        innerHeight={innerHeight}
                                    />
                                </Spectrum1DSliceChart>
                            </svg>
                        );
                    }}
                </ParentSize>
            </Box>
            <Box w="100%" flexShrink={0}>
                <HorizontalSpec1DParamsSlider
                    refIndex={refIndex}
                    onRefIndexChange={(v) => setRefIndex(v)}
                    refIndexRange={[roiCollapseWindow.waveMin, roiCollapseWindow.waveMax]}
                    lambda0={Lambda0}
                    onLambda0Change={(v) => setLambda0(v)}
                    fwhm={FWHM}
                    onFwhmChange={(v) => setFWHM(v)}
                />
            </Box>
        </VStack>
    )

}

interface Spectrum1DSliceChartProps {
    spectrum1D: Spectrum1D[];
    innerWidth: number; // inner chart width
    innerHeight: number; // inner chart height
    xScale: ScaleLinear<number, number>;
    yScale: ScaleLinear<number, number>;
    anchor: { top: number; left: number };
    label?: { left?: string; bottom?: string };
    refIndex?: number;
    factor?: number;
    children?: React.ReactNode;
}

// 🎨 样式常量配置 (Dark Theme)
const THEME = {
    axisStroke: "#718096",    // gray.500
    gridStroke: "#2D3748",    // gray.700
    tickLabel: "#A0AEC0",     // gray.400
    axisLabel: "#CBD5E0",     // gray.300
    lineFlux: "#4FD1C5",      // teal.300 (高亮主线)
    areaError: "#38B2AC",     // teal.400 (误差填充基色)
    crosshair: "#EDF2F7",     // gray.100
};

const Spectrum1DSliceChart = memo(function Spectrum1DSliceChart(
    props: Spectrum1DSliceChartProps,
) {
    const { spectrum1D, xScale, yScale, innerWidth, innerHeight, anchor, label, children } = props;

    const tickFormat = (value: number) => {
        const deltaA = (value - (props.refIndex ?? 0)) * (props.factor ?? 1);
        return deltaA.toFixed(0);
    }

    if (innerWidth < 10 || innerHeight < 10) return null;

    return (
        <Group left={anchor.left} top={anchor.top}>

            <AxisLeft
                scale={yScale}
                numTicks={5}
                label={label?.left ?? "Flux (e⁻/s)"}
                labelOffset={45}
                stroke={THEME.axisStroke}
                tickStroke={THEME.axisStroke}
                tickLabelProps={() => ({
                    fill: THEME.tickLabel,
                    fontSize: 10,
                    fontFamily: "monospace", 
                    dx: -10,
                    dy: 3,
                    textAnchor: "end",
                })}
                labelProps={{
                    fill: THEME.axisLabel,
                    fontSize: 12,
                    fontWeight: "bold",
                    textAnchor: "middle",
                }}
            />

            <AxisBottom
                top={innerHeight}
                scale={xScale}
                numTicks={6}
                tickFormat={(v) => {
                    return tickFormat(Number(v));
                }}
                label={label?.bottom ?? "λ (pixels)"}
                stroke={THEME.axisStroke}
                tickStroke={THEME.axisStroke}
                tickLabelProps={() => ({
                    fill: THEME.tickLabel,
                    fontSize: 10,
                    fontFamily: "monospace",
                    textAnchor: "middle",
                    dy: 2,
                })}
                labelProps={{
                    fill: THEME.axisLabel,
                    fontSize: 12,
                    fontWeight: "bold",
                    dy: 2, 
                }}
            />

            <AreaClosed<Spectrum1D>
                data={spectrum1D}
                x={(d) => xScale(d.wavelength) ?? 0}
                y={(d) => yScale(d.fluxPlusErr) ?? 0}
                y0={(d) => yScale(d.fluxMinusErr) ?? 0}
                yScale={yScale}
                curve={curveStep} 
                fill={THEME.areaError}
                fillOpacity={0.15} 
                stroke="none"
            />

            <LinePath<Spectrum1D>
                data={spectrum1D}
                x={(d) => xScale(d.wavelength) ?? 0}
                y={(d) => yScale(d.flux) ?? 0}
                stroke={THEME.lineFlux}
                strokeWidth={1.5} 
                curve={curveStep}
            />

            {children}
        </Group>
    );
});

const VERTICAL_COLOR = "#ED8903";
interface VerticalLineProps {
    refIndex?: number;
    fwhmKms?: number;
    kmsPerPixel?: number;
    xScale: ScaleLinear<number, number>;
    innerWidth: number;
    innerHeight: number;
}
const VerticalLine = memo(function VerticalLine(props: VerticalLineProps) {
    const { refIndex, fwhmKms, kmsPerPixel, xScale, innerWidth, innerHeight } = props;
    const fwhmPixels = (fwhmKms && kmsPerPixel) ? (fwhmKms / kmsPerPixel) : 0;
    const fwhmLeft = useMemo(() => {
        if (refIndex === undefined || fwhmPixels === 0) return undefined;
        const xPos = xScale(refIndex - fwhmPixels / 2);
        if (xPos === undefined || xPos < 0 || xPos > innerWidth) return undefined;
        return xPos;
    }, [refIndex, fwhmPixels, xScale, innerWidth]);
    const fwhmRight = useMemo(() => {
        if (refIndex === undefined || fwhmPixels === 0) return undefined;
        const xPos = xScale(refIndex + fwhmPixels / 2);
        if (xPos === undefined || xPos < 0 || xPos > innerWidth) return undefined;
        return xPos;
    }, [refIndex, fwhmPixels, xScale, innerWidth]);
    return (
        <>
            {refIndex !== undefined && (
                <Line
                    from={{ x: xScale(refIndex), y: 0 }}
                    to={{ x: xScale(refIndex), y: innerHeight }}
                    stroke={VERTICAL_COLOR}
                    strokeWidth={2}
                    pointerEvents="none"
                />
            )}
            {refIndex !== undefined && fwhmLeft !== undefined && (
                <Line
                    from={{ x: fwhmLeft, y: 0 }}
                    to={{ x: fwhmLeft, y: innerHeight }}
                    stroke={VERTICAL_COLOR}
                    strokeWidth={1}
                    pointerEvents="none"
                    strokeDasharray="4 4"
                />
            )}
            {refIndex !== undefined && fwhmRight !== undefined && (
                <Line
                    from={{ x: fwhmRight, y: 0 }}
                    to={{ x: fwhmRight, y: innerHeight }}
                    stroke={VERTICAL_COLOR}
                    strokeWidth={1}
                    pointerEvents="none"
                    strokeDasharray="4 4"
                />
            )}
        </>
    )
});