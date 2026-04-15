import type { ScaleLinear } from "d3-scale";
import type { PointerEvent } from "react";
import type {
	Spectrum1DCanvasActions,
	Spectrum1DCanvasFitModel,
	Spectrum1DCanvasGaussianFitModel,
	Spectrum1DCanvasLinearFitModel,
	Spectrum1DCanvasWaveRange,
} from "../api";
import { useFitHandleDrag } from "../canvasHooks/useFitHandleDrag";
import { FitHandleMark } from "../objects/FitHandleMark";
import {
	SPECTRUM_1D_CANVAS_HANDLE_RADIUS_PX,
	SPECTRUM_1D_CANVAS_SQRT_2_LN2,
} from "../shared/constants";
import type {
	ScreenAnchor,
	ScreenPoint,
	Spectrum1DCanvasFitHandleDrag,
} from "../shared/types";
import { normalizeWaveRange } from "../utils/normalizeWaveRange";
import { sampleLinearFlux } from "../utils/sampleLinearFlux";

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

export function FitHandleLayer({
	models,
	xScale,
	yScale,
	height,
	anchor,
	sliceRange,
	actions,
}: {
	models: Spectrum1DCanvasFitModel[];
	xScale: ScaleLinear<number, number>;
	yScale: ScaleLinear<number, number>;
	height: number;
	anchor: ScreenAnchor;
	sliceRange: Spectrum1DCanvasWaveRange;
	actions: Spectrum1DCanvasActions;
}) {
	const { drag, startDrag, updateDrag, endDrag } = useFitHandleDrag({
		commitFitModelEdit: actions.commitFitModelEdit,
	});
	const updateFitModel = actions.updateFitModel;

	if (!updateFitModel || models.length === 0 || height <= 0) {
		return null;
	}

	return (
		<g transform={`translate(${anchor.left}, ${anchor.top})`}>
			{models.map((model) =>
				model.kind === "gaussian" ? (
					<GaussianFitHandles
						key={`fit-handle-gaussian-${model.id}`}
						model={model}
						xScale={xScale}
						yScale={yScale}
						height={height}
						sliceRange={sliceRange}
						drag={drag}
						startDrag={startDrag}
						updateDrag={updateDrag}
						endDrag={endDrag}
						updateFitModel={updateFitModel}
					/>
				) : (
					<LinearFitHandles
						key={`fit-handle-linear-${model.id}`}
						model={model}
						xScale={xScale}
						yScale={yScale}
						height={height}
						sliceRange={sliceRange}
						drag={drag}
						startDrag={startDrag}
						updateDrag={updateDrag}
						endDrag={endDrag}
						updateFitModel={updateFitModel}
					/>
				),
			)}
		</g>
	);
}

function GaussianFitHandles({
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

function LinearFitHandles({
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
