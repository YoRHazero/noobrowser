import type { ScaleLinear } from "d3-scale";
import { useEffect } from "react";
import type { Spectrum1DCanvasPoint } from "../api";
import { usePointerHover } from "../canvasHooks/usePointerHover";
import type {
	ScreenAnchor,
	Spectrum1DCanvasTooltipData,
} from "../shared/types";

export function HoverLayer({
	points,
	width,
	height,
	xScale,
	yScale,
	anchor,
	onHoverDataChange,
}: {
	points: Spectrum1DCanvasPoint[];
	width: number;
	height: number;
	xScale: ScaleLinear<number, number>;
	yScale: ScaleLinear<number, number>;
	anchor: ScreenAnchor;
	onHoverDataChange: (data: Spectrum1DCanvasTooltipData | null) => void;
}) {
	const { hoverData, handlePointerMove, handlePointerLeave } = usePointerHover({
		points,
		width,
		height,
		xScale,
		yScale,
	});

	useEffect(() => {
		onHoverDataChange(hoverData);
	}, [hoverData, onHoverDataChange]);

	useEffect(
		() => () => {
			onHoverDataChange(null);
		},
		[onHoverDataChange],
	);

	if (width <= 0 || height <= 0) {
		return null;
	}

	return (
		<g transform={`translate(${anchor.left}, ${anchor.top})`}>
			<rect
				x={0}
				y={0}
				width={width}
				height={height}
				fill="transparent"
				pointerEvents="all"
				onPointerMove={handlePointerMove}
				onPointerLeave={handlePointerLeave}
			/>
			{hoverData ? (
				<g pointerEvents="none">
					<line
						x1={hoverData.axis.x}
						x2={hoverData.axis.x}
						y1={0}
						y2={height}
						stroke="var(--spectrum-1d-hover-color)"
						strokeWidth={1}
						strokeDasharray="2 4"
					/>
					<circle
						cx={hoverData.axis.x}
						cy={hoverData.axis.y}
						r={4}
						fill="var(--spectrum-1d-hover-fill-color)"
						stroke="var(--spectrum-1d-hover-color)"
						strokeWidth={2}
					/>
				</g>
			) : null}
		</g>
	);
}
