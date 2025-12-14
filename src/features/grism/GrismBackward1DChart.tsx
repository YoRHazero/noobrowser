import { memo } from "react";
import { Box } from "@chakra-ui/react";
import { scaleLinear } from "@visx/scale";
import { ParentSize } from "@visx/responsive";
import { Group } from "@visx/group";
import { AreaClosed, LinePath } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveStep } from "@visx/curve";
import type { Spectrum1D } from "@/utils/util-types";
import { useRoiSpectrum1D } from "@/hook/calculation-hook";
const MARGIN = { top: 20, right: 20, bottom: 50, left: 50 };
export default function GrismBackward1DChart({ currentBasename }: { currentBasename: string | undefined }) {
    /* -------------------------------------------------------------------------- */
    /*                                 Data Access                                */
    /* -------------------------------------------------------------------------- */    
    const spectrum1D = useRoiSpectrum1D(currentBasename);
    if (spectrum1D.length === 0) {
        return (
            <Box w="100%" h="100%" display="flex" alignItems="center" justifyContent="center" bg="gray.900" color="gray.500">
                No data available
            </Box>
        );
    }

    return (
        <Box w="100%" h="100%" minH="200px">
            <ParentSize debounceTime={10}>
                {({ width, height }) => {
                    const innerWidth = width - MARGIN.left - MARGIN.right;
                    const innerHeight = height - MARGIN.top - MARGIN.bottom;
                    
                    /* -------------------------------------------------------------------------- */
                    /*                                 Scales Setup                               */
                    /* -------------------------------------------------------------------------- */
                    const xMin = Math.min(...spectrum1D.map(d => d.wavelength));
                    const xMax = Math.max(...spectrum1D.map(d => d.wavelength));
                    const xScale = scaleLinear({
                        domain: [xMin, xMax],
                        range: [0, innerWidth],
                    });
                        const yMin = Math.min(...spectrum1D.map(d => d.fluxMinusErr));
                    const yMax = Math.max(...spectrum1D.map(d => d.fluxPlusErr));
                    const yPadding = (yMax - yMin) * 0.1;
                    const yScale = scaleLinear({
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
                                anchor={{ top: MARGIN.top, left: MARGIN.left }}
                            />
                        </svg>
                    );
                }}
            </ParentSize>
        </Box>
    )

}



interface Spectrum1DSliceChartProps {
    spectrum1D: Spectrum1D[];
    innerWidth: number; // inner chart width
    innerHeight: number; // inner chart height
    xScale: any;
    yScale: any;
    anchor: { top: number; left: number };
    label?: { left?: string; bottom?: string };
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
                label={label?.bottom ?? "Wavelength (pixels)"}
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