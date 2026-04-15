import type { ScaleLinear } from "d3-scale";
import type { PointerEvent } from "react";
import type {
	Spectrum1DCanvasActions,
	Spectrum1DCanvasGaussianFitModel,
	Spectrum1DCanvasWaveRange,
} from "../api";
import {
	SPECTRUM_1D_CANVAS_HANDLE_RADIUS_PX,
	SPECTRUM_1D_CANVAS_SQRT_2_LN2,
} from "../shared/constants";
import type {
	ScreenPoint,
	Spectrum1DCanvasFitHandleDrag,
} from "../shared/types";
import { normalizeWaveRange } from "../utils/normalizeWaveRange";
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

export function GaussianFitHandles({
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
	model: Spectrum1DCanvasGaussianFitModel;
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
	const peakPoint = {
		x: xScale(model.muUm),
		y: yScale(model.amplitude),
	};
	const halfFlux = model.amplitude / 2;
	const halfWidthUm = Math.abs(model.sigmaUm) * SPECTRUM_1D_CANVAS_SQRT_2_LN2;
	const halfLeftWavelengthUm = model.muUm - halfWidthUm;
	const halfRightWavelengthUm = model.muUm + halfWidthUm;
	const halfLeftPoint = {
		x: xScale(halfLeftWavelengthUm),
		y: yScale(halfFlux),
	};
	const halfRightPoint = {
		x: xScale(halfRightWavelengthUm),
		y: yScale(halfFlux),
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
				point: peakPoint,
				wavelengthUm: model.muUm,
				height,
				sliceRange,
			}) ? (
				<FitHandleMark
					x={peakPoint.x}
					y={peakPoint.y}
					radius={SPECTRUM_1D_CANVAS_HANDLE_RADIUS_PX}
					fill={model.color}
					stroke={HANDLE_STROKE}
					cursor="move"
					onPointerDown={(event) => {
						capturePointer(event);
						startDrag({
							type: "gaussian-peak",
							modelId: model.id,
							lastPointer: {
								x: event.clientX,
								y: event.clientY,
							},
						});
					}}
					onPointerMove={(event) => {
						if (drag?.type !== "gaussian-peak" || drag.modelId !== model.id) {
							return;
						}

						const dx = event.clientX - drag.lastPointer.x;
						const dy = event.clientY - drag.lastPointer.y;
						if (dx === 0 && dy === 0) {
							return;
						}

						updateFitModel(model.id, {
							kind: "gaussian",
							patch: {
								amplitude: yScale.invert(peakPoint.y + dy),
								muUm: xScale.invert(peakPoint.x + dx),
							},
						});
						updateDrag({
							type: "gaussian-peak",
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
				point: halfLeftPoint,
				wavelengthUm: halfLeftWavelengthUm,
				height,
				sliceRange,
			}) ? (
				<FitHandleMark
					x={halfLeftPoint.x}
					y={halfLeftPoint.y}
					radius={SPECTRUM_1D_CANVAS_HANDLE_RADIUS_PX}
					fill={model.color}
					stroke={HANDLE_STROKE}
					cursor="ew-resize"
					onPointerDown={(event) => {
						capturePointer(event);
						startDrag({
							type: "gaussian-sigma-left",
							modelId: model.id,
							lastPointerX: event.clientX,
						});
					}}
					onPointerMove={(event) => {
						if (
							drag?.type !== "gaussian-sigma-left" ||
							drag.modelId !== model.id
						) {
							return;
						}

						const dx = event.clientX - drag.lastPointerX;
						if (dx === 0) {
							return;
						}

						const nextHalfWidthUm = Math.max(
							Number.EPSILON,
							halfWidthUm - getScaleDelta(xScale, dx),
						);
						updateFitModel(model.id, {
							kind: "gaussian",
							patch: {
								sigmaUm: nextHalfWidthUm / SPECTRUM_1D_CANVAS_SQRT_2_LN2,
							},
						});
						updateDrag({
							type: "gaussian-sigma-left",
							modelId: model.id,
							lastPointerX: event.clientX,
						});
					}}
					onPointerUp={finishDrag}
					onPointerCancel={finishDrag}
				/>
			) : null}
			{isPointVisible({
				point: halfRightPoint,
				wavelengthUm: halfRightWavelengthUm,
				height,
				sliceRange,
			}) ? (
				<FitHandleMark
					x={halfRightPoint.x}
					y={halfRightPoint.y}
					radius={SPECTRUM_1D_CANVAS_HANDLE_RADIUS_PX}
					fill={model.color}
					stroke={HANDLE_STROKE}
					cursor="ew-resize"
					onPointerDown={(event) => {
						capturePointer(event);
						startDrag({
							type: "gaussian-sigma-right",
							modelId: model.id,
							lastPointerX: event.clientX,
						});
					}}
					onPointerMove={(event) => {
						if (
							drag?.type !== "gaussian-sigma-right" ||
							drag.modelId !== model.id
						) {
							return;
						}

						const dx = event.clientX - drag.lastPointerX;
						if (dx === 0) {
							return;
						}

						const nextHalfWidthUm = Math.max(
							Number.EPSILON,
							halfWidthUm + getScaleDelta(xScale, dx),
						);
						updateFitModel(model.id, {
							kind: "gaussian",
							patch: {
								sigmaUm: nextHalfWidthUm / SPECTRUM_1D_CANVAS_SQRT_2_LN2,
							},
						});
						updateDrag({
							type: "gaussian-sigma-right",
							modelId: model.id,
							lastPointerX: event.clientX,
						});
					}}
					onPointerUp={finishDrag}
					onPointerCancel={finishDrag}
				/>
			) : null}
		</g>
	);
}
