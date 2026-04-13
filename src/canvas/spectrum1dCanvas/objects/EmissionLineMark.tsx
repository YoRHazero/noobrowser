export function EmissionLineMark({
	x,
	height,
	label,
	color,
	showLabel = false,
}: {
	x: number;
	height: number;
	label: string;
	color: string;
	showLabel?: boolean;
}) {
	return (
		<g pointerEvents="none">
			<line
				x1={x}
				x2={x}
				y1={0}
				y2={height}
				stroke={color}
				strokeWidth={1}
				strokeDasharray="3 3"
			/>
			{showLabel ? (
				<text
					x={x + 4}
					y={12}
					fill={color}
					fontSize={11}
					textAnchor="start"
					dominantBaseline="middle"
				>
					{label}
				</text>
			) : null}
		</g>
	);
}
