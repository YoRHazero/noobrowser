import type { ScaleLinear } from "d3-scale";
import { memo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useFitStore } from "@/stores/fit";
import type { FitGaussianModel, FitLinearModel } from "@/stores/stores-types";
import { SQRT_2_LN2 } from "./constants";

type DragKind =
	| { type: "gauss-peak"; id: number; lastX: number; lastY: number }
	| { type: "gauss-sigma-left"; id: number; lastX: number }
	| { type: "gauss-sigma-right"; id: number; lastX: number }
	| { type: "linear-x0"; id: number; lastX: number; lastY: number }
	| { type: "linear-left"; id: number; lastY: number }
	| { type: "linear-right"; id: number; lastY: number }
	| null;

interface Spectrum1DFitHandleLayerProps {
	xScale: ScaleLinear<number, number>;
	yScale: ScaleLinear<number, number>;
	chartHeight: number;
	sliceRange: { min: number; max: number };
}

const Spectrum1DFitHandleLayer = memo(function Spectrum1DFitHandleLayer(
	props: Spectrum1DFitHandleLayerProps,
) {
	const { xScale, yScale, chartHeight, sliceRange } = props;
	const handleStroke = useColorModeValue(
		"var(--chakra-colors-gray-900)",
		"var(--chakra-colors-cyan-200)",
	);
	const { updateModel, models, validateModel } = useFitStore(
		useShallow((state) => ({
			updateModel: state.updateModel,
			models: state.models,
			validateModel: state.validateModel,
		})),
	);
	const modelsDraw = models.filter(
		(model) => model.active && model.subtracted === false,
	);
	const [drag, setDrag] = useState<DragKind>(null);
	if (modelsDraw.length === 0) return null;
	return (
		<g>
			{modelsDraw.map((model) =>
				model.kind === "gaussian" ? (
					<GaussianHandle
						key={`handle-gaussian-${model.id}`}
						model={model}
						xScale={xScale}
						yScale={yScale}
						sliceRange={sliceRange}
						chartHeight={chartHeight}
						drag={drag}
						setDrag={setDrag}
						updateModel={updateModel}
						validateModel={validateModel}
						handleStroke={handleStroke}
					/>
				) : (
					<LinearHandle
						key={`handle-linear-${model.id}`}
						model={model}
						xScale={xScale}
						yScale={yScale}
						sliceRange={sliceRange}
						drag={drag}
						setDrag={setDrag}
						updateModel={updateModel}
						validateModel={validateModel}
						handleStroke={handleStroke}
					/>
				),
			)}
		</g>
	);
});

interface GaussianHandleProps {
	model: FitGaussianModel;
	xScale: ScaleLinear<number, number>;
	yScale: ScaleLinear<number, number>;
	sliceRange: { min: number; max: number };
	chartHeight: number;
	drag: DragKind;
	setDrag: (drag: DragKind) => void;
	updateModel: (id: number, patch: Partial<FitGaussianModel>) => void;
	validateModel?: () => void;
	cricleSize?: number;
	handleStroke: string;
}

function GaussianHandle(props: GaussianHandleProps) {
	const {
		model,
		xScale,
		yScale,
		sliceRange,
		chartHeight,
		drag,
		setDrag,
		updateModel,
		validateModel,
		cricleSize = 7,
		handleStroke,
	} = props;
	const peakWave = model.mu;
	const peakFlux = model.amplitude;
	const peakX = xScale(peakWave);
	const peakY = yScale(peakFlux);
	const peakInChart =
		peakWave >= sliceRange.min &&
		peakWave <= sliceRange.max &&
		peakY !== undefined &&
		peakY >= 0 &&
		peakY <= chartHeight;

	const halfFlux = peakFlux / 2;
	const halfWidth = model.sigma * SQRT_2_LN2;
	const halfLeftWave = model.mu - halfWidth;
	const halfRightWave = model.mu + halfWidth;

	const halfLeftX = xScale(halfLeftWave);
	const halfRightX = xScale(halfRightWave);
	const halfLeftY = yScale(halfFlux);
	const halfRightY = yScale(halfFlux);
	const halfLeftInChart =
		halfLeftWave >= sliceRange.min &&
		halfLeftWave <= sliceRange.max &&
		halfLeftY !== undefined &&
		halfLeftY >= 0 &&
		halfLeftY <= chartHeight;
	const halfRightInChart =
		halfRightWave >= sliceRange.min &&
		halfRightWave <= sliceRange.max &&
		halfRightY !== undefined &&
		halfRightY >= 0 &&
		halfRightY <= chartHeight;

	return (
		<g pointerEvents="visiblePainted">
			{peakInChart && (
				<circle
					cx={peakX}
					cy={peakY}
					r={cricleSize}
					fill={model.color}
					stroke={handleStroke}
					strokeWidth={1}
					style={{ cursor: "move" }}
					onPointerDown={(e) => {
						e.stopPropagation();
						(e.currentTarget as Element).setPointerCapture(e.pointerId);
						setDrag({
							type: "gauss-peak",
							id: model.id,
							lastX: e.clientX,
							lastY: e.clientY,
						});
					}}
					onPointerMove={(e) => {
						if (!drag || drag.type !== "gauss-peak" || drag.id !== model.id)
							return;
						const dx = e.clientX - drag.lastX;
						const dy = e.clientY - drag.lastY;
						if (dx === 0 && dy === 0) return;
						const newPx = peakX + dx;
						const newPy = peakY + dy;
						const newMu = xScale.invert(newPx);
						const newAmp = yScale.invert(newPy);
						updateModel(model.id, { mu: newMu, amplitude: newAmp });
						setDrag({ ...drag, lastX: e.clientX, lastY: e.clientY });
					}}
					onPointerUp={(e) => {
						if (!drag || drag.type !== "gauss-peak" || drag.id !== model.id)
							return;
						(e.currentTarget as Element).releasePointerCapture(e.pointerId);
						setDrag(null);
						validateModel?.();
					}}
				/>
			)}
			{halfLeftInChart && (
				<circle
					cx={halfLeftX}
					cy={halfLeftY}
					r={cricleSize}
					fill={model.color}
					stroke={handleStroke}
					strokeWidth={1}
					style={{ cursor: "ew-resize" }}
					onPointerDown={(e) => {
						e.stopPropagation();
						(e.currentTarget as Element).setPointerCapture(e.pointerId);
						setDrag({
							type: "gauss-sigma-left",
							id: model.id,
							lastX: e.clientX,
						});
					}}
					onPointerMove={(e) => {
						if (
							!drag ||
							drag.type !== "gauss-sigma-left" ||
							drag.id !== model.id
						)
							return;
						const dx = e.clientX - drag.lastX;
						if (dx === 0) return;
						const newHalfWidth =
							halfWidth - (xScale.invert(dx) - xScale.invert(0));
						const newSigma = newHalfWidth / SQRT_2_LN2;
						updateModel(model.id, { sigma: newSigma });
						setDrag({ ...drag, lastX: e.clientX });
					}}
					onPointerUp={(e) => {
						if (
							!drag ||
							drag.type !== "gauss-sigma-left" ||
							drag.id !== model.id
						)
							return;
						(e.currentTarget as Element).releasePointerCapture(e.pointerId);
						setDrag(null);
						validateModel?.();
					}}
				/>
			)}
			{halfRightInChart && (
				<circle
					cx={halfRightX}
					cy={halfRightY}
					r={cricleSize}
					fill={model.color}
					stroke={handleStroke}
					strokeWidth={1}
					style={{ cursor: "ew-resize" }}
					onPointerDown={(e) => {
						e.stopPropagation();
						(e.currentTarget as Element).setPointerCapture(e.pointerId);
						setDrag({
							type: "gauss-sigma-right",
							id: model.id,
							lastX: e.clientX,
						});
					}}
					onPointerMove={(e) => {
						if (
							!drag ||
							drag.type !== "gauss-sigma-right" ||
							drag.id !== model.id
						)
							return;
						const dx = e.clientX - drag.lastX;
						if (dx === 0) return;
						const newHalfWidth =
							halfWidth + xScale.invert(dx) - xScale.invert(0);
						const newSigma = newHalfWidth / SQRT_2_LN2;
						updateModel(model.id, { sigma: newSigma });
						setDrag({ ...drag, lastX: e.clientX });
					}}
					onPointerUp={(e) => {
						if (
							!drag ||
							drag.type !== "gauss-sigma-right" ||
							drag.id !== model.id
						)
							return;
						(e.currentTarget as Element).releasePointerCapture(e.pointerId);
						setDrag(null);
						validateModel?.();
					}}
				/>
			)}
		</g>
	);
}

interface LinearHandleProps {
	model: FitLinearModel;
	xScale: ScaleLinear<number, number>;
	yScale: ScaleLinear<number, number>;
	sliceRange: { min: number; max: number };
	drag: DragKind;
	setDrag: (drag: DragKind) => void;
	updateModel: (id: number, patch: Partial<FitLinearModel>) => void;
	validateModel?: () => void;
	cricleSize?: number;
	handleStroke: string;
}

function LinearHandle(props: LinearHandleProps) {
	const {
		model,
		xScale,
		yScale,
		drag,
		setDrag,
		updateModel,
		validateModel,
		cricleSize = 7,
		handleStroke,
	} = props;
	const x0X = xScale(model.x0);
	const x0Y = yScale(model.b);
	const x0InChart = x0X !== undefined && x0Y !== undefined;
	const leftX = xScale(model.range.min);
	const leftY = yScale(model.k * (model.range.min - model.x0) + model.b);
	const leftInChart = leftX !== undefined && leftY !== undefined;

	const rightX = xScale(model.range.max);
	const rightY = yScale(model.k * (model.range.max - model.x0) + model.b);
	const rightInChart = rightX !== undefined && rightY !== undefined;
	return (
		<g pointerEvents="visiblePainted">
			{x0InChart && (
				<circle
					cx={x0X}
					cy={x0Y}
					r={cricleSize}
					fill={model.color}
					stroke={handleStroke}
					strokeWidth={1}
					style={{ cursor: "move" }}
					onPointerDown={(e) => {
						e.stopPropagation();
						(e.currentTarget as Element).setPointerCapture(e.pointerId);
						setDrag({
							type: "linear-x0",
							id: model.id,
							lastX: e.clientX,
							lastY: e.clientY,
						});
					}}
					onPointerMove={(e) => {
						if (!drag || drag.type !== "linear-x0" || drag.id !== model.id)
							return;
						const dx = e.clientX - drag.lastX;
						const dy = e.clientY - drag.lastY;
						if (dx === 0 && dy === 0) return;
						const newX0 = model.x0 + xScale.invert(dx) - xScale.invert(0);
						const newB = model.b + yScale.invert(dy) - yScale.invert(0);
						updateModel(model.id, { x0: newX0, b: newB });
						setDrag({ ...drag, lastX: e.clientX, lastY: e.clientY });
					}}
					onPointerUp={(e) => {
						if (!drag || drag.type !== "linear-x0" || drag.id !== model.id)
							return;
						(e.currentTarget as Element).releasePointerCapture(e.pointerId);
						setDrag(null);
						validateModel?.();
					}}
				/>
			)}
			{leftInChart && (
				<circle
					cx={leftX}
					cy={leftY}
					r={cricleSize}
					fill={model.color}
					stroke={handleStroke}
					strokeWidth={1}
					style={{ cursor: "ns-resize" }}
					onPointerDown={(e) => {
						e.stopPropagation();
						(e.currentTarget as Element).setPointerCapture(e.pointerId);
						setDrag({ type: "linear-left", id: model.id, lastY: e.clientY });
					}}
					onPointerMove={(e) => {
						if (!drag || drag.type !== "linear-left" || drag.id !== model.id)
							return;
						const dy = e.clientY - drag.lastY;
						if (dy === 0) return;
						const newK =
							model.k +
							(yScale.invert(dy) - yScale.invert(0)) /
								(model.range.min - model.x0);
						updateModel(model.id, { k: newK });
						setDrag({ ...drag, lastY: e.clientY });
					}}
					onPointerUp={(e) => {
						if (!drag || drag.type !== "linear-left" || drag.id !== model.id)
							return;
						(e.currentTarget as Element).releasePointerCapture(e.pointerId);
						setDrag(null);
						validateModel?.();
					}}
				/>
			)}
			{rightInChart && (
				<circle
					cx={rightX}
					cy={rightY}
					r={cricleSize}
					fill={model.color}
					stroke={handleStroke}
					strokeWidth={1}
					style={{ cursor: "ns-resize" }}
					onPointerDown={(e) => {
						e.stopPropagation();
						(e.currentTarget as Element).setPointerCapture(e.pointerId);
						setDrag({ type: "linear-right", id: model.id, lastY: e.clientY });
					}}
					onPointerMove={(e) => {
						if (!drag || drag.type !== "linear-right" || drag.id !== model.id)
							return;
						const dy = e.clientY - drag.lastY;
						if (dy === 0) return;
						const newK =
							model.k +
							(yScale.invert(dy) - yScale.invert(0)) /
								(model.range.max - model.x0);
						updateModel(model.id, { k: newK });
						setDrag({ ...drag, lastY: e.clientY });
					}}
					onPointerUp={(e) => {
						if (!drag || drag.type !== "linear-right" || drag.id !== model.id)
							return;
						(e.currentTarget as Element).releasePointerCapture(e.pointerId);
						setDrag(null);
						validateModel?.();
					}}
				/>
			)}
		</g>
	);
}

export default Spectrum1DFitHandleLayer;
