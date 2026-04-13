import { Brush, type BrushHandleRenderProps } from "@visx/brush";
import type { ScaleLinear } from "d3-scale";
import type { Spectrum1DCanvasWaveRange } from "../api";
import { useBrushState } from "../canvasHooks/useBrushState";
import { BrushHandle } from "../objects/BrushHandle";
import type { ScreenAnchor } from "../shared/types";

const BRUSH_MARGIN = {
	top: 0,
	right: 0,
	bottom: 0,
	left: 0,
};

const SELECTED_BOX_STYLE = {
	fill: "var(--spectrum-1d-brush-fill-color)",
	fillOpacity: 0.18,
	stroke: "var(--spectrum-1d-brush-stroke-color)",
	strokeWidth: 1,
};

function renderBrushHandle(props: BrushHandleRenderProps) {
	return <BrushHandle {...props} />;
}

export function BrushLayer({
	wavelengthsUm,
	startIndex,
	endIndex,
	xScale,
	yScale,
	width,
	height,
	anchor,
	onSliceRangeChange,
}: {
	wavelengthsUm: readonly number[];
	startIndex: number;
	endIndex: number;
	xScale: ScaleLinear<number, number>;
	yScale: ScaleLinear<number, number>;
	width: number;
	height: number;
	anchor: ScreenAnchor;
	onSliceRangeChange: (range: Spectrum1DCanvasWaveRange) => void;
}) {
	const { brushRef, handleBrushChange } = useBrushState({
		wavelengthsUm,
		startIndex,
		endIndex,
		xScale,
		onSliceRangeChange,
	});

	if (wavelengthsUm.length === 0 || width <= 0 || height <= 0) {
		return null;
	}

	return (
		<g transform={`translate(${anchor.left}, ${anchor.top})`}>
			<Brush
				xScale={xScale}
				yScale={yScale}
				width={width}
				height={height}
				innerRef={brushRef}
				margin={BRUSH_MARGIN}
				handleSize={8}
				resizeTriggerAreas={["left", "right"]}
				brushDirection="horizontal"
				useWindowMoveEvents
				renderBrushHandle={renderBrushHandle}
				onBrushEnd={handleBrushChange}
				selectedBoxStyle={SELECTED_BOX_STYLE}
			/>
		</g>
	);
}
