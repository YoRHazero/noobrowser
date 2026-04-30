import type { PointerEvent } from "react";
import type { CollapsedSpectrumViewModel } from "../../shared/types";
import {
	COLLAPSED_SPECTRUM_AXIS_COLOR,
	COLLAPSED_SPECTRUM_ERROR_FILL,
	COLLAPSED_SPECTRUM_FWHM_COLOR,
	COLLAPSED_SPECTRUM_LINE_COLOR,
	COLLAPSED_SPECTRUM_PANEL_HEIGHT,
	COLLAPSED_SPECTRUM_PANEL_MARGIN,
	COLLAPSED_SPECTRUM_PANEL_WIDTH,
	COLLAPSED_SPECTRUM_REFERENCE_COLOR,
	COLLAPSED_SPECTRUM_TICK_COLOR,
} from "./shared/constants";
import type { SpectrumPanelPoint, SpectrumPanelScales } from "./shared/types";
import {
	createStepErrorPath,
	createStepLinePath,
	createTicks,
} from "./utils/chartGeometry";

function getSvgX(event: PointerEvent<SVGSVGElement>) {
	const rect = event.currentTarget.getBoundingClientRect();
	return (
		((event.clientX - rect.left) / Math.max(rect.width, 1)) *
		COLLAPSED_SPECTRUM_PANEL_WIDTH
	);
}

export function CollapsedSpectrumChart({
	spectrum,
	points,
	scales,
	fwhmKmS,
	onReferenceDrag,
}: {
	spectrum: CollapsedSpectrumViewModel | null;
	points: SpectrumPanelPoint[];
	scales: SpectrumPanelScales;
	fwhmKmS: number;
	onReferenceDrag: (svgX: number) => void;
}) {
	const linePath = createStepLinePath(points, scales);
	const errorPath = createStepErrorPath(points, scales);
	const ticks = createTicks(scales.xMin, scales.xMax, 5);
	const axisY = COLLAPSED_SPECTRUM_PANEL_MARGIN.top + scales.innerHeight + 0.5;
	const referenceX = scales.xForVelocity(0);
	const fwhmHalfWidth = Number.isFinite(fwhmKmS) ? Math.max(0, fwhmKmS) / 2 : 0;
	const fwhmLineXs =
		fwhmHalfWidth > 0
			? [
					scales.xForVelocity(-fwhmHalfWidth),
					scales.xForVelocity(fwhmHalfWidth),
				]
			: [];
	const plotLeft = COLLAPSED_SPECTRUM_PANEL_MARGIN.left;
	const plotRight = COLLAPSED_SPECTRUM_PANEL_MARGIN.left + scales.innerWidth;

	const handlePointer = (event: PointerEvent<SVGSVGElement>) => {
		event.preventDefault();
		onReferenceDrag(getSvgX(event));
	};

	return (
		<svg
			viewBox={`0 0 ${COLLAPSED_SPECTRUM_PANEL_WIDTH} ${COLLAPSED_SPECTRUM_PANEL_HEIGHT}`}
			width="100%"
			height="100%"
			role="img"
			aria-label="Collapsed spectrum"
			onPointerDown={handlePointer}
			onPointerMove={(event) => {
				if (event.buttons === 1) {
					handlePointer(event);
				}
			}}
		>
			<rect
				x={COLLAPSED_SPECTRUM_PANEL_MARGIN.left}
				y={COLLAPSED_SPECTRUM_PANEL_MARGIN.top}
				width={scales.innerWidth}
				height={scales.innerHeight}
				fill="rgba(2, 6, 23, 0.32)"
			/>
			{errorPath ? (
				<path
					d={errorPath}
					fill={COLLAPSED_SPECTRUM_ERROR_FILL}
					stroke="none"
				/>
			) : null}
			{linePath ? (
				<path
					d={linePath}
					fill="none"
					stroke={COLLAPSED_SPECTRUM_LINE_COLOR}
					strokeWidth="1.7"
					vectorEffect="non-scaling-stroke"
				/>
			) : null}
			{points.length > 0 ? (
				<line
					x1={referenceX}
					x2={referenceX}
					y1={COLLAPSED_SPECTRUM_PANEL_MARGIN.top}
					y2={COLLAPSED_SPECTRUM_PANEL_MARGIN.top + scales.innerHeight}
					stroke={COLLAPSED_SPECTRUM_REFERENCE_COLOR}
					strokeWidth="1.6"
					vectorEffect="non-scaling-stroke"
				/>
			) : null}
			{points.length > 0
				? fwhmLineXs.map((x) =>
						x >= plotLeft && x <= plotRight ? (
							<line
								key={x}
								x1={x}
								x2={x}
								y1={COLLAPSED_SPECTRUM_PANEL_MARGIN.top}
								y2={COLLAPSED_SPECTRUM_PANEL_MARGIN.top + scales.innerHeight}
								stroke={COLLAPSED_SPECTRUM_FWHM_COLOR}
								strokeWidth="1"
								strokeDasharray="4 4"
								vectorEffect="non-scaling-stroke"
								pointerEvents="none"
							/>
						) : null,
					)
				: null}
			<line
				x1={COLLAPSED_SPECTRUM_PANEL_MARGIN.left}
				x2={COLLAPSED_SPECTRUM_PANEL_MARGIN.left + scales.innerWidth}
				y1={axisY}
				y2={axisY}
				stroke={COLLAPSED_SPECTRUM_AXIS_COLOR}
				strokeWidth="1"
				vectorEffect="non-scaling-stroke"
			/>
			{ticks.map((tick) => {
				const x = scales.xForVelocity(tick);
				return (
					<g key={tick}>
						<line
							x1={x}
							x2={x}
							y1={axisY}
							y2={axisY + 4}
							stroke={COLLAPSED_SPECTRUM_AXIS_COLOR}
							strokeWidth="1"
							vectorEffect="non-scaling-stroke"
						/>
						<text
							x={x}
							y={axisY + 15}
							fill={COLLAPSED_SPECTRUM_TICK_COLOR}
							fontSize="9"
							fontFamily="monospace"
							textAnchor="middle"
						>
							{tick.toFixed(0)}
						</text>
					</g>
				);
			})}
			<text
				x={COLLAPSED_SPECTRUM_PANEL_WIDTH / 2}
				y={COLLAPSED_SPECTRUM_PANEL_HEIGHT - 4}
				fill={COLLAPSED_SPECTRUM_TICK_COLOR}
				fontSize="10"
				fontFamily="system-ui, sans-serif"
				textAnchor="middle"
			>
				FWHM (km/s)
			</text>
			{!spectrum || points.length === 0 ? (
				<text
					x={COLLAPSED_SPECTRUM_PANEL_WIDTH / 2}
					y={COLLAPSED_SPECTRUM_PANEL_HEIGHT / 2}
					fill="rgba(203, 213, 225, 0.55)"
					fontSize="11"
					fontFamily="system-ui, sans-serif"
					textAnchor="middle"
				>
					No spectrum
				</text>
			) : null}
		</svg>
	);
}
