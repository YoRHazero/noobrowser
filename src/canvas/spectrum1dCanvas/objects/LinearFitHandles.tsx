import type { ScaleLinear } from "d3-scale";
import type { PointerEvent } from "react";
import type {
	Spectrum1DCanvasActions,
	Spectrum1DCanvasLinearFitModel,
	Spectrum1DCanvasWaveRange,
} from "../api";
import { SPECTRUM_1D_CANVAS_HANDLE_RADIUS_PX } from "../shared/constants";
import type {
	ScreenPoint,
	Spectrum1DCanvasFitHandleDrag,
} from "../shared/types";
import { normalizeWaveRange } from "../utils/normalizeWaveRange";
import { sampleLinearFlux } from "../utils/sampleLinearFlux";
import { FitHandleMark } from "./FitHandleMark";

const HANDLE_STROKE = "var(--spectrum-1d-fit-handle-stroke-color)";

function getScaleDelta(
	scale: ScaleLinear<number, number>,
	screenDelta: number,
) {
	return scale.invert(screenDelta) - scale.invert(0);
}

function isFiniteScreenPoint(point: ScreenPoint) {
	return Number.isFinite(point.x) && Number.isFinite(point.y);
}

function isPointVisible({
	point,
	wavelengthUm,
	height,
	sliceRange,
}: {
	point: ScreenPoint;
	wavelengthUm: number;
	height: number;
	sliceRange: Spectrum1DCanvasWaveRange;
}) {
	const normalizedRange = normalizeWaveRange(sliceRange);
	return (
		isFiniteScreenPoint(point) &&
		wavelengthUm >= normalizedRange.minUm &&
		wavelengthUm <= normalizedRange.maxUm &&
		point.y >= 0 &&
		point.y <= height
	);
}

function capturePointer(event: PointerEvent<SVGCircleElement>) {
	event.preventDefault();
	event.stopPropagation();
	event.currentTarget.setPointerCapture(event.pointerId);
}

function releasePointer(event: PointerEvent<SVGCircleElement>) {
	event.preventDefault();
	event.stopPropagation();
	if (event.currentTarget.hasPointerCapture(event.pointerId)) {
		event.currentTarget.releasePointerCapture(event.pointerId);
	}
}

export function LinearFitHandles({
	model,
	xScale,
	yScale,
	height,
	sliceRange,
	drag,
	startDrag,
	updateDrag,
	endDrag,
	updateFitModel,
}: {
	model: Spectrum1DCanvasLinearFitModel;
	xScale: ScaleLinear<number, number>;
	yScale: ScaleLinear<number, number>;
	height: number;
	sliceRange: Spectrum1DCanvasWaveRange;
	drag: Spectrum1DCanvasFitHandleDrag | null;
	startDrag: (drag: Spectrum1DCanvasFitHandleDrag) => void;
	updateDrag: (drag: Spectrum1DCanvasFitHandleDrag) => void;
	endDrag: (modelId?: number) => void;
	updateFitModel: NonNullable<Spectrum1DCanvasActions["updateFitModel"]>;
}) {
	const x0Point = {
		x: xScale(model.x0Um),
		y: yScale(model.b),
	};
	const leftFlux = sampleLinearFlux(model, model.range.minUm);
	const leftPoint = {
		x: xScale(model.range.minUm),
		y: yScale(leftFlux),
	};
	const rightFlux = sampleLinearFlux(model, model.range.maxUm);
	const rightPoint = {
		x: xScale(model.range.maxUm),
		y: yScale(rightFlux),
	};
	const finishDrag = (event: PointerEvent<SVGCircleElement>) => {
		if (drag?.modelId !== model.id) {
			return;
		}

		releasePointer(event);
		endDrag(model.id);
	};

	return (
		<g pointerEvents="visiblePainted">
			{isPointVisible({
				point: x0Point,
				wavelengthUm: model.x0Um,
				height,
				sliceRange,
			}) ? (
				<FitHandleMark
					x={x0Point.x}
					y={x0Point.y}
					radius={SPECTRUM_1D_CANVAS_HANDLE_RADIUS_PX}
					fill={model.color}
					stroke={HANDLE_STROKE}
					cursor="move"
					onPointerDown={(event) => {
						capturePointer(event);
						startDrag({
							type: "linear-x0",
							modelId: model.id,
							lastPointer: {
								x: event.clientX,
								y: event.clientY,
							},
						});
					}}
					onPointerMove={(event) => {
						if (drag?.type !== "linear-x0" || drag.modelId !== model.id) {
							return;
						}

						const dx = event.clientX - drag.lastPointer.x;
						const dy = event.clientY - drag.lastPointer.y;
						if (dx === 0 && dy === 0) {
							return;
						}

						updateFitModel(model.id, {
							kind: "linear",
							patch: {
								b: model.b + getScaleDelta(yScale, dy),
								x0Um: model.x0Um + getScaleDelta(xScale, dx),
							},
						});
						updateDrag({
							type: "linear-x0",
							modelId: model.id,
							lastPointer: {
								x: event.clientX,
								y: event.clientY,
							},
						});
					}}
					onPointerUp={finishDrag}
					onPointerCancel={finishDrag}
				/>
			) : null}
			{isPointVisible({
				point: leftPoint,
				wavelengthUm: model.range.minUm,
				height,
				sliceRange,
			}) ? (
				<FitHandleMark
					x={leftPoint.x}
					y={leftPoint.y}
					radius={SPECTRUM_1D_CANVAS_HANDLE_RADIUS_PX}
					fill={model.color}
					stroke={HANDLE_STROKE}
					cursor="ns-resize"
					onPointerDown={(event) => {
						capturePointer(event);
						startDrag({
							type: "linear-left",
							modelId: model.id,
							lastPointerY: event.clientY,
						});
					}}
					onPointerMove={(event) => {
						if (drag?.type !== "linear-left" || drag.modelId !== model.id) {
							return;
						}

						const dy = event.clientY - drag.lastPointerY;
						const wavelengthDelta = model.range.minUm - model.x0Um;
						if (dy === 0 || wavelengthDelta === 0) {
							return;
						}

						updateFitModel(model.id, {
							kind: "linear",
							patch: {
								k: model.k + getScaleDelta(yScale, dy) / wavelengthDelta,
							},
						});
						updateDrag({
							type: "linear-left",
							modelId: model.id,
							lastPointerY: event.clientY,
						});
					}}
					onPointerUp={finishDrag}
					onPointerCancel={finishDrag}
				/>
			) : null}
			{isPointVisible({
				point: rightPoint,
				wavelengthUm: model.range.maxUm,
				height,
				sliceRange,
			}) ? (
				<FitHandleMark
					x={rightPoint.x}
					y={rightPoint.y}
					radius={SPECTRUM_1D_CANVAS_HANDLE_RADIUS_PX}
					fill={model.color}
					stroke={HANDLE_STROKE}
					cursor="ns-resize"
					onPointerDown={(event) => {
						capturePointer(event);
						startDrag({
							type: "linear-right",
							modelId: model.id,
							lastPointerY: event.clientY,
						});
					}}
					onPointerMove={(event) => {
						if (drag?.type !== "linear-right" || drag.modelId !== model.id) {
							return;
						}

						const dy = event.clientY - drag.lastPointerY;
						const wavelengthDelta = model.range.maxUm - model.x0Um;
						if (dy === 0 || wavelengthDelta === 0) {
							return;
						}

						updateFitModel(model.id, {
							kind: "linear",
							patch: {
								k: model.k + getScaleDelta(yScale, dy) / wavelengthDelta,
							},
						});
						updateDrag({
							type: "linear-right",
							modelId: model.id,
							lastPointerY: event.clientY,
						});
					}}
					onPointerUp={finishDrag}
					onPointerCancel={finishDrag}
				/>
			) : null}
		</g>
	);
}
