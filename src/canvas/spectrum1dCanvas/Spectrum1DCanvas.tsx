import { Box, useSlotRecipe } from "@chakra-ui/react";
import { type CSSProperties, useEffect } from "react";
import type { Spectrum1DCanvasProps } from "./api";
import { useCanvasSize } from "./hooks/useCanvasSize";
import { useChartLayout } from "./hooks/useChartLayout";
import { useOverviewScales } from "./hooks/useOverviewScales";
import { useSliceScales } from "./hooks/useSliceScales";
import { BrushLayer } from "./layers/BrushLayer";
import { EmissionLineLayer } from "./layers/EmissionLineLayer";
import { FitCurveLayer } from "./layers/FitCurveLayer";
import { HoverLayer } from "./layers/HoverLayer";
import { OverviewSpectrumLayer } from "./layers/OverviewSpectrumLayer";
import { SliceSpectrumLayer } from "./layers/SliceSpectrumLayer";
import { SpectrumTooltip } from "./overlays/SpectrumTooltip";
import { spectrum1DCanvasRecipe } from "./Spectrum1DCanvas.recipe";
import { resetSpectrum1DCanvasInteractionStore } from "./store/interactionStore";
import { useSpectrum1DCanvas } from "./useSpectrum1DCanvas";

const SPECTRUM_1D_CANVAS_STYLE = {
	"--spectrum-1d-axis-color": "currentColor",
	"--spectrum-1d-brush-fill-color": "var(--chakra-colors-cyan-400)",
	"--spectrum-1d-brush-stroke-color": "var(--chakra-colors-cyan-500)",
	"--spectrum-1d-error-band-color": "currentColor",
	"--spectrum-1d-emission-line-color": "var(--chakra-colors-red-500)",
	"--spectrum-1d-hover-color": "var(--chakra-colors-blue-500)",
	"--spectrum-1d-hover-fill-color": "var(--chakra-colors-bg)",
	"--spectrum-1d-overview-line-color": "currentColor",
	"--spectrum-1d-slice-line-color": "currentColor",
} as CSSProperties;

const SVG_STYLE = {
	display: "block",
	height: "100%",
	width: "100%",
} as const;

export default function Spectrum1DCanvas({
	model,
	actions,
}: Spectrum1DCanvasProps) {
	const recipe = useSlotRecipe({ recipe: spectrum1DCanvasRecipe });
	const styles = recipe();
	const { containerRef, size } = useCanvasSize();
	const view = useSpectrum1DCanvas({ model, actions });
	const layout = useChartLayout(size, model.layout);
	const overviewScales = useOverviewScales(view.spectrumStats, layout);
	const sliceScales = useSliceScales({
		layout,
		sliceRange: view.sliceRange,
		sliceSpectrum: view.slice.sliceSpectrum,
	});
	const hasDrawableArea =
		size.width > 0 &&
		size.height > 0 &&
		layout.chartWidth > 0 &&
		(layout.overviewHeight > 0 || layout.sliceHeight > 0);

	useEffect(() => {
		resetSpectrum1DCanvasInteractionStore();
		return resetSpectrum1DCanvasInteractionStore;
	}, []);

	return (
		<Box ref={containerRef} css={styles.root} style={SPECTRUM_1D_CANVAS_STYLE}>
			<Box css={styles.surface}>
				{hasDrawableArea ? (
					<svg
						width={size.width}
						height={size.height}
						role="img"
						aria-label={view.labels.accessibilityLabel}
						style={SVG_STYLE}
					>
						<title>{view.labels.accessibilityLabel}</title>
						{view.visibility.overview ? (
							<OverviewSpectrumLayer
								points={view.points}
								xScale={overviewScales.xScale}
								yScale={overviewScales.yScale}
								anchor={layout.overviewAnchor}
							/>
						) : null}
						{view.visibility.overview && view.visibility.emissionLines ? (
							<EmissionLineLayer
								emissionLines={view.observedEmissionLines}
								xScale={overviewScales.xScale}
								height={layout.overviewHeight}
								anchor={layout.overviewAnchor}
							/>
						) : null}
						{view.visibility.overview && view.visibility.brush ? (
							<BrushLayer
								wavelengthsUm={view.spectrumStats.wavelengthsUm}
								startIndex={view.sliceIndices.startIndex}
								endIndex={view.sliceIndices.endIndex}
								xScale={overviewScales.xScale}
								yScale={overviewScales.yScale}
								width={layout.chartWidth}
								height={layout.brushHeight}
								anchor={layout.overviewAnchor}
								onSliceRangeChange={view.actions.setSliceRange}
							/>
						) : null}
						{view.visibility.slice ? (
							<SliceSpectrumLayer
								points={view.slice.sliceSpectrum}
								width={layout.chartWidth}
								height={layout.sliceHeight}
								xScale={sliceScales.xScale}
								yScale={sliceScales.yScale}
								anchor={layout.sliceAnchor}
								labels={view.labels}
								wavelengthDisplay={view.wavelengthDisplay}
								showErrorBand={view.visibility.errorBand}
							/>
						) : null}
						{view.visibility.slice && view.visibility.fitCurves ? (
							<FitCurveLayer
								samples={view.fitCurveSamples}
								xScale={sliceScales.xScale}
								yScale={sliceScales.yScale}
								anchor={layout.sliceAnchor}
							/>
						) : null}
						{view.visibility.slice && view.visibility.emissionLines ? (
							<EmissionLineLayer
								emissionLines={view.observedEmissionLines}
								xScale={sliceScales.xScale}
								height={layout.sliceHeight}
								anchor={layout.sliceAnchor}
								showLabels
							/>
						) : null}
						{view.visibility.slice && view.visibility.hover ? (
							<HoverLayer
								points={view.slice.sliceSpectrum}
								width={layout.chartWidth}
								height={layout.sliceHeight}
								xScale={sliceScales.xScale}
								yScale={sliceScales.yScale}
								anchor={layout.sliceAnchor}
							/>
						) : null}
					</svg>
				) : null}
			</Box>
			<Box css={styles.overlay}>
				<SpectrumTooltip
					anchor={layout.sliceAnchor}
					wavelengthDisplay={view.wavelengthDisplay}
				/>
			</Box>
		</Box>
	);
}
