import type { BrushHandleRenderProps } from "@visx/brush";

export function BrushHandle({
	x,
	width,
	height,
	className,
	isBrushActive,
}: BrushHandleRenderProps) {
	if (!isBrushActive) {
		return null;
	}

	const centerX = x + width / 2;

	return (
		<g className={className}>
			<rect
				x={centerX - 5}
				y={0}
				width={10}
				height={height}
				fill="transparent"
			/>
			<line
				x1={centerX}
				x2={centerX}
				y1={0}
				y2={height}
				stroke="var(--spectrum-1d-brush-stroke-color)"
				strokeWidth={2}
			/>
		</g>
	);
}
