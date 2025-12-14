import { Box } from "@chakra-ui/react";
import {
	type BaseBrushState,
	type Bounds,
	Brush,
	type BrushHandleRenderProps,
	type UpdateBrush,
} from "@visx/brush";
import { curveLinear, curveStep } from "@visx/curve";
import { Group } from "@visx/group";
import { AnimatedAxis } from "@visx/react-spring";
import { AreaClosed, LinePath } from "@visx/shape";
import { defaultStyles, useTooltip, useTooltipInPortal } from "@visx/tooltip";
import { type ScaleLinear, scaleLinear } from "d3-scale";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useWavelengthDisplay } from "@/hook/transformation-hook";
import { useFitStore } from "@/stores/fit";
import { useGrismStore } from "@/stores/image";
import type { FitGaussianModel, FitLinearModel } from "@/stores/stores-types";
import { getWavelengthSliceIndices } from "@/utils/extraction";
import { sampleModel, sampleModelFromWave } from "@/utils/plot";
import type { Spectrum1D } from "@/utils/util-types";
import { findNearestWavelengthIndex } from "@/utils/wavelength";

type Anchor = {
	top: number;
	left: number;
};
type Label = {
	top?: string;
	right?: string;
	bottom?: string;
	left?: string;
};
interface TooltipData {
	wavelength: number;
	flux: number;
	error: number;
	axisX: number;
	axisY: number;
	pointerX: number;
	pointerY: number;
}

interface Spectrum1DSliceChartProps {
	spectrum1D: Spectrum1D[];
	width: number; // inner chart width excluding margins
	height: number; // inner chart height excluding margins
	xScale: ScaleLinear<number, number>;
	yScale: ScaleLinear<number, number>;
	anchor: Anchor;
	label?: Label;
	children?: React.ReactNode;
}

const Spectrum1DSliceChart = memo(function Spectrum1DSliceChart(
	props: Spectrum1DSliceChartProps,
) {
	const { spectrum1D, xScale, yScale, height, anchor, label, children } = props;
	const { label: defaultBottomLabel, formatter } = useWavelengthDisplay();
	const fillColor = useColorModeValue("#444", "#ccc");
	const strokeColor = useColorModeValue("#000", "#fff");
	return (
		<Group left={anchor.left} top={anchor.top}>
			<AnimatedAxis
				orientation="left"
				scale={yScale}
				numTicks={5}
				label={label?.left ?? "flux"}
				labelOffset={35}
				animationTrajectory="outside"
				tickLabelProps={{
					dx: -10,
					dy: -5,
					fill: strokeColor,
				}}
				labelProps={{ fill: strokeColor }}
				stroke={strokeColor}
				tickStroke={strokeColor}
			/>
			<AnimatedAxis
				orientation="bottom"
				animationTrajectory="outside"
				left={0}
				top={height}
				scale={xScale}
				numTicks={8}
				label={defaultBottomLabel}
				tickFormat={(v) => {
					const n = typeof v === "number" ? v : Number(v.valueOf());
					return formatter(n);
				}}
				tickLabelProps={{ fill: strokeColor }}
				labelProps={{ fill: strokeColor }}
				stroke={strokeColor}
				tickStroke={strokeColor}
			/>
			{/* Area for error bars */}
			<AreaClosed<Spectrum1D>
				yScale={yScale}
				data={spectrum1D}
				x={(d) => xScale(d.wavelength) ?? 0}
				y={(d) => yScale(d.fluxPlusErr) ?? 0}
				y0={(d) => yScale(d.fluxMinusErr) ?? 0}
				curve={curveStep}
				fill={fillColor}
				fillOpacity={0.25}
				stroke="none"
			/>
			{/* Line for flux */}
			<LinePath<Spectrum1D>
				data={spectrum1D}
				x={(d) => xScale(d.wavelength) ?? 0}
				y={(d) => yScale(d.flux) ?? 0}
				stroke={strokeColor}
				strokeWidth={2}
				curve={curveStep}
			/>
			{children}
		</Group>
	);
});

interface Spectrum1DFitLayerProps {
	xScale: ScaleLinear<number, number>;
	yScale: ScaleLinear<number, number>;
	samplePoints?: number;
}
const Spectrum1DFitLayer = memo(function Spectrum1DFitLayer(
	props: Spectrum1DFitLayerProps,
) {
	const { xScale, yScale, samplePoints = 201 } = props;
	const models = useFitStore((state) => state.models);
	const gaussianModelsDraw = models.filter(
		(model) =>
			model.kind === "gaussian" && model.active && model.subtracted === false,
	);
	const linearModelsDraw = models.filter(
		(model) =>
			model.kind === "linear" && model.active && model.subtracted === false,
	);
	const sliceRange = useGrismStore((state) => state.slice1DWaveRange);
	const sampleGaussianList = useMemo(() => {
		return gaussianModelsDraw.map((model) => {
			const sampled = sampleModel(model, sliceRange, samplePoints);
			const sampledInChart = sampled.filter(
				(d) =>
					d.wavelength >= sliceRange.min &&
					d.wavelength <= sliceRange.max &&
					yScale(d.flux) !== undefined &&
					yScale(d.flux) >= 0 &&
					yScale(d.flux) <= yScale.range()[0],
			);
			return sampledInChart;
		});
	}, [gaussianModelsDraw, sliceRange, samplePoints, yScale]);
	const sampleLinearList = useMemo(() => {
		return linearModelsDraw.map((model) => {
			const sampled = sampleModel(model, sliceRange);
			return sampled;
		});
	}, [linearModelsDraw, sliceRange]);
	return (
		<g pointerEvents={"none"}>
			{sampleLinearList.map((sampled, index) => {
				if (sampled.length < 2) {
					return null;
				}
				return (
					<LinePath<{ wavelength: number; flux: number }>
						key={`fit-linear-${linearModelsDraw[index].id}`}
						data={sampled}
						x={(d) => xScale(d.wavelength) ?? 0}
						y={(d) => yScale(d.flux) ?? 0}
						stroke={linearModelsDraw[index].color}
						strokeWidth={1}
						curve={curveLinear}
					/>
				);
			})}
			{sampleGaussianList.map((sampled, index) => {
				if (sampled.length < 2) {
					return null;
				}
				return (
					<LinePath<{ wavelength: number; flux: number }>
						key={`fit-gaussian-${gaussianModelsDraw[index].id}`}
						data={sampled}
						x={(d) => xScale(d.wavelength) ?? 0}
						y={(d) => yScale(d.flux) ?? 0}
						stroke={gaussianModelsDraw[index].color}
						strokeWidth={1}
						curve={curveLinear}
					/>
				);
			})}
		</g>
	);
});
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
const SQRT_2_LN2 = Math.sqrt(2 * Math.log(2));
const Spectrum1DFitHandleLayer = memo(function Spectrum1DFitHandleLayer(
	props: Spectrum1DFitHandleLayerProps,
) {
	const { xScale, yScale, chartHeight, sliceRange } = props;
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
					stroke="#000"
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
					stroke="#000"
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
					stroke="#000"
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
	} = props;
	const x0X = xScale(model.x0); // x pixel at x0
	const x0Y = yScale(model.b); // y pixel at x0
	const x0InChart = x0X !== undefined && x0Y !== undefined;
	// k handle, left side (at min x)
	const leftX = xScale(model.range.min);
	const leftY = yScale(model.k * (model.range.min - model.x0) + model.b);
	const leftInChart = leftX !== undefined && leftY !== undefined;

	// k handle, right side (at max x)
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
					stroke="#000"
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
					stroke="#000"
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
					stroke="#000"
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

interface Spectrum1DHoverLayerProps {
	spectrum1D: Spectrum1D[];
	width: number;
	height: number;
	xScale: ScaleLinear<number, number>;
	yScale: ScaleLinear<number, number>;
	onHover: (data: TooltipData | null) => void;
}
function Spectrum1DHoverLayer(props: Spectrum1DHoverLayerProps) {
	const { spectrum1D, width, height, xScale, yScale, onHover } = props;
	const waveArray = useMemo(
		() => spectrum1D.map((d) => d.wavelength),
		[spectrum1D],
	);
	const [activeData, setActiveData] = useState<TooltipData | null>(null);

	const handleMouseMove = (
		event: React.MouseEvent<SVGRectElement, MouseEvent>,
	) => {
		if (spectrum1D.length === 0) {
			setActiveData(null);
			onHover(null);
			return;
		}
		const bounds = event.currentTarget.getBoundingClientRect();
		const pointerX = event.clientX - bounds.left;
		const pointerY = event.clientY - bounds.top;
		if (pointerX < 0 || pointerX > width || pointerY < 0 || pointerY > height) {
			setActiveData(null);
			onHover(null);
			return;
		}
		const waveAtPointer = xScale.invert(pointerX);
		const nearest = findNearestWavelengthIndex(waveArray, waveAtPointer);
		if (nearest === null) {
			setActiveData(null);
			onHover(null);
			return;
		}
		const dataPoint = spectrum1D[nearest.index];
		const axisX = xScale(dataPoint.wavelength) ?? 0;
		const axisY = yScale(dataPoint.flux) ?? 0;
		const tooltipData: TooltipData = {
			wavelength: dataPoint.wavelength,
			flux: dataPoint.flux,
			error: dataPoint.error,
			axisX: axisX,
			axisY: axisY,
			pointerX: pointerX,
			pointerY: pointerY,
		};
		setActiveData(tooltipData);
		onHover(tooltipData);
	};
	const handleMouseLeave = () => {
		setActiveData(null);
		onHover(null);
	};

	return (
		<>
			<rect
				x={0}
				y={0}
				width={width}
				height={height}
				fill="transparent"
				pointerEvents={"all"}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
			/>
			{activeData && (
				<g pointerEvents="none">
					<circle
						cx={activeData.axisX}
						cy={activeData.axisY}
						r={4}
						fill="#ff0000"
						stroke="#ffffff"
						strokeWidth={2}
					/>
					{/* cross line */}
					<line
						x1={activeData.pointerX}
						x2={activeData.pointerX}
						y1={0}
						y2={height}
						stroke="#666"
						strokeWidth={1}
						strokeDasharray="4 4"
					/>
					<line
						x1={0}
						x2={width}
						y1={activeData.pointerY}
						y2={activeData.pointerY}
						stroke="#666"
						strokeWidth={1}
						strokeDasharray="4 4"
					/>
				</g>
			)}
		</>
	);
}

interface Spectrum1DAllChartProps {
	spectrum1D: Spectrum1D[];
	xScale: ScaleLinear<number, number>;
	yScale: ScaleLinear<number, number>;
	anchor: Anchor;
	children?: React.ReactNode;
}
const Spectrum1DAllChart = memo(function Spectrum1DAllChart(
	props: Spectrum1DAllChartProps,
) {
	const { spectrum1D, xScale, yScale, anchor, children } = props;
	const strokeColor = useColorModeValue("#111", "#eee");
	return (
		<Group left={anchor.left} top={anchor.top}>
			{/* Area for all fluxes */}
			<LinePath<Spectrum1D>
				data={spectrum1D}
				x={(d) => xScale(d.wavelength) ?? 0}
				y={(d) => yScale(d.flux) ?? 0}
				stroke={strokeColor}
				strokeWidth={2}
				curve={curveStep}
			/>
			{children}
		</Group>
	);
});

const BrushHandle = memo(function BrushHandle({
	x,
	height,
	isBrushActive = true,
}: BrushHandleRenderProps) {
	const handleWidth = 8;
	const handleHeight = 15;
	if (!isBrushActive) {
		return null;
	}
	return (
		<Group left={x + handleWidth / 2} top={(height - handleHeight) / 2}>
			<path
				fill="#f2f2f2"
				d="M -4.5 0.5 L 3.5 0.5 L 3.5 15.5 L -4.5 15.5 L -4.5 0.5 M -1.5 4 L -1.5 12 M 0.5 4 L 0.5 12"
				stroke="#999999"
				strokeWidth={1}
				style={{ cursor: "ew-resize" }}
			/>
		</Group>
	);
});

interface EmissionLineLayerProps {
	xScale: ScaleLinear<number, number>;
	chartHeight: number;
}
const EmissionLineLayer = memo(function EmissionLineLayer(
	props: EmissionLineLayerProps,
) {
	const { xScale, chartHeight } = props;
	const { selectedEmissionLines, zRedshift } = useGrismStore(
		useShallow((state) => ({
			selectedEmissionLines: state.selectedEmissionLines,
			zRedshift: state.zRedshift,
		})),
	);
	const [waveMin, waveMax] = xScale.domain() as [number, number];
	return (
		<g pointerEvents={"none"}>
			{Object.entries(selectedEmissionLines).map(([lineName, lineWave]) => {
				// rest -> obs
				const lineWaveObs = lineWave * (1 + zRedshift);
				if (lineWaveObs < waveMin || lineWaveObs > waveMax) {
					return null;
				}
				const xPos = xScale(lineWaveObs);
				return (
					<g key={lineName}>
						<line
							x1={xPos}
							x2={xPos}
							y1={0}
							y2={chartHeight}
							stroke="#e53e3e"
							strokeWidth={1}
						/>
						<text
							x={xPos}
							y={chartHeight + 20}
							textAnchor="middle"
							fontSize={12}
							fill="#e53e3e"
						>
							{lineName}
						</text>
					</g>
				);
			})}
		</g>
	);
});

interface Spectrum1DBrushChartProps {
	spectrum1D: Spectrum1D[];
	width: number;
	height: number;
	hRatio?: { top: number; bottom: number; gap: number };
	margin?: { top: number; right: number; bottom: number; left: number };
}
const DEFAULT_HRATIO = { top: 0.15, bottom: 0.8, gap: 0.05 };
const DEFAULT_MARGIN = { top: 20, bottom: 50, left: 100, right: 30 };
export default function Spectrum1DChart(props: Spectrum1DBrushChartProps) {
	// Chart parameters setup
	const { spectrum1D, width, height, hRatio, margin } = props;
	const { waveArray, waveMin, waveMax, fluxMin, fluxMax } = useMemo(() => {
		const n = spectrum1D.length;
		const waveArray = new Array<number>(n);
		let waveMin = Infinity;
		let waveMax = -Infinity;
		let fluxMin = Infinity;
		let fluxMax = -Infinity;
		for (let i = 0; i < n; i++) {
			const d = spectrum1D[i];
			waveArray[i] = d.wavelength;
			if (d.wavelength < waveMin) waveMin = d.wavelength;
			if (d.wavelength > waveMax) waveMax = d.wavelength;
			if (d.fluxMinusErr < fluxMin) fluxMin = d.fluxMinusErr;
			if (d.fluxPlusErr > fluxMax) fluxMax = d.fluxPlusErr;
		}
		if (!Number.isFinite(waveMin)) {
			waveMin = 0;
			waveMax = 1;
			fluxMin = 0;
			fluxMax = 1;
		}
		return {
			waveArray,
			waveMin,
			waveMax,
			fluxMin,
			fluxMax,
		};
	}, [spectrum1D]);
	const finalHRatio = useMemo(() => {
		const ratio = hRatio ?? DEFAULT_HRATIO;
		const total = ratio.top + ratio.bottom + ratio.gap;
		if (total !== 1) {
			return {
				top: ratio.top / total,
				bottom: ratio.bottom / total,
				gap: ratio.gap / total,
			};
		}
		return ratio;
	}, [hRatio]);
	const finalMargin = margin ?? DEFAULT_MARGIN;

	// Calculate chart dimensions
	const chartHeightTotal = height - finalMargin.top - finalMargin.bottom;
	const chartWidth = width - finalMargin.left - finalMargin.right;
	const chartHeightTop = chartHeightTotal * finalHRatio.top;
	const chartHeightBottom = chartHeightTotal * finalHRatio.bottom;
	const gapHeight = chartHeightTotal * finalHRatio.gap;
	const chartAnchorTop = { left: finalMargin.left, top: finalMargin.top };
	const chartAnchorBottom = {
		left: finalMargin.left,
		top: finalMargin.top + chartHeightTop + gapHeight,
	};

	// Scales
	// Brush xScale use entire wavelength range
	const chartBrushHeight = chartHeightTop;
	const xScaleBrush = useMemo(() => {
		const scale = scaleLinear()
			.domain([waveMin, waveMax])
			.range([0, chartWidth]);
		return scale;
	}, [waveMin, waveMax, chartWidth]);
	const yScaleBrush = useMemo(() => {
		const scale = scaleLinear()
			.domain([fluxMin, fluxMax])
			.range([chartBrushHeight, 0]);
		return scale;
	}, [fluxMin, fluxMax, chartBrushHeight]);

	// Tooltip state
	const {
		tooltipOpen,
		tooltipData,
		tooltipLeft,
		tooltipTop,
		showTooltip,
		hideTooltip,
	} = useTooltip<TooltipData>();

	const { containerRef, TooltipInPortal } = useTooltipInPortal({
		detectBounds: true,
		scroll: true,
	});
	const tooltipOffset = 5;

	const handleHover = useCallback(
		(data: TooltipData | null) => {
			if (!data) {
				hideTooltip();
				return;
			}
			showTooltip({
				tooltipData: data,
				tooltipLeft: data.pointerX + chartAnchorBottom.left + tooltipOffset,
				tooltipTop: data.pointerY + chartAnchorBottom.top + tooltipOffset,
			});
		},
		[chartAnchorBottom.left, chartAnchorBottom.top, hideTooltip, showTooltip],
	);

	// Brush state
	const { slice1DWaveRange, setSlice1DWaveRange } = useGrismStore(
		useShallow((state) => ({
			slice1DWaveRange: state.slice1DWaveRange,
			setSlice1DWaveRange: state.setSlice1DWaveRange,
		})),
	);
	const brushRef = useRef<any>(null);
	const brushMoveRef = useRef<boolean>(false);
	const handleBrushChange = useCallback(
		(domain: Bounds | null) => {
			if (!domain) return;
			brushMoveRef.current = true;
			const { x0, x1 } = domain;
			const [xMin, xMax] = x0 < x1 ? [x0, x1] : [x1, x0];
			if (xMin === xMax) {
				return;
			}
			setSlice1DWaveRange({ min: xMin, max: xMax });
		},
		[setSlice1DWaveRange],
	);

	const { startIdx: waveStartIndex, endIdx: waveEndIndex } = useMemo(() => {
		return getWavelengthSliceIndices(
			waveArray,
			slice1DWaveRange.min,
			slice1DWaveRange.max,
		);
	}, [waveArray, slice1DWaveRange]);

	useEffect(() => {
		if (!brushRef?.current) return;
		if (brushMoveRef.current) {
			brushMoveRef.current = false;
			return;
		}
		const updater: UpdateBrush = (prevBrush) => {
			const newExtent = brushRef.current.getExtent(
				{
					x: xScaleBrush(
						waveStartIndex >= 0 ? waveArray[waveStartIndex] : waveArray[0],
					),
				},
				{
					x: xScaleBrush(
						waveEndIndex >= 0
							? waveArray[waveEndIndex]
							: waveArray[waveArray.length - 1],
					),
				},
			);
			const newState: BaseBrushState = {
				...prevBrush,
				start: { y: newExtent.y0, x: newExtent.x0 },
				end: { y: newExtent.y1, x: newExtent.x1 },
				extent: newExtent,
			};
			return newState;
		};
		brushRef.current.updateBrush(updater);
	}, [waveStartIndex, waveEndIndex, waveArray, xScaleBrush]);
	// Slice spectrum
	const chartHeightSlice = chartHeightBottom;
	const models = useFitStore((state) => state.models);
	const modelsSubtracted = models.filter(
		(model) => model.subtracted && model.active,
	);
	const sliceSpectrum = useMemo(() => {
		const slice = spectrum1D.slice(waveStartIndex, waveEndIndex + 1);
		const sliceSpectrumSubtracted = slice.map((d) => {
			let totolFluxForSubtration = 0;
			for (const model of modelsSubtracted) {
				const modelFlux = sampleModelFromWave(model, d.wavelength).flux;
				totolFluxForSubtration += modelFlux;
			}
			return {
				...d,
				flux: d.flux - totolFluxForSubtration,
				fluxMinusErr: d.fluxMinusErr - totolFluxForSubtration,
				fluxPlusErr: d.fluxPlusErr - totolFluxForSubtration,
			};
		});
		return sliceSpectrumSubtracted;
	}, [spectrum1D, waveStartIndex, waveEndIndex, modelsSubtracted]);
	const xScaleSlice = useMemo(() => {
		const scale = scaleLinear()
			.domain([slice1DWaveRange.min, slice1DWaveRange.max])
			.range([0, chartWidth]);
		return scale;
	}, [slice1DWaveRange, chartWidth]);
	const yScaleSlice = useMemo(() => {
		const fluxMin = Math.min(...sliceSpectrum.map((d) => d.fluxMinusErr));
		const fluxMax = Math.max(...sliceSpectrum.map((d) => d.fluxPlusErr));
		const fluxPadding = (fluxMax - fluxMin) * 0.05;
		const scale = scaleLinear()
			.domain([fluxMin - fluxPadding, fluxMax + fluxPadding])
			.range([chartHeightSlice, 0]);
		return scale;
	}, [sliceSpectrum, chartHeightSlice]);

	// wavelength converter
	const { formatterWithUnit, formatter } = useWavelengthDisplay();

	return (
		<Box position={"relative"} ref={containerRef}>
			<svg width={width} height={height}>
				<Spectrum1DAllChart
					spectrum1D={spectrum1D}
					xScale={xScaleBrush}
					yScale={yScaleBrush}
					anchor={chartAnchorTop}
				>
					<EmissionLineLayer
						xScale={xScaleBrush}
						chartHeight={chartBrushHeight}
					/>
					<Brush
						xScale={xScaleBrush}
						yScale={yScaleBrush}
						width={chartWidth}
						height={chartHeightTop}
						innerRef={brushRef}
						margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
						handleSize={8}
						resizeTriggerAreas={["left", "right"]}
						brushDirection="horizontal"
						useWindowMoveEvents={true}
						renderBrushHandle={(props) => <BrushHandle {...props} />}
						onChange={handleBrushChange}
						selectedBoxStyle={{
							fill: `url(#brush-pattern)`,
							stroke: "#057283",
						}}
					/>
				</Spectrum1DAllChart>
				<Spectrum1DSliceChart
					spectrum1D={sliceSpectrum}
					width={chartWidth}
					height={chartHeightBottom}
					xScale={xScaleSlice}
					yScale={yScaleSlice}
					anchor={chartAnchorBottom}
					label={{ left: "Flux", bottom: "Wavelength" }}
				>
					<Spectrum1DFitLayer xScale={xScaleSlice} yScale={yScaleSlice} />
					<Spectrum1DHoverLayer
						spectrum1D={sliceSpectrum}
						width={chartWidth}
						height={chartHeightBottom}
						xScale={xScaleSlice}
						yScale={yScaleSlice}
						onHover={handleHover}
					/>
					<Spectrum1DFitHandleLayer
						xScale={xScaleSlice}
						yScale={yScaleSlice}
						chartHeight={chartHeightBottom}
						sliceRange={slice1DWaveRange}
					/>
				</Spectrum1DSliceChart>
			</svg>
			{tooltipOpen && tooltipData && (
				<TooltipInPortal
					top={tooltipTop}
					left={tooltipLeft}
					style={{
						...defaultStyles,
						zIndex: 100,
					}}
				>
					<div>{`(${formatter(xScaleSlice.invert(tooltipData.axisX))}, ${yScaleSlice.invert(tooltipData.axisY).toFixed(4)})`}</div>
					<div>
						<strong>Wave:</strong> {formatterWithUnit(tooltipData.wavelength)}
					</div>
					<div>
						<strong>Flux:</strong> {tooltipData.flux.toFixed(4)}
					</div>
					<div>
						<strong>Error:</strong> {tooltipData.error.toFixed(4)}
					</div>
				</TooltipInPortal>
			)}
		</Box>
	);
}

export {Spectrum1DAllChart, Spectrum1DSliceChart}