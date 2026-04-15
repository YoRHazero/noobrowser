import type { PointerEventHandler } from "react";

export function FitHandleMark({
	x,
	y,
	radius,
	fill,
	stroke,
	cursor,
	onPointerCancel,
	onPointerDown,
	onPointerMove,
	onPointerUp,
}: {
	x: number;
	y: number;
	radius: number;
	fill: string;
	stroke: string;
	cursor: string;
	onPointerCancel: PointerEventHandler<SVGCircleElement>;
	onPointerDown: PointerEventHandler<SVGCircleElement>;
	onPointerMove: PointerEventHandler<SVGCircleElement>;
	onPointerUp: PointerEventHandler<SVGCircleElement>;
}) {
	return (
		<circle
			cx={x}
			cy={y}
			r={radius}
			fill={fill}
			stroke={stroke}
			strokeWidth={1}
			style={{ cursor }}
			onPointerCancel={onPointerCancel}
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
		/>
	);
}
